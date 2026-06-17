# How the Modules Connect — Detailed Connection Map

> **Purpose:** Make sure we both understand the same big picture.
> Every arrow below represents an actual field reference, webhook event, auto-creation, or data sync in the spec.

---

## Layer 1: Identity & Foundation (Every module depends on these)

```
┌─────────────────────────────────────────────────────────────────┐
│                    MODULE A — User Identity                      │
│  (Global profile, KYC, E-Signature, Face Liveness)              │
│                                                                  │
│  USED BY: Every module that has a userId, createdBy,            │
│           assigneeId, approvedBy, withdrawnBy, rentedBy          │
│  PROVIDES TO:                                                    │
│    → Module B: user joins company (CompanyMember)                │
│    → Module C: user receives role inside company                 │
│    → Module J: recruited candidate → auto-creates user account   │
│    → §3.6 Contract: Face Liveness + E-Signature for signing      │
│    → Module Q PO/SO: E-Signature + Face Liveness for signing     │
│    → Module K: EXIF selfie verification for clock-in/out         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                MODULE B — Company (Tenant) Management            │
│  (Legal entity, branches, storefront, company seal, ERP API)     │
│                                                                  │
│  USED BY: Every module that has a tenantId                       │
│  PROVIDES TO:                                                    │
│    → Module C: company has roles → role assigned to user         │
│    → Module D: contacts belong to company (tenantId)             │
│    → Module H: products belong to company (tenantId)             │
│    → Module F: sales plans belong to company                     │
│    → §3.5: notification routes configured per company            │
│    → §3.6: company seal applied to contracts                     │
│    → Module O: company billed for subscription                   │
│    → Module Q: PO/SO belong to company (sellerTenantId/buyer)    │
│    → Module S: campaigns belong to company                       │
│                                                                  │
│  ERP API (Module B §3):                                          │
│    ← FROM ERP: contacts, products, invoices, stock levels        │
│    → TO ERP (webhooks):                                          │
│       • contact.updated                                          │
│       • invoice.created                                          │
│       • product.updated                                          │
│       • expense.approved / expense.updated                       │
│       • sample.distributed / sample.returned                     │
│       • fuel.logged                                              │
│       • attendance.shift_completed                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│            MODULE C — Roles, Permissions & Team Hierarchy         │
│  (RBAC, 95+ permissions, approval chains, reportToUserId)        │
│                                                                  │
│  GATES ACCESS TO: Every single action on the platform            │
│  PROVIDES TO:                                                    │
│    → Module D: who can view/edit contacts                        │
│    → Module E: task assignment follows team hierarchy             │
│    → Module F: manager visibility (cascading up org chart)       │
│    → Module G: chat permissions                                  │
│    → Module H: inventory.view_cost, product.trending_vote        │
│    → Module J: recruitment permissions                           │
│    → Module K: attendance management permissions                 │
│    → Module Q: PO approval chain (who can approve above ฿X)     │
│    → §3.6: vault access levels (who can view/sign contracts)     │
│    → §3.7: expense approval chain (reportToUserId hierarchy)     │
│    → Sample/Equipment: approval for withdrawal (approvedBy)      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layer 2: Core Data (Contacts + Tasks — the operational heart)

```
┌─────────────────────────────────────────────────────────────────┐
│               MODULE D — Contact Pool Management                 │
│  (3 types: Verified Company, Unverified Company, Individual)     │
│  (Dual profile: Internal Profile + Verified Profile)             │
│                                                                  │
│  FEEDS INTO:                                                     │
│    → Module E: task.linkedContactId (every task can link to a    │
│                contact for context)                              │
│    → Module F: salesPlanContact.contactId (sales visits target   │
│                contacts from the pool)                           │
│    → Module G: chat can be linked to a contact                   │
│    → Module H: sample.givenToContactId (sample given to which    │
│                customer)                                         │
│    → Module H: selectedStockContactIds[] (who can see stock)     │
│    → Module Q: po.buyerContactId / sellerContactId (PO links     │
│                to the business relationship)                     │
│    → Module S: campaign leads can be auto-added to contact pool  │
│    → §3.7: expense.expenseTarget → contactId (expense linked     │
│             to a specific customer for investment tracking)       │
│                                                                  │
│  RECEIVES FROM:                                                  │
│    ← Module B ERP API: contact sync from ERP                     │
│    ← Module L: QR contact exchange (scan → auto-add to pool)     │
│    ← Module J: recruited candidate can become a contact           │
│    ← Module S: lead form submission can auto-create contact       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│          MODULE E — Unified Work & Collaboration Hub             │
│  (EVERYTHING is a task. 9 typed pipelines. Calendar sync.)       │
│                                                                  │
│  9 TASK PIPELINES (each has its own status flow):                │
│    1. STANDARD — general tasks                                   │
│    2. SALES_VISIT — from Module F actual plan                    │
│    3. HR_CANDIDATE — auto-created from Module J                  │
│    4. APPROVAL — expense, PO, contract approvals                 │
│    5. SPONSOR_REQUEST — from Module F sponsor system             │
│    6. PROJECT — multi-party projects with budget                 │
│    7. LEAD — from Module S campaign lead form                    │
│    8. PROCUREMENT — auto-created from Module Q PO steps          │
│    9. CUSTOM — company-defined                                   │
│                                                                  │
│  AUTO-CREATED BY:                                                │
│    ← Module F: sales visit creates SALES_VISIT task              │
│    ← Module J: candidate applies → HR_CANDIDATE task             │
│    ← Module Q: every PO step → PROCUREMENT follow-up task        │
│    ← Module Q: RFQ received → task for seller to respond         │
│    ← Module Q: Quotation received → task for buyer to review     │
│    ← Module H: RENT_LOAN sample → return follow-up task          │
│    ← Module H: equipment rental → return follow-up task          │
│    ← Module S: lead form submitted → LEAD task                   │
│    ← §3.6 Contract: document pending signature → task            │
│                                                                  │
│  FEEDS INTO:                                                     │
│    → Module G: tasks can be mentioned in chat (#TASK-123)        │
│    → Google Calendar: tasks sync to Google Calendar               │
│    → §3.5 Notifications: task events trigger notifications       │
│    → §16.6 Reports: task completion rates, pipeline analytics    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layer 3: Operational Modules (Where daily work happens)

### Module F — Sales Planning & Routing

```
DEPENDS ON:
  ← Module D: contactId (which customer to visit)
  ← Module C: reportToUserId (manager hierarchy for visibility)
  ← Module K: GPS work hours (feeds into work duration reports)
  ← Module K: GPS check-in at customer location
  ← §3.7: expenses linked to sales visits (linkedSalesPlanId)
  ← Module B ERP API: historical sales data for AI analysis

PRODUCES:
  → Module E: creates SALES_VISIT tasks in Actual Plan
  → §3.5: SALES_VISIT_MISSED, SALES_REPORT_SUBMITTED notifications
  → §16.6 Reports: FuelInput, EmployeeCost, SponsorSpendSummary,
                    DailyProductivityReport, GPSWorkZoneReport
  → ERP (via fuel.logged webhook): daily fuel/transportation costs
```

### Module G — Chat System

```
DEPENDS ON:
  ← Module A: userId (who is chatting)
  ← Module C: permissions (who can chat with whom)

CONNECTS TO (bidirectional):
  ↔ Module E: mention tasks in chat (#TASK-123), approve from chat,
              forward messages into task activity log, convert
              message to task with one tap
  ↔ Module H: create RFQ/Quotation by selecting products in chat,
              share product cards
  ↔ Module Q: send PO/SO/RFQ/Quotation documents via chat
  ↔ Module D: share contact cards in chat
  ↔ Module L: share location (GPS pin, LINE/WhatsApp style)

PRODUCES:
  → §3.5: CHAT_FILE_EXPIRING notification
```

### Module H — Product Catalog, Marketplace & Internal Inventory

```
THREE PRODUCT WORLDS:
  1. PUBLIC PRODUCTS (marketplace-visible)
  2. INTERNAL SAMPLES (isInternalOnly + SAMPLE type)
  3. INTERNAL EQUIPMENT (isInternalOnly + EQUIPMENT type)

DEPENDS ON:
  ← Module C: permissions (inventory.view_cost, product.trending_vote)
  ← Module D: sample.givenToContactId, selectedStockContactIds[]
  ← Module B ERP API: stock levels synced FROM ERP (read-only)

PRODUCES:
  → Module E: RENT_LOAN sample → auto-creates return follow-up task
  → Module E: equipment rental → auto-creates return follow-up task
  → Module I: linkedShowcaseIds[] (products featured in showcase)
  → Module Q: PO/SO line items reference MasterProduct catalog
  → Module S: campaign items reference products/services/assets
  → Module G: products can be selected in chat for RFQ/Quotation
  → §3.5: PRODUCT_APPROVAL_NEEDED, PRODUCT_MODERATION_FLAGGED,
           PRODUCT_PRICE_VIOLATION, TRENDING_RANK_CHANGED,
           EQUIPMENT_OVERDUE, SAMPLE_BUDGET_THRESHOLD,
           SAMPLE_RETURN_DUE, EQUIPMENT_RETURN_DUE, SAMPLE_LOST_REPORTED
  → ERP (via sample.distributed webhook): sample giveaway costs
  → ERP (via sample.returned webhook): sample return data
  → §16.6 Reports: sample utilization, equipment rental, stock levels

TOP 5 TRENDING:
  ← Module A: userId (who voted)
  → Leaderboard display on category pages (separate from ads)
```

### Module I — Design Showcase

```
DEPENDS ON:
  ← Module H: linkedProductIds[] (products featured in showcase)
  ← Module A: userId (who created showcase)

PRODUCES:
  → Module L: showcase shared via news feed
  → §3.5: SHOWCASE_MODERATION_FLAGGED notification
```

### Module J — Recruitment Pipeline

```
DEPENDS ON:
  ← Module A: candidate profile data
  ← Module C: recruitment permissions

PRODUCES:
  → Module E: candidate applies → auto-creates HR_CANDIDATE task
  → Module A: RECRUITED status → auto-creates user account
  → Module B: auto-creates company membership (employment)
  → §3.6: employment contract stored in vault
  → §3.5: JOB_APPLICATION_RECEIVED, CANDIDATE_STATUS_CHANGED,
           CANDIDATE_AUTO_CONVERTED
```

### Module K — Events, GPS & Attendance

```
DEPENDS ON:
  ← Module A: userId, EXIF selfie verification
  ← Module C: permissions (attendance management)
  ← Module L: QR Event Check-in (scan event QR code)

PRODUCES:
  → Module F: GPS work hours FEED INTO sales reports
  → Module F: GPS check-in data for visit verification
  → §3.7: GPS location stamp on expense receipts
  → §3.5: EVENT_REMINDER, ATTENDANCE_CHECK_IN, ATTENDANCE_LATE,
           SHIFT_OVERTIME_ALERT, DEVICE_PRIMARY_CHANGED,
           DEVICE_CHANGE_APPROVED, DEVICE_CHANGE_REJECTED
  → ERP (via attendance.shift_completed webhook): work hours for payroll
  → §16.6 Reports: attendance, leave, overtime reports
```

### Module L — Favorites, QR & News Feed

```
DEPENDS ON:
  ← Module K: QR Event Check-in (references Module K event)
  ← Module H: E-Brochure (linkedProductIds[] from catalog)
  ← Module D: QR contact exchange auto-adds to contact pool

PRODUCES:
  → Module D: scanned QR → auto-adds contact to pool
  → §3.5: NEWS_POST_FROM_FOLLOWED notification
```

### Module N — Skill Testing

```
DEPENDS ON:
  ← Module A: userId (who takes the test)
  ← Module C: permissions (who assigns tests)

PRODUCES:
  → §3.5: TEST_ASSIGNED, TEST_DUE_SOON, TEST_RESULTS_AVAILABLE
  → §16.6 Reports: skill test scores per employee
```

---

## Layer 4: Transactions & Commerce

### Module Q — Purchase Order & Procurement

```
FULL LIFECYCLE: RFQ → Quotation → PO → SO → Delivery → Invoice

DEPENDS ON:
  ← Module D: buyerContactId / sellerContactId (business relationship)
  ← Module H: productId (line items from product catalog)
  ← Module C: PO approval chain (who approves above threshold)
  ← Module A: E-Signature + Face Liveness for PO/SO signing
  ← Module G: RFQ/Quotation can be created/sent within chat
  ← §1.6: Financial Precision Architecture (10-decimal, Extended Satang)

PRODUCES:
  → Module E: auto-creates PROCUREMENT follow-up tasks at every step
     (RFQ → task for seller, Quotation → task for buyer, PO → task)
  → Module B ERP: PO/SO syncs to ERP for invoicing (Co-Work.cloud)
  → §3.5: PO_CREATED, PO_ACKNOWLEDGED, SO_CREATED, PO_STATUS_CHANGED,
           PO_INVOICE_ATTACHED, PO_SIGNATURE_REQUESTED, RFQ_RECEIVED,
           QUOTATION_RECEIVED, PO_APPROVAL_REQUIRED, DELIVERY_STATUS_UPDATED
  → §16.6 Reports: procurement metrics, PO/SO dashboards

ERP SYNC (read-only inbound):
  ← Co-Work.cloud: delivery status, invoice data, payment status
     (auto-sync in real-time)
  ← External ERP: manual status update or API sync
     (user updates status in Cloudfull after acting in ERP)
```

### Module S — Lead Generation & Campaign

```
DEPENDS ON:
  ← Module H: campaign items reference products/services/assets
  ← Module C: permissions (who can create campaigns)

PRODUCES:
  → External: shareable link + QR code for advertising
  → Module E: lead form submission → auto-creates LEAD task
  → Module D: lead can be auto-added to contact pool
  → §3.5: CAMPAIGN_LEAD_CAPTURED, CAMPAIGN_STARTED,
           CAMPAIGN_ENDING_SOON, CAMPAIGN_COMPLETED,
           CAMPAIGN_LEAD_DATA_EXPIRING
  → §16.6 Reports: campaign performance, conversion rates
```

---

## Layer 5: Cross-Platform Utilities

### §3.5 — Notifications (83+ event types, 6 channels)

```
RECEIVES EVENTS FROM: Every module (A through S)
DELIVERS VIA: In-App Feed, Native Push, Browser Push,
              Ecosystem Chat, Email, SMS
CATEGORIZED INTO 6 FEEDS:
  📋 Tasks & Approvals
  👥 HR & People
  🏢 Company & Contacts
  💬 Sales & Commerce (includes Trending, Campaign, Procurement)
  📅 Calendar & Events
  💰 Billing & Compliance
  📰 Feed & Social
```

### §3.6 — Contract Vault

```
DEPENDS ON:
  ← Module A: Face Liveness + E-Signature engine
  ← Module B: Company Seal application
  ← Module C: vault access levels (5-level access control)

PRODUCES:
  → Module P: audit trail logged
  → §3.5: VAULT_DOCUMENT_UPLOADED, VAULT_SIGNATURE_REQUESTED,
           VAULT_DOCUMENT_EXPIRED
```

### §3.7 — Expense & Receipt Management

```
DEPENDS ON:
  ← Module A: userId (who submits)
  ← Module C: approval chain (reportToUserId hierarchy)
  ← Module D: contactId (customer-linked expense for investment ROI)
  ← Module K: GPS location stamp on receipt
  ← Module F: linkedSalesPlanId (optional: links to sales visit)

PRODUCES:
  → Module E: expense approval becomes a task
  → §3.5: EXPENSE_SUBMITTED, EXPENSE_APPROVAL_NEEDED,
           EXPENSE_APPROVED, EXPENSE_REJECTED
  → ERP (via expense.approved webhook): approved expense data
  → §16.6 Reports: Customer Investment report, expense analytics
```

---

## Layer 6: Platform Administration

```
┌─────────────────────────────────────────────────────────────────┐
│  Module O (Billing)  — How Cloudfull charges companies           │
│  Module P (Compliance) — AI moderation, government takedowns     │
│  §16.5 (Sandbox) — Safe deployment environment                   │
│  §16.6 (Reports) — 13 report categories from ALL modules        │
│  §16.7 (Security) — 59 measures across 10 zones                 │
│                                                                  │
│  ALL MODULES FEED DATA INTO §16.6 Reports:                      │
│    Sales Performance ← Module F                                  │
│    Contact Analytics ← Module D                                  │
│    Task Productivity ← Module E                                  │
│    Products & Showcase ← Module H + Module I                     │
│    Recruitment ← Module J                                        │
│    Attendance & HR ← Module K                                    │
│    Skill Assessment ← Module N                                   │
│    Chat Usage ← Module G                                         │
│    Billing & Revenue ← Module O                                  │
│    Compliance & Security ← Module P                              │
│    Inventory & Tracking ← Module H (Internal)                    │
│    Campaign Performance ← Module S                               │
│    Customer Investment ← §3.7 + Module F + Module S + Module Q   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layer 7: Future (Feature-Flag Gated)

```
┌─────────────────────────────────────────────────────────────────┐
│              MODULE R — Marketplace, Payment & Warehouse         │
│  (moduleR.enabled feature flag — requires BOT license)           │
│                                                                  │
│  DEPENDS ON:                                                     │
│    ← Module H: products listed on marketplace                    │
│    ← Module D: buyer/seller relationships                        │
│    ← Module A: buyer/seller identity                             │
│    ← Module Q: extends PO/SO into payment processing             │
│                                                                  │
│  NEW CAPABILITIES:                                               │
│    Payment Gateway (credit card, bank transfer, PromptPay)       │
│    Physical Warehouses (Cloudfull-managed or franchise)           │
│    TTA Commission (% per transaction)                            │
│    Special Account Law compliance (>฿1B reporting)               │
└─────────────────────────────────────────────────────────────────┘
```

---

## ERP Sync Summary — All Data Flows Between Platforms

### Cloudfull.com → Co-Work.cloud / External ERP (Outbound Webhooks)

| Webhook Event | Data | Source Module |
|--------------|------|--------------|
| `contact.updated` | Contact details, address, phone, tax ID | Module D |
| `invoice.created` | Platform billing invoice | Module O |
| `product.updated` | Product catalog changes | Module H |
| `expense.approved` | Approved expense: amount, VAT, category, receipt | §3.7 |
| `expense.updated` | Updated expense after approval | §3.7 |
| `sample.distributed` | Sample cost: product, quantity, costPerUnit, contact | Module H |
| `sample.returned` | Sample return: quantity, condition | Module H |
| `fuel.logged` | Daily fuel/transportation cost per employee | Module F |
| `attendance.shift_completed` | Work hours, overtime, leave | Module K |

### Co-Work.cloud / External ERP → Cloudfull.com (Inbound Sync)

| Data | Display In | Mode |
|------|-----------|------|
| Stock levels (available, reserved, total) | Module H — Product Inventory | Read-only |
| Invoice data (number, date, amount, payment) | Module Q — PO/SO detail page | Read-only |
| Delivery status (tracking, dates) | Module Q — PO/SO detail page | Read-only |
| Contact details | Module D — Verified Profile | Auto-sync |
| Product catalog | Module H — Product catalog | Sync |
| Historical sales data (for AI analysis) | Module F — Hermes AI | Read-only |

---

## Auto-Creation Chains (Things that happen automatically)

| Trigger | What Gets Auto-Created | Where |
|---------|----------------------|-------|
| Candidate applies to job | HR_CANDIDATE task | Module E |
| Candidate status → RECRUITED | User account + company membership | Module A + B |
| Sales visit scheduled in Actual Plan | SALES_VISIT task | Module E |
| RFQ received from buyer | Follow-up task for seller | Module E |
| Quotation received from seller | Review task for buyer | Module E |
| PO sent to seller | Processing task for seller | Module E |
| RENT_LOAN sample given out | Return follow-up task (with due date) | Module E |
| Equipment rented by employee | Return follow-up task | Module E |
| Lead form submitted (campaign) | LEAD task assigned per distribution | Module E |
| Contract uploaded to vault | Signature request task | Module E |
| Expense submitted | Approval task in manager's queue | Module E |
| Sample returned in DAMAGED condition | Manager review task | Module E |
| QR code scanned (contact exchange) | Contact auto-added to pool | Module D |

---

## Legal Compliance Connections

| Law | Modules Involved | How They Connect |
|-----|-----------------|------------------|
| **PDPA** | A (consent), D (data processing), K (attendee data), S (lead forms), G (chat retention) | User consent recorded at registration (A) → flows to every data collection point |
| **Thai ETA B.E. 2544** | A (e-signature), §3.6 (vault), Q (PO/SO signing) | Same Face Liveness + E-Signature engine shared across vault and procurement |
| **Computer Crime Act §26** | G (chat), P (compliance) | 90-day metadata retention in chat → compliance monitoring in Module P |
| **Revenue Code** | H (pricing), Q (VAT/WHT calc), B ERP (tax filing) | Product prices (H) → SO/PO tax calc (Q) → ERP creates tax invoice (B) |
| **Alcohol/Tobacco Act** | H (substance classification), P (substance gating) | Product flagged as regulated (H) → AI gating rules enforced (P) |
| **Social Security Act** | K (attendance/hours) → B ERP (payroll sync) | Work hours tracked (K) → synced to ERP for contribution calc |
| **Stamp Duty** | §3.6 (vault) | Contract types requiring duty → user notified with Revenue Dept link |

---

> [!IMPORTANT]
> **Key insight:** Module E (Task Hub) is the gravitational center. Nearly every module auto-creates tasks in Module E. If you count: Module F (sales), Module J (recruitment), Module Q (PO/SO), Module H (samples, equipment), Module S (campaigns), §3.6 (contracts), §3.7 (expenses) — that's **7 different modules** feeding tasks into Module E. This is by design: "Everything is a task, every task is tracked."

> [!TIP]
> **Does this match your understanding?** If any connection is wrong or missing, let me know and I'll correct it in the spec.
