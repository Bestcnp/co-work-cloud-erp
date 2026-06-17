# Full QA Audit: Module Placement, Web/Native, Conflicts & Gaps

> **Roles:** Lead BA + Lead Engineer + Senior Lawyer + Lead QA
> **Date:** 2026-06-17
> **Spec:** 7,080 lines | comprehensive_webapp_specification.md

---

## Part 1: Module Placement Analysis — What Should Shift?

### Current Architecture

```
CLOUDFULL.COM (CRM — Build First)          CO-WORK.CLOUD (ERP — Build Later)
═══════════════════════════════════        ════════════════════════════════
Module A: User Registration               Chart of Accounts
Module B: Company Management              General Ledger
Module C: Roles & Permissions              Full Tax Management (Input/Output VAT)
Module D: Contact Pool                     Inventory Management (stock levels)
Module E: Task Hub                         Full Invoicing
Module F: Sales Planning & Routing         Financial Statements (P&L, Balance Sheet)
Module G: Chat System                      Manufacturing (SuperAdmin-exclusive)
Module H: Product Catalog + Inventory      Payroll (future)
Module I: Design Showcase
Module J: Recruitment Pipeline
Module K: Events, GPS & Attendance
Module L: Favorites, QR & News Feed
Module N: Skill Testing
Module O: Platform Billing
Module P: Compliance & Admin
Module Q: Procurement (PO/SO)
Module R: Marketplace (future)
Module S: Lead Generation & Campaign
§3.5: Notifications
§3.6: Contract Vault
§3.7: Expense Management
§16.5: Sandbox
§16.6: Reports (13 categories)
§16.7: Security Audit
```

### My Honest Assessment: What Should Shift

> [!IMPORTANT]
> **Short answer: Almost nothing should shift.** The current placement is architecturally sound. Here's my detailed analysis:

#### ✅ Correctly Placed in Cloudfull (No Change Needed)

| Module | Why It Belongs in Cloudfull |
|--------|---------------------------|
| **A, B, C** (User, Company, RBAC) | Core platform identity — needed by both CRM and ERP. Building in Cloudfull first is correct since CRM launches first. |
| **D** (Contact Pool) | CRM's core data asset. ERP only needs a subset (synced via thin API). |
| **E** (Task Hub) | Field operations tool. Salespeople manage tasks on mobile. |
| **F** (Sales Planning) | Flagship CRM feature. #1 competitive advantage. |
| **G** (Chat) | Real-time communication = CRM. |
| **H** (Product Catalog) | Sales-facing product data. ERP has its own "accounting product." |
| **I** (Showcase) | Marketing/display = CRM. |
| **O** (Platform Billing) | This is how YOU charge companies for using Cloudfull. CRM-only. |
| **P** (Compliance) | Platform-wide admin. Serves both CRM and ERP from one backoffice. |
| **Q** (Procurement) | Salespeople create PO/SO in the field. Sync to ERP for invoicing. Correct. |
| **S** (Lead Generation) | Pure CRM/marketing function. |
| **§3.5** (Notifications) | Platform-wide. Serves both. |
| **§3.6** (Contract Vault) | Used in the field for signing. |
| **§3.7** (Expense) | Field workers photograph receipts on mobile. |

#### ⚠️ Could Go Either Way (But Current Placement Is Fine)

| Module | Where It Is | Observation | Recommendation |
|--------|------------|-------------|----------------|
| **Module J** (Recruitment) | Cloudfull | Recruitment is traditionally HR/ERP. But since Cloudfull is a "work collaboration platform" (not just CRM), and recruitment creates tasks in Module E, it fits. | **Keep in Cloudfull.** If you build an HR module in Co-Work.cloud later, recruitment can optionally sync candidate data to it. |
| **Module K** (Events/Attendance) | Cloudfull | Attendance (clock-in/out, work hours) is typically HR/ERP. But GPS tracking is deeply CRM. These are tightly coupled — splitting them would break the GPS check-in → work hours → sales report chain. | **Keep in Cloudfull.** Attendance data can sync to ERP for payroll calculation later. |
| **Module N** (Skill Testing) | Cloudfull | HR function. But it's lightweight and feeds into recruitment (Module J). | **Keep in Cloudfull.** |
| **H Internal Inventory** (Samples/Equipment) | Cloudfull | The TRACKING workflow (which user holds which sample) must stay in Cloudfull. But the STOCK QUANTITY (how many samples are in the warehouse) is an ERP function. Currently, Cloudfull manages both. | **Keep in Cloudfull for now.** When ERP is built, stock counts should be mastered in ERP and synced to Cloudfull as read-only (same as marketplace product stock). |

