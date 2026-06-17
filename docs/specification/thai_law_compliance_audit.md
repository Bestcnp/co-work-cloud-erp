# Thai Law Compliance Audit — Architecture Gap Analysis

## Source: Your Gemini Legal Research + Current Codebase

I reviewed every legal point from your conversation and mapped it against our existing architecture. Below is the full audit.

---

## ✅ What's Already Covered

| Legal Requirement | Law | Architecture Coverage |
|-------------------|-----|----------------------|
| Substance detection (alcohol, tobacco, cannabis, narcotics) | Alcohol Control Act, Tobacco Act, Narcotics Code | ✅ `SubstanceGateService` classifies products via Hermes |
| Content moderation pipeline | Computer Crime Act Sec 15 | ✅ `ModerationService` with auto/manual review queue |
| Emergency freeze (government takedown) | Technology Crimes Decree B.E. 2566 | ✅ `freezeMiddleware` blocks all writes instantly |
| PDPA consent before data collection | PDPA Sec 24 | ✅ `PdpaService.recordConsent()` |
| PDPA right to data access | PDPA Sec 30 | ✅ `PdpaService.getMyData()` |
| PDPA right to erasure | PDPA Sec 33 | ✅ `PdpaService.deleteMyData()` |
| Audit logging of all operations | PDPA, Computer Crime Act | ✅ `AuditMiddleware` logs all POST/PUT/PATCH/DELETE |
| Role-based access control (RBAC) | All substance laws | ✅ `requirePermission()` middleware |
| Multi-tenant isolation | PDPA, data protection | ✅ Firestore paths: `/tenants/{tenantId}/...` |
| Rate limiting | Security best practice | ✅ `rate-limit.middleware.ts` |
| Company verification status | DBD regulations | ✅ `TenantConfig.verificationStatus` field |
| Subscription tiers | Business model | ✅ `SubscriptionTierConfig` model |

---

## 🔴 Critical Gaps Found (18 Items)

### GAP 1: Product Visibility Layer (Public vs B2B Gating)
**Law:** Alcohol Control Act Sec 32, Tobacco Act, Cannabis Regulations
**Risk:** ฿500,000 fine + ฿50,000/day + imprisonment

**What Gemini confirmed:** Products with restricted substances must be **completely invisible** to public/unverified users. Not just hidden UI — the API must never return restricted product data to unauthorized requests.

**What's missing:**
```typescript
// Need a visibility middleware that checks:
// 1. Is this product restricted? (substance category)
// 2. Is the requesting user verified B2B?
// 3. Does their company hold the correct LICENSE TYPE?

// Example: A verified construction company should NOT see alcohol catalogs
// Only companies with Excise Alcohol License should see alcohol products
```

**Architecture needed:**
- `ProductVisibilityService` — filters query results based on user verification + company license type
- Every product API endpoint must pass through this filter
- Direct URL to restricted product → redirect to generic page for unverified users

---

### GAP 2: 3-Step Company Verification (Not Just Status Flag)
**Law:** ETDA Platform Regulations 2025, Excise Department
**Risk:** Entire platform liability if verification is weak

**What Gemini confirmed:** Verification must include:
1. **Corporate Identity** — DBD registration + Tax ID
2. **Authorized Person** — Director's Thai ID verification (the person creating the account is actually authorized)
3. **License Verification** — Specific Excise/MoPH/FDA license for restricted product categories

**What's missing:**
```typescript
// Current TenantConfig only has:
verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';

// Need to expand to:
interface CompanyVerification {
  dbdVerified: boolean;
  dbdCertificateUrl: string;      // encrypted storage
  taxIdVerified: boolean;
  authorizedPersonVerified: boolean;
  authorizedPersonIdUrl: string;   // encrypted, religion/blood type redacted
  licenses: CompanyLicense[];      // multiple license types
  verifiedAt: string;
  verifiedBy: string;              // admin who approved
  verificationNotes: string;
}

interface CompanyLicense {
  licenseType: 'EXCISE_ALCOHOL_TYPE1' | 'EXCISE_ALCOHOL_TYPE2' | 
               'EXCISE_TOBACCO' | 'MOPH_CANNABIS' | 'FDA_PHARMACEUTICAL' | 
               'FDA_COSMETIC' | 'FDA_FOOD_SUPPLEMENT';
  licenseNumber: string;
  issuedBy: string;
  validUntil: string;
  documentUrl: string;             // encrypted storage
  verified: boolean;
}
```

---

### GAP 3: Thai ID Sensitive Data Handling
**Law:** PDPA Sec 26 (Sensitive Personal Data)
**Risk:** Heavy fines for processing religion/blood type without explicit consent

