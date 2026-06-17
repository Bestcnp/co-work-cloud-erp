# Post-Fix Audit Report — All Issues with Recommendations

> [!NOTE]
> **Status:** Re-audited all 4,869 lines after applying 27 fixes. Quick wins (B1-B5) and new issues (N1-N3) have been **fixed** in this round. 29 original issues remain with recommendations below.

---

## ✅ Resolved This Round (8 items)

| ID | Fix | Status |
|---|---|---|
| B1 | Personal phone HOTLINE removed (L371) | ✅ Fixed |
| B2 | "56 perms" → "65+" at L80, L153 | ✅ Fixed |
| B3 | "A-P" → "A-Q" at L1581, L1621 | ✅ Fixed |
| B4 | "53+" → "62+" at L58, L80, L1581, L4736 | ✅ Fixed |
| B5 | `LICENSING` → `LICENSING_AGREEMENT` in vaultCategory | ✅ Fixed |
| N1 | REGULATED + isInternalOnly guard clause added | ✅ Fixed |
| N2 | Empty "PO/SO Document Signing" header removed | ✅ Fixed |
| D29 | "53+ events" in completeness checklist → "62+" | ✅ Fixed |

---

## 🔴 Remaining Issues — With Recommendations

### Category 1: Duplicate/Inconsistent Data Models (10 issues)

---

#### D1. License Data in 2 Places — `companyProductCategories[]` (L982) vs `categoryLicenses[]` (L1229)

**Problem:** Same license concept modeled twice with different field names (`licenseDocUrl` vs `licenseDocumentUrl`) and different expiry notification schedules (30/7 vs 90/60/30 days).

**Recommendation:**
- **Keep L1229 `categoryLicenses[]`** (KYC section) as the **canonical source** — it has richer fields including AI verification states and `issuedDate`
- **Remove license fields from L982** `companyProductCategories[]` — replace with a cross-reference: `licenseRef → categoryLicenses[].licenseId` in §3.4 KYC
- **Standardize expiry schedule:** Use **90 / 60 / 30 / 7 days** (most thorough) everywhere
- This also fixes **D4 (License expiry 3 schedules)**

---

#### D2. Address Config in 2 Places — `AddressField[]` (L284) vs `AddressFieldDef[]` (L646)

**Problem:** Two different address configuration schemas with different field names.

**Recommendation:**
- **Keep L646 `AddressFieldDef[]`** (Module A) as canonical — it has `labelEN`, `labelLocal`, `dropdownSource`, `displayOrder` — all needed for i18n
- **Replace L284** (§1.5 CountryConfig) with a note: *"Address format configuration is defined in Module A §2 — see `countryAddressConfigs[]`"*
- Rename `fieldKey` → `fieldName` for clarity across both

---

#### D3. `kycStatus` vs `kycLevel` — Different Names for Same Field

**Problem:** "Currently Implemented" section says `kycStatus`, spec defines `kycLevel`.

**Recommendation:**
- **Use `kycLevel`** as the canonical name — it better describes the progressive verification levels (NOT_STARTED → BASIC → STANDARD → VERIFIED → ENTERPRISE)
- Update L345 "Currently Implemented" to say `kycLevel` instead of `kycStatus`
- Add `FAILED` and `SUSPENDED` states to the enum for completeness

---

#### D4. License Expiry — 3 Different Notification Schedules

**Problem:** 30/7 days (L990), 90/60/30 days (L1237), 30/7 days (L1627).

**Recommendation:** Resolved by D1 — consolidate to **90 / 60 / 30 / 7 days** everywhere

---

#### D5. `operatingHours` vs `departmentWorkingHours` — Overlapping

**Problem:** Two different working hours fields with undefined scope.

**Recommendation:**
- **Remove `operatingHours` (L971)** — it's an untyped `object` with no schema
- **Keep `departmentWorkingHours[]` (L1748)** — fully defined with workdays, times, timezone
- Add a special entry `departmentName: 'COMPANY_DEFAULT'` for company-wide hours
- Add a note at L971: *"Company operating hours are defined in §3.5 Company Calendar — see `departmentWorkingHours[]` with `departmentName: 'COMPANY_DEFAULT'`"*