#### ❌ Should NOT Shift to Cloudfull (Correctly in ERP)

| Function | Why It Must Stay in ERP |
|----------|------------------------|
| Invoicing | Legal tax document. Requires chart of accounts, tax filing integration. |
| Chart of Accounts | Accounting standard (TFRS). Not a CRM concern. |
| Inventory stock levels | Physical warehouse management. Cloudfull just displays synced data. |
| Financial statements | P&L, balance sheet = pure accounting. |
| Tax filing | Revenue Department submission. |
| Manufacturing | BOM, work orders = factory operations. |
| Payroll | Social Security + Revenue Code compliance. |

---

## Part 2: Data Flow Gaps Found

### 🔴 GAP 1: Expense → ERP Sync Not Specified

**Problem:** §3.7 (Expense) creates expenses in Cloudfull. Approved expenses need to flow to ERP for accounting (journal entries, expense reports, tax deductions). But:
- The ERP API webhook events (L1712) only list: `'contact.updated', 'invoice.created', 'product.updated'`
- No `'expense.approved'` webhook event exists
- No expense sync flow is described

**Impact:** Companies using ERP will need to manually re-enter approved expenses. This defeats the purpose of AI OCR auto-fill.

**Recommendation:** Add `'expense.approved'`, `'expense.updated'` to the webhook events list. Add a note that approved expenses sync to ERP with: expenseId, amount, currency, VAT, category, contactId, date, receipt image URL.

---

### 🔴 GAP 2: SO → ERP → Invoice → Cloudfull Flow Is Vague

**Problem:** The spec says (L5787): *"Invoice & Delivery = Read-Only from ERP."* But there is NO data model for what the read-only invoice view looks like in Cloudfull. L6057 says: *"invoice and delivery tracking still require ERP integration."* But the exact fields Cloudfull receives from ERP are never defined.

**Impact:** Developers won't know what to display when showing invoice status in Cloudfull.

**Recommendation:** Add a brief "Invoice Read-Only View" model to Module Q with fields: invoiceNumber, soNumber, amount, date, paymentStatus, paidAmount, paidDate, dueDate, invoiceFileUrl.

---

### 🟡 GAP 3: Attendance → ERP Sync for Payroll Not Specified

**Problem:** Module K (Attendance) tracks work hours, overtime, leave. The spec mentions (L181): *"GPS work-hour data feeds into social security contribution calculations."* But there's no webhook event or sync mechanism for attendance data → ERP payroll.

**Impact:** Low — payroll is a future Co-Work.cloud feature. But the sync path should be documented.

**Recommendation:** Add a note in Module K that attendance data (work hours, overtime, leave) will be available via the ERP API when payroll module is built. No immediate code change needed.

---

### 🟡 GAP 4: Trending System Missing from Notification Feed Categorization

**Problem:** `TRENDING_RANK_CHANGED` event (L1946) was added to the event list, but it's not assigned to any feed category in the Feed Categorization table (L2008-2020).

**Impact:** Notifications would go to the In-App Feed but won't be categorized properly.

**Recommendation:** Add `TRENDING_RANK_CHANGED` to the "📦 Products & Orders" feed category.

---

## Part 3: Count Verification

### Permission Count

| Claimed | Actual | Status |
|---------|--------|--------|
| "100+ permissions" | ~98 unique permission strings | ⚠️ Borderline — close to 100 but technically under. With `product.trending_vote` just added, we're at ~99. |

**Recommendation:** Either add 2 more granular permissions to genuinely reach 100+, or change claim to "95+ permissions." Being honest: I recommend changing to "95+" to avoid appearing inflated. The exact count fluctuates as we add features.

### Notification Event Count

| Claimed | Actual | Status |
|---------|--------|--------|
| "84+ event types" | 83 events counted (L1919-L2001) | ⚠️ One short. Adding `TRENDING_RANK_CHANGED` brought us to 83, but the claim says 84+. |