**What Gemini confirmed:** Thai ID cards display **Religion** and **Blood Type** — these are PDPA "Sensitive Data." Users must redact them before uploading, OR you need explicit consent + immediate redaction.

**Architecture needed:**
- Upload instructions UI: "Please cover your Religion and Blood Type before photographing your ID"
- Hermes pre-screening: detect if religion/blood type fields are visible → flag for redaction
- Privacy policy clause: accidental upload → auto-redact upon receipt
- Separate explicit consent checkbox for sensitive data (not bundled with general consent)

---

### GAP 4: KYC Data Cold Storage & Retention Lifecycle
**Law:** PDPA Sec 33 (Right to Erasure exemption for legal claims)
**Risk:** Keeping data forever = PDPA violation. Deleting too early = losing fraud evidence.

**What Gemini confirmed:**
- After account deletion, KYC data moves to **encrypted cold storage**
- Retention: **3-5 years** after account closure (statute of limitations)
- After retention period: **automated permanent deletion** (cron job)
- Cold storage = restricted access (legal/compliance team only, not regular admins)

**Architecture needed:**
```typescript
interface KycArchiveEntry {
  archiveId: string;
  originalUserId: string;
  originalEmail: string;           // hashed, not plain text
  idDocumentUrl: string;           // encrypted cold storage (separate bucket)
  faceComparisonResult: 'MATCH' | 'NO_MATCH';
  verificationDate: string;
  accountDeletedAt: string;
  scheduledPurgeAt: string;        // accountDeletedAt + 5 years
  accessLog: Array<{               // every access is logged
    accessedBy: string;
    accessedAt: string;
    reason: string;                // must state legal basis
  }>;
}
```
- Cron job: monthly scan for `scheduledPurgeAt < now()` → permanent delete
- Access requires super admin + legal reason + audit log entry

---

### GAP 5: Marketing Language Detection in B2B Content
**Law:** Alcohol Control Act Sec 32 — "boasting or inducing consumption"
**Risk:** ฿500,000 fine even INSIDE the B2B portal

**What Gemini confirmed:** Even behind the login wall, product descriptions cannot use:
- ❌ Adjectives: "delicious", "refreshing", "crisp", "smooth"
- ❌ Lifestyle imagery: people drinking, party scenes
- ❌ Promotional language: "Buy 3 get 1 free!", "Best selling"
- ✅ Allowed: Factual only — brand name, SKU, ABV%, volume, wholesale price

**Architecture needed:**
- Hermes moderation rule: when `substanceCategory !== 'NONE'`, scan description for marketing adjectives
- Maintain a Thai + English banned word list for restricted product descriptions
- Flag violations before publishing, even in B2B view
- System prompt for Hermes:
  ```
  "This product is classified as [ALCOHOL]. Under Thai law Section 32, 
  the description must be strictly factual. Check if the description 
  contains any marketing adjectives, lifestyle references, promotional 
  offers, or language that could be interpreted as encouraging consumption. 
  Flag any violations."
  ```

---

### GAP 6: Brand DNA / Cross-Promotion Detection
**Law:** Alcoholic Beverage Control Act (No. 2) B.E. 2568 (2025 amendment)
**Risk:** ฿500,000 fine

**What Gemini confirmed:** The 2025 amendment bans "brand DNA" — you cannot publicly display non-alcoholic products (clothing, water, merchandise) that carry an alcohol brand's logo or trademark.

**Architecture needed:**
- Hermes moderation: flag products on the PUBLIC side that share brand names with known alcohol/tobacco brands
- Brand registry: maintain a list of known restricted brand names
- Public product check: if product name/description contains a restricted brand name → auto-quarantine or restrict to B2B only

---

### GAP 7: Direct URL Protection
**Law:** All substance restriction laws
**Risk:** A verified user shares a product URL → unverified person sees restricted content

**What Gemini confirmed:** "If a verified business user shares a direct URL to an alcohol product with a non-logged-in friend, that link must redirect to an error page or a generic public landing page."

**Architecture needed:**
- Every product page API call checks auth + verification + license
- Frontend route guards: restricted product routes check `user.tenantMemberships[x].licenses`
- Server-side rendering: if no valid session → generic "Please log in" page (no product data in HTML)
- No restricted product data in meta tags, Open Graph tags, or URL slugs

---

### GAP 8: SEO Metadata Scrubbing
**Law:** Alcohol Control Act, Tobacco Act
**Risk:** Google indexing restricted brand names from your public pages