---

#### D6. Phone/Email Sub-Field Naming — Inconsistent Across 4 Models

**Problem:** `countryCode` vs `phoneCountryCode`, `department` vs `departmentLabel`, `email` vs `emailAddress`.

**Recommendation:** Standardize to:

| Field | Standard Name | Apply To |
|-------|--------------|----------|
| Country code | `phoneCountryCode` | All models (company phone at L957 uses `countryCode` — change it) |
| Extension | `extension` | All models |
| Department | `departmentLabel` | All models (company phone/email at L957-962 uses `department` — change it) |
| Email | `emailAddress` | All models (company email at L962 uses `email` — change it) |

---

#### D7. `profileHierarchy` Duplicated in Module B (L1292) and Module D (L2626)

**Problem:** Same enum defined twice in different modules.

**Recommendation:**
- **Define canonically in Module D** (L2626) — it's a CustomerContact attribute
- **Replace L1292** with a cross-reference note: *"See Module D (§5) `profileHierarchy` on the CustomerContact model"*

---

#### D8. `returnDueDate` vs `expectedReturnDate` — Same Concept, Different Names

**Problem:** Acknowledgement of Receipt uses `returnDueDate` (L3440), Sample Transaction uses `expectedReturnDate` (L3376).

**Recommendation:**
- **Standardize to `expectedReturnDate`** everywhere — it's more descriptive
- Update L3440 to use `expectedReturnDate`
- Add note: Receipt's `expectedReturnDate` is copied from the Sample Transaction at creation

---

#### D9. `distributionType` vs `receiptType` — Identical Enums on Linked Models

**Problem:** Both have `GIVE_AWAY / RENT_LOAN` with identical values.

**Recommendation:**
- **Keep `distributionType` on Sample Transaction** as the source of truth
- **Replace `receiptType` on Receipt** with: *"Inherited from parent Sample Transaction `distributionType` — always matches. Read-only on Receipt."*
- Or rename to `distributionType` on both to make the link obvious

---

#### D10. Three+ `documentType` Enums Across the Spec

**Problem:** E-Signature Registry (L817), Contract Vault (L1900), T&A consent (L463, raw string), Procurement (L4661).

**Recommendation:**
- This is **architecturally correct** — each module has its own document scope
- **Add a clarifying note** in §1 (Reading Guide) explaining the design:
  > *"The `documentType` field appears in multiple modules with different enum values. This is intentional: E-Signature Registry (Module A) tracks ALL signing events across the platform — its enum is the union of all document types. Contract Vault (§3.6) covers legal agreements only. Module Q covers procurement documents only."*
- **Fix L463** (T&A consent): Change from raw `string` to an enum: `'TERMS_OF_SERVICE' / 'PRIVACY_POLICY' / 'PDPA_CONSENT' / 'COOKIE_POLICY' / 'COMPANY_NDA'`

---

### Category 2: Missing/Incomplete Models (7 issues)

---

#### D11. CustomerContact Base Model Never Formally Defined

**Problem:** Fields are scattered across Module B (L1285) and Module D (L2453, L2622) but no complete model exists.

**Recommendation:** Add a formal **CustomerContact Base Model** table at the beginning of Module D (§5), before the existing "Contact Entity Types" section:

```
| Field | Type | Description |
|-------|------|-------------|
| contactId | string | Unique identifier |
| tenantId | string | Which company owns this contact record |
| contactEntityType | enum | 'INDIVIDUAL' / 'ORGANIZATION' / 'GOVERNMENT' |
| contactName | string | Display name |
| contactEmail | string | Primary email |
| contactPhone | string | Primary phone |
| contactBranches[] | BranchAssignment[] | Branch associations (see §3.3) |
| profileHierarchy | enum | 'INTERNAL_ONLY' / 'VERIFIED_LINKED' |
| linkedUserId | string | If this contact has a platform account |
| sourceType | enum | 'MANUAL' / 'ERP_SYNC' / 'IMPORT' / 'QR_SCAN' |
| createdBy | string | userId who created |
| createdAt | string | When created |
```