**Recommendation:** Change to "83+ event types" or add 1-2 more events (e.g., `TRENDING_MONTHLY_LOCK_EXPIRED` when a user's 30-day lock expires and they can vote again).

---

## Part 4: Web vs Native Considerations

### Currently Specified Web/Native Differences

| Feature | Web | Native | Status |
|---------|-----|--------|--------|
| GPS tracking | Point-in-time only (clock-in, visit) | Continuous tracking on primary device | ✅ Correct |
| Chat offline | No offline cache | Last 200 messages per room in SQLite/Realm | ✅ Correct |
| Push notifications | Browser Push API | FCM/APNs | ✅ Correct |
| Face Liveness | WebRTC camera | Native camera | ✅ Correct |
| QR scanning | Camera API | Native camera | ✅ Correct |
| Receipt photo (§3.7) | File upload from gallery | Camera + gallery | ✅ Correct |
| Product sample tracking | Full UI | Full UI | ✅ Correct |

### Missing Web/Native Distinctions

| Feature | Issue | Recommendation |
|---------|-------|----------------|
| **Trending voting** | No mention of how voting works on web vs native | Add note: Same UX on both — select products from category list, drag to reorder positions 1-5. |
| **Location sharing in chat** | L3975 mentions LINE/WhatsApp-style location sharing | Add note: Native uses device GPS + maps app deep-link. Web uses browser Geolocation API + Google Maps embed. |
| **File size limits for uploads** | §3.7 expense receipt and chat file uploads don't specify mobile network considerations | Add note: Native app should compress images to max 2MB before upload on mobile networks. Web uploads at original size. |

---

## Part 5: Conflicts Found

### 🟡 CONFLICT 1: Event Count Inconsistency

The spec claims different event counts in different places:
- L60 (Executive Summary): "75+ event types"
- L1875 (§3.5 header): "84+ event types"
- L1870 (§3.5): "84+ event types"
- Actual count: 83 events

**Recommendation:** Standardize. The Executive Summary says "75+" (which is technically correct — 83 > 75). The §3.5 section says "84+" (which is wrong — it's 83). Fix §3.5 to say "83+ event types."

### 🟡 CONFLICT 2: Permission Count Inconsistency

- L2407 (Module C tip): "100+ possible permissions"
- L2455 (Permission matrix header): "100+ permission strings"
- L86 (Architecture diagram): "(100+ perms)"
- Actual count: ~98-99

**Recommendation:** Change all to "95+ permissions" to be accurate and honest.

---

## Part 6: Legal Assessment

### PDPA Compliance for New Features

| Feature | PDPA Status | Issue |
|---------|------------|-------|
| **Top 5 Trending** | ✅ Low risk | User's product rankings are voluntary public endorsements. No personal data exposed beyond userId (which is already platform-public). |
| **ERP Manufacturing** | ✅ No issue | Manufacturing data is company-internal. PDPA doesn't apply to business process data. |
| **Expense → ERP sync (GAP 1)** | ⚠️ Needs attention | Expense receipts may contain merchant names, employee names, and amounts. Syncing to ERP requires the company to declare this in their PDPA notice (data processing purpose: "accounting and tax compliance"). Currently not documented in the spec. |

### Consumer Protection for Trending

| Concern | Assessment |
|---------|------------|
| **Deceptive ranking** | The spec correctly separates "🔥 Community Trending" from "📢 Sponsored." This prevents consumer confusion. ✅ |
| **Self-voting** | Allowed by design. Not deceptive because: (1) voterCount is shown publicly, (2) monthly lock prevents rapid manipulation. ✅ |
| **Competition law** | No issue — algorithm is transparent (simple point sum). ✅ |

---

## Part 7: Summary of Actionable Items

| # | Priority | What | Action |
|---|----------|------|--------|
| **F1** | 🔴 High | Expense → ERP sync gap | Add `'expense.approved'` webhook event + expense sync payload definition |
| **F2** | 🔴 High | Invoice read-only model missing | Add brief InvoiceReadOnlyView model to Module Q |
| **F3** | 🟡 Medium | Event count claim "84+" but actual is 83 | Fix to "83+" in §3.5 |
| **F4** | 🟡 Medium | Permission count claim "100+" but actual is ~98 | Fix to "95+" everywhere |
| **F5** | 🟡 Medium | TRENDING_RANK_CHANGED not in feed categories | Add to "📦 Products & Orders" feed |
| **F6** | 🟢 Low | Attendance → ERP payroll sync note | Add future sync note to Module K |

### Module Placement Summary

> [!TIP]
> **No modules need to shift.** The current Cloudfull ↔ Co-Work.cloud boundary is correct. The only adjustments needed are data flow fixes (F1, F2, F6) — ensuring that Cloudfull data can properly sync TO the ERP when it's built.

---

> [!IMPORTANT]
> **Do you want me to implement fixes F1-F6?** I can apply all six in a single pass. None of them require structural changes — they're data model additions and count corrections.