**What Gemini confirmed:** "Even in your meta-tags, SEO descriptions, or public URLs, avoid using promotional language about alcohol."

**Architecture needed:**
- Server-side: public pages never include restricted brand names in `<title>`, `<meta description>`, or `<og:description>`
- `robots.txt`: block crawlers from any `/b2b/` or `/restricted/` paths
- Sitemap: exclude all restricted product pages
- Hermes: periodically audit public-facing content for brand name leakage

---

### GAP 9: Advertising Slot Substance Restrictions
**Law:** All substance laws — advertising ban
**Risk:** Running paid ads for restricted products, even inside B2B

**What Gemini confirmed:** Even in B2B, promotional banners for alcohol/tobacco are illegal. Your advertising system must block restricted substance companies from buying public ad slots.

**Architecture needed:**
```typescript
// In advertising system:
if (product.substanceCategory !== 'NONE') {
  // Block from ALL ad placements:
  // - Category banners (public)
  // - Product highlights (public)
  // - Map pin featured (public)
  // - Even B2B internal banners (no promotional language)
  throw new Error('RESTRICTED_PRODUCT_CANNOT_ADVERTISE');
}
```

---

### GAP 10: Safe Harbor / Notice-and-Takedown Workflow
**Law:** Computer Crime Act Sec 15, ETDA Digital Platform Regulations
**Risk:** Without this, platform owner = liable for ALL user content

**What Gemini confirmed:** To claim "passive intermediary" protection:
1. Must register with ETDA
2. Must have formal takedown workflow
3. Must respond within 24 hours to government notices
4. Lose protection if you actively structure restricted data (categories/dropdowns)

**Architecture needed:**
```typescript
interface TakedownRequest {
  requestId: string;
  requestedBy: string;              // government agency or rights holder
  requestType: 'GOVERNMENT_ORDER' | 'RIGHTS_HOLDER' | 'USER_REPORT';
  targetContentType: string;
  targetContentId: string;
  reason: string;
  legalBasis: string;               // specific law section
  receivedAt: string;
  deadline: string;                  // receivedAt + 24 hours
  status: 'RECEIVED' | 'REVIEWING' | 'COMPLIED' | 'APPEALED';
  actionTaken: string;
  completedAt: string | null;
}
```
- Admin dashboard: "Government Takedown" queue with countdown timer
- Auto-alert super admin team when request received
- Auto-hide content immediately if deadline approaches without action

---

### GAP 11: Company Public Profile — Generic vs Detailed
**Law:** Alcohol Control Act, Tobacco Act

**What Gemini confirmed:**
- **Public side:** Company name + DBD registered business objective only (e.g., "Manufacturing and distributing beverages")
- **B2B side:** Full brand names, product catalogs, detailed descriptions

**Architecture needed:**
```typescript
interface CompanyProfile {
  // Public fields (visible to everyone)
  publicName: string;                // Legal entity name from DBD
  publicDescription: string;         // Generic: "Licensed beverage distributor"
  publicIndustry: string;            // "Food & Beverage" (no brand names)
  
  // B2B fields (visible only to verified companies with matching licenses)
  b2bDescription: string;            // "Official distributor of Chang Beer, SangSom..."
  b2bBrands: string[];               // ["Chang", "SangSom", "Mekhong"]
  b2bCatalogVisible: boolean;
}
```
- Hermes moderation: scan `publicDescription` for restricted brand names → reject if found
- API: never return `b2bDescription` or `b2bBrands` to unauthenticated requests

---

### GAP 12: License-Based Catalog Access (Not Just "Verified")
**Law:** Excise Department regulations

**What Gemini confirmed:** A verified construction company should NOT see alcohol catalogs. Only companies with the **correct license type** should see restricted categories.

**Architecture needed:**
```
License Type                    → Unlocks Catalog
─────────────────────────────────────────────────
EXCISE_ALCOHOL_TYPE1            → Alcohol wholesale catalog
EXCISE_ALCOHOL_TYPE2            → Alcohol retail catalog  
EXCISE_TOBACCO                  → Tobacco logistics data
MOPH_CANNABIS                   → Medical cannabis catalog
FDA_PHARMACEUTICAL              → Pharmaceutical catalog
FDA_COSMETIC                    → Cosmetic catalog (if restricted)
FDA_FOOD_SUPPLEMENT             → Supplement catalog (including CBD < 0.2% THC)
NONE                            → General products only
```

---

### GAP 13: CBD Exception Handling
**Law:** Cannabis regulations 2025/2026

**What Gemini confirmed:** Hemp extracts and CBD products with < 0.2% THC are treated as cosmetics/food supplements — can be sold and advertised online normally.