---

#### D12. `contactBranches[]` Defined in Module B (L1285), Belongs in Module D

**Problem:** The field's own description says "part of CustomerContact model in Module D."

**Recommendation:** Resolved by D11 — when the CustomerContact base model is defined in Module D, include `contactBranches[]` there. Replace L1285 with a cross-reference.

---

#### D13. RENT_LOAN Auto-Task — Missing Details

**Problem:** Auto-creates a task in Module E but doesn't specify taskType, title, assignee, or pipeline.

**Recommendation:** Add after L3380:

```
> **Auto-created task specification:**
> - taskType: 'STANDARD'
> - title: "Return Due: [productName] — loaned to [recipientName]"
> - assigneeIds: [withdrawnByUserId]
> - dueDate: expectedReturnDate
> - priority: 'MEDIUM' (auto-escalates to 'HIGH' 3 days before due)
> - tags: ['SAMPLE_RETURN', 'AUTO_CREATED']
> - Pipeline: STANDARD → NOT_STARTED → IN_PROGRESS → COMPLETED
> - Auto-completed when returnStatus = 'RETURNED_GOOD' or 'RETURNED_DAMAGED'
```

---

#### D14. User Sample Inventory — Missing Fields

**Problem:** No `holdingId` primary key, no `totalLost`/`totalDamaged`.

**Recommendation:** Add to the User Sample Holding Model (L3494):

```
| holdingId | string | Unique identifier (composite: userId + tenantId + productId) |
| totalLost | number | Cumulative units marked as LOST |
| totalDamaged | number | Cumulative units returned as RETURNED_DAMAGED |
| lastWithdrawalDate | string | When the user last withdrew this product |
| lastDistributionDate | string | When the user last distributed this product |
```

---

#### D15. Missing Permissions for Module A, §3.5, §3.6 AI, Module D Fraud

**Problem:** No permission strings defined for these features.

**Recommendation:** Add to Module C Permission Matrix:

```
**Module A — User Self-Service:**
| user.kyc_submit | Submit KYC documents for verification (self-service — all users) |
Note: KYC and e-signature are self-service — no permission required

**§3.5 — Notifications:**
| notification.configure | Configure company-level notification routing presets |
Note: Viewing own notifications requires no permission

**§3.6 — Contract Vault AI:**
| contract.ai_analyze | Run AI analysis on vault documents |
Note: Vault access is controlled per-party — AI analysis inherits vault access

**Module D — Fraud Reporting:**
| contact.fraud_report | Submit fraud report against a contact or company |
| contact.fraud_investigate | Review and act on fraud reports (Super Admin) |
```

---

#### D16. Missing Notification Events in §3.5 Master List

**Problem:** 9 `po.*` events in Module Q not in master list; no events for vault, QR brochure, sample tracking, equipment rental.

**Recommendation:** Add to the Full Notification Event List table (after L1676):

```
| **Procurement (Q)** | `PO_CREATED` | New PO created and sent to seller |
| **Procurement (Q)** | `PO_ACKNOWLEDGED` | Seller acknowledged PO |
| **Procurement (Q)** | `SO_CREATED` | SO created from incoming PO |
| **Procurement (Q)** | `PO_STATUS_CHANGED` | PO/SO status update |
| **Procurement (Q)** | `PO_INVOICE_ATTACHED` | Seller attached invoice to SO |
| **Procurement (Q)** | `PO_SIGNATURE_REQUESTED` | Signature/liveness requested on PO/SO |
| **Procurement (Q)** | `RFQ_RECEIVED` | New RFQ received from buyer |
| **Procurement (Q)** | `QUOTATION_RECEIVED` | Quotation received from seller |
| **Procurement (Q)** | `PO_APPROVAL_REQUIRED` | PO pending approval |
| **Vault (§3.6)** | `VAULT_DOCUMENT_UPLOADED` | New document added to shared vault |
| **Vault (§3.6)** | `VAULT_SIGNATURE_REQUESTED` | Signature requested on vault document |
| **Vault (§3.6)** | `VAULT_DOCUMENT_EXPIRED` | Contract term has expired |
| **Inventory (H)** | `SAMPLE_RETURN_DUE` | Loaned sample approaching return date |
| **Inventory (H)** | `EQUIPMENT_RETURN_DUE` | Rented equipment approaching return date |
```

---

#### D17. `reportType` Enum Missing 4 Categories

**Problem:** Enum has 6 values but report table lists 10 categories.

**Recommendation:** Update L4226 reportType enum to:
```
'SALES_SUMMARY' / 'HR_PIPELINE' / 'CONTACT_POOL' / 'BILLING' /
'TASK_COMPLETION' / 'ATTENDANCE' / 'CHAT_COMMUNICATION' /
'PRODUCT_SHOWCASE' / 'INVENTORY_TRACKING' / 'PROCUREMENT_PO'
```

Also update L4743 "6 report categories" → "10 report categories"

---

### Category 3: Misplaced Content (5 issues)

---

#### D18. Google Calendar Sync (85 lines) in Module E

**Problem:** Used by Modules E, F, K but defined only in E.

**Recommendation:**
- **Keep in Module E** (it's most closely tied to tasks and is the biggest consumer)
- **Add explicit cross-reference notes** at the top of the section:
  > *"This calendar integration serves Module E (tasks), Module F (sales visit scheduling), and Module K (GPS/attendance). Other modules reference this section."*
- Add a one-line note in Module F and Module K pointing to Module E calendar section

---

#### D19. Expense/Costing in Module F (Sales)

**Problem:** Spec says "ANY user role can submit" but it's inside Sales module.

**Recommendation:**
- **Keep in Module F** for now (sales reps are the primary users)
- **Rename the subsection:** "Expense & Costing (Platform-Wide, hosted in Module F)"
- Add note: *"While hosted in Module F for historical reasons, expense tracking is available to ALL user roles across the platform. Future versions may extract this into its own module."*

---

#### D20. Fraud Reporting in Module D (Contacts)

**Problem:** Platform-level system logically belongs in Module P (Compliance).

**Recommendation:**
- **Keep in Module D** (it's triggered from the contact/company profile UI)
- Add cross-reference in Module P: *"See Module D (§5) Fraud Reporting System for the user-facing fraud report submission and investigation workflow."*
- The Super Admin investigation screens are already in Module P's backoffice — just add the link

---

#### D21. Company Calendar Inside §3.5 (Notifications)

**Problem:** Calendar is used by GPS, events, sales — not just notifications.

**Recommendation:**
- **Move to Module B §3** as a new subsection "§3.4b Company Calendar & Working Hours"
- Replace the content at §3.5 with a cross-reference: *"See Module B §3.4b for company calendar and working hours configuration"*

---

#### D22. EXIF Photo Verification — Empty Header Then Content Later

**Problem:** Empty `### EXIF Photo Verification` at L3720, content at L3754 under "Enterprise Plan §7".

**Recommendation:**
- **Delete the empty header** at L3720
- **Move EXIF content (L3754-3764)** up to where the empty header was
- Remove the "From Enterprise Plan §7:" label — inline the content directly

---

### Category 4: Unclear/Stale Content (7 issues)

---

#### D23. Company Seal Contradiction — Delegation vs MD-Only

**Problem:** L1089 says any user with permission can apply, L1098 says only DBD MDs can apply.

**Recommendation:**
- **Keep the MD-only rule** (L1098) as the law requires DBD-registered directors for official company seals
- **Clarify L1089:** The `companySeal.apply` permission is a *prerequisite* — a user must BOTH hold the permission AND be a DBD-authorized director. The permission alone is not sufficient. This is a **two-factor gate**: permission + legal authority
- Rewrite L1089: *"The `companySeal.apply` permission can be granted by users with `companySeal.manage`. However, even with this permission, the system enforces that only DBD-registered Managing Directors can actually apply the seal (see §3.2 Company Seal). The permission serves as an additional access control layer — it is necessary but not sufficient."*

---

#### D24. "Enterprise Plan" References Unexplained

**Problem:** 4 references (L2911, L3187, L3751, L3772) to an external document never cited.

**Recommendation:**
- **Add a note in §1 (Reading Guide):**
  > *"References to 'Enterprise Plan' refer to the original product requirements document (internal Cloudfull.com document, version dated [DATE]). All requirements from the Enterprise Plan have been incorporated into this specification. The references are retained for traceability."*
- Or **remove the references entirely** and just keep the incorporated content

---

#### D25. Module H Permission Matrix Listed Twice

**Problem:** "Module H — Products" (L2177) and "Module H — Internal Inventory" (L2213) as separate groups.

**Recommendation:**
- **Merge into one block:** "Module H — Products, Inventory & Samples"
- List all 7 permissions together:
  ```
  products.create, products.approve, products.pricing,
  inventory.manage, inventory.withdraw, inventory.approve_rental, inventory.view_cost
  ```

---

#### D26. APPOINTED Status in HR Pipeline — Unclear Meaning

**Problem:** `SCREENING → APPOINTED → INTERVIEW` — what does APPOINTED mean here?

**Recommendation:**
- **Rename to `INTERVIEW_SCHEDULED`** — this more clearly communicates that the candidate has passed screening and an interview date/time has been set
- Pipeline becomes: `NEW → SCREENING → INTERVIEW_SCHEDULED → INTERVIEW → EVALUATION → OFFER_SENT → RECRUITED / NOT_PASS`

---

#### D27. Promotional Campaigns — Empty Header Then Content Later

**Problem:** Empty `### Promotional Campaigns` at L3999, content at L4022.

**Recommendation:**
- **Delete the empty header** at L3999
- The content at L4022 already has its own header — no need for a duplicate

---

#### D28. Build Order Missing Reports & Security Audit Phases

**Problem:** §16.6 Reports and §16.7 Security Audit not in any build phase.

**Recommendation:** Add to **Phase 10** (Billing & Admin):
```
├── §16.6 Reports & Analytics engine (10 report categories + export)
├── §16.7 Security Layers Audit Checklist (42 measures, 8 zones)
```

---

#### N3. Thai Tax Invoice B2B Fields in Module O (Platform Billing)

**Problem:** Thai Tax Invoice model at L3982 has `sellerTenantId`/`buyerTenantId` suggesting B2B, but Module O is platform-only.

**Recommendation:**
- **Clarify in Module O:** The Thai Tax Invoice model is a **template** used for platform invoices where `sellerTenantId` is always Cloudfull.com's tenantId
- **Add note:** *"For B2B invoicing between companies, sellers attach invoice files (PDF/image) through the PO/SO flow in Module Q (§17). The Thai Tax Invoice format is used as a reference template for Co-Work.cloud's auto-generated invoices — see Module Q Unified PO/SO View."*
- The `sellerTenantId`/`buyerTenantId` fields are useful for the template structure — just clarify scope

---

## Summary — Total Issue Status

| Category | Fixed This Round | Fixed Previously | Remaining | Total |
|----------|-----------------|-----------------|-----------|-------|
| **Quick-win fixes** | 8 | — | 0 | 8 |
| **Duplicate data models** | — | 2 (H11, H12) | 10 (D1-D10) | 12 |
| **Missing models** | — | 3 (C3, H6, H7) | 7 (D11-D17) | 10 |
| **Misplaced content** | — | — | 5 (D18-D22) | 5 |
| **Unclear/stale content** | — | 5 (C1, C5, M1, M2, H15) | 7 (D23-D28, N3) | 12 |
| **Total** | **8** | **10** | **29** | **47** |

> [!TIP]
> **Fastest impact batch:** D1+D4 (license consolidation), D3 (kycLevel), D5 (operatingHours), D17 (reportType enum), D23 (seal rules), D26 (APPOINTED rename), D27 (empty header). These are all simple edits that don't require architectural decisions.