**Architecture needed:**
- Substance classification needs a `CBD_BELOW_THRESHOLD` category separate from `CANNABIS_THC`
- CBD products → normal visibility rules (public OK)
- Products claiming CBD must verify THC % → if > 0.2%, reclassify as `CANNABIS_THC`

---

### GAP 14: Watermarking Guidance for ID Upload
**Law:** Thai security best practice, PDPA

**What Gemini confirmed:** Standard practice to ask users to write "For registration on [App Name] only" on their ID photo before uploading.

**Architecture needed:**
- Upload UI instructions: "Write 'For Cloudfull.com verification only' across your ID card before photographing"
- Hermes: detect if watermark text is present → bonus confidence score
- Helps protect users if data breach occurs

---

### GAP 15: Privacy Notice Timing
**Law:** PDPA

**What Gemini confirmed:** Privacy notice must appear BEFORE the upload button, not after. User must read and acknowledge before uploading any documents.

**Architecture needed:**
- KYC upload page: privacy notice with specific retention period displayed FIRST
- Checkbox: "I have read and understand that my ID will be stored for [X] years"
- Upload button disabled until checkbox is checked

---

### GAP 16: "รับชงเหล้า" / Service Category Restrictions  
**Law:** Prevention and Suppression of Prostitution Act, Alcohol Control Act

**What Gemini confirmed:** Freelance drink mixing services are legal but their PROMOTION is heavily restricted (no alcohol brand photos, no explicit imagery).

**Architecture needed:**
- Service listings (not just products) need substance/content moderation
- Hermes: scan service descriptions for alcohol brand references + explicit content
- Service categories like "Entertainment", "Event Staffing" → flag for manual review

---

### GAP 17: Automated TISI / License Expiry Monitoring
**Law:** Various regulatory bodies

**Architecture needed:**
- Cron job: monthly check if company licenses have expired
- If license expired → automatically downgrade company to public-only view
- Notification to company admin: "Your Excise Alcohol License expires in 30 days. Please upload renewal."

---

### GAP 18: ETDA Platform Registration
**Law:** ETDA Digital Platform Regulations 2025

**What Gemini confirmed:** To legally claim Safe Harbor protection, digital platforms must register with ETDA.

**Action needed:**
- This is a **manual/legal process**, not a code feature
- Must register before launch
- Submit: T&C, KYC procedures, takedown workflow to ETDA

---

## Summary: Compliance Score

| Category | Items Covered | Items Missing | Score |
|----------|--------------|---------------|-------|
| **Substance Classification** | 4/5 | CBD exception | 80% |
| **Product Visibility Gating** | 0/4 | All missing | 0% |
| **Company Verification** | 1/3 | License types, 3-step process | 33% |
| **PDPA / Data Lifecycle** | 3/6 | Cold storage, retention, watermark | 50% |
| **Content Moderation** | 2/5 | Marketing language, brand DNA, SEO | 40% |
| **Advertising Restrictions** | 0/2 | Substance ad blocking | 0% |
| **Platform Liability** | 1/3 | Safe Harbor, takedown, ETDA | 33% |
| **Overall** | **11/28** | **17 gaps** | **39%** |

> [!WARNING]
> The current architecture covers the basic foundation but is **missing critical visibility gating and B2B access control** — the most important compliance features for Thai law. These must be built in Phase 0.5 (before any marketplace or product features go live).

---

## Recommended Priority for Gap Fixes

### 🔴 Must Fix Before Any Product/Marketplace Feature (Phase 0.5)
1. GAP 1: Product Visibility Layer
2. GAP 2: 3-Step Company Verification + License Types
3. GAP 7: Direct URL Protection
4. GAP 9: Advertising Substance Restrictions
5. GAP 11: Public vs B2B Company Profiles
6. GAP 12: License-Based Catalog Access

### 🟡 Must Fix Before Launch
7. GAP 3: Thai ID Sensitive Data Handling
8. GAP 4: KYC Cold Storage + Retention Lifecycle
9. GAP 5: Marketing Language Detection
10. GAP 8: SEO Metadata Scrubbing
11. GAP 10: Safe Harbor / Takedown Workflow
12. GAP 13: CBD Exception
13. GAP 14: Watermark Guidance
14. GAP 15: Privacy Notice Timing

### 🟢 Can Build During Phase 2-3
15. GAP 6: Brand DNA Detection
16. GAP 16: Service Category Restrictions
17. GAP 17: License Expiry Monitoring
18. GAP 18: ETDA Registration (manual/legal process)
