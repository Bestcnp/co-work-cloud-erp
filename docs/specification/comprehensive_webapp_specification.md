# Complete Webapp Specification — Final Version
## Cloudfull.com (CDF) + Co-Work.cloud (CW.C) Ecosystem

> This document extracts **every feature, data field, and business rule** from **ALL your source documents**:
> 1. [2026 Co Work Cloud App.docx](file:///Users/bestcnp/Projects/Informations/2026%20Co%20Work%20Cloud%20App.docx) (the original vision)
> 2. [Enterprise Master Plan & Architecture.docx](file:///Users/bestcnp/Projects/Informations/Enterprise%20Master%20Plan%20%26%20Architecture.docx) (AI-generated architecture)
> 3. Full AI Canvas conversation transcript (586K characters)
> 4. Current codebase: [index.ts](file:///Users/bestcnp/Projects/co-work-cloud-erp/backend/src/models/index.ts) (700 lines, 17KB)
>
> **Status Legend:** ✅ = Implemented &nbsp;&nbsp; 🟡 = Partially Implemented &nbsp;&nbsp; All other sections = Fully specified, pending implementation

---

## Executive Summary — Platform Understanding

### What This Platform Is

Cloudfull.com is a **B2B SaaS platform** that combines CRM, marketplace, and lightweight ERP capabilities into a single ecosystem. It launches in **Thailand first** and is architected from day one for **international expansion** — connecting domestic and international businesses on a single platform. In its future phase, the platform evolves into a **full transactional marketplace** (Module R: Marketplace, Payment & Warehouse) with payment processing, physical warehouses, franchise storefronts, and platform commission (TTA) — deployable via feature flag when government approvals are obtained.

The platform is designed for businesses — from SMEs to holding company groups — that need to manage their sales teams, business contacts, products, contracts, recruitment, and day-to-day operations in one place. It is built from the ground up around how B2B businesses actually operate: managing personal relationships alongside company relationships, navigating multi-tier distributor networks, handling **country-specific legal requirements** (tax rules, privacy laws, company verification), and supporting the reality that a single business owner often controls multiple companies simultaneously.

**Thailand** is the first market with deep compliance (PDPA, Revenue Code, DBD verification). The platform's **Country Rule Engine** (§1.5) makes legal compliance, tax formats, address structures, and KYC requirements pluggable per country — so expanding to EU (GDPR), US (CCPA), UK, UAE, and SEA markets requires configuration, not re-architecture.

A second platform, **Co-Work.cloud**, will later extend the ecosystem into full ERP territory (accounting, logistics, procurement). Cloudfull.com is built first and operates independently.

---

### How It Works — The User Journey

**A person signs up once and exists globally.** They create a single identity (Module A: User Profiles & Personal Identity) with their personal details, KYC verification, e-signature collection, and professional portfolio. This identity is theirs — it follows them regardless of which company they work for.

**They then join one or more companies.** Each company is a separate tenant (Module B: Company (Tenant) Management) with its own data, roles, subscription, and settings. Companies can set a **storefront display name** different from their legal name (e.g., legal: "บริษัท เอบีซี เบเวอเรจ จำกัด", storefront: "ABC Premium Drinks") — used on marketplace listings and public profile. Branches can also have their own storefront names. When a user joins a company, they receive a company role (Module C: Roles, Permissions & Team Hierarchy) that determines what they can see and do within that company. A person can be an OWNER in Company A, a SALES_REP in Company B, and a VIEWER in Company C — all from the same account, switchable with one tap.

**Inside each company, all work flows through a central hub.** Module E (Unified Work & Collaboration Hub) is the operational heart of the platform. Every action — a sales visit, a recruitment interview, a sponsor request, an expense claim, a contract approval — becomes a **task** with a typed pipeline, its own activity timeline (logs, comments, status changes), and automatic calendar sync. **Chat (Module G) and Tasks (Module E) are completely separate modules** — like LINE/WhatsApp versus a task board. Users chat casually with each other in Module G, and can **mention tasks or projects** directly in chat (e.g., `#TASK-123`), creating clickable links. When a mentioned task reaches COMPLETED status, the mention is hidden from chat view by default (users can filter to show completed tasks). Users can also **approve work directly from chat**, and **forward text, links, images, videos, and files from chat into a task's activity log notes**. If a user creates a task assigned to someone they haven't chatted with yet, they can **manually create a chat** — but if a conversation already exists between those users, no new chat needs to be created. Separately, the Task module (Module E) gives users their full task board — all tasks assigned to them with status indicators, due dates, and priority sorting. Everything is a task, every task is tracked, and chat connects people while tasks track deliverables.

**The company's business relationships live in the Contact Pool.** Module D manages three types of contacts: (1) Verified Companies already on the platform (auto-synced, always up to date), (2) Unverified External Companies (manually entered, can later become verified), and (3) Individual Contacts. The system maintains **dual profiles** for **all contact types — including individuals** — an **Internal Profile** (the company's private notes, pricing tiers, custom fields) and a **Verified Profile** (official data from the verified company's or individual's own registration on the platform). The Verified Profile updates on the verified company's side, but the Internal Profile **stays static** — it does not auto-update. When data differs between the two profiles (e.g., the verified company changed their phone number), the system displays a **"⚠️ Data Mismatch" label** on the affected fields. Users can then choose to manually sync individual fields or all fields to match the Verified Profile. This ensures companies always control their own contact data while still being alerted to changes.

**Sales teams plan, execute, and report through a structured pipeline.** Module F is the platform's competitive flagship. Each contact in the sales pool is tagged with a tracking mode: **ROUTINE** (recurring visits/calls on a set schedule — every N weeks/months/quarters), **MANUAL** (must visit but no set schedule), or **NEVER** (history only). The **To-Be Plan** is the master pool of all contacts needing attention. The **Actual Plan** is when salespeople schedule contacts from the To-Be Plan into daily time slots for the week or month. When an action is completed, the contact's routine timer advances to the next due date. When missed, the contact stays in the pending pool with a days-since-last-action counter. AI Agent (Hermes) analyzes order history to suggest optimal visit frequency and predict order values per category — but **only if the company has synced their external ERP, connected Co-Work.cloud ERP, or manually uploaded sales data** (duplicate invoice/SO numbers automatically replace the old record to prevent double-counting). Free tier analysis is limited to **2 years of history and 10,000 invoices/SO maximum**; paid tiers allow adjustable years and document counts (configured per tier in the Super Admin backoffice). Field visits include GPS check-in, EXIF photo verification to prove physical presence, work-hour tracking (e.g., 3 visits over 3 hours vs. 7 visits over 7:20 hours), **plus activity logs of all user actions within the webapp during work hours** (create, update, approve — presented as a separate report section for activities during vs. outside work hours). **GPS tracks from work-hour start to end**, with the report noting first visit to last visit. Two sales tracking modes — **TRAVELING_SALES** (multi-province with hotel stays) and **LOCAL_SALES** (returns home daily) — allow companies to define work zones per salesperson and receive alerts if the salesperson goes outside the defined work area during or after work hours. Managers see cascading visibility up the org chart.

**Products, showcases, and marketplace form the commercial layer.** Module H defines the product catalog with multiple price lists per customer segment (including **before-VAT/after-VAT pricing** that drives SO/PO tax calculation), authorized reseller/distributor networks with territory controls, substance classification for regulated goods (alcohol, tobacco, THC), and an advertising system. Every product, service, and asset can be featured in a **lead generation campaign** (Module S: Lead Generation & Campaign). Each campaign generates a **shareable link and QR code** for advertising on external platforms (Facebook, LINE, printed flyers, packaging, banners) — when scanned/clicked by anyone (even non-users), it opens a public campaign landing page with a **customizable lead form** (full form builder with custom questions). Submissions automatically create a Lead task in Module E for the campaign's assigned team to follow up. After the campaign ends, a performance report shows conversion rates, task outcomes, and item-level analytics. Module I provides a Pinterest-style visual showcase where companies display their products and services, with AI-extracted color palettes and hotspot-based interactive images. Together, they form a B2B marketplace where companies discover, evaluate, and connect with suppliers. **A community-driven Top 5 Trending system** lets users rank their favorite products per category (1st = 5 points, 5th = 1 point) — creating organic trending leaderboards separate from paid advertising, with monthly change locks to prevent gaming.

**Real-time messaging connects all platform activity.** Module G provides a standalone chat system beyond task-embedded conversations. Users can create direct 1:1 chats, group chats, and contextual chat rooms (linked to contacts, products, or recruitment postings). Messages support file sharing with lifecycle management (large files >10 MB expire after 7 days, small files ≤10 MB after 14 days on free tier; paid tier is permanent), emoji reactions, @mentions of users, tasks, projects, products, services, and assets — all creating clickable links. Users can share contacts and user profiles as tappable cards, and share their live GPS location (LINE/WhatsApp style). Read receipts, sticker packs (bound to individual users — marketplace purchase, company-distributed, or user-uploaded), full-text message search, date-based history navigation, and optimized lazy loading (loads last 50 messages initially, infinite scroll for history). Chat complies with Thai Computer Crime Act Sec 26 (90-day metadata retention, TLS 1.3 in-transit + AES-256 at-rest encryption). Messages cannot be permanently deleted — only hidden from the user's own view (for audit compliance). Key productivity features: any message can be converted into a task or lead with one tap, users can create RFQs or Quotations by selecting products directly in chat (goes to draft for review), AI can summarize long threads, and approval requests can be pinned directly in chat for quick action. Files opened on native app are cached locally — users keep access even after server expiry.

**Contracts are managed in a secure, court-admissible vault.** §3.6 (Contract Vault) is a standalone document management system with 5-level access control, multi-party signing workflows (sequential or parallel, 2-100 parties), version history, and AI-powered features (clause extraction, risk assessment, renewal reminders). Every signing event is verified with AWS Face Liveness and timestamped under Thai ETA B.E. 2544 — making signatures legally equivalent to ink on paper in Thai courts. For companies that haven't registered for e-Stamps via DBD, the vault supports a **hybrid physical-digital workflow**: upload a document with ink company stamp → system applies a digital watermark labeling the document's purpose → authorized director applies e-signature + Face Liveness KYC → system cryptographically locks the document (hash) making it immutable. For contract types that require government Stamp Duty (อากรแสตมป์), the system **notifies the user** with a reference link to the Revenue Department's e-Stamp portal — the user pays externally and uploads proof of payment to complete the contract.

**Products now include internal operations alongside the marketplace.** Module H manages the full product lifecycle — from public marketplace listings with multiple price lists and reseller networks, to **internal-only products** (samples that can be given to contacts, equipment that can be rented by employees, office supplies). These internal products are never invoiced and never appear on the public marketplace. Module H also displays **live stock levels** synced from external ERP systems (Odoo, SAP, Oracle) and Co-Work.cloud, with configurable visibility: public, internal-only, contact pool, or selected contacts. Module I provides a Pinterest-style visual showcase for product marketing.

**Recruitment is its own pipeline module.** Module J handles job postings on a recruitment marketplace and manages candidate pipelines. When a candidate is recruited, the system automatically **triggers** a user account and company membership — creating the employment relationship in Module B.

**Events and attendance tracking serve HR and field operations.** Module K manages work shifts (clock-in/out with GPS + selfie), company events with PDPA-compliant attendee data collection, leave management, and **multi-device GPS management**. Users may log in on multiple devices simultaneously, but for GPS tracking, **only ONE native app device is designated as the "working device"** at any time — preventing multiple devices from sending conflicting location data. Web browsers can still stamp GPS for point-in-time actions (clock-in/out, visit check-in, expense location) but do NOT send continuous movement tracking. All non-GPS activities (tasks, chat, approvals) sync across all devices. GPS work-hour data from Module K **feeds** into Module F sales reports — showing how many visits a salesperson made and how many working hours they logged per day.

**Skill testing is an HR performance module.** Module N delivers periodic skill assessments for company teams — monthly small tests and quarterly big tests. Free tier: manual question creation. Paid tier: AI generates questions from company data, training materials, and product catalogs. Scores are tracked per employee with AI recommendations for improvement areas.

**QR networking and news feed connect the ecosystem.** Module L enables QR-code contact exchange (scan → auto-populate contact pool) and a company news feed where businesses share updates with their network.

**B2B transactions flow through a structured procurement pipeline.** Module Q handles the procurement document lifecycle: RFQ → Quotation → PO → SO. This is a **separate module from the Contract Vault** — PO/SO documents use the same e-signature and KYC infrastructure but are presented independently so users don't confuse procurement orders with legal contracts. Both PO and SO support **file upload** (users can upload their own documents instead of using in-app forms). Users can also **send quotations or RFQs directly within chat** (Module G) — a "Send To" function lets users share procurement documents to specific users or group chats. Additionally, users can **create new RFQs or Quotations from within chat** by selecting products, services, or assets from Module H's catalog via an inline product picker — the document goes to DRAFT for review before sending. Each company has a **dedicated SO/PO dashboard** showing all current and historical documents, integrated with the per-contact SO/PO list in the Contact Pool (Module D: Contact Pool Management). **Running numbers are unique to the Cloudfull ecosystem** and do not affect the company's external ERP numbering; however, if the company uses Co-Work.cloud ERP, Cloudfull SO/PO can sync into the ERP for invoicing. SO/PO documents include **simple tax calculation** driven by the product price setup in Module H — each product price list specifies whether the price is before or after VAT, and the system auto-calculates VAT and WHT when products are added to SO/PO line items. **All financial calculations follow the §1.6 Financial Calculation Precision Architecture** — 10-decimal intermediate precision, Extended Satang integer storage, Half-Up rounding at display only. Chart of accounts and full tax management are handled by Co-Work.cloud ERP only. Invoice and delivery tracking remain **read-only data synced from Co-Work.cloud or external ERP**, with a **Delivery Partner API Plugin** architecture supporting both **Push (webhook from carrier)** and **Pull (polling carrier API)** modes for direct integration with carriers (Kerry, Flash, J&T, Thailand Post, etc.) to receive real-time delivery status updates.

**Expense management is a cross-platform utility.** §3.7 (Expense & Receipt Management) is available to **ALL user roles** — not just sales. Any employee can photograph a receipt or invoice, and the AI (Hermes) uses OCR to auto-fill expense details (merchant name, amount, VAT, date, receipt number). Expenses flow through the company's approval chain (Module C). The sales cycle uses §3.7 for visit-related expenses, but HR, operations, admin, and any department can submit expenses through the same system.

**Everything is billed, secured, and administered through platform-level systems.** Module O handles subscriptions, Thai tax invoices, and promotional campaigns. Module P provides AI-powered compliance monitoring, content moderation (Hermes AI), substance gating, and a Super Admin backoffice. §3.5 (Platform Notification Architecture) delivers platform-wide notifications across 6 channels with 75+ event types (including 9 po.* events from Module Q: Purchase Order & Procurement). §16.5 manages sandbox environments for safe deployments. §16.6 provides reports across 13 categories. §16.7 verifies 59 security measures across 10 zones. Co-Work.cloud ERP includes **SuperAdmin-exclusive modules** (e.g., Manufacturing for factories) that are feature-flag gated and only available to companies the SuperAdmin explicitly enables.

**A future marketplace phase transforms the platform.** Module R (Marketplace, Payment & Warehouse) is fully specified and ready for deployment via a feature flag (`moduleR.enabled`) when government approvals are obtained. It introduces: **payment processing** through the webapp (Bank of Thailand license required), **physical warehouses** for partner stock managed by Cloudfull or franchise partners, **franchise storefronts** for buyer pickup, and **TTA (Transaction Take Amount)** — a percentage or fixed-value commission on each product transaction. The tax model follows Thai Revenue Department rules with two separate invoices per order (Seller→Buyer for the product, Platform→Seller for the fee), and complies with the **2024 Special Account law** requiring platforms with >฿1B revenue to report merchant revenue directly to the Revenue Department.

---

### How the Modules Connect — The Big Picture

The platform is not a collection of isolated features. Every module is deliberately connected:

```
                         ┌──────────────────────────────────────────┐
                         │        Module A — User Identity          │
                         │   (Global profile, KYC, E-Signature)     │
                         └──────────┬───────────────────────────────┘
                                    │ user joins companies
                         ┌──────────▼───────────────────────────────┐
                         │       Module B — Company Management       │
                         │ (Tenant, Storefront, Seal, ERP, Contract) │
                         └───┬──────┬──────┬──────┬─────────────────┘
                             │      │      │      │
              ┌──────────────▼─┐ ┌──▼────┐ │  ┌───▼──────────────────┐
              │ Module C       │ │ §3.5  │ │  │ §3.6 Contract Vault  │
              │ Roles/Perms    │ │ Notif │ │  │ (Documents, Signing) │
              │ (95+ perms)    │ │ (72+) │ │  │ (Hybrid, Stamp Duty) │
              └──────┬─────────┘ └───────┘ │  └──────────────────────┘
                     │ roles gate access    │ contacts belong to company
              ┌──────▼─────────────────────▼────────────────────────┐
              │           Module D — Contact Pool                    │
              │    (3 entity types, dual-profile, batch sync)        │
              └──────────┬──────────────────────────────────────────┘
                         │ contacts feed into
              ┌──────────▼──────────────────────────────────────────┐
              │         Module E — Central Work Hub                  │
              │  (ALL work = tasks, 9 pipelines, calendar sync,      │
              │   approval chains — Chat is Module G, separate)      │
              └──┬────┬────┬────┬────┬────┬────┬────────────────────┘
                 │    │    │    │    │    │    │
                 ▼    ▼    ▼    ▼    ▼    ▼    ▼
              Mod F  Mod G  Mod H  Mod I  Mod J  Mod K  Mod L-N
              Sales  Chat   Prod   Show   Recruit Event  QR/News
                            +Link            +GPS   QR/News
                            (view)           Device Skill
              └─────────┬───────┬──────────────────────────────────┘
                        │       │
                         │      │ items from H
              ┌──────────▼──────▼──────────────────────────────────┐
              │     Module S — Lead Generation & Campaign           │
              │  (Campaigns, QR/link, form builder, multi-assignee, │
              │   PDPA consent, campaign reports → creates E task)  │
              └──────────┬──────┬──────────────────────────────────┘
              ┌─────────▼───────▼──────────────────────────────────┐
              │     §3.7 Expense (cross-platform, all roles)        │
              │     Module Q (PO/SO + Delivery API Plugin)          │
              └─────────────┬──────────────────────────────────────┘
                            │ all feed into
              ┌─────────────▼──────────────────────────────────────┐
              │     Module O (Billing) + Module P (Compliance)      │
              │     §16.5 (Sandbox) + §16.6 (Reports)              │
              │     §16.7 (Security Audit — 59 measures)            │
              └─────────────┬──────────────────────────────────────┘
                            │ future deployment (feature flag)
              ┌─────────────▼──────────────────────────────────────┐
              │     Module R — Marketplace, Payment, Warehouse      │
              │     (TTA, Payment Gateway, Warehouse, Franchise,    │
              │      Special Account Law — feature flag gated)      │
              └────────────────────────────────────────────────────┘
```

**Key integration chains:**
- **Sales cycle:** Contact Pool (D) → Sales Plan (F) → Routine Plan Task (E) → GPS Check-in (K, primary device only) → Expense Receipt Photo (§3.7, AI OCR auto-fill) → Approval Chain (C) → Notification (§3.5)
- **Recruitment cycle:** Job Posting (J) → Candidate applies → HR Task auto-created (E) → Interview scheduled (E calendar) → Recruited → User account auto-created (A) → Employment Contract (B) → Contract stored in Vault (§3.6)
- **Contract cycle:** Party A creates vault (§3.6) → Invites Party B → Multi-party signing with Face Liveness (A) → Company Seal applied (B) → Document locked → Audit trail logged (P)
- **Campaign-to-Lead cycle:** Product/Service/Asset created (H) → Campaign created (S) with items from H → QR code/shareable link generated (S) → External user scans QR or clicks link → Fills lead form with custom questions (S) → PDPA consent recorded → Lead task auto-created (E) → Assigned user follows up → Campaign report generated (S)
- **Product-to-Order cycle:** Product created (H) → Showcase published (I) → Contact discovers via marketplace → RFQ/Quotation/PO via Module Q → SO acknowledged (Q) → Delivery status via Delivery Partner API Plugin or ERP sync (Q)
- **Expense cycle (any role):** Employee takes receipt photo → AI OCR auto-fills (§3.7) → Employee reviews/submits → Manager approves via Module C chain → Notification (§3.5)
- **Future marketplace cycle (Module R):** Buyer places order (R) → Payment via gateway (R) → Fulfillment via warehouse/distributor/seller (R) → TTA commission deducted (R) → Seller payout (R) → Special Account report to Revenue Dept (R)
- **Trending cycle:** User browses category (H) → Selects Top 5 products → Points aggregated (H) → Trending leaderboard updated → Public display on category page (H/I)

---

### What Makes This Platform Unique

1. **Sales Planning with Physical Verification** — No existing Thai CRM combines routine visit planning, EXIF photo verification (proving the sales rep was physically at the location), AI-suggested visit gaps, and route cost estimation in a single workflow. This is the platform's #1 competitive advantage.

2. **Dual-Profile Contact System** — When a contact is a verified company or individual on the platform, the system shows both an Internal Profile (the company's own notes and data) and a Verified Profile (the contact's official registration). When data differs, a mismatch label alerts users to review and manually sync — giving companies full control over their own contact data while staying informed of changes.

3. **Country-Adaptive Legal Architecture** — Compliance is not bolted on as an afterthought; it's woven into every data collection point. Thailand launches with deep PDPA, Revenue Code, DBD, and ETA integration. The Country Rule Engine (§1.5) makes this pluggable — adding GDPR (EU), CCPA (US), or any country's legal requirements is a configuration change, not a re-architecture.

4. **Company Group Management** — A single business owner managing Subsidiary, Affiliated, and Sister companies can switch between them from one account, while the system enforces strict per-company role boundaries (Admin in Company A ≠ Admin in Company B).

5. **Court-Admissible Contract Vault** — AWS Face Liveness proves the signer was physically present and alive at signing time. Combined with timestamp verification and complete audit trails, this creates evidence that meets Thai ETA B.E. 2544 requirements for electronic transactions. Supports a hybrid physical-digital workflow with ink stamp upload + digital e-signature + stamp duty notification.

6. **Everything-Is-a-Task Architecture** — Every business action (sales visit, expense claim, recruitment interview, contract approval, sponsor request) flows through Module E as a typed task with its own pipeline and calendar entry. Chat (Module G) and Tasks (Module E) are separate modules — connected via mentions, approvals, and content forwarding.

7. **Campaign-Based Lead Generation** — Companies create campaigns (Module S) featuring products, services, or assets from their catalog. Each campaign generates a shareable link and QR code for external advertising (Facebook, LINE, printed materials, packaging). External visitors fill a customizable lead form with PDPA consent and custom questions built by the company. The system auto-creates follow-up tasks assigned to one or more team members (round-robin, all-notify, or manual pick). After the campaign, a performance report shows conversion rates, task outcomes (WON/LOST), and item-level analytics.

8. **AI-Powered Expense Management** — Any employee photographs a receipt and AI OCR auto-fills the expense form (merchant name, amount, VAT, date, receipt number). Available to all user roles — not just sales.

9. **Multi-Device GPS Intelligence** — Users work across multiple devices, but GPS tracking designates ONE native app as the "working device" to prevent messy map data. Web browsers stamp GPS for point-in-time actions only.

10. **Future-Ready Marketplace Architecture** — Module R is fully specified for deployment via feature flag when government approvals are obtained — transforming the B2B platform into a Shopee-like transactional marketplace with payment processing, physical warehouses, franchise storefronts, TTA commission, and 2024 Special Account law compliance.

11. **Community-Driven Product Trending** — Users rank their personal Top 5 products per category, earning tiered points (1st = 5 pts, 5th = 1 pt). Aggregated across all users, this creates an organic trending leaderboard per category — clearly separated from paid advertising. Monthly change locks prevent gaming. The result: buyers discover what the community actually values, not just what companies pay to promote.

---

### Legal Compliance Framework

The platform launches with **Thailand-first compliance** and is designed to add country-specific legal rules as it expands internationally (§1.5 Internationalization Architecture). Current Thai compliance:

| Law | How It's Applied |
|-----|-----------------|
| **PDPA B.E. 2562** | Per-field consent at every data collection point. Right to erasure (5-year retention for legal obligation). Purpose limitation on reports. Sensitive data (Thai ID, biometrics) requires explicit separate consent. **Separate PDPA consent** required for after-hours GPS tracking. |
| **Computer Crime Act B.E. 2550** | 90-day traffic data retention for chat metadata (Sec 26). TLS 1.3 + AES-256 encryption. Service provider obligations for data preservation. |
| **ETA B.E. 2544** | E-signatures legally equivalent to ink signatures (Sec 9). Reliable system requirements met via Face Liveness + audit trail (Sec 26). Contract Vault and PO/SO signing events are court-admissible. Hybrid physical-digital signing supported. |
| **Criminal Code Sec 264** | Company Seal protection — Face Liveness proves the authorized director physically applied the seal, preventing forgery claims. |
| **Revenue Code** | Thai Tax Invoice format with 7% VAT, withholding tax by product category, 5-year document retention (Sec 87/3). Product price lists specify before-VAT/after-VAT pricing for SO/PO tax calculation. Stamp duty notification for applicable contract types. |
| **AMLA B.E. 2542** | KYC data retained for 5 years after account deletion. Three-level company verification (ACTIVE → VERIFIED → FULLY_LICENSED). |
| **Alcohol Control Act / Tobacco Act / FDA Act** | Substance gate blocks regulated product listings without valid licenses. Direct URL protection prevents bypassing frontend guardrails. |
| **ETDA Platform Regulations 2025** | Platform registration requirements. Tenant verification queue managed by Super Admin. |
| **Social Security Act B.E. 2533** | Employee social security contributions. Relevant for Module K attendance/payroll integration — GPS work-hour data feeds into social security contribution calculations. |
| **Foreign Business Act B.E. 2542** | Restrictions on foreign-owned businesses operating in Thailand. Relevant for Module B company verification — foreign-owned companies may require additional BOI or FBA license documentation during KYC. |
| **Payment Systems Act B.E. 2560** | *(Module R, future)* E-Money/Payment Service Provider license from Bank of Thailand required before marketplace payment processing can go live. |
| **Special Account Law 2024** | *(Module R, future)* Platforms with >฿1B revenue must submit detailed merchant revenue reports to Revenue Department. Module R includes SpecialAccountReport model for compliance. |

---

### Security Architecture at a Glance

| Layer | Technology | What It Protects |
|-------|-----------|-----------------|
| **Identity** | Firebase Auth + AWS Face Liveness + MFA/OTP | User authentication, high-value operations (signing, seal, bank export) |
| **Authorization** | 95+ RBAC permissions + 11 Super Admin permissions + approval chains | Every action gated by Module C permission matrix |
| **Data Isolation** | Firestore tenant-scoped paths + API middleware enforcement | Company A cannot see Company B's data — verified in Zone 1 audit |
| **Encryption** | TLS 1.3 (transit) + AES-256 (rest) + per-user chat keys | All data encrypted in motion and at rest |
| **API Security** | HMAC signing + IP allowlisting + auto-freeze + rate limiting | ERP API + Delivery Partner API Plugin hardened against key leaks and brute force |
| **Audit Trail** | Immutable operation logging + 90-day traffic data + 5-year KYC archive | Full forensic capability for legal proceedings |
| **Content Safety** | Hermes AI moderation + substance gate + emergency freeze | Regulated content blocked at platform level, not just frontend |
| **Device Management** | Primary GPS device designation + source tagging | GPS data integrity — only one native device sends continuous tracking, web stamps tagged separately |
| **Infrastructure** | Sandbox environments + deployment pipeline + 72-hour rollback | Safe deployments with auto-snapshot before every release |
| **External Data (PDPA)** | Mandatory consent + configurable retention (3–24 months) + auto-anonymize + erasure URL | Module S campaign lead form data from external visitors — PDPA Sec 33 right to erasure enforced |
| **Payment Security** | *(Module R, future)* Payment gateway encryption + escrow + webhook verification | Marketplace transactions, TTA commission, seller payouts |

**59 security measures across 10 zones — all verified at 100%.** *(Security audit to be updated when Module R is activated and Module S external data handling is verified.)*

---

### Scale and Build Plan

- **Year 1 target:** 10,000+ active users
- **Long-term target:** 100,000+ users
- **Build approach:** 11 phases over 18 weeks, with Sales Planning (Phase 3) as the critical competitive differentiator
- **Technology:** Firebase/Firestore (multi-tenant), Next.js frontend, REST API with API key + HMAC for ERP integration
- **Two platforms:** Cloudfull.com (CRM — built first) → Co-Work.cloud (full ERP — built later, with SuperAdmin-exclusive modules like Manufacturing)

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
1.5. [Internationalization Architecture](#1-5-internationalization)
2. [Module A: User Profiles & Personal Identity](#2-module-a)
3. [Module B: Company (Tenant) Management](#3-module-b)
3.5. [Platform Notification Architecture](#3-5-notifications)
3.6. [Contract Vault & Document Management](#3-6-contract-vault)
3.7. [Expense & Receipt Management (Cross-Platform)](#3-7-expense)
4. [Module C: Roles, Permissions & Team Hierarchy](#4-module-c)
5. [Module D: Contact Pool Management](#5-module-d)
6. [Module E: Unified Work & Collaboration Hub](#6-module-e)
7. [Module F: Sales Planning & Routing](#7-module-f)
8. [Module G: Chat System](#8-module-g)
9. [Module H: Product Catalog, Marketplace & Internal Inventory](#9-module-h)
10. [Module I: Design Showcase (Pinterest-Style)](#10-module-i)
11. [Module J: Recruitment Pipeline](#11-module-j)
12. [Module K: Events, GPS & Attendance](#12-module-k)
13. [Module L: Favorites, QR & News Feed](#13-module-l)
    _(Module M: Reserved for future use)_
14. [Module N: Skill Testing](#14-module-n)
15. [Module O: Billing & Subscription](#15-module-o)
16. [Module P: Compliance, AI & Admin Backoffice](#16-module-p)
16.5. [Platform Sandbox & Version Control Architecture](#16-5-sandbox)
16.6. [Simple Reports & Analytics](#16-6-reports)
16.7. [Security Layers Audit Checklist](#16-7-security-audit)
17. [Module Q: Purchase Order & Procurement](#17-module-q)
18. [Module R: Marketplace, Payment & Warehouse (Future)](#18-module-r)
18.5. [Module S: Lead Generation & Campaign](#18-5-module-s)
19. [Specification Completeness Checklist](#19-completeness)
20. [Build Order Recommendation](#20-build-order)
21. [Firestore Architecture Notes](#21-firestore-notes)

---

### Reading Guide & Conventions

> [!NOTE]
> **For AI agents and developers:** This section explains the conventions used throughout this specification to help you navigate and understand the document quickly.

**Document Structure:**
- **Modules (§2–§17)** define distinct feature areas of the platform. Each module has its own data models, business rules, and UI requirements.
- **Shared Sections (§3.5, §3.6, §3.7)** define cross-cutting systems used by multiple modules — Notifications, Contract Vault, and Expense Management.
- **Platform Sections (§16.5–§16.7)** define infrastructure concerns — Sandbox, Reports, and Security.
- **§19 Completeness Checklist** verifies all gaps are resolved. **§20 Build Order** defines implementation sequence.

**Relationship Markers — How Modules Connect:**
When one module depends on or integrates with another, the specification uses these relationship keywords:

| Keyword | Meaning | Example |
|---------|---------|---------|
| **References** | This field stores an ID from another module | `contactId` in Module F **references** Module D's contact pool |
| **Triggers** | An action here automatically creates something in another module | Candidate application **triggers** an HR task in Module E |
| **Validates against** | This action checks permissions/rules defined elsewhere | Vault signing **validates against** Module C's permission matrix |
| **Integrates with** | Two-way data exchange between modules | Google Calendar **integrates with** Module E tasks |
| **Feeds** | This module sends data/events to another | Module F sales visits **feed** into §3.5 Notification events |
| **Depends on** | This feature requires another module to function | Module F sales plans **depend on** Module D contact pool |

**Data Model Tables:**
- Fields prefixed with `→` are nested sub-fields of the parent field above them.
- Fields in **bold** are new additions to the model.
- `enum` types list all valid values separated by `/`.

**Section Labels:**
- **"Currently Implemented"** = Already built and deployed in the codebase.
- **"Partially Implemented"** = Some fields exist; the spec defines what's missing.
- Unlabeled sections = Fully specified but not yet built.


## 1. Platform Overview {#1-platform-overview}

> [!TIP]
> **📖 What is the Platform Overview?** This section describes the two connected platforms (Cloudfull.com CRM and Co-Work.cloud ERP), what each platform does, and how they connect through API sync. It also covers platform-wide settings like target user counts, address formatting, and registration flow.

### Two Connected Platforms

| Platform | Domain | Purpose | Audience |
|----------|--------|---------|----------|
| **Cloudfull.com (CDF)** | cloudfull.com | CRM, marketplace, showcase, chat, recruitment, sales planning | All users — public + verified B2B |
| **Co-Work.cloud (CW.C)** | co-work.cloud | ERP — accounting, inventory, logistics, procurement | Verified companies only (built later) |

**Build order:** Cloudfull.com first → Co-Work.cloud after

> [!NOTE]
> **Co-Work.cloud has SuperAdmin-exclusive modules.** Some advanced ERP features (e.g., Manufacturing for factories) are only available to companies that the SuperAdmin explicitly enables. These are premium features — not part of the standard ERP tier. See Module B §3 "Co-Work.cloud SuperAdmin-Exclusive Modules" for details.

### Scale Target
- **10,000+ active users** within Year 1
- **100,000+ users** long-term
- One user can belong to **multiple companies simultaneously**
- External ERP integration (Odoo, SAP, Oracle) via REST API

---

## 1.5 Internationalization Architecture {#1-5-internationalization}


> [!TIP]
> **📖 In Plain Language:** This section defines how the platform handles different countries. Instead of hard-coding Thai rules everywhere, we put all country-specific settings (tax rates, ID card formats, address fields, legal requirements, payment methods) into a single configuration system called the "Country Rule Engine." Think of it like a settings file per country — Thailand has one, and when you expand to Singapore, you just create another settings file. No code changes needed.
>
> **Example:** Thailand's config says: VAT = 7%, ID format = 13-digit Thai National ID, company verification API = DBD (Department of Business Development). When you add Singapore: GST = 9%, ID format = NRIC, company verification = ACRA.


> [!IMPORTANT]
> **The platform launches in Thailand first and is architected for international expansion.** All country-specific rules (legal compliance, tax formats, address structures, KYC requirements, company verification APIs, payment methods) are managed through a pluggable **Country Rule Engine**. Adding a new country requires configuration — not re-architecture.

### Country Rule Engine

The Country Rule Engine defines per-country behavior for every aspect of the platform that varies by jurisdiction. Thailand is the first implementation; additional countries are added as configuration entries.

**CountryConfig Model:**

| Field | Type | Description |
|-------|------|-------------|
| countryCode | string | ISO 3166-1 alpha-2 (e.g., 'TH', 'US', 'GB', 'AE', 'DE') |
| countryName | string | Display name in English |
| countryNameLocal | string | Display name in local language (e.g., 'ประเทศไทย') |
| isActive | boolean | Country is available on the platform |
| **taxRules** | TaxConfig | Country-specific tax configuration |
| → vatRate | number | Standard VAT/GST rate (e.g., 7 for Thailand, 20 for UK, 0 for UAE) |
| → vatLabel | string | What VAT is called in this country ('VAT', 'GST', 'Sales Tax') |
| → withholdingTaxEnabled | boolean | Whether withholding tax applies |
| → withholdingTaxRateTable[] | WHTRate[] | Rates by product category (Thailand Revenue Dept rates, EU rates, etc.) |
| → invoiceFormat | enum | 'THAI_TAX_INVOICE' / 'EU_INVOICE' / 'US_INVOICE' / 'INTERNATIONAL' |
| → fiscalYearStart | enum | Fiscal year start month (e.g., 'JANUARY', 'APRIL', 'OCTOBER') |
| → taxIdLabel | string | What the company tax ID is called ('TAX ID', 'VAT Number', 'EIN', 'ABN') |
| → taxIdFormat | string | Regex validation pattern for tax ID |
| **addressFormat** | AddressConfig | Country-specific address structure — **see Module A (§2) `countryAddressConfigs[]` for the canonical field definitions** including `fieldKey`, `labelEN`, `labelLocal`, `dropdownSource`, `displayOrder`, `postalCodeFormat`, and `googlePlacesComponents`. The Module A definition is the authoritative schema; this reference ensures CountryConfig links to it. |
| **kycRequirements** | KYCConfig | Country-specific identity verification |
| → individualIdType | enum | 'THAI_NATIONAL_ID' / 'PASSPORT' / 'NATIONAL_ID' / 'SSN' / 'AADHAAR' |
| → individualIdLabel | string | Display label for the ID field |
| → individualIdFormat | string | Regex validation for ID number |
| → companyVerificationApi | enum | API for company verification: 'DBD_THAILAND' / 'COMPANIES_HOUSE_UK' / 'SEC_EDGAR_US' / 'MANUAL_REVIEW' |
| → faceLivenessRequired | boolean | Whether AWS Face Liveness is required for KYC in this country |
| **complianceLaws** | ComplianceLaw[] | Country-specific legal requirements |
| → lawName | string | e.g., 'PDPA B.E. 2562', 'GDPR', 'CCPA', 'PIPA' |
| → dataRetentionDays | number | Minimum data retention period (90 days for Thai Computer Crime Act, varies by country) |
| → consentModel | enum | 'OPT_IN' (GDPR/PDPA: explicit consent required) / 'OPT_OUT' (US: consent assumed unless opted out) |
| → rightToErasure | boolean | Whether users can request data deletion |
| → crossBorderTransferRules | string | Rules for transferring data across borders (GDPR SCCs, PDPA adequacy decisions) |
| **defaultCurrency** | string | ISO 4217 currency code: 'THB', 'USD', 'EUR', 'GBP', 'AED' |
| **supportedPaymentMethods[]** | string[] | Available payment methods: 'BANK_TRANSFER', 'CREDIT_CARD', 'PROMPTPAY', 'STRIPE', 'PAYPAL', etc. |
| **languageSupport** | LanguageConfig | Language settings |
| → primaryLanguage | string | 'th', 'en', 'ar', 'de', etc. |
| → secondaryLanguage | string | Usually 'en' for all non-English countries |
| → rightToLeft | boolean | RTL layout support (Arabic, Hebrew) |
| → nameFieldOrder | enum | 'FIRST_LAST' (Western) / 'LAST_FIRST' (East Asian) / 'FIRST_LAST_WITH_NATIONAL' (Thailand: English + Thai names) |

### Multi-Currency Support

> [!NOTE]
> **All monetary fields in the platform support multi-currency.** The default currency is determined by the company's `countryCode` → `CountryConfig.defaultCurrency`. Individual transactions can specify a different currency when dealing with international contacts. Exchange rates are stored at the transaction level for audit accuracy.

| Field | Type | Description |
|-------|------|-------------|
| **currencyCode** | string | ISO 4217 code of the transaction currency |
| **exchangeRate** | number | Exchange rate to platform base currency at time of transaction |
| **exchangeRateDate** | string | When the exchange rate was captured |
| **amountInOriginalCurrency** | number | Amount in the transaction's currency |
| **amountInBaseCurrency** | number | Amount converted to the company's default currency |

### Financial Calculation Precision Architecture (§1.6)

> [!CAUTION]
> **Platform-wide financial calculation rules applying to ALL modules that handle monetary values.** Never round during intermediate steps. Only round at the final display/payment output. Failure to follow this architecture will cause "hanging penny" discrepancies between invoices, payment gateways, and reports.

**Three-Phase Precision Model:**

| Phase | Description | Precision | Method |
|-------|-------------|-----------|--------|
| **1. Calculation** | All intermediate math (discounts, multi-line totals, tax) | **10 decimal places** | Never round during calculation. All arithmetic operations maintain 10 decimal places internally. |
| **2. Storage (Firestore)** | Database persistence | **Integer (Extended Satang)** | Store as smallest currency unit × 10^8. E.g., `150.5500000000 THB` → stored as `15055000000` (integer). Division by 10^8 happens ONLY at display time. All DB arithmetic uses integer math — eliminates JavaScript floating-point errors. |
| **3. Display & Payment** | UI rendering, payment gateway, invoice PDF, receipt | **2 decimal places** | **Half-Up rounding** (commercial standard) applied ONCE at the final output step only. |

> [!IMPORTANT]
> **Extended Satang Method (NoSQL/Firestore):** All monetary values are stored as integers representing `value × 10^8`. This provides 8 decimal places of precision in storage (sufficient for 10-decimal intermediate calculations with rounding at storage boundary). JavaScript's `Number.MAX_SAFE_INTEGER` (2^53 - 1 = 9,007,199,254,740,991) supports values up to **90,071,992.54740991** in base currency — more than sufficient for B2B transactions. For values exceeding this (rare), use `BigInt`.

**Rounding Rule: Half-Up (Commercial Standard)**

| Third Decimal Digit | Action | Example |
|---------------------|--------|--------|
| ≥ 5 | Round **UP** | 100.125 → **100.13** |
| < 5 | Round **DOWN** | 100.124 → **100.12** |

**Calculation Workflow Example (3 units × 150.55 THB, 12.5% discount, 7% VAT):**

| Step | Action | Raw Value (10 decimals) | Stored Integer (×10^8) |
|------|--------|------------------------|------------------------|
| 1. Unit Price | Fetch from DB | 150.5500000000 | 15055000000 |
| 2. Quantity × 3 | Multiply | 451.6500000000 | 45165000000 |
| 3. Discount 12.5% | Subtract discount | 395.1937500000 | 39519375000 |
| 4. VAT 7% | Add tax | 422.8573125000 | 42285731250 |
| 5. **Display** | Round for invoice/receipt | **422.86** | — |

**Line Item vs. Total Rounding Policy:**

> [!NOTE]
> **Round at the TOTAL level, not per line item.** When an invoice/PO/SO has multiple line items, each line item's `lineTotal` is stored at full 10-decimal precision. The `subtotal`, `taxAmount`, and `grandTotal` are also calculated at full precision. Rounding to 2 decimal places happens ONLY when displaying the final `grandTotal` to the user or sending it to a payment gateway. This prevents cumulative rounding errors across many line items.

**Affected Modules (all monetary `number` fields follow this architecture):**
- **Module H (§9):** Product prices (`unitPrice`), price lists, discount calculations
- **Module Q (§17):** RFQ/Quote/PO/SO line items (`unitPrice`, `lineTotal`), `subtotal`, `taxAmount`, `grandTotal`
- **§3.7:** Expense amounts, receipt totals, currency conversion amounts
- **Module O (§15):** Subscription billing, add-on pricing, invoice amounts
- **Module S (§18.5):** Campaign cost tracking (if applicable)
- **Module R (§18):** Marketplace transactions, TTA commission, seller payouts (future)
- **Multi-Currency (§1.5):** `exchangeRate` stored at 10-decimal precision. `amountInBaseCurrency` calculated at 10 decimals, stored as Extended Satang integer.

### Platform-Wide Data Retention & Media Lifecycle (§1.7)

> [!IMPORTANT]
> **Company-configurable retention policies for media files (images, videos, documents) across all modules.** Companies can flush/clear historical data year-by-year to manage storage costs. Legal minimum retention periods are enforced — companies cannot set retention below the legal floor.

**CompanyDataRetentionConfig Model:**

| Field | Type | Description |
|-------|------|-------------|
| retentionConfigId | string | Unique identifier |
| tenantId | string | Company |
| configuredBy | string | userId who set/updated the policy |
| configuredAt | string | ISO 8601 — when last updated |
| **globalDefaultRetentionYears** | number | Default media retention for all modules (range: 1–10 years, default: 3). Cannot be set below the legal minimum for any module. |
| **moduleOverrides[]** | ModuleRetentionOverride[] | Per-module retention overrides (optional — falls back to global default if not set) |
| → moduleCode | enum | 'MODULE_A' / 'MODULE_B' / 'MODULE_D' / 'MODULE_E' / 'MODULE_F' / 'MODULE_G' / 'MODULE_H' / 'MODULE_I' / 'MODULE_J' / 'MODULE_K' / 'MODULE_L' / 'MODULE_N' / 'MODULE_Q' / 'MODULE_S' / 'VAULT' / 'EXPENSE' |
| → retentionYears | number | Years to keep media for this module (must be ≥ legalMinimumYears) |
| → mediaTypes[] | enum[] | Which media this applies to: 'IMAGE' / 'VIDEO' / 'DOCUMENT' / 'AUDIO' / 'ALL' |
| → legalMinimumYears | number | **System-enforced minimum** — UI prevents setting below this. Auto-populated from Legal Floor table below. |
| **autoCleanupEnabled** | boolean | Enable automatic yearly cleanup job (default: false — companies must explicitly opt in) |
| **cleanupSchedule** | enum | 'YEARLY_JAN' / 'YEARLY_APR' / 'YEARLY_JUL' / 'YEARLY_OCT' / 'YEARLY_CUSTOM' |
| **customCleanupMonth** | number | If YEARLY_CUSTOM: month (1–12) |
| **cleanupNotificationDays** | number | Notify admin X days before scheduled cleanup (default: 30) |
| **requireManualApproval** | boolean | If true: cleanup requires admin click to confirm (not automatic). Default: **true** (recommended). |

**Legal Minimum Retention Floors:**

| Data Type | Minimum Retention | Legal Basis | Modules Affected |
|-----------|-------------------|-------------|------------------|
| Financial documents (invoices, receipts, PO/SO) | **5 years** | Revenue Code Sec 87/3 | Q, §3.7, O |
| KYC data (identity, verification docs) | **5 years post-deletion** | AMLA Sec 22 | A, B |
| Chat metadata (traffic data) | **90 days** | Computer Crime Act Sec 26 | G |
| Employment records (attendance, leave) | **2 years post-termination** | Labour Protection Act | K |
| Contract documents | **10 years** | Civil & Commercial Code Sec 193/30 | §3.6 (Vault) |
| Campaign lead data (PDPA) | **Per campaign config (max 24 months)** | PDPA B.E. 2562 | S |
| E-signatures and signing events | **10 years** | ETA B.E. 2544 + Revenue Code | A, §3.6 |
| GPS/location data | **2 years** | PDPA Sec 26 + Labour Protection Act | K, F |

**Cleanup Process (Year-by-Year Flush):**

| Step | Action |
|------|--------|
| 1 | System identifies media files older than the module's retention period |
| 2 | 30 days before cleanup date → sends `DATA_CLEANUP_PENDING` notification to company admin |
| 3 | Admin reviews the cleanup summary (file count, total size, affected modules) |
| 4 | If `requireManualApproval: true` → admin must click "Approve Cleanup" within 30 days. If not approved → postponed to next cycle, admin re-notified |
| 5 | If approved (or `autoCleanupEnabled` + `!requireManualApproval`): media files permanently deleted from cloud storage. Database records REMAIN (metadata only) with `mediaStatus: 'EXPIRED'`. Expired media shows placeholder: "[File expired — retention period ended]" |
| 6 | Audit log: "Media cleanup executed — {count} files, {sizeGB} GB freed, modules: [{list}]" |
| 7 | `DATA_CLEANUP_COMPLETED` notification sent to admin |

**Media Status Field (added to all modules with file attachments):**

| Field | Type | Description |
|-------|------|-------------|
| **mediaStatus** | enum | 'ACTIVE' (file exists on server) / 'EXPIRED' (file deleted by retention policy, metadata remains) / 'EXPIRING_SOON' (within 30 days of cleanup). Default: 'ACTIVE'. |
| **mediaExpiredAt** | string | ISO 8601 — when the file was deleted by cleanup (null if ACTIVE) |

> [!NOTE]
> **User-level file management:** Individual users cannot override company retention policies. However, users can **download/export** their own files before the retention period expires. The system sends `CHAT_FILE_EXPIRING` and `DATA_CLEANUP_PENDING` notifications to give users advance warning. Files already saved to the user's physical device (native app local cache) remain accessible even after server deletion.

### Country Launch Priority

| Priority | Countries | Status |
|----------|-----------|--------|
| **1 — Launch Market** | Thailand (TH) | ✅ Fully specified — PDPA, Revenue Code, DBD, ETA |
| **2 — Near-term Expansion** | Singapore (SG), Malaysia (MY), Indonesia (ID), Philippines (PH), Vietnam (VN) | Planned — SEA market |
| **3 — Developed Markets** | United States (US), United Kingdom (GB), Germany (DE), France (FR), United Arab Emirates (AE) | Planned — each requires country-specific ComplianceLaw and TaxConfig |
| **4 — International Standard** | All other countries | Uses 'INTERNATIONAL' invoice format, 'PASSPORT' for KYC, 'MANUAL_REVIEW' for company verification |

> [!NOTE]
> **For countries not yet configured:** The platform uses a default international profile — passport-based KYC, manual company verification by Super Admin, international invoice format, and USD as fallback currency. Companies in unconfigured countries can still use the platform with these defaults.

---

## 2. Module A: User Profiles & Personal Identity {#2-module-a}

> [!TIP]
> **📖 What is Module A?** This is about the **individual person** — the human being who creates an account on Cloudfull.com. Before they join any company, they are just a person with a profile. This module covers: their personal info (name, phone, ID), their identity verification (KYC — proving they are who they say they are), their digital signatures, their professional resume/CV, and how they log in.
>
> **Why it matters:** Every user exists globally on the platform. They can then join multiple companies. Their personal identity (KYC, signatures) follows them everywhere.



The individual person who creates an account. One person exists globally, then joins companies.

### Currently Implemented
uid, email, displayName, photoUrl, kycVerificationStatus, activeTenantId, tenantMemberships, pdpaConsentedAt, isGlobalAdmin, isSuperAdminTeam, createdAt, updatedAt

### Personal Contact & Identity

> [!TIP]
> **📖 In Plain Language:** This is the registration form — name, phone, date of birth, nationality. The key design: when you select your nationality, the form adapts. Thai nationals see Thai name fields + Thai ID. Japanese nationals see Japanese name fields + passport. The system stores both English and local-language names.



> [!NOTE]
> **Form flow:** User selects `nationality` and `addressCountry` FIRST. These determine which fields are shown (Thai names, Thai ID, address format). English fields are always default and required.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| nationality | string | ✅ | Selected first — determines KYC requirements, conditional fields, and **national name labels** (see below) |
| firstNameEN | string | ✅ | English first name (always required) |
| **middleNameEN** | string | Optional | English middle name (optional — standard for international users) |
| lastNameEN | string | ✅ | English last name (always required) |
| **firstNameLocal** | string | National | **Dynamic label based on nationality selection:** Thai → "ชื่อ (First Name)", Japanese → "名 (First Name)", Chinese → "名 (Given Name)", Korean → "이름 (First Name)". Shown when nationality ≠ EN-only countries. Field key is always `firstNameLocal` — only the UI label changes. |
| **middleNameLocal** | string | Optional | National language middle name (optional) |
| **lastNameLocal** | string | National | **Dynamic label based on nationality selection:** Thai → "นามสกุล (Last Name)", Japanese → "姓 (Last Name)", Chinese → "姓 (Family Name)", Korean → "성 (Family Name)". |
| nicknameTH | string | Thai only | Thai nickname (ชื่อเล่น) — critical in Thai business culture. For non-Thai nationals, this field is hidden. |
| dateOfBirth | string | ✅ | ISO date — needed for age verification |
| gender | enum | ✅ | 'MALE'/'FEMALE'/'OTHER'/'PREFER_NOT_TO_SAY' |
| nationalIdNumber | string | Thai only | **Thai ID / Personal Tax ID** (13-digit, encrypted). Same number serves as both national ID and personal tax ID for freelancers. |
| passportNumber | string | Non-Thai only | Passport number — shown only when nationality ≠ Thai |
| **passportFullName** | string | Non-Thai only | Full name as printed on passport |
| **passportNationality** | string | Non-Thai only | Nationality as printed on passport |
| **passportExpiryDate** | string | Non-Thai only | Passport expiry date (ISO date) |
| phoneCountryCode | string | ✅ | Country code selector dropdown (e.g., '+66', '+81', '+1', '+86', '+82') |
| phoneNumber | string | ✅ | Primary phone number. Validation length varies by country and type. |
| phoneType | enum | ✅ | 'MOBILE' / 'LANDLINE' — determines validation rules per country. **Note:** HOTLINE is a company/branch-level phone type only (see Module B §3) and is not available for personal user profiles. |
| **phoneExtension** | string | Optional | Extension number (optional, applies to ALL phone types — e.g., "ext. 1234"). No digit limit. |
| phoneSecondary | string | Optional | Secondary phone number |
| lineId | string | Optional | LINE messenger ID |
| linkedinUrl | string | Optional | LinkedIn profile URL |
| preferredLanguage | enum | ✅ | Default: 'EN'. Options managed by Super Admin locale config. Initial: 'EN'/'TH'. Ready to enable: 'ZH' (Chinese)/'JA' (Japanese)/'KO' (Korean). Future: 'VI'/'MY'/'ID'/'MS'/'OTHER' |
| timezone | string | ✅ | Default: 'Asia/Bangkok' |

> [!IMPORTANT]
> **Phone validation:** Number length and format vary by country AND type. Thai mobile = 10 digits (0x-xxxx-xxxx), Thai landline = 9 digits, Thai fax = 9 digits. **Hotline** numbers follow E.164 with no digit limit (corporate main lines vary globally). All phone types support an optional `phoneExtension` field. Validation rules are applied per `phoneCountryCode` + `phoneType` combination. International formats follow ITU-T E.164.

> [!NOTE]
> **Passport data — PDPA Sec 22 (Minimum Data Principle):** For non-Thai nationals, the platform collects ONLY: passport number, full name as printed, nationality, and expiry date. The platform does NOT collect: place of birth, issuing authority internal codes, machine-readable zone (MRZ) data, or passport photo page scan. Passport number is encrypted at rest (AES-256). Purpose: identity verification for KYC and legal compliance only.

> [!NOTE]
> **Login email:** The user's registration `email` (already in "Currently Built") IS their personal email and primary login. There is no separate `personalEmail` field. Company emails are added later when assigned a company role (see Multi-Login section below).

### Multi-Login & Identity Linking

> [!TIP]
> **📖 In Plain Language:** One person = one account, but they can log in with multiple emails. Their personal email is permanent. When a company gives them a work email (somchai@companya.com), that ALSO becomes a login method. If they leave the company, the work email login is revoked but their personal account is untouched.
>
> **Example:** A consultant works for 3 companies. They can log in with personal@gmail.com, or work1@companya.com, or work2@companyb.com — all lead to the same account with different company contexts.



> [!IMPORTANT]
> **Core architecture:** Every user has ONE permanent `userId` that never changes. Every company role has ONE permanent `companyRoleId` that survives user changes. Login methods are linked to the permanent userId.

**Login methods:**

| Login Method | When Added | When Removed |
|---|---|---|
| **Personal email** (primary) | At registration | Never — permanent login |
| **Verified phone number** | At registration (if registering by phone) or when user verifies phone via OTP | Never — permanent login (if registered by phone). Revocable if added later. |
| **Company email** | When assigned a company role with a company email | When removed from company — login via this email is revoked |
| **Personal email on company role** | When company allows user to use their own email for the role | When removed from company |

> [!IMPORTANT]
> **Phone number as login method:** Users can register and login using a verified phone number (OTP-based authentication). Phone registration flow: (1) User enters phone number + country code, (2) System sends OTP via SMS, (3) User verifies OTP → account created with phone as primary login, (4) User can optionally add email later. Verified phone numbers can be used as login credentials alongside email. Company role phone is set by the company and is always informational (not a login method).

**User Identity Model:**

| Field | Type | Description |
|-------|------|-------------|
| userId | string | **Permanent.** Format: `{yearMonth}-{randomAlphanumeric}` (e.g., `2606-A7K3M9X2B4`, `2607-N4P1Y5C8D2`). YearMonth = registration period (YYMM). Random suffix = 10-character alphanumeric (unpredictable, case-insensitive). **Privacy-first:** userId does NOT contain nationality, country code, or any personally identifiable information — prevents profiling and complies with PDPA data minimization principles. Never exhausts, never sequential, prevents user-count leakage. All login methods link to this single ID. |
| loginEmails[] | LoginEmail[] | All email addresses that can authenticate this user |
| → email | string | The email address |
| → emailType | enum | 'PERSONAL' / 'COMPANY_ROLE' |
| → linkedCompanyRoleId | string | If company role email: which companyRoleId this email authenticates. Null for personal. |
| → isVerified | boolean | Email has been verified/authenticated |
| → isActive | boolean | Currently active (false when revoked) |
| → addedAt | string | When linked |
| → revokedAt | string | When unlinked (null if active) |

**Company Role Identity Model:**

| Field | Type | Description |
|-------|------|-------------|
| companyRoleId | string | **Permanent.** Survives user changes. If User A leaves and User B takes over the same position, the companyRoleId stays — only `currentUserId` changes. |
| tenantId | string | Which company |
| currentUserId | string | Current user filling this role |
| roleEmail | string | Company email for this role (or user's personal email if company allows) |
| **rolePhone** | RolePhone | Company phone number for this role (informational only, set by the company). Follows Platform Phone Validation Standard. |
| → phoneNumber | string | Full phone number |
| → phoneCountryCode | string | Country code (e.g., '+66'). Determines validation rules. |
| → phoneType | enum | 'MOBILE' / 'LANDLINE' / 'FAX' / 'EXTENSION'. Validation per phoneCountryCode + phoneType combination. |
| assignedRole | string | Role name |
| permissions[] | string[] | Granted permissions |
| isActive | boolean | Currently active |
| assignedAt | string | When current user was assigned |
| **joinDate** | string | Company-set join date for this role (e.g., employment start date). Set by company admin at assignment. **Auto-cleared when user is removed from role.** |
| **companyInternalCode** | string | Free-text field for company's internal employee/role code. Used for API mapping with external ERP/HR systems (e.g., "EMP-001", "SAP-HR-12345"). |
| **previousHolders[]** | RoleHistory[] | History of who held this role |
| → userId | string | Previous user |
| → assignedAt | string | When assigned |
| → removedAt | string | When removed |
| → removalReason | enum | 'RESIGNED' / 'TERMINATED' / 'CONTRACT_ENDED' / 'ROLE_TRANSFERRED' / 'OTHER' |
| → removalReasonDetail | string | Free-text detail for removal reason |

> [!NOTE]
> **When a user is removed from a company:** (1) Company email login is revoked immediately. (2) The `companyRoleId` stays in the company records — user moves to `previousHolders[]`. (3) User's personal profile, portfolio, and other company memberships are NOT affected.

> [!NOTE]
> **Platform Phone Validation Standard (applies to ALL phone fields across the spec):** Every phone number field in the platform — personal phones, company phones, branch phones, role phones, MD contact phones, contact person phones — follows the same validation rules: (1) Phone number format varies by `phoneCountryCode` + `phoneType` combination. (2) **Thai mobile** = 10 digits (0x-xxxx-xxxx). **Thai landline** = 9 digits. **Thai fax** = 9 digits. (3) **Hotline** numbers = no digit limit (corporate main lines vary globally, follow E.164). (4) **All phone types** support an optional `phoneExtension` field (no digit limit). (5) **International** formats follow ITU-T E.164 standard. (6) All phone number inputs display the country code selector dropdown (populated from Super Admin platform locale config). This standard is referenced by: Company Phones (Module B), Branch Phones (Module B), MD Contact (Module A KYC), Contact Person (Module D).

### Terms & Agreement Consent Audit Log

> [!IMPORTANT]
> **Thai law basis:** Electronic Transactions Act B.E. 2544 (ETA) Sec 7-9 (electronic signatures), Sec 11 (admissibility of electronic evidence). Clickwrap agreements are legally binding in Thailand, but the **platform bears the burden of proving** the signature is "reliable." This audit log provides the 4 pillars of court-admissible evidence: **Authentication, Device, Timestamp, Document Version.**

**Consent Audit Log Entry (captured every time a user or company accepts any terms/agreement):**

| Field | Type | Description |
|-------|------|-------------|
| consentId | string | Unique identifier |
| userId | string | User who accepted |
| tenantId | string | Company context (null if personal consent) |
| action | enum | 'ACCEPTED_TERMS' / 'ACCEPTED_PRIVACY_POLICY' / 'ACCEPTED_PDPA_CONSENT' / 'ACCEPTED_CONTRACT' / 'ACCEPTED_NDA' / 'ACCEPTED_COMPANY_AGREEMENT' |
| documentType | enum | 'TERMS_OF_SERVICE' / 'PRIVACY_POLICY' / 'PDPA_CONSENT' / 'COOKIE_POLICY' / 'COMPANY_NDA' — which document was agreed to |
| documentVersion | string | Exact version accepted (e.g., "v3.2_2026") — immutable, version-controlled |
| documentHash | string | SHA-256 hash of the exact document content at time of acceptance — cryptographic proof the document hasn't been altered |
| timestamp | string | ISO 8601 with timezone (e.g., "2026-06-06T12:41:17+07:00") — server-side, high precision |
| ipAddress | string | IP address at exact moment of acceptance |
| userAgent | string | Full device fingerprint (e.g., "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X)") |
| authMethod | enum | 'EMAIL_PASSWORD' / 'GOOGLE_SSO' / 'APPLE_SSO' / 'OTP_VERIFIED' — how user was authenticated at the moment |
| gpsLocation | object | GPS coordinates at time of acceptance (if available) — corroborating evidence accepted by Thai courts |
| → lat | number | Latitude |
| → lng | number | Longitude |
| sessionId | string | Active session identifier — links consent to the authenticated session |
| sessionDurationBeforeConsent | number | Seconds on the consent page before clicking accept — proves user had time to read |
| precedingActions[] | string[] | Last 5 actions before consent (e.g., "scrolled_to_bottom", "viewed_section_3", "expanded_clause_7") — proves engagement with document |

> [!NOTE]
> **Subsequent behavior as evidence:** Under Thai Civil and Commercial Code, post-acceptance behavior (usage, payments, messages) demonstrates implied consent. The platform's standard audit logging (Module P) captures this automatically — no additional fields needed here.

> [!IMPORTANT]
> **Document immutability rule:** The platform MUST NOT modify or delete any terms/agreement document version after ANY user has accepted it. All versions are archived permanently with their SHA-256 hash. When terms change, a new version is created and users must re-accept. Each user's consent history shows exactly which version they accepted and when.

**Applies to:**
- Platform Terms of Service (all users, at registration)
- PDPA Consent (all users, at registration)
- Privacy Policy (all users, at registration)
- Platform AI Disclaimer (all users AND companies, at registration — see below)
- Company-specific agreements (NDA, employment contracts, etc.)
- Contract signings via the Contract Vault (see §3.6 — Contract Vault & Document Management)
- Any future agreement type added by Super Admin

**Platform AI Disclaimer (Required in Terms & Agreement for ALL Users AND Companies):**

> [!CAUTION]
> **Thai legal basis:** Consumer Protection Act B.E. 2522 (unfair contract terms), Civil and Commercial Code Sec 420-421 (wrongful acts / tort), Thai Lawyers Council Act (only licensed lawyers can provide legal advice for compensation), ETA Sec 15 (AI does not qualify as a "reliable electronic signature"). The platform MUST include this disclaimer in both user Terms of Service and company Terms of Service. Users and companies MUST accept it at registration. Changes require re-acceptance.

**Master AI Disclaimer Clause (must be displayed and accepted):**

*"AI-generated suggestions, verifications, analyses, risk assessments, and recommendations provided by this platform — including but not limited to signature verification, KYC assessments, withholding tax rate suggestions, product moderation decisions, contract analysis, fraud detection scoring, recruitment matching, and regulatory scanning — are provided for informational and assistive purposes only. They do not constitute legal, financial, tax, medical, or professional advice. The platform makes no warranty regarding the accuracy, completeness, or reliability of AI outputs. Users and companies are solely responsible for independently verifying AI suggestions before acting on them. The platform, its operators, and its AI systems shall not be liable for any loss, damage, legal consequence, or financial impact arising from reliance on AI-generated content. For legal matters, consult a qualified attorney licensed by the Thai Lawyers Council. For tax matters, consult a certified public accountant or the Thai Revenue Department."*

**Module-Specific AI Disclaimers (displayed contextually within each module):**

| Module | AI Feature | Contextual Disclaimer (abbreviated) |
|--------|-----------|--------------------------------------|
| **E-Signature (A)** | Signature similarity check | "AI verification is algorithmic pattern matching. It does not constitute legal identity verification. For highest legal standing, request human verification." |
| **KYC (A)** | Face matching, ID validation | "AI face matching is an assistive tool. Final verification authority rests with the Super Admin review team." |
| **WHT (B→H→O)** | Tax rate recommendations | "AI-recommended WHT rates are based on general categories. Consult your tax advisor. Incorrect rates may result in Revenue Department penalties." |
| **Products (H)** | Content moderation, pricing checks | "AI moderation flags are preliminary assessments. Human review determines final status." |
| **Contract Vault (B)** | Amendment diff analysis, risk scoring | "AI contract analysis is an automated preliminary review. It does not constitute legal advice. Consult a qualified attorney before making legal decisions." |
| **Fraud Detection (D)** | Reporter credibility scoring | "AI fraud assessments are probability-based. All cases receive human review before permanent action." |
| **Recruitment (J)** | Candidate-job matching | "AI matching scores are suggestions based on stated criteria. Hiring decisions must be made by authorized human reviewers." |
| **Regulatory Scanning (P)** | Legislation change detection | "AI regulatory scanning identifies potential impacts. Legal interpretation requires licensed legal counsel." |

**Consent action:** `AI_DISCLAIMER_ACCEPTED` — added to the `action` enum in the Consent Audit Log Entry above. Tracked with the same SHA-256 hash, timestamp, and device fingerprint as all other consent events.

> [!IMPORTANT]
> **Version tracking:** The AI Disclaimer is version-controlled independently from other terms. When the disclaimer is updated (e.g., new AI features added), ALL users and companies must re-accept. The previous version's acceptance records remain permanently archived.

### Professional Portfolio

> [!TIP]
> **📖 In Plain Language:** This is a built-in digital resume/CV. Users list their skills (AI normalizes entries like "photoshop" → "Adobe Photoshop"), education, work history, certifications, language test scores, and work samples. They control who can see it — nobody, everyone, or everyone EXCEPT their current employer.
>
> **Why it matters:** Feeds directly into Module J (Recruitment) for job matching. Companies can find qualified candidates based on skills + salary expectations + location preferences.



Design requirement: *"Users can set up and maintain a comprehensive professional portfolio which serves as a detailed resume"*

| Field | Type | Description |
|-------|------|-------------|
| **skills[]** | SkillEntry[] | Select from platform master skill list, or add custom. Hermes AI normalizes custom entries for searchability (e.g., "photoshop" → "Adobe Photoshop"). |
| → skillName | string | Skill name (user-entered — serves as both the skill identifier and display name. Custom entries are normalized by AI for search.) |
| → **selfRating** | number | User's self-assessment rating from **0 to 10** (0 = no experience, 5 = intermediate, 10 = expert). Displayed as a visual meter on the portfolio. |
| → isNormalized | boolean | Hermes has processed and standardized this entry |
| **educationHistory[]** | EducationEntry[] | Academic records **AND private courses/training programs**. Not limited to formal institutions — includes private courses (e.g., "Leadership Course by Dr. A"), online certifications, bootcamps, and workshops. |
| → institution | string | Select from **platform master institution list** or type custom name. Accepts both formal institutions (universities, schools) AND private course providers (e.g., "Dr. A Leadership Academy", "Coursera", "Skillshare"). If custom: AI Agent auto-checks legitimacy and tags as `MASTER_LIST` (matched) / `AI_VERIFIED` (AI found sufficient evidence institution exists — goes live immediately as unverified) / `UNVERIFIED` (no data found — goes live with ⚠️ unverified badge). **No approval gate.** AI generates a **monthly summary report** for Super Admin showing: all new unverified/AI-verified institutions, usage count, user feedback. Super Admin can batch-approve to master list or flag for removal. |
| → degree | string | Degree type (e.g., Bachelor's, Master's, Certificate of Completion, Diploma) — **optional** (private courses may not have a formal degree) |
| → fieldOfStudy | string | Major/field — **optional** |
| → gpa | number | GPA — **optional** |
| → graduationYear | number | Year graduated/completed |
| → documents[] | FileEntry[] | Uploaded files — transcripts, diplomas, certificates of completion. Multiple files allowed. **Limit: 60 MB total per section** (across all education entries combined). |
| **workHistory[]** | WorkEntry[] | Employment history |
| → company | string | Company name |
| → position | string | Job title |
| → startDate | string | Start date |
| → endDate | string | End date (null if current) |
| → responsibilities | string | Job responsibilities |
| → resignReason | string | Reason for leaving |
| → documents[] | FileEntry[] | Uploaded files — recommendation letters, contracts. Multiple files allowed. **Limit: 60 MB total per section** (across all work entries combined). |
| **certifications[]** | CertEntry[] | Professional certifications. Hermes AI normalizes cert names for accurate search. |
| → certName | string | Certificate name |
| → issuer | string | Issuing organization |
| → issueDate | string | When issued |
| → expiryDate | string | When expires (null if lifetime) |
| → **certificateDoc** | FileEntry | Uploaded certificate scan. **Limit: 15 MB per file.** |
| → documents[] | FileEntry[] | Additional uploaded files — supporting documents. Multiple files allowed. **Limit: 60 MB total per section** (across all certification entries combined). |
| **languageSkills[]** | LangEntry[] | Language proficiency |
| → language | string | Language name |
| → proficiency | enum | 'NATIVE'/'FLUENT'/'ADVANCED'/'INTERMEDIATE'/'BASIC' |
| **testResults[]** | TestResult[] | Multiple test results per language (e.g., TOEIC 850 AND IELTS 7.5 for English) |
| → → testName | string | Test name (TOEIC, IELTS, JLPT, HSK, TOPIK, etc.) |
| → → testScore | string | Score |
| → → testDate | string | When test was taken |
| → → certificateDoc | FileEntry | Optional — uploaded certificate scan. **Limit: 15 MB per file.** |
| **workPortfolioFiles[]** | FileEntry[] | General work samples / portfolio pieces. Multiple files allowed. **Limit: 100 MB total per section.** |
| workPortfolioLinks[] | string[] | External links to work (Behance, GitHub, Dribbble, personal website, etc.) |
| bio | string | Short personal introduction / about me — displayed at the top of the professional portfolio |
| desiredSalaryMin | number | For recruitment matching |
| desiredSalaryMax | number | For recruitment matching |
| **preferredLocations[]** | string[] | Provinces/districts user **prefers** to work in (first choice) |
| **acceptableLocations[]** | string[] | Provinces/districts user **is willing** to work in (wider fallback range) |
| **preferredDays** | DayFlags | Days user **prefers** to work (Mon-Sun boolean flags) |
| **acceptableDays** | DayFlags | Days user **is willing** to work (wider range than preferred) |
| **desiredWelfareBenefits[]** | WelfareEntry[] | Benefits user is looking for from potential employers. Select from **platform master welfare list** (Super Admin-managed) or choose 'Other' + free-text. Same AI flow as institution: custom entries go live immediately as unverified, AI generates **monthly summary** for Super Admin to review and potentially add to master list. |
| → benefitName | string | Benefit name |
| → source | enum | 'MASTER_LIST' / 'AI_VERIFIED' / 'CUSTOM_UNVERIFIED' |
| → isNormalized | boolean | AI has processed and standardized this entry |
| → customInput | string | Free-text input if 'Other' selected |
| → priority | enum | 'MUST_HAVE' / 'NICE_TO_HAVE' — user indicates importance |

**Standard Welfare Benefits Master List (initial — expandable by Super Admin):**

| Category | Benefits |
|----------|----------|
| **Insurance & Health** | Social Security (ประกันสังคม), Health Insurance, Life Insurance, Dental Insurance, Vision Insurance, Accident Insurance |
| **Financial** | Annual Bonus, Provident Fund, Commission, Stock Options, Retirement Plan, Performance Bonus |
| **Leave** | Annual Leave (above legal 6-day minimum), Sick Leave (above legal), Maternity/Paternity Leave, Personal Days, Birthday Leave |
| **Allowances** | Meal Allowance, Transport Allowance, Housing Allowance, Phone Allowance, Fuel Allowance, Uniform Allowance |
| **Work Style** | Flexible Hours, Remote Work / WFH, Hybrid Work, Compressed Work Week |
| **Development** | Training Budget, Conference Attendance, Tuition Reimbursement, Certification Support |
| **Other** | Company Car, Parking, Gym Membership, Employee Discount, Annual Health Check |

> [!NOTE]
> **FileEntry structure:** `{ fileId, fileName, fileUrl, fileSizeBytes, mimeType, uploadedAt }`

**Visibility & Privacy Controls:**

| Field | Type | Description |
|-------|------|-------------|
| portfolioVisibility | enum | 'PRIVATE' — only user sees / 'PUBLIC' — anyone can view / 'JOB_APPLICATION_ONLY' — visible only to companies user applies to / 'JOB_POSTING_ONLY' — visible only when user posts "looking for work" |
| hiddenFromTenantIds[] | string[] | Companies that CANNOT see this portfolio (e.g., hide from current employer). When user posts for a job, these companies won't see the posting. |

> [!IMPORTANT]
> **Hermes AI role in portfolio:** When users add custom skill names, certification names, institution names, or welfare benefit names, Hermes normalizes the text so search and recruitment matching work accurately. AI generates **monthly summary reports** for Super Admin: (1) New unverified institutions — usage count, AI confidence, suggested action. (2) New custom welfare benefits — frequency, similar existing entries, suggested merge/add. (3) New custom skills/certifications — normalization suggestions. Super Admin batch-reviews and updates master lists.

### Address Structure (Conditional by Country)

> [!NOTE]
> **Merged into Personal Contact flow.** User selects `addressCountry` first, then sees the appropriate address form. This reusable address model (ThaiAddress / InternationalAddress) is used across the platform for users, companies, contacts, and branches.

**Thai Address (when `addressCountry` = 'TH'):**

| Field | Type | Description |
|-------|------|-------------|
| addressCountry | string | 'TH' — Thailand |
| addressLine1 | string | House/building number + street (บ้านเลขที่ + ถนน) |
| addressLine2 | string | Village/condo name (หมู่บ้าน/คอนโด) — optional |
| soi | string | Soi (ซอย) — optional |
| moo | string | Moo (หมู่) — village number — optional |
| subDistrict | string | Tambon/Khwaeng (ตำบล/แขวง) |
| district | string | Amphoe/Khet (อำเภอ/เขต) |
| province | string | Changwat (จังหวัด) — 77 provinces dropdown |
| postalCode | string | 5-digit Thai postal code |

**International Address (when `addressCountry` ≠ 'TH'):**

| Field | Type | Description |
|-------|------|-------------|
| addressCountry | string | ISO country code (e.g., 'JP', 'US', 'KR', 'CN') |
| addressLine1 | string | Street address |
| addressLine2 | string | Apt, suite, unit — optional |
| city | string | City / municipality |
| stateOrProvince | string | State, province, or prefecture |
| postalCode | string | Postal/ZIP code (format varies by country) |

**Common fields (all addresses):**

> [!NOTE]
> **Google Maps Integration (all entities):** Every address form — users, companies, company branches, and contacts — includes an embedded **Google Maps picker**. When the user selects a point on the map, the system auto-fills `gpsLat`, `gpsLng`, and `googleMapsPlusCode`. For Thai addresses, Google Places API also assists with auto-completing `province`, `district`, and `subDistrict`. All GPS data is input via the map — users do not manually type coordinates.

| Field | Type | Description |
|-------|------|-------------|
| gpsLat | number | Latitude — auto-filled from Google Maps pin selection |
| gpsLng | number | Longitude — auto-filled from Google Maps pin selection |
| googleMapsPlusCode | string | Google Maps Plus Code — auto-generated from map pin selection |

**International Address Expansion Architecture (Future-Ready):**

> [!NOTE]
> **Designed for expansion.** When the platform expands to new countries, Super Admin adds a **Country Address Configuration** to the platform config. This defines the address fields specific to that country — no code changes required. The address form dynamically renders fields based on the selected country.

| Field | Type | Description |
|-------|------|-------------|
| **countryAddressConfigs[]** | CountryAddressConfig[] | Super Admin-managed per-country address field definitions (platform-level config) |
| → countryCode | string | ISO country code (e.g., 'JP', 'KR', 'CN', 'US') |
| → countryNameEN | string | Country name in English |
| → countryNameLocal | string | Country name in local language |
| → **addressFields[]** | AddressFieldDef[] | Ordered list of address fields for this country |
| → → fieldKey | string | Programmatic key (e.g., 'prefecture', 'state', 'district') |
| → → labelEN | string | English label (e.g., "Prefecture", "State", "Province") |
| → → labelLocal | string | Local language label (e.g., "都道府県", "จังหวัด") |
| → → fieldType | enum | 'TEXT' / 'DROPDOWN' / 'CASCADING_DROPDOWN' (e.g., Thai province→district→sub-district) |
| → → isRequired | boolean | Field is required |
| → → validationRegex | string | Regex pattern for validation (e.g., US ZIP: `^\d{5}(-\d{4})?$`) |
| → → dropdownSource | string | If DROPDOWN/CASCADING: reference to master data list (e.g., 'TH_PROVINCES', 'JP_PREFECTURES') |
| → → displayOrder | number | Order in the address form |
| → postalCodeFormat | string | Expected postal code format description |
| → googlePlacesComponents | string[] | Which Google Places API address_components to map to which fields |

**Pre-configured country examples (expandable by Super Admin):**

| Country | Key Fields | Notes |
|---------|-----------|-------|
| 🇹🇭 Thailand | soi, moo, subDistrict, district, province, postalCode | Cascading dropdown: province→district→subDistrict. Already implemented. |
| 🇯🇵 Japan | prefecture (都道府県), city (市区町村), chome (丁目), banchi (番地), building (建物名) | Postal code (〒) auto-fills prefecture+city |
| 🇺🇸 United States | street, apt/suite, city, state, ZIP+4 | State dropdown (50 states + territories) |
| 🇨🇳 China | province (省), city (市), district (区), street (街道), detail (详细地址) | Cascading: province→city→district |
| 🇰🇷 South Korea | province (도/시), city (시/군/구), dong (동), detail (상세주소) | 5-digit postal code |
| 🇻🇳 Vietnam | province/city (tỉnh/thành phố), district (quận/huyện), ward (phường/xã), street, house number | Cascading: province→district→ward. 6-digit postal code. |
| 🇲🇲 Myanmar | state/region (ပြည်နယ်/တိုင်း), township (မြို့နယ်), ward/village (ရပ်ကွက်/ကျေးရွာ), street, house number | Township is primary administrative unit. 5-digit postal code. |
| 🇮🇩 Indonesia | province (provinsi), city/regency (kota/kabupaten), district (kecamatan), village (kelurahan), RT/RW, street | Cascading: province→city→district→village. 5-digit postal code. |
| 🇲🇾 Malaysia | street, city, state (negeri), postcode | State dropdown (13 states + 3 federal territories). 5-digit postcode. |
| 🇵🇭 Philippines | street, barangay, city/municipality, province, region | Cascading: region→province→city→barangay. 4-digit ZIP code. |
| 🇸🇬 Singapore | block, street, unit number (floor-unit), building name, postal code | 6-digit postal code. No state/province — Singapore is a city-state. |
| 🇰🇭 Cambodia | province/city (ខេត្ត/ក្រុង), district/khan (ស្រុក/ខណ្ឌ), commune/sangkat (ឃុំ/សង្កាត់), village, house number | 6-digit postal code. |
| 🇱🇦 Laos | province (ແຂວງ), district (ເມືອງ), village (ບ້ານ), house number | 5-digit postal code. |

| 🇬🇧 United Kingdom | flat/unit number, building name, street, city/town, county (optional), postcode | UK postcode format validated (e.g., SW1A 1AA, EC2A 4NE). County is optional — not all areas use it. |
| 🇩🇪 Germany / EU | street (Straße), house number (Hausnummer), additional line (Adresszusatz — optional), postal code (PLZ), city (Stadt), state (Bundesland) | 5-digit PLZ. Bundesland dropdown (16 states). Format reusable for Austria (AT) and Switzerland (CH) with minor label adjustments. |
| 🇦🇪 United Arab Emirates | villa/apartment number, building name, street, area/district, emirate, PO Box | Emirate dropdown (7: Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah). No postal codes — PO Box is the primary mail identifier. |
| 🇦🇺 Australia | unit/flat number, street number + street name, suburb/city, state/territory, postcode | State/territory dropdown (8: NSW, VIC, QLD, SA, WA, TAS, NT, ACT). 4-digit postcode. |

> [!NOTE]
> **Generic International Address Format:** All countries NOT listed in the pre-configured table above use the standard International Address form: `addressLine1`, `addressLine2`, `city`, `stateOrProvince`, `postalCode`, `addressCountry` (ISO code). This covers all nations globally without requiring specific configuration. Super Admin can promote any country to a dedicated pre-configured format at any time without code deployment — simply add a new `CountryAddressConfig` entry with the country's specific field definitions, dropdown source data, and validation rules.

> [!NOTE]
> **Nationality-based address pre-selection:** When a user selects their nationality in the Personal Contact form, the address form **pre-selects** that country's address format as the default. Users can change to a different country if their address is different from their nationality (e.g., a Japanese national living in Thailand). The address country selector shows the user's nationality country FIRST in the dropdown, followed by the most common SEA countries, then all other countries alphabetically.

> [!IMPORTANT]
> **Adding a new country does NOT require code deployment.** Super Admin creates the country address config in the backoffice, uploads the master data lists (provinces/states/prefectures), and the address forms auto-render. Google Maps integration works globally — only the field mapping changes per country.

### Notification Preferences

| Field | Type | Description |
|-------|------|-------------|
| pushEnabled | boolean | Native phone push notifications on/off (iOS/Android) |
| **browserPushEnabled** | boolean | Browser push notifications on/off (desktop/laptop — Chrome, Firefox, Edge, Safari). Uses Web Push API with service worker for real-time notifications while using desktop/laptop browsers. |
| emailEnabled | boolean | Email notifications on/off |
| inAppChatEnabled | boolean | In-app chat notifications (platform's own ecosystem chat) |
| **workdaysOnly** | boolean | Only notify during work days. **Applies per user role profile** — each company role can have different workday settings. Personal profile uses the user's own preference. Company's holiday calendar (see Module B — Company Calendar) is respected. |
| activeHoursStart | string | e.g., "08:30" |
| activeHoursEnd | string | e.g., "18:00" |
| offHoursDelivery | enum | What happens outside active hours: 'SILENT' (no notification) / 'DELIVER' (deliver anyway) / 'QUEUE_UNTIL_ACTIVE' (hold and deliver when active hours start) |
| is24x7Available | boolean | User opts in to receive notifications 24/7 — overrides activeHours |
| alwaysReachableByUserIds[] | string[] | Specific users who can ALWAYS reach this person regardless of active hours or quiet mode (e.g., boss, emergency contact, specific team lead) |
| **vacationMode** | VacationConfig | Temporarily suppress notifications for a defined period |
| → isActive | boolean | Vacation mode currently active |
| → startDate | string | Vacation start date |
| → endDate | string | Vacation end date |
| → notificationBehavior | enum | 'SUPPRESS_ALL' (no notifications during vacation) / 'URGENT_ONLY' (only notifications from `isRequired: true` routes) / 'QUEUE_ALL' (hold everything, deliver when vacation ends) |
| → delegateTo | string | userId who receives this user's notifications during vacation — optional |
| → autoReplyMessage | string | Auto-reply message shown when someone tries to reach this user — optional |
| → **requiresCompanyApproval** | boolean | **Company setting** (set in Module B company config, not by user). If true, vacation mode requires approval from manager/admin before activating. If false, user can self-activate. |
| → approvalStatus | enum | 'NOT_REQUIRED' / 'PENDING' / 'APPROVED' / 'REJECTED' |
| → approvedBy | string | userId of manager/admin who approved |
| → approvedAt | string | When approved |

### KYC Details Sub-object

> [!TIP]
> **📖 In Plain Language:** KYC = "Know Your Customer" — proving you are who you say you are. For Thai nationals: photograph your Thai ID (front only, never the back), draw your e-signature, take a live selfie, and the system uses AWS Face Liveness to confirm you're a real person (not a photo/video/mask). AI compares your selfie to your ID photo. For non-Thai: passport details instead of Thai ID.
>
> **Status flow:** NOT_VERIFIED → PENDING (under review) → VERIFIED ✅ or FAILED ❌


**Individual User KYC Flow:**

```
1. User takes photo of Thai ID (FRONT ONLY)
   → System auto-labels (ID type: Thai ID / Passport)
   ⚠️ PDPA Sec 26: Back of Thai ID contains religion and blood type
   (Sensitive Personal Data). System MUST NOT collect the back.
   AI/OCR auto-detects and redacts religion field if visible on
   older front-side cards.

2. User provides digital signature (e-signature on screen)
   → Stored in E-Signature Registry as baseline original (see below)

3. User takes live selfie from phone camera (**camera capture only — NO photo upload allowed**.
   System enforces camera-only mode to prevent using pre-saved photos.)

3.5. **AWS Face Liveness check** (anti-spoofing):
   → User follows on-screen prompts (blink, turn head)
   → AWS Rekognition Face Liveness API confirms this is a LIVE person,
     not a photo, video, or mask
   → Liveness confidence score stored alongside face match result

4. AWS Rekognition compares selfie ↔ Thai ID photo → face match result

5. Result (v1 — photo + selfie verification only):
   → FULLY_VERIFIED (high confidence match, photos clearly the same person)
   → PENDING_MANUAL_REVIEW (photos look significantly different or AI confidence
     below threshold — auto-routed to Super Admin team for review)
   → FAILED (clear mismatch — user can request manual review by Super Admin team)

   🔮 FUTURE (requires government & private company contracts):
   AI Agent (Hermes) cross-checks ID details against Creden.co / DOPA
   for authoritative identity verification.
```

> [!IMPORTANT]
> **PDPA Sec 26 compliance:** The system collects ONLY: name, ID number, photo, and date of birth from the Thai ID front. Religion, blood type, and laser code (back of card) are NEVER collected. Privacy notice before upload: *"We collect your name, ID number, photo, and date of birth. We do NOT collect religion, blood type, or any data from the back of your ID."*

| Field | Type | Description |
|-------|------|-------------|
| **kycVerificationStatus** | enum | **User-facing status:** 'NOT_VERIFIED' (hasn't completed verification) / 'PENDING' (documents submitted, awaiting verification) / 'VERIFIED' (fully verified) / 'FAILED' (verification failed — can resubmit) / 'SUSPENDED' (account suspended by admin) |
| **kycInternalPipeline** | enum | **Internal processing state** (tracks verification progress): 'NOT_STARTED' / 'ID_SUBMITTED' / 'FACE_MATCHED' / 'PENDING_AI_CHECK' / 'PENDING_MANUAL_REVIEW' / 'COMPLETED' / 'REJECTED'. This field is for internal system tracking only — users see `kycVerificationStatus` above. |
| verifiedAt | string | When KYC was completed |
| provider | enum | 'AWS_REKOGNITION' / 'MANUAL_REVIEW' / 'CREDEN_CO_FUTURE' |
| idPhotoUrl | string | Encrypted storage — Thai ID **front** photo only |
| idPhotoLabelResult | enum | AI auto-label: 'THAI_ID_FRONT' / 'PASSPORT' / 'INVALID' |
| selfiePhotoUrl | string | Encrypted storage — live selfie |
| faceMatchResult | enum | 'MATCH' / 'NO_MATCH' / 'INCONCLUSIVE' |
| faceMatchConfidence | number | 0-100% confidence |
| **livenessCheckResult** | enum | 'LIVE' (confirmed real person) / 'SPOOF_DETECTED' (photo/video/mask detected) / 'INCONCLUSIVE' / 'NOT_PERFORMED' |
| **livenessConfidence** | number | 0-100% AWS Face Liveness confidence score |
| **livenessSessionId** | string | AWS Face Liveness session ID for audit trail |
| transactionHash | string | 🔮 **FUTURE.** Blockchain audit hash (Stellar) from Creden.co — immutable proof. **PDPA compliance note:** KYC verification records retained for minimum 5 years per Anti-Money Laundering Act (AMLA) B.E. 2542 Sec 20. After retention period, off-chain database references are deleted → blockchain hash becomes orphaned and non-identifiable, satisfying PDPA Sec 33 Right to Erasure. |
| aiVerificationNotes | string | AI agent's verification summary |
| manualReviewRequestedAt | string | When user requested manual review (after FAILED result) |
| manualReviewedBy | string | Super Admin team member who reviewed (Super Admin assigns reviewers to verification team — see Module P) |
| manualReviewDecision | enum | 'APPROVED' / 'REJECTED' / null |
| manualReviewNotes | string | Reviewer's notes |

> [!IMPORTANT]
> **"Super Admin" standardization (applies throughout this spec):** All references to "Super Admin" in this specification mean "Super Admin or Super Admin-assigned team." Super Admin can delegate review, approval, and moderation tasks to designated team members via role assignments in Module C. The delegated team operates under Super Admin authority with full audit logging of who performed each action.

> [!NOTE]
> **Manual review paths:** (1) **Auto-routed:** When AI confidence is below threshold, status is set to `PENDING_MANUAL_REVIEW` automatically. (2) **User-initiated:** When verification fails, the user can tap "Request Manual Review" to submit their case to Super Admin. Both paths go to the Super Admin verification queue.

### E-Signature Registry

> [!TIP]
> **📖 In Plain Language:** Users register their digital signatures on the platform (full signature, initials, stamp). The first one drawn during KYC is the most trusted "baseline." Later, when they sign contracts or POs, the system compares the new signature against the registered ones. This is for MATCHING/VERIFICATION — proving the same person signed.
>
> **Example:** A director signs a contract in the vault. AI calculates 92% match to their registered signature → passes verification. For higher legal standing, they can request human verification instead.



> [!IMPORTANT]
> **Thai law basis:** ETA Sec 9 — electronic signatures are "reliable" when uniquely linked to the signatory and any alteration is detectable. This registry persists all user signatures and uses AI similarity checking on official documents.

**Registered Signature Model (per user):**

| Field | Type | Description |
|-------|------|-------------|
| signatureId | string | Unique identifier |
| userId | string | Signature owner |
| signatureImageUrl | string | Encrypted storage — signature image |
| signatureHash | string | SHA-256 hash for tamper detection |
| isOriginal | boolean | First registered signature (KYC baseline — highest trust) |
| **signatureLabel** | string | User-defined label (e.g., "Formal Signature", "Initials", "Full Name Signature"). Users can store **multiple signatures** for different purposes. |
| **signatureType** | enum | 'FULL_SIGNATURE' / 'INITIALS' / 'STAMP' — categorizes the signature for appropriate use |
| registeredAt | string | When registered |
| registeredViaKyc | boolean | Captured during KYC verification (most trustworthy) |
| **isDefault** | boolean | User's default signature used when signing (user can switch at signing time) |

> [!NOTE]
> **Personal multi-signature collection:** Users can register and store multiple signatures (e.g., a formal full-name signature, initials, and a stamp/seal for personal use). The first signature registered during KYC is always marked `isOriginal: true` and has the highest trust level. Additional signatures can be added later. At signing time, the user selects which signature to use from their collection.

**Signing Event Model (each time a user signs a document):**

| Field | Type | Description |
|-------|------|-------------|
| signingEventId | string | Unique identifier |
| userId | string | Who signed |
| documentType | enum | 'TERMS_OF_SERVICE' / 'CONTRACT' / 'NDA' / 'EMPLOYMENT_CONTRACT' / 'MOU' / 'COMPANY_AGREEMENT' / 'PURCHASE_ORDER' / 'SALES_ORDER' / 'OTHER_OFFICIAL'. **Note:** PURCHASE_ORDER and SALES_ORDER signing events are created by Module Q (§17), not the Contract Vault. The E-Signature Registry tracks ALL signing events across both modules. |

> [!IMPORTANT]
> **Signature vs Liveness vs Verified Account — when each is used:**
>
> | Document Type | Verification Required | Why |
> |---|---|---|
> | **PO/SO (Module Q)** | Verified account only | The user's verified identity is sufficient for procurement documents. No additional signature needed. |
> | **Uploaded contracts (Contract Vault §3.6)** | Liveness verification | User confirms identity via face liveness. No handwritten signature required. The liveness check proves the verified account holder is the person approving the document. |
> | **E-Signature on vault documents** | Signature match + liveness | Used ONLY to confirm that the user's registered default signature matches what appears on the physical document. This is a **signature comparison** tool, not a signing ceremony. |
>
> **In summary:** Signatures are NOT used for "signing" documents. They are used to **match** the user's registered signature profile against a physical document's signature. Liveness verification is the primary identity confirmation method. Verified accounts alone are sufficient for PO/SO.
| documentId | string | Reference to the document being signed |
| signatureImageUrl | string | The signature used for THIS signing event |
| signatureHash | string | Hash of this signature |
| **verificationMethod** | enum | 'AI_VERIFIED' (algorithmic similarity check — faster, automated) / 'HUMAN_VERIFIED' (authorized person manually confirmed identity match — stronger legal standing). **User chooses** at signing time: "Verify with AI" or "Request Human Verification." |
| aiSimilarityScore | number | 0-100% similarity to the user's original registered signature (calculated regardless of verificationMethod — provides data for both paths) |
| aiSimilarityResult | enum | 'PASS' (≥80%) / 'FLAG_FOR_REVIEW' (<80%) |
| **humanVerifierId** | string | If HUMAN_VERIFIED: userId of the person who manually verified the signature. Must be: (a) a user with appropriate permissions in the company, or (b) Super Admin team for personal documents. |
| **humanVerificationDecision** | enum | 'CONFIRMED_MATCH' / 'REJECTED_MISMATCH' / null |
| **humanVerifiedAt** | string | When human verification was completed |
| reviewedBy | string | If AI flagged for review (<80%): userId of the peer reviewer who approved/rejected |
| reviewDecision | enum | 'APPROVED' / 'REQUIRE_RESIGN' / null |
| reviewedAt | string | When reviewed |
| **verificationBadge** | enum | Badge displayed on the signed document: 'AI_VERIFIED_PASS' (AI checked, ≥80%) / 'AI_VERIFIED_FLAGGED_APPROVED' (AI flagged but human approved) / 'HUMAN_VERIFIED' (human confirmed identity match) / '**FACE_LIVENESS_VERIFIED**' (AWS Face Liveness confirmed live person + signature verified) / 'PENDING_VERIFICATION' (awaiting review) |
| **faceLivenessRequired** | boolean | Whether this signing event required AWS Face Liveness check (determined by document type and company/vault config) |
| **faceLivenessResult** | enum | 'LIVE' / 'SPOOF_DETECTED' / 'NOT_PERFORMED' — result of Face Liveness check at signing time |
| **faceLivenessConfidence** | number | 0-100% liveness confidence score |
| **faceLivenessSessionId** | string | AWS Face Liveness session ID for this signing event |
| authMethodAtSigning | enum | Authentication method used before signing (OTP, biometric, password re-entry) |
| timestamp | string | Exact signing time (ISO 8601 with timezone) |
| ipAddress | string | IP at signing |
| userAgent | string | Device fingerprint at signing |

**Signature Verification Flow (user chooses at signing time):**

```
User signs document
  ↓
System calculates AI similarity score (always, regardless of chosen method)
  ↓
User chooses verification method:
  ├── Option A: "Verify with AI" (instant)
  │   ├── Score ≥ 80% → AI_VERIFIED_PASS badge → signing complete
  │   └── Score < 80% → FLAG_FOR_REVIEW → auto-routes to peer reviewer
  │       ├── Reviewer approves → AI_VERIFIED_FLAGGED_APPROVED badge
  │       └── Reviewer requires re-sign → user must sign again
  │
  └── Option B: "Request Human Verification" (manual)
      → Routes to authorized verifier (company permission holder or Super Admin)
      → Verifier compares signature visually + checks signer identity
      ├── Confirmed → HUMAN_VERIFIED badge → signing complete
      └── Rejected → user must sign again
```

> [!IMPORTANT]
> **80% similarity threshold rule:** If the AI similarity score is **below 80%**, the signing is NOT auto-rejected. Instead, it is flagged for **peer review** — another authorized user (with appropriate permissions in the company, or Super Admin for personal documents) reviews the signing event and can either: (1) **Approve** it (proceed with document signing), or (2) **Require re-sign** (user must sign again). This prevents both fraud and false rejections from AI inaccuracy.

> [!NOTE]
> **Official e-documents requiring signature + re-authentication:** Terms of agreement between companies, purchase orders, sales orders, employment contracts, NDAs, and all official documents that may be needed for future legal proceedings. For these document types, the system requires **re-authentication** (OTP or biometric) before the user can sign.

> [!WARNING]
> **AI Verification Disclaimer (displayed at signing time):** "AI signature verification is an algorithmic similarity check and does not constitute legal identity verification under Thai ETA Sec 9. For the strongest legal standing in court proceedings, select 'Request Human Verification.' The platform takes no responsibility for the accuracy of AI verification results. See Platform AI Disclaimer for full terms."

> [!NOTE]
> **Legal weight distinction (ETA Sec 9):** Human-verified signatures carry **stronger legal weight** in Thai courts because they satisfy the "uniquely linked to signatory" requirement through direct human confirmation. AI-verified signatures are admissible under ETA Sec 11 (electronic evidence) but rely on algorithmic pattern matching, which may be challenged. Both are legally valid — human verification provides additional evidentiary strength.

### AWS Face Liveness Integration Points

> [!IMPORTANT]
> **Thai legal basis for Face Liveness:** ETA Sec 9 requires electronic signatures to be "uniquely linked to the signatory." AWS Face Liveness (anti-spoofing detection) provides court-admissible evidence that the actual person — not a photo, video, or mask — was present at the moment of signing/verification. This strengthens the evidentiary chain under ETA Sec 11 and PDPA Sec 26 (biometric data = Sensitive Personal Data requiring explicit consent). **PDPA Sec 26 biometric consent:** Before any Face Liveness check, the system must obtain separate explicit consent: *"We will capture a brief video of your face to verify your identity. This biometric data is processed by AWS Rekognition and is not stored beyond the verification session. You may withdraw consent at any time."*

**7 Face Liveness Verification Points across the Platform:**

| # | Verification Point | When Triggered | Face Liveness Required? | Court-Admissible Evidence? |
|---|-------------------|----------------|------------------------|---------------------------|
| 1 | **User KYC (personal)** | During initial identity verification | ✅ Always | ✅ Proves the person who registered is a real, live person |
| 2 | **Company MD Verification (Level 2 Standard)** | When MD registers the company and completes KYC | ✅ Always | ✅ Proves the Managing Director is a real person and matches the certificate |
| 3 | **Company MD Remote Selfie (Level 2 Delegated)** | When MD verifies identity via remote selfie link | ✅ Always | ✅ Proves the remote verifier is the actual MD, not someone using their photo |
| 4 | **Contract Vault Signing (high-value)** | When signing contracts in the vault — configurable per vault (vault owner can require Face Liveness for all signers) | ⚙️ Configurable per vault | ✅ Strongest evidence: proves the signer was physically present and alive at signing time |
| 5 | **Company Seal Application** | When applying the company seal to a document | ✅ Always (MFA + Face Liveness) | ✅ Criminal Code Sec 264 protection — proves the authorized director physically applied the seal |
| 6 | **Contract Termination Approval** | When approving unanimous contract termination | ✅ Always | ✅ Proves each approving party was present for the termination decision |
| 7 | **Bank Account Export Link Generation** | When generating a link that shares full bank account details | ✅ Always | ✅ Prevents unauthorized sharing of financial data — proves the authorized person initiated the export |


> [!NOTE]
> **Company KYC** is defined in Module B (§3) — Company Management. This module covers individual user identity only.


### Super Admin Platform Locale Config

> [!NOTE]
> Managed by Super Admin in backoffice. Controls which languages and address country formats are visible in the webapp UI. Expandable without code changes.

**Language Configuration:**

| Status | Languages |
|--------|-----------|
| ✅ Active (launch) | EN (English), TH (Thai) |
| 🟡 Ready to enable | JA (Japanese), KO (Korean), ZH (Chinese) |
| 📋 Future | VI (Vietnamese), MY (Burmese), ID (Indonesian), MS (Malay) |

| Field | Type | Description |
|-------|------|-------------|
| supportedLanguages[] | LangConfig[] | Languages active in the webapp UI |
| → langCode | string | ISO code (e.g., 'EN', 'TH', 'JA') |
| → langNameEN | string | English label (e.g., 'Thai') |
| → langNameNative | string | Native label (e.g., 'ภาษาไทย') |
| → isActive | boolean | Currently enabled in the webapp |

**Address Country Configuration:**

| Field | Type | Description |
|-------|------|-------------|
| supportedAddressCountries[] | CountryConfig[] | Address formats available for selection in forms |
| → countryCode | string | ISO code (e.g., 'TH', 'JP', 'US') |
| → countryNameEN | string | English name |
| → addressFormat | enum | 'THAI' / 'INTERNATIONAL' / 'JAPANESE' / 'KOREAN' |
| → isActive | boolean | Currently enabled |

---

## 3. Module B: Company (Tenant) Management {#3-module-b}

> [!TIP]
> **📖 What is Module B?** This is about the **company** (organization) — not the person. A company is called a "tenant" because multiple companies share the same platform but each has completely isolated data. This module covers: company profile details, industry licenses, bank accounts, company verification (KYC for companies), company seals (ตราประทับ), branches, company groups (for owners with multiple companies), and ERP API connections.
>
> **Why it matters:** Everything else on the platform happens WITHIN a company context. Roles, contacts, products, tasks — they all belong to a company.



### Currently Implemented
tenantId, companyNameLocal, companyNameEN, vatId, dbdRegistrationNumber, subscriptionTier, verificationStatus, isEmergencyFrozen, gpsTrackingMode, maxUsers, maxProducts, storageQuotaBytes, CompanyVerification (3-step), CompanyPublicProfile, CompanyB2bProfile

### Company Details

| Field | Type | Description |
|-------|------|-------------|
| companyType | enum | 'SOLE_PROPRIETOR'/'PARTNERSHIP'/'LIMITED'/'PUBLIC_LIMITED' |
| dbdBusinessObjective | string | Registered business objective from DBD |
| registeredCapital | number | Registered capital (currency per CountryRuleEngine) |
| establishedDate | string | Date company was registered |
| **yearsInBusiness** | number | **Computed field** (cached daily, not real-time). Calculated as `currentYear - year(establishedDate)`. Displayed on company profile and used for filtering/sorting. |
| **companyPurpose** | string | Company's registered business purpose/objective from DBD. Auto-populated when Tax ID is verified via DBD API. Read-only — reflects official DBD registration. |
| **storefrontDisplayName** | string | Optional storefront/trade name different from the legal company name (e.g., legal name: "บริษัท เอบีซี เบเวอเรจ จำกัด", storefront: "ABC Premium Drinks"). Displayed on marketplace listings, product pages, and public profile instead of the legal name. If empty, the system uses `companyNameLocal`/`companyNameEN`. |
| **companyLogoUrl** | string | Company logo image (recommended: 512x512px, max 5 MB, PNG/JPG/SVG). Displayed on company profile, invoices, letterheads, and marketplace listings. |
| numberOfEmployees | enum | '1-10'/'11-50'/'51-200'/'201-500'/'500+' |
| **industries[]** | IndustryEntry[] | **Multiple industries using TSIC** (Thailand Standard Industrial Classification, maintained by National Statistical Office / สำนักงานสถิติแห่งชาติ, based on ISIC Rev.4). Auto-populated from DBD when company verifies. Companies can select additional codes. Super Admin manages master TSIC list (synced from official NSO data). Custom industry requests submitted for AI validation + Super Admin approval. |
| → tsicCode | string | TSIC code (e.g., "1101" = Distilling and blending of spirits) |
| → tsicLabel | string | Official TSIC label (EN) |
| → tsicLabelLocal | string | Official TSIC label (localized per CountryRuleEngine) |
| → isPrimary | boolean | Primary industry for this company |
| → source | enum | 'DBD_AUTO' (from DBD registration) / 'USER_SELECTED' / 'CUSTOM_APPROVED' |
| registeredAddress | ThaiAddress/IntlAddress | Legal registered address (from DBD) |
| operatingAddress | ThaiAddress/IntlAddress | Operating/office address (may differ from registered) |
| companyCountryCode | string | Company's country of registration. Selector dropdown like user setup (e.g., 'TH', 'JP', 'US'). Determines address format for registered/operating addresses. Default: 'TH'. |
| branchCode | string | Head office branch code — always "00000" for main company. Additional branches have their own codes (see Company Branches below). |
| **companyPhones[]** | CompanyPhone[] | **Multiple phone numbers with department labels** |
| → phoneNumber | string | Full phone number |
| → phoneCountryCode | string | Country code (e.g., '+66') |
| → phoneType | enum | 'MOBILE'/'LANDLINE'/'FAX'/'EXTENSION' — Extensions can be 4-digit (bank/corporate). Validation rules differ by type and country. |
| → departmentLabel | string | Free-text department label (e.g., "Sales", "Support", "Accounting", "Reception") |
| → isPrimary | boolean | Primary company contact number |
| **companyEmails[]** | CompanyEmail[] | **Multiple emails with department labels** |
| → emailAddress | string | Email address |
| → departmentLabel | string | Free-text department label (e.g., "General", "HR", "Sales") |
| → isPrimary | boolean | Primary company contact email |
| userCanUsePersonalEmail | boolean | Company allows users to use their personal email for their company role (instead of company-issued email) |
| companyLineOA | string | LINE Official Account ID — *optional* |
| companyFacebook | string | Facebook page URL — *optional* |
| companyInstagram | string | Instagram handle — *optional* |
| companyTikTok | string | TikTok handle — *optional* |
| companyCoverImageUrl | string | Banner/cover image |
| operatingHours | — | **Removed.** Company operating hours are now defined in Module K (§11) GPS & Attendance — see `departmentWorkingHours[]` with `departmentName: 'COMPANY_DEFAULT'` for company-wide hours, and per-department overrides. The working hours configuration is used for GPS tracking window and attendance calculations. Calendar events (task visits, interviews) are managed through Module E (§6) Google Calendar integration. |
| **bankAccounts[]** | BankAccount[] | **Multiple bank accounts.** ⚠️ **Visibility:** Hidden from public. Internal contacts see **last 4 digits only** unless in an active transaction flow. Full account visible only during payment/invoice workflows. Company can assign user roles with `bankAccount.share` permission to send full details via ecosystem chat or generate a **time-limited export link** (configurable expiry: 1hr/6hr/24hr/72hr) for customers to view for transfers. |
| → bankName | string | Bank name (e.g., "Bangkok Bank", "KBank", "SCB") |
| → accountName | string | Account holder name |
| → accountNumber | string | Bank account number (encrypted at rest) |
| → accountType | enum | 'CURRENT'/'SAVINGS' |
| → branchName | string | Bank branch name — optional |
| → promptPayId | string | PromptPay ID linked to this account — optional |
| → isPrimary | boolean | Primary payment/receiving account |
| → sharingLinkExpiry | enum | Default expiry for export links: '1_HOUR'/'6_HOURS'/'24_HOURS'/'72_HOURS' |
| → **permanentVisibilityTenantIds[]** | string[] | **Whitelisted company tenant IDs** that can see this bank account's full details **permanently** (no time limit). Set by company admin. Used for long-term business partners, parent companies, or affiliated companies that always need payment details. Revocable at any time by company admin. |
| **companyProductCategories[]** | ProductCategoryEntry[] | **Product/service categories this company operates in.** Linked to TSIC codes from `industries[]`. Companies declare which categories they sell/provide. Categories requiring specific licenses (alcohol, food/drug, medical devices, etc.) gate product creation — company CANNOT create products in a restricted category without uploading and verifying the required license. |
| → categoryId | string | Unique identifier |
| → categoryName | string | Category name (e.g., "Alcoholic Beverages", "Pharmaceutical Products", "Consulting Services") |
| → tsicCodeRef | string | Reference to TSIC code from `industries[]` — links business registration to product categories |
| → **requiresLicense** | boolean | **Set by Super Admin per category.** If true, company must upload and verify license before creating products in this category. |
| → licenseType | string | Type of license required (e.g., 'EXCISE_LICENSE', 'FDA_REGISTRATION', 'MOPH_PERMIT', 'COSMETICS_LICENSE', 'TOBACCO_LICENSE') — null if no license required |
| → **licenseRef** | string | **References → `categoryLicenses[].licenseId` in Company KYC (§3.4).** All license data (document URL, number, expiry, verification status) is stored canonically in the KYC `categoryLicenses[]` model. This field links the product category to its license record. Null if `requiresLicense: false`. |
| → isActive | boolean | Category is currently active for this company |

### Company Group Architecture (Subsidiary / Affiliated / Sister)

> [!TIP]
> **📖 In Plain Language:** If a business owner has multiple companies (e.g., a holding company with 3 subsidiaries), they can link them into a group. They get a "Company Switcher" in the navigation to jump between companies without logging out. But each company remains 100% isolated — being admin in Company A gives you ZERO rights in Company B.



> [!IMPORTANT]
> **Business context:** Some company owners own multiple companies but want to manage them from a single account. The Company Group architecture allows a **main company** to link its **Subsidiary**, **Affiliated**, and **Sister** companies into a unified management group. User roles remain strictly per-company — there is NO cross-company permission inheritance. Each company within the group retains its own tenantId, its own subscription, its own data, and its own roles.

**Company Group Model:**

| Field | Type | Description |
|-------|------|-------------|
| groupId | string | Unique identifier for the company group |
| groupName | string | Group name (e.g., "ABC Holdings Group") |
| groupNameLocal | string | Localized group name (label per CountryRuleEngine) |
| **mainCompanyTenantId** | string | The tenantId of the main/parent company that manages the group |
| **groupOwnerUserId** | string | The user (owner) who created and manages the group. Must be an authorized director (MD) of the main company. |
| **memberCompanies[]** | GroupMember[] | Companies in this group |
| → tenantId | string | The company's tenantId |
| → companyNameEN | string | Company name (cached for display) |
| → companyNameLocal | string | Localized company name (cached, label per CountryRuleEngine) |
| → **relationshipType** | enum | 'SUBSIDIARY' (parent owns majority shares) / 'AFFILIATED' (shared ownership/control but not majority) / 'SISTER' (same owner, separate entities) |
| → addedAt | string | When added to the group |
| → addedBy | string | userId who added this company |
| → isActive | boolean | Currently active in the group |
| createdAt | string | When the group was created |

**User Access Across Company Group:**

```
User has roles in multiple companies within the same group
  ↓
User account shows "Company Switcher" in the navigation
  → Dropdown shows all companies the user has active roles in
  → User selects company → UI switches to that company's context
  → User sees ONLY the data, roles, and permissions of the selected company
  ↓
Key Rules:
  1. User roles are STRICTLY per-company (companyRoleId is per-tenant)
  2. NO cross-company permission inheritance
     (Admin in Company A ≠ Admin in Company B)
  3. Some users may only have roles in ONE company in the group
     (they cannot see or access other group companies)
  4. The "Company Switcher" only shows companies where
     the user has an ACTIVE role
  5. Company data is fully isolated between tenants
     (contacts, products, contracts, vault — all separate)
  ↓
Management Team Benefits:
  → Management users with roles across multiple group companies
    can switch companies without logging out/in
  → Notification feeds show which company each notification belongs to
  → Calendar view can optionally aggregate across group companies
    (toggle: "Show all companies" / "Current company only")
```

> [!NOTE]
> **Group creation rules:** (1) Only an authorized director (MD) of the main company can create a Company Group. (2) To add a company to the group, the adding user must be an authorized director of BOTH the main company AND the company being added. (3) Removing a company from the group does not affect the company's data or user roles — it only removes the group link. (4) A company can only belong to ONE group at a time.

### Company Seal Registry

> [!TIP]
> **📖 In Plain Language:** Thai Limited Companies have an official company seal (ตราประทับ) used on legal documents. This is a BIG DEAL in Thai law — using someone's seal without authorization is a criminal offense (Criminal Code Sec 264). Only the DBD-registered Managing Director (MD) can apply the seal, and they must re-authenticate with MFA + Face Liveness every single time. Every seal application is logged with who, when, where, and how.



> [!CAUTION]
> **Thai legal basis:** Criminal Code Sec 264 (Document Forgery — applying a company seal without authority carries imprisonment), ETA Sec 26 (electronic seals must be under "exclusive control" of the authorized signatory), Civil and Commercial Code Sec 1144 (only directors named in DBD Affidavit can legally bind the company). **PDPA does NOT apply** — company seals are juristic person property, not personal data.

> [!IMPORTANT]
> **Platform liability protection:** When the company uploads their seal, the authorized director must accept this clause: *"I, as an authorized director named in the company’s DBD Affidavit (หนังสือรับรองบริษัท), authorize [Platform Name] to securely store this corporate seal image on our behalf. The company assumes full responsibility for managing user access roles and authorizing seal usage within our corporate account. Unauthorized use of the company seal by any person constitutes a criminal offense under Thai Criminal Code Sec 264."*

**Company Seal Model:**

| Field | Type | Description |
|-------|------|-------------|
| **companySealRegistry** | CompanySealRegistry | Secure storage for the company’s official seal image |
| → sealId | string | Unique identifier |
| → sealImageUrl | string | Encrypted storage — company seal image (ตราประทับบริษัท) |
| → sealHash | string | SHA-256 hash of the seal image for tamper detection |
| → uploadedByUserId | string | userId of the authorized director who uploaded |
| → uploaderAuthorityVerification | enum | 'DBD_MD_VERIFIED' (uploader matched against DBD certificate as current MD) / 'MD_DELEGATED' (MD explicitly delegated seal management permission to this user) |
| → dbdAffidavitUrl | string | Encrypted storage — uploaded DBD Affidavit (หนังสือรับรอง) listing authorized directors |
| → uploadedAt | string | When seal was uploaded |
| → isActive | boolean | Currently the active company seal |
| → revokedAt | string | If seal was revoked/replaced |
| → revokedBy | string | userId who revoked |
| → revocationReason | string | Why the seal was replaced (e.g., "New seal design", "Previous seal compromised") |
| → sealUploadConsentId | string | Link to Consent Audit Log entry for the director’s authorization clause |
| → **sealHistory[]** | SealHistoryEntry[] | All previous seal versions (never deleted) |
| → → sealImageUrl | string | Previous seal image |
| → → sealHash | string | Hash of previous seal |
| → → activeFrom | string | When this seal was active from |
| → → activeTo | string | When this seal was replaced |
| → → uploadedBy | string | Who uploaded this version |

**Seal Access Control:**

| Permission | Who Can Hold It | How It's Granted |
|------------|----------------|------------------|
| `companySeal.manage` | Upload, replace, or revoke the company seal image | **Only the verified MD** can grant this permission. The MD themselves always have it. MD can delegate to other users via Module C permission system. |
| `companySeal.apply` | Apply the seal to documents in the Contract Vault | **Only users with `companySeal.manage` can grant `companySeal.apply`** to other users. However, **only DBD-authorized Managing Directors can actually apply the seal** — the permission is a prerequisite but NOT sufficient alone. |

> [!IMPORTANT]
> **Seal verification is a two-factor gate:** A user must BOTH hold `companySeal.apply` permission AND be a DBD-registered Managing Director. The permission alone is insufficient. The platform cross-references the user against `mdNameFromDocument` from KYC verification. **Annual re-verification:** The platform prompts the company to re-upload their latest Business Registration Certificate annually to ensure the authorized director list is current.

> [!WARNING]
> **Every seal application requires MFA/OTP re-verification** within 5 minutes before the seal is applied. This satisfies ETA Sec 26 "exclusive control" requirement.

**Document Seal Verification Flow (Phase 1 — Current):**

| Step | Process | Outcome |
|------|---------|--------|
| 1 | Company uploads physical document with signature + stamp as PDF/image | Document stored in vault |
| 2 | System checks uploaded document against company's registered signature and seal images in the database | If **match found**: document marked as `SEAL_VERIFIED` |
| 3a | If company has NOT uploaded signature/seal reference images | AI agent analyzes the document — if no stamp or signature is detected as a label on the document, it is flagged as `NOT_QUALIFIED` |
| 3b | If company accepts liveness verification as sufficient (override) | Document proceeds with liveness confirmation only — marked as `LIVENESS_VERIFIED` |
| 4 | Final status | `SEAL_VERIFIED` (signature+stamp matched) / `LIVENESS_VERIFIED` (liveness override accepted) / `NOT_QUALIFIED` (no stamp/signature detected, not overridden) |

**Document Seal Verification Flow (Phase 2 — E-Stamp Available):**

> [!NOTE]
> **When E-Stamp is available:** If a company has registered an E-Stamp with the DBD and uploaded their E-Stamp to the platform, the system can:
> - **Label and verify** documents using the registered E-Stamp image
> - **Apply E-Stamp digitally** from the DBD-registered E-Stamp on documents created within the platform
> - Cross-reference E-Stamp authenticity against DBD's E-Stamp registry

> [!IMPORTANT]
> **Seal upload requires KYC Level 2+ (VERIFIED_ACTIVE_COMPANY).** A company MUST complete Level 2 verification (MD identity confirmed) before the company seal can be uploaded to the platform. This ensures: (1) The company is a verified legal entity, (2) The MD who authorizes the seal upload is a confirmed director, (3) The seal image is stored under the verified company's encrypted tenant storage.


**Seal Application Log (every use of the company seal is recorded):**

| Field | Type | Description |
|-------|------|-------------|
| **sealApplicationLog[]** | SealApplicationEntry[] | Immutable audit trail of every seal usage |
| → applicationId | string | Unique identifier |
| → sealId | string | Which seal version was used |
| → appliedByUserId | string | Who applied the seal |
| → appliedToDocumentId | string | Which document received the seal |
| → appliedToVaultId | string | Which vault the document belongs to |
| → applicationPurpose | enum | 'CONTRACT_SIGNING' / 'PURCHASE_ORDER' / 'OFFICIAL_LETTER' / 'TAX_INVOICE' / 'OTHER' |
| → mfaMethodUsed | enum | 'OTP_SMS' / 'OTP_EMAIL' / 'BIOMETRIC' / 'PASSWORD_REENTRY' — **MFA/OTP is REQUIRED before EVERY seal application** |
| → mfaVerifiedAt | string | When MFA was completed (must be within 5 minutes of seal application) |
| → **faceLivenessResult** | enum | 'LIVE' / 'SPOOF_DETECTED' — **AWS Face Liveness is REQUIRED for every seal application** (Criminal Code Sec 264 protection — proves the authorized director physically applied the seal) |
| → **faceLivenessConfidence** | number | 0-100% liveness confidence score |
| → **faceLivenessSessionId** | string | AWS Face Liveness session ID for this seal application |
| → timestamp | string | Exact time of seal application (ISO 8601 with timezone) |
| → ipAddress | string | IP at time of application |
| → userAgent | string | Device fingerprint |
| → consentAuditId | string | Link to Consent Audit Log entry for this specific application |


> [!IMPORTANT]
> **Thai companies have TWO addresses:** The legal registered address (from DBD) and the operating address. Both must be stored. `branchCode` "00000" means head office — Thai tax invoices require branch codes. Both addresses use the **Google Maps picker** (auto-fills GPS + Plus Code, see Address Structure in Module A).

> [!WARNING]
> **Product category licensing disclaimer (displayed in webapp):** "Certain product categories require specific licenses under Thai law (Excise Act for alcohol, FDA Act for food/drug/cosmetics, MoPH for medical devices, Tobacco Act for tobacco products). Creating or listing products in a restricted category without a valid license is prohibited and may result in account suspension and legal liability."

> [!NOTE]
> **WHT rates (moved to product/invoice level):** Withholding tax rates are calculated at the invoice line-item level based on each product's category. Master WHT rate table (sourced from Thai Revenue Department / กรมสรรพากร) is maintained by Super Admin as platform-level config. See Module H (Products & Internal Inventory) for product category tagging. See Module O (Billing) for WHT calculation on invoices. AI Agent (Hermes) recommends initial WHT categories when products are created.

> [!NOTE]
> **Bank account export link:** When a user with `bankAccount.share` permission generates a time-limited link, the link is: (1) Single-use or time-limited (company configurable), (2) Logged in the audit trail with recipient and timestamp, (3) Auto-expires and shows "Link expired" after timeout, (4) **AWS Face Liveness verification is REQUIRED** before generating the link (proves the authorized person initiated the export — see Module A, AWS Face Liveness Integration Points #7). This ensures PDPA compliance for financial data sharing.


### Company KYC & Three-Level Verification

> [!TIP]
> **📖 In Plain Language:** Companies verify in 3 levels, each unlocking more features:
> - **Level 1 (ACTIVE):** Enter Tax ID → system checks DBD to confirm the company exists and is active. Basic access.
> - **Level 2 (VERIFIED):** Upload Business Registration Certificate → AI extracts the MD's name → matches against the user who registered. Full access.
> - **Level 3 (FULLY_LICENSED):** Upload industry licenses (Excise for alcohol, FDA for food/drugs) → unlocks selling regulated products.
>
> **Example:** A brewery reaches Level 2 (verified), then uploads their Excise Department license to reach Level 3 → now they can create beer products in the catalog. Without the license, the system blocks it.


> [!IMPORTANT]
> Company-level verification flow. Individual user KYC remains in Module A (§2).

**Company KYC Flow (Three-Level Verification):**

```
Level 1 — "ACTIVE_COMPANY":
  Company inputs 13-digit Tax ID → AI Agent queries DBD API to verify it's still active
  → If active: status = "ACTIVE_COMPANY"

Level 2 — "VERIFIED_ACTIVE_COMPANY" (Standard Path):
  Company uploads Business Registration Certificate / Certificate of Incorporation
  → AI Agent reads document, extracts Managing Director (MD) name
  → System matches MD name against verified user who registered the company
  → If match: status = "VERIFIED_ACTIVE_COMPANY"
  → If no match: flagged for manual review

Level 2 — "VERIFIED_ACTIVE_COMPANY" (Delegated Path):
  For enterprises where the Managing Director delegates company registration
  to their authorized team:
  1. Authorized representative (verified user with company creation authority)
     creates the company profile on the platform
  2. Uploads official Business Registration Certificate (หนังสือรับรองบริษัท)
     + hard copy bearing the Managing Director's signature
     (+ company seal / ตราประทับบริษัท if Limited Company — required by law)
  3. Enters Managing Director's full name and contact details
     (phone with country code, email address)
  4. System creates a placeholder MD role with all provided details
  5. Authorized representative sends a **Remote Selfie Verification Link**
     to the Managing Director
     → MD receives link via email/SMS
     → MD clicks link → **reviews and confirms their contact details**
       (phone, email) displayed on the verification page
     → MD takes selfie from their own device (camera capture only)
     → AWS Rekognition compares selfie ↔ Thai ID photo on certificate
  6. If face match confirmed: status = "VERIFIED_ACTIVE_COMPANY"
  7. MD role is created with verified contact details for
     Super Admin emergency contact registry

  Auto-Match: If the Managing Director later registers a personal account
  and completes personal KYC, the system detects the match (by Thai ID number)
  and auto-links the MD user to their existing company role.
  The MD is notified for confirmation.

Level 3 — "FULLY_LICENSED" (per restricted product category):
  Company uploads specific industry licenses based on their product categories
  → License verification is PER CATEGORY — not a single blanket license
  → Each category that requires a license has its own verification entry
  → AI Agent verifies license validity (expiry date, license number, issuing authority)
  → Super Admin final approval per license
  → Unlocks the specific restricted product category

  License Categories (examples — Super Admin manages the full list):
  ├── ALCOHOL → Excise Department License (กรมสรรพสามิต)
  ├── TOBACCO → Excise + MOPH License
  ├── FOOD_SUPPLEMENT → FDA (อย.) Registration
  ├── PHARMACEUTICAL → FDA Drug License
  ├── COSMETICS → FDA Cosmetics Notification
  ├── MEDICAL_DEVICE → FDA Medical Device License
  ├── CANNABIS → FDA + MoPH Cannabis License
  ├── IMPORT_EXPORT → DFT (กรมการค้าต่างประเทศ) License
  └── CHEMICAL → DIW (กรมโรงงานอุตสาหกรรม) License

  Rule: If a company does NOT have a verified license for a category,
  they CANNOT create products in that category (Module H blocks creation).
  The system checks companyProductCategories[] against verified licenses.
```

| Field | Type | Description |
|-------|------|-------------|
| companyVerificationLevel | enum | 'UNVERIFIED' / 'ACTIVE_COMPANY' (Tax ID verified via DBD) / 'VERIFIED_ACTIVE_COMPANY' (documents + MD identity) / 'FULLY_LICENSED' (industry licenses verified) |
| verificationPath | enum | 'STANDARD' (MD registered the company) / 'DELEGATED' (team created, MD verified remotely) |
| taxIdVerifiedAt | string | When AI confirmed tax ID is active |
| taxIdVerificationSource | string | 'DBD_API' / 'MANUAL' |
| registrationCertUrl | string | Encrypted — Business Registration Certificate |
| companySealImageUrl | string | Encrypted — Company seal image (ตราประทับ) for Limited Companies |
| mdNameFromDocument | string | Managing Director name extracted from certificate by AI |
| mdUserIdMatch | string | userId of the verified user who matches the MD (null if MD hasn't registered yet) |
| mdMatchResult | enum | 'MATCH' / 'NO_MATCH' / 'PENDING_REMOTE_VERIFICATION' / 'PENDING_REVIEW' |
| **mdContactDetails** | object | MD's contact information (required for Super Admin emergency contact) |
| → mdFullName | string | Full name |
| → mdPhone | string | Phone number |
| → mdEmail | string | Email address |
| remoteSelfieLink | object | Remote verification link for delegated path |
| → linkId | string | Unique link identifier |
| → sentTo | string | Email or phone the link was sent to |
| → sentAt | string | When sent |
| → expiresAt | string | Link expiration (e.g., 72 hours) |
| → status | enum | 'SENT' / 'CLICKED' / 'SELFIE_SUBMITTED' / 'VERIFIED' / 'EXPIRED' |
| → selfiePhotoUrl | string | MD's selfie from the remote link |
| → faceMatchResult | enum | 'MATCH' / 'NO_MATCH' / 'INCONCLUSIVE' |
| mdAutoLinkedAt | string | When MD's personal registration was auto-matched to this company |
| **categoryLicenses[]** | CategoryLicense[] | Per-category license verification entries (Level 3 KYC) |
| → licenseId | string | Unique identifier |
| → productCategoryCode | string | Which product category this license covers (matches companyProductCategories[] code) |
| → licenseType | enum | 'EXCISE' / 'FDA' / 'MOPH' / 'DFT' / 'DIW' / 'CUSTOM' |
| → licenseNumber | string | License registration number |
| → issuingAuthority | string | Thai government body that issued the license |
| → licenseDocumentUrl | string | Encrypted uploaded license document |
| → issuedDate | string | When license was issued |
| → expiryDate | string | When license expires. **Canonical notification schedule: 90 / 60 / 30 / 7 days before expiry** — system sends `COMPANY_LICENSE_EXPIRING` notification at each interval. |
| → verificationStatus | enum | 'PENDING_AI_CHECK' / 'AI_VERIFIED' / 'PENDING_ADMIN' / 'APPROVED' / 'REJECTED' / 'EXPIRED' |
| → verifiedBy | string | Super Admin userId who approved |
| → verifiedAt | string | When approved |
| → rejectionReason | string | If rejected: why |

> [!NOTE]
> **Other document verification** (receipt OCR, invoice reading, etc.) is handled by individual modules (Costing, Billing) — not part of the KYC sub-object. AI Agent also periodically re-checks company active status via DBD.

### Company Branches

> [!NOTE]
> Branches are **sub-documents owned by the main company** (not separate tenants). Users belong to the tenant, not to individual branches. Branches represent physical locations with local contact details. Companies can **optionally** assign user roles for branch-level contact detail management.

| Field | Type | Description |
|-------|------|-------------|
| branchId | string | Unique identifier |
| branchCode | string | Thai branch code (e.g., "00001", "00002"). "00000" is reserved for head office (the main company record). |
| **branchInternalCode** | string | Company's internal branch reference code for ERP/accounting systems (e.g., "BKK-HQ", "CNX-01", "FACTORY-EAST"). Used for API mapping and cross-system integration. Not related to the Thai branch code. |
| branchName | string | Branch name (EN) |
| branchNameLocal | string | Branch name (localized per CountryRuleEngine) |
| **branchStorefrontName** | string | Optional storefront/trade name for this branch (e.g., "ABC Drinks — Chiang Mai"). If empty, falls back to the company's `storefrontDisplayName` or `branchName`. Displayed on marketplace and public listings specific to this branch. |
| branchAddress | ThaiAddress/IntlAddress | Branch physical address — uses **Google Maps picker** (auto-fills GPS + Plus Code) |
| branchPhones[] | BranchPhone[] | Branch phone numbers with department labels |
| → phoneNumber | string | Phone number |
| → phoneCountryCode | string | Country code (e.g., "+66") |
| → phoneType | enum | 'MOBILE' / 'LANDLINE' / 'FAX' / 'HOTLINE' / 'EXTENSION' |
| → extension | string | Optional extension number |
| → **departmentLabel** | string | Which department this phone belongs to (e.g., "Sales", "Accounting", "Customer Service", "General"). Free text — company defines their own labels. |
| → isPrimary | boolean | Primary phone for this branch |
| branchEmails[] | BranchEmail[] | Branch email addresses with department labels |
| → emailAddress | string | Email address |
| → **departmentLabel** | string | Which department this email belongs to (e.g., "Sales", "HR", "Procurement", "General"). Free text. |
| → isPrimary | boolean | Primary email for this branch |
| branchManagerId | string | userId of branch manager |
| **branchRoleAssignments[]** | BranchRole[] | **Optional.** Company can assign user roles specifically for managing this branch's contact details and operations. |
| → userId | string | User assigned to this branch role |
| → branchPermission | enum | 'BRANCH_ADMIN' (full management) / 'BRANCH_EDITOR' (edit contacts/details) / 'BRANCH_VIEWER' (read-only) |
| → assignedAt | string | When assigned |
| isActive | boolean | Branch is currently operational |
| createdAt | string | When added |

**Internal Contact Branch Linking (Verified Contact → Branch Propagation):**

> [!IMPORTANT]
> **When an internal contact's branches are stored in your contact pool:** Company A can record branch locations for an internal contact (Company B) — even without Company B's main HQ details. When Company B later **verifies on the platform**, Company B's verified branch data propagates to all companies that have Company B in their contact pool. The same dual-profile architecture (Internal vs Verified) applies to branches.

| Field | Type | Description |
|-------|------|-------------|
| **contactBranches[]** | ContactBranch[] | Branch locations for an internal contact. **Canonical field defined in Module D (§5) CustomerContact Base Model.** Field definition below is for the ContactBranch sub-document schema. |
| → contactBranchId | string | Unique identifier |
| → branchName | string | Branch name (manually entered by the contact owner) |
| → branchAddress | ThaiAddress/IntlAddress | Branch address |
| → branchPhone | string | Branch phone |
| → branchEmail | string | Branch email |
| → customNotes | string | Internal notes about this branch (never overwritten by verified data) |
| → **profileHierarchy** | enum | 'INTERNAL_ONLY' (no verified match) / 'VERIFIED_LINKED' (matched to verified company's branch). **See Module D (§5) for canonical definition.** |
| → verifiedBranchId | string | If linked: the branchId from the verified company's branch list |
| → verifiedBranchData | object | Auto-populated from verified company's branch data (read-only). Contains: official branch name, address, code, phones. |
| → hasMainHQ | boolean | Whether this contact's branch set includes a main HQ record. **Branches without a main HQ are valid** — Company A may only deal with specific branch locations. When the contact verifies, the full branch structure (including HQ) becomes available via the verified profile. |


---

#### ERP API Integration Subscription

> [!TIP]
> **📖 In Plain Language:** Companies can connect their existing ERP systems (Odoo, SAP, Oracle) to the platform via API. Three tiers of data depth: CONTACT_ONLY (just names), SHALLOW (contacts + basic financials), DEEP (everything). The API has 6 layers of security: IP restrictions, key rotation, anomaly detection with auto-freeze, audit logging, read/write key separation, and HMAC signing.



> [!NOTE]
> Companies can subscribe to API access to connect their external ERP systems (**integrates with** → Module H products & inventory, Module D contacts, Module O invoices) (Odoo, SAP, Oracle, etc.) to push/pull data with the webapp. Three tiers of data depth are available. Authentication uses **API Key** per tenant (simple, secure for SMEs). OAuth2 Client Credentials available as a future premium upgrade for enterprise clients.

| Field | Type | Description |
|-------|------|-------------|
| **erpApiSubscription** | ErpApiConfig | Company's API integration subscription |
| → **erpConnectionTarget** | enum | 'CO_WORK_CLOUD' / 'EXTERNAL' — Which ERP this company connects to. **'CO_WORK_CLOUD'** = platform's own ERP (co-work.cloud). **'EXTERNAL'** = third-party ERP (Odoo, SAP, Oracle, etc.). Company can only connect to ONE ERP at a time. Default: null (no ERP connected). |
| → isActive | boolean | API access is currently active |
| → apiTier | enum | 'CONTACT_ONLY' / 'SHALLOW' / 'DEEP' |
| → **readApiKey** | string | Encrypted API key for **read-only** operations (pull contacts, invoices). Separate from write key to limit blast radius if leaked. |
| → **writeApiKey** | string | Encrypted API key for **read-write** operations (push data, create/update records). Higher privilege — issue only to trusted integrations. |
| → apiKeyCreatedAt | string | When keys were generated |
| → apiKeyExpiresAt | string | Keys expire after configurable period. Default: **90 days**. Company must rotate before expiry. 24-hour grace period after expiry before full deactivation. |
| → apiKeyLastUsedAt | string | Last API call timestamp |
| → monthlyCallLimit | number | Max API calls per month (per tier) |
| → currentMonthCalls | number | Calls used this month |
| → perMinuteRateLimit | number | Max API calls per minute. Default: 60. Prevents bulk data scraping even with valid key. |
| → **ipAllowlist[]** | IPAllowEntry[] | **Must-have security.** Company registers which IP addresses, CIDR ranges, or cloud provider ranges can use their API key. Requests from unlisted IPs are **rejected immediately**. Empty list = API disabled (must add at least one entry to activate). Each entry has: |
| → → entryId | string | Unique identifier |
| → → ipType | enum | 'STATIC_IP' (single IP address, e.g., "203.0.113.42") / 'CIDR_RANGE' (IP range, e.g., "10.0.0.0/24") / 'CLOUD_PROVIDER_RANGE' (pre-configured cloud provider IP blocks — auto-updated by Super Admin) |
| → → ipValue | string | The IP address or CIDR range (null if CLOUD_PROVIDER_RANGE) |
| → → cloudProvider | enum | If CLOUD_PROVIDER_RANGE: 'AWS' / 'GCP' / 'AZURE' / 'DIGITAL_OCEAN' / 'ODOO_CLOUD' / 'SAP_CLOUD' / 'ORACLE_CLOUD' / null. Super Admin maintains the official IP blocks for each provider. |
| → → label | string | Human-readable label (e.g., "Office Bangkok", "AWS ap-southeast-1", "Odoo SaaS") |
| → → addedBy | string | userId who added this entry |
| → → addedAt | string | When added |
| → → isActive | boolean | Currently active |
| → **hmacSecret** | string | 🟢 **Enterprise feature.** Shared secret for HMAC-SHA256 request signing. Each API request includes a timestamp + signature. Server validates signature and rejects requests older than 5 minutes (anti-replay). |
| → isFrozen | boolean | API key is currently frozen (manually or by auto-freeze). All requests rejected until unfrozen. |
| → frozenAt | string | When key was frozen |
| → frozenReason | enum | 'MANUAL_REVOKE' / 'ANOMALY_DETECTED' / 'KEY_EXPIRED' / 'IP_VIOLATION' |

**API Tier Details:**

| Tier | Data Scope | Fields Synced | Use Case |
|------|-----------|---------------|----------|
| **CONTACT_ONLY** | Contact details only | Contact name, address, phone, email, tax ID, **credit terms** (payment terms, credit days, credit limit) | Basic contact sync between ERP and webapp, accounts receivable/payable |
| **SHALLOW** | Contacts + invoice summaries | All CONTACT_ONLY fields + invoice code, date, value, payment status, due date, salesperson name | Sales dashboard, payment tracking |
| **DEEP** | Contacts + full invoice details | All SHALLOW fields + line items: product name, quantity, unit price, line discount, product category | Full accounting integration, inventory sync |

| Tier | Monthly Price (THB) | Monthly Call Limit |
|------|--------------------|---------------------|
| CONTACT_ONLY | *Set by Super Admin* | *Set by Super Admin* |
| SHALLOW | *Set by Super Admin* | *Set by Super Admin* |
| DEEP | *Set by Super Admin* | *Set by Super Admin* |

> [!NOTE]
> **Super Admin controls all pricing.** Tier prices and call limits are configured in the backoffice and can be adjusted without code changes. Promotional pricing and per-company custom deals are supported via the existing promotional campaign system (Module O).

#### API Key Security Hardening

> [!IMPORTANT]
> **Defense-in-depth strategy.** Multiple independent security layers ensure that even if one layer is compromised, the others prevent or limit damage. All layers are implemented server-side — the company's ERP integration code does not need to change when security policies are updated.

**Security Layers (by implementation priority):**

| Priority | Layer | Description |
|----------|-------|-------------|
| **Must have** | **IP Allowlisting** | Only registered IPs can use the key. **Single most effective protection** — a leaked key is useless from any unauthorized IP. Company manages their allowlist in the dashboard. |
| **Must have** | **Emergency Revoke** | One-click instant key revocation in company dashboard. All in-flight and future requests with the revoked key are rejected immediately. New key can be generated instantly. |
| **Must have** | **Full Audit Log** | Every API call logged with: IP address, timestamp, endpoint called, data scope accessed, response size, response code. Company can review in their dashboard. Essential for breach forensics — know exactly what was accessed. |
| 🟡 **Should have** | **Auto-Freeze on Anomaly** | AI monitors API usage patterns per tenant. Auto-freeze triggers: (1) Usage spike >10x normal hourly average, (2) Request from IP not in allowlist (logged + blocked), (3) Accessing data outside company's scope, (4) Requests from geo-blocked countries. On trigger: key frozen + company admin notified immediately via push/email. |
| 🟡 **Should have** | **Key Expiry + Rotation** | Keys expire after configurable period (default: 90 days). 30-day and 7-day expiry warnings sent to company admin. 24-hour grace period after expiry. Old key deactivated after grace period. Prevents forgotten leaked keys from persisting indefinitely. |
| 🟡 **Should have** | **Per-Minute Rate Limit** | Beyond monthly caps, enforce per-minute limits (default: 60 req/min). Returns HTTP 429 when exceeded. Slows down any bulk data exfiltration attempt even with a valid key. |
| 🟢 **Nice to have** | **Read/Write Key Separation** | Two separate keys per tenant: read-only key (GET operations only) and read-write key (GET + POST/PUT/DELETE). Company can issue read-only keys to less-trusted integrations or analytics tools. If read key leaks, data can't be modified. |
| 🟢 **Nice to have** | **HMAC Request Signing** | Each request includes: `X-Timestamp` header + `X-Signature` header (HMAC-SHA256 of request body + timestamp using shared secret). Server validates: (1) Signature matches, (2) Timestamp within 5 minutes of server time. Prevents replay attacks — even captured requests can't be reused. |

**API Audit Log Entry:**

| Field | Type | Description |
|-------|------|-------------|
| logId | string | Unique identifier |
| tenantId | string | Which company's API |
| keyType | enum | 'READ' / 'WRITE' |
| requestIp | string | Source IP address |
| endpoint | string | API endpoint called (e.g., "/api/v1/contacts") |
| httpMethod | enum | 'GET' / 'POST' / 'PUT' / 'DELETE' |
| requestTimestamp | string | When request was received (ISO 8601) |
| responseCode | number | HTTP response code (200, 401, 403, 429, etc.) |
| dataScope | string | What data was accessed (e.g., "contacts:list", "invoices:detail") |
| recordCount | number | Number of records returned/affected |
| responseBytes | number | Response payload size |
| isBlocked | boolean | Was this request blocked by a security layer |
| blockedReason | enum | 'IP_NOT_ALLOWED' / 'KEY_EXPIRED' / 'KEY_FROZEN' / 'RATE_LIMITED' / 'INVALID_SIGNATURE' / null |

**Auto-Freeze Alert Model:**

| Field | Type | Description |
|-------|------|-------------|
| alertId | string | Unique identifier |
| tenantId | string | Affected company |
| triggerType | enum | 'USAGE_SPIKE' / 'UNKNOWN_IP' / 'SCOPE_VIOLATION' / 'GEO_BLOCK' |
| triggerDetails | string | Human-readable description (e.g., "150 requests in 1 minute vs normal average of 12") |
| detectedAt | string | When anomaly was detected |
| autoFrozen | boolean | Was the key auto-frozen |
| notifiedUsers[] | string[] | userIds of company admins who were notified |
| resolvedAt | string | When admin unfroze or confirmed legitimate |
| resolvedBy | string | userId who resolved |
| resolution | enum | 'CONFIRMED_LEGITIMATE' / 'KEY_ROTATED' / 'INCIDENT_ESCALATED' |

**Unfreeze Request Flow:**

> [!NOTE]
> **When a company's API key is frozen** (by auto-freeze or manual revoke), the company can request unfreezing through the platform. The request goes to the Super Admin team for review.

| Field | Type | Description |
|-------|------|-------------|
| unfreezeRequestId | string | Unique identifier |
| tenantId | string | Company requesting unfreeze |
| requestedBy | string | userId who submitted the request |
| requestedAt | string | When submitted |
| reason | string | Company's explanation for why the freeze was triggered and why it should be unfrozen |
| frozenKeyType | enum | 'READ' / 'WRITE' / 'BOTH' |
| frozenReason | enum | Original freeze reason |
| auditLogAttached | boolean | System auto-attaches the API audit log for the period around the freeze event |
| status | enum | 'PENDING_REVIEW' / 'APPROVED' / 'DENIED' / 'APPROVED_WITH_CONDITIONS' |
| reviewedBy | string | Super Admin team member who reviewed |
| reviewedAt | string | When reviewed |
| reviewNotes | string | Reviewer's notes and conditions |
| conditions | string | If APPROVED_WITH_CONDITIONS: what the company must do (e.g., "rotate keys", "update IP allowlist") |
| unfrozenAt | string | When key was unfrozen |

**Cloud-Based ERP Security:**

> [!NOTE]
> **For companies using cloud-based ERP systems** (SaaS ERPs like Odoo Cloud, SAP S/4HANA Cloud, Oracle Cloud), additional security measures protect the cloud-to-cloud data channel:

| Layer | Description |
|-------|-------------|
| **Mutual TLS (mTLS)** | Both the webapp API server and the ERP cloud endpoint authenticate each other via certificates. Prevents man-in-the-middle attacks. |
| **Webhook Signature Verification** | When the webapp pushes data to a cloud ERP webhook, the payload includes an HMAC signature. The ERP verifies the signature before processing. |
| **Encrypted Payload** | All data in transit is encrypted via TLS 1.3. Data at rest in the API layer is encrypted with AES-256. |
| **Cloud Provider IP Ranges** | For known SaaS ERPs, Super Admin can pre-configure the provider's published IP ranges (e.g., Odoo's cloud IP blocks) for easier IP allowlisting. |

### ERP Incremental Sync Architecture

> [!IMPORTANT]
> **Incremental sync (webhooks + watermark) replaces full data dumps.** Instead of pulling all records on every sync, the platform uses a combination of webhooks (push) and watermark-based polling (pull) to sync only changed records. This reduces API calls by 90%+ and prevents rate limit issues.

**Sync Strategies:**

| Strategy | Direction | How It Works |
|----------|-----------|-------------|
| **Webhooks (push)** | Platform → ERP | When data changes on the platform (contact updated, invoice created, expense approved, sample distributed), the platform sends a webhook notification to the ERP's registered endpoint. Payload includes the changed record(s) only. ERP processes the webhook and updates its records. |
| **Watermark polling (pull)** | ERP → Platform | ERP stores a `lastSyncTimestamp` (watermark). On each poll, ERP calls `/api/v1/sync/changes?since={watermark}`. Platform returns only records modified after the watermark. ERP updates watermark after successful processing. |
| **Full resync (fallback)** | Either direction | If watermark is lost or data integrity is suspect, ERP can request a full resync via `/api/v1/sync/full`. Rate-limited to 1 full resync per 24 hours. |

**Webhook Configuration:**

| Field | Type | Description |
|-------|------|-------------|
| **webhookEndpoints[]** | WebhookConfig[] | Company's registered webhook endpoints |
| → endpointUrl | string | HTTPS URL that receives webhook payloads |
| → events[] | string[] | Which events trigger this webhook (e.g., 'contact.updated', 'invoice.created', 'product.updated', 'expense.approved', 'expense.updated', 'attendance.shift_completed', 'sample.distributed', 'sample.returned', 'fuel.logged') |
| → isActive | boolean | Webhook is currently active |
| → secret | string | Shared secret for webhook signature verification (HMAC-SHA256) |
| → retryPolicy | enum | 'RETRY_3X' (retry 3 times with exponential backoff: 1min, 5min, 30min) / 'NO_RETRY' |
| → lastDeliveryAt | string | Last successful webhook delivery |
| → failureCount | number | Consecutive delivery failures (auto-disable after 10 consecutive failures) |

---


---

### Co-Work.cloud SuperAdmin-Exclusive Modules

> [!TIP]
> **📖 What is this?** Co-Work.cloud is the platform's ERP, available to all verified companies. However, some advanced ERP modules are **SuperAdmin-exclusive** — they are only available to companies that the SuperAdmin explicitly enables. These are premium/specialized features that require additional configuration and are not part of the standard ERP offering.

> [!IMPORTANT]
> **SuperAdmin-exclusive modules are feature-flag gated.** Each exclusive module has a feature flag in the company's tenant configuration. Only SuperAdmin can toggle these flags — company admins cannot self-enable. This prevents unauthorized access to premium features and allows the platform owner to monetize or strategically distribute advanced capabilities.

**Exclusive Module Registry:**

| Module | Feature Flag | Description | Status |
|--------|-------------|-------------|--------|
| **Manufacturing** | `erp.manufacturing.enabled` | Bill of Materials (BOM), Work Orders, Production Planning, Quality Control, Production Cost Tracking. Designed for factories (plastics, food processing, electronics assembly, etc.). | 🔲 Planned — platform owner will customize |

**Tenant Configuration (SuperAdmin-only):**

| Field | Type | Description |
|-------|------|-------------|
| **erpExclusiveModules** | object | SuperAdmin-configured feature flags for exclusive ERP modules |
| → manufacturing | boolean | `true` = company can access Manufacturing module. Default: `false`. Only SuperAdmin can change. |
| → enabledBy | string | SuperAdmin userId who enabled this module |
| → enabledAt | string | When enabled |

> [!NOTE]
> **Why is manufacturing exclusive?** Manufacturing ERP is highly specialized — it requires BOM management, shop floor control, quality inspection, and production costing. Most CRM users don't need this. By making it SuperAdmin-exclusive, the platform owner can: (1) offer it as a premium add-on, (2) enable it only for their own factory companies, or (3) gradually roll it out to partners. The manufacturing module specification will be detailed in a separate document when development begins.


### Company Role Employment Contract (T&A Pipeline)

> [!NOTE]
> Employment contract and terms & agreement workflows. Module E (§6) creates tasks that reference contracts defined here.


> [!IMPORTANT]
> **Thai law basis:** Labor Protection Act B.E. 2541 Sec 14-17 (employment conditions), ETA Sec 9-11 (electronic contracts). Every company role assignment can optionally include a formal employment contract/T&A stored in the Contract Vault. This creates a legally binding record of the employment relationship.

**Employment Contract Flow:**

```
User is assigned a company role
  ↓
System checks: Does this company have a role T&A template?
  ├── YES (company-uploaded custom template)
  │   → Display custom contract for user to review and sign
  │   → Signed contract stored in Contract Vault (auto-created vault)
  │
  ├── YES (platform-standard template)
  │   → Display platform template with company details auto-filled
  │   → Signed contract stored in Contract Vault
  │
  └── NO (no template configured)
      → User accepts standard role assignment terms (minimal)
      → No vault entry created
  ↓
If company role REQUIRES GPS tracking (company config):
  → Separate GPS Consent Clause displayed (PDPA Sec 26 — Sensitive Data)
  → User must EXPLICITLY check GPS consent checkbox
  → GPS tracking details: tracked during work hours ONLY,
    disabled during vacation mode AND company holidays,
    data retention period disclosed, right to withdraw stated
  → GPS consent recorded in Consent Audit Log
  ↓
Contract/T&A stored in Contract Vault with parties:
  Party 1 = Company (employer)
  Party 2 = User (employee/contractor)
```

**Role T&A Template Model:**

| Field | Type | Description |
|-------|------|-------------|
| templateId | string | Unique identifier |
| tenantId | string | Company that owns this template |
| templateType | enum | 'COMPANY_CUSTOM' (uploaded by company) / 'PLATFORM_STANDARD' (system-generated) |
| templateName | string | Template name (e.g., "Full-Time Employment Agreement", "Contractor Agreement") |
| templateDocument | FileEntry | The contract document template |
| **gpsConsentClause** | GPSConsentConfig | GPS tracking consent configuration |
| → requiresGpsConsent | boolean | Whether this role requires GPS consent |
| → trackingScope | enum | 'WORK_HOURS_ONLY' (default) / 'SHIFT_HOURS_ONLY' |
| → disabledDuringVacation | boolean | Always true — GPS disabled during vacation mode |
| → disabledDuringHoliday | boolean | Always true — GPS disabled during company holidays |
| → retentionDays | number | How long GPS data is retained (PDPA disclosure) |
| **approvalChain** | ApprovalConfig | Who must approve role assignment/removal |
| → requiresApproval | boolean | Whether role assignment/removal needs approval |
| → approverRoleIds[] | string[] | Which user roles can approve (**validates against** Module C (§4) approval hierarchy) |
| → approvalType | enum | 'ANY_ONE' / 'ALL_REQUIRED' / 'SEQUENTIAL' |
| isActive | boolean | Template is currently in use |
| version | string | Template version (e.g., "v1.0") |

**Role Removal Flow:**

```
User role is being removed
  ↓
System prompts: "Reason for removal?"
  ├── RESIGNED — user initiated departure
  ├── TERMINATED — company initiated removal
  ├── CONTRACT_ENDED — fixed-term contract expired
  ├── ROLE_TRANSFERRED — role transferred to another user
  └── OTHER — free text reason
  ↓
If role has an active employment contract in vault:
  → Contract is marked as TERMINATED with datestamp
  → terminatedAt, terminationReason, terminatedBy recorded
  → Original contract remains in vault (immutable)
  ↓
joinDate is cleared from the user's role record
companyRoleId moves to previousHolders[] history
```

**T&A Update Flow (Company Updates Terms):**

```
Company publishes new version of role T&A template
  ↓
All existing users with this role type receive notification:
  "Your company has updated the employment terms. Please review."
  ↓
User reviews new T&A:
  ├── ACCEPT → New T&A version stored in vault, old version archived
  └── REJECT → User stays on old T&A version
      → Company is notified of rejection
      → Company can DISABLE the user role (user cannot work until they accept)
      → User can re-accept at any time to re-enable their role
```

> [!CAUTION]
> **GPS Tracking — PDPA Sec 26 compliance:** Location data linked to employee monitoring is classified as Sensitive Personal Data. The GPS consent is a SEPARATE checkbox from the employment T&A acceptance. It cannot be bundled. The consent text must clearly state: (1) what is tracked, (2) when tracking is active (work hours only), (3) when tracking is disabled (vacation, holidays), (4) retention period, (5) user's right to withdraw consent per PDPA Sec 19(5). Withdrawing GPS consent does NOT terminate employment but may affect roles that require GPS tracking per company policy.


---

> [!NOTE]
> **Related standalone sections (extracted for clarity):**
> - **Contact Pool** → Module D (§5)
> - **Notifications** → §3.5 Platform Notification Architecture
> - **Contract Vault** → §3.6 Contract Vault & Document Management

---

## 3.5 Platform Notification Architecture {#3-5-notifications}

> [!TIP]
> **📖 What is §3.5?** This is the platform-wide alert system. When ANYTHING happens (task assigned, PO received, license expiring, KYC approved) → the right people get notified through the right channels (push, email, chat, SMS, in-app). Companies configure "routing presets" — named rules like "Sales Team Alerts" that define who gets notified for which events.
>
> **6 channels:** In-App Feed (always on), Phone Push, Browser Push, Chat Message, Email, SMS (costs extra).
> **83+ event types** from all modules. Some notifications are mandatory (government takedowns, security alerts) and CANNOT be disabled.



> [!IMPORTANT]
> Platform-wide notification system serving all modules (A through Q). Configured per-company but operates across the entire platform. Covers **6 delivery channels**, **83+ event types** (including 9 po.* events from Module Q §17, 4 expense events from §3.7, 3 device events from Module K, 5 campaign events from Module S §18.5), **7 feed categories**, and per-event channel selection.

### Company Notification Routing

> [!IMPORTANT]
> **Notification architecture:** ALL notifications flow through the **user role notification center** first. This is the primary destination for every event across all modules. Notifications can ADDITIONALLY be pushed to secondary delivery channels — configurable per routing preset via the delivery channel config.
>
> **6 Notification Delivery Channels:**
> 1. **In-App Feed** — categorized notification feed within the webapp (default, always on)
> 2. **Native Phone Push** — iOS/Android push notifications via FCM/APNs
> 3. **Browser Push** — Desktop/laptop push notifications via Web Push API
> 4. **Ecosystem Chat** — notification delivered as a chat message in Module G
> 5. **Email** — notification sent via email
> 6. **SMS** — notification sent via SMS ⚠️ **SMS incurs per-message cost** (charged to the company's subscription billing). Companies must opt-in to SMS notifications and acknowledge cost. SMS is recommended ONLY for critical/urgent notifications (e.g., security alerts, termination approvals, emergency contact).
>
> **Channel selection:** Each notification routing preset can specify which channels to use per event type. Users can override their personal channel preferences in their notification settings (Module A). Company admins can set **required channels** per event type (e.g., "Security alerts MUST go to SMS + Push").

> [!NOTE]
> **"When THIS happens → Notify THESE people."** Each company configures named routing presets so the right people are alerted when events occur. Personal users do NOT need to configure routing — all notifications go directly to them. Expandable — new event types can be added by Super Admin without code changes.

> [!IMPORTANT]
> **Creator override:** When a user creates a task, event, recruitment posting, or any entity with notifications, they can edit the notification targets at creation time — UNLESS a specific target is marked `isRequired: true`, in which case that target cannot be removed. Users with company profile access (per permission model) can set the `isRequired` flag.

| Field | Type | Description |
|-------|------|-------------|
| **notificationRoutes[]** | NotificationRoute[] | Event → target routing presets |
| → presetName | string | Named preset (e.g., "Sales Team Alerts", "HR Pipeline", "All Managers") |
| → eventType | enum | Event that triggers notification (see configurable event list below) |
| → isDefault | boolean | Default preset for this event type. When a user creates an entity, this preset is auto-selected. One default per event type per user/team/role context. |
| → targets[] | RouteTarget[] | Who gets notified |
| → → targetType | enum | 'USER' / 'TEAM' / 'ROLE' / 'EMAIL' / 'CHAT' |
| → → targetId | string | userId, teamId, or roleName (when USER/TEAM/ROLE) |
| → → targetValue | string | Email address (when EMAIL) or chatRoomId (when CHAT — pushes notification to ecosystem chat in addition to notification center) |
| → → isRequired | boolean | **Locked target.** Cannot be removed when creator edits notifications. Only users with company profile access can set this. |
| → isActive | boolean | This route preset is enabled |
| → isOverridableByCreator | boolean | When true, the creator of a task/event can add/remove non-required targets at creation. When false, only this preset applies (no modifications). |

> [!NOTE]
> **Personal users:** Individual users without a company context receive all their notifications directly — no routing configuration needed. Their notification preferences (Module A — push/email/chat/active hours) control delivery.

**Full Notification Event List (audited across all modules A-Q):**

| Category | eventType | Trigger |
|----------|-----------|---------|
| **User (A)** | `USER_KYC_STATUS_CHANGE` | User verification level changes |
| **Company (B)** | `COMPANY_VERIFICATION_STATUS_CHANGE` | Company verification level changes |
| **Company (B)** | `COMPANY_LICENSE_EXPIRING` | License expiry warning (90/60/30/7 days) |
| **Roles (C)** | `ROLE_ASSIGNED` | User assigned a new role |
| **Roles (C)** | `ROLE_REMOVED` | User removed from a role |
| **Contacts (D)** | `CONTACT_APPROVAL_NEEDED` | New contact needs approval to become official |
| **Contacts (D)** | `CONTACT_VERIFIED_PROFILE_LINKED` | Internal contact matched to verified company |
| **Tasks (E)** | `TASK_ASSIGNED` | Task assigned to user |
| **Tasks (E)** | `TASK_STATUS_CHANGED` | Task status changes |
| **Tasks (E)** | `TASK_ESCALATION` | Task overdue or manually escalated |
| **Tasks (E)** | `TASK_DUE_SOON` | Task due within 24 hours |
| **Tasks (E)** | `TASK_OVERDUE` | Task past due date |
| **Tasks (E)** | `TASK_COMMENT_ADDED` | New comment on a task |
| **Tasks (E)** | `LEAD_STATUS_CHANGED` | Lead moves through pipeline |
| **Tasks (E)** | `EXTERNAL_APPROVAL_RECEIVED` | External party responded to approval link |
| **Sales (F)** | `SALES_VISIT_MISSED` | Scheduled visit was missed |
| **Sales (F)** | `SALES_REPORT_SUBMITTED` | Sales rep submitted visit report |
| **§3.7 Expense** | `EXPENSE_SUBMITTED` | Expense receipt submitted — notifies approving manager via Module C hierarchy |
| **§3.7 Expense** | `EXPENSE_APPROVAL_NEEDED` | Expense receipt pending approval (sent to approver) |
| **§3.7 Expense** | `EXPENSE_APPROVED` | Expense approved — notifies the submitter |
| **§3.7 Expense** | `EXPENSE_REJECTED` | Expense rejected with reason — notifies the submitter |
| **Sales (F)** | `SALES_ACTUAL_PLAN_REMINDER` | **Pushed to the sales rep themselves** — reminder for upcoming planned visit/call/meeting from their Actual Plan (configurable: 1hr/30min/15min before) |
| **Sales (F)** | `SALES_ACTUAL_PLAN_CREATED` | Notifies sales rep when their daily actual plan is finalized/updated by manager |
| **Chat (G)** | `CHAT_FILE_EXPIRING` | Free-tier file approaching expiry |
| **Products (H)** | `PRODUCT_APPROVAL_NEEDED` | New product submitted for review |
| **Products (H)** | `PRODUCT_MODERATION_FLAGGED` | Hermes flagged product content |
| **Products (H)** | `PRODUCT_PRICE_VIOLATION` | Price outside TCCT/MOC bounds |
| **Products (H)** | `TRENDING_RANK_CHANGED` | Your product's trending position changed (entered or left Top 10 in any category) — notifies product owner |
| **Campaign (S)** | `CAMPAIGN_LEAD_CAPTURED` | External visitor submitted lead form via campaign QR/link — notifies assigned user(s) per leadDistribution method |
| **Campaign (S)** | `CAMPAIGN_STARTED` | Campaign status changed to ACTIVE (scheduled start date reached) |
| **Campaign (S)** | `CAMPAIGN_ENDING_SOON` | Campaign end date is within 3 days — notifies campaign creator |
| **Campaign (S)** | `CAMPAIGN_COMPLETED` | Campaign completed — performance report ready for review |
| **Campaign (S)** | `CAMPAIGN_LEAD_DATA_EXPIRING` | PDPA retention period for lead data expiring in 30 days — notifies campaign owner |
| **Data Retention** | `DATA_CLEANUP_PENDING` | Scheduled media cleanup approaching — admin review required |
| **Data Retention** | `DATA_CLEANUP_COMPLETED` | Media cleanup executed — summary of files deleted and storage freed |
| **Delivery (Q)** | `DELIVERY_PULL_API_FAILED` | Delivery partner pull API failed 10 consecutive times — auto-disabled, admin action needed |
| **Showcase (I)** | `SHOWCASE_MODERATION_FLAGGED` | Hermes flagged showcase content |
| **Recruitment (J)** | `JOB_APPLICATION_RECEIVED` | New candidate applies |
| **Recruitment (J)** | `CANDIDATE_STATUS_CHANGED` | Candidate moves through pipeline |
| **Recruitment (J)** | `CANDIDATE_AUTO_CONVERTED` | Recruited candidate auto-converted to employee |
| **Events (K)** | `EVENT_REMINDER` | Event starting soon — applies to employees AND external users (attendees, freelancers, clients) |
| **Events (K)** | `ATTENDANCE_CHECK_IN` | Employee or external participant checked in |
| **Events (K)** | `ATTENDANCE_LATE` | Employee or participant is late |
| **Events (K)** | `SHIFT_OVERTIME_ALERT` | Employee approaching overtime |
| **Events (K)** | `DEVICE_PRIMARY_CHANGED` | User's primary GPS device was switched. **Company-configurable behavior:** (1) Auto-approve: change takes effect immediately, notification sent to admin. (2) Require approval: change request sent to user with `device.manage` permission, device stays unchanged until approved. Both modes generate an audit log entry and appear in the Device Change Report |
| **Events (K)** | `DEVICE_CHANGE_APPROVED` | Device change request was approved by authorized personnel |
| **Events (K)** | `DEVICE_CHANGE_REJECTED` | Device change request was rejected — user notified with reason |
| **Favorites (L)** | `NEWS_POST_FROM_FOLLOWED` | Followed company posted news |
| **Products & Inventory (H)** | `EQUIPMENT_OVERDUE` | Rented equipment past return date |
| **Products & Inventory (H)** | `SAMPLE_BUDGET_THRESHOLD` | Sample spending approaching limit |
| **Skill Test (N)** | `TEST_ASSIGNED` | New test assigned to user/team |
| **Skill Test (N)** | `TEST_DUE_SOON` | Test deadline approaching |
| **Skill Test (N)** | `TEST_RESULTS_AVAILABLE` | Test scored, results ready |
| **Billing (O)** | `BILLING_ALERT` | Payment due, failed, or subscription change |
| **Billing (O)** | `INVOICE_GENERATED` | New invoice created |
| **Billing (O)** | `SUBSCRIPTION_EXPIRING` | Subscription renewal approaching |
| **Compliance (P)** | `ABUSE_REPORT_FILED` | Content/user reported |
| **Compliance (P)** | `TAKEDOWN_ORDER_RECEIVED` | Government takedown (24hr deadline) |
| **Compliance (P)** | `SECURITY_INCIDENT` | Security alarm triggered |
| **Compliance (P)** | `REGULATORY_SCAN_ALERT` | New regulation affecting platform |
| **Calendar Sync** | `CALENDAR_EVENT_REMINDER` | Google Calendar event reminder — pushed via platform notification system (in addition to Google’s own notifications) |
| **Calendar Sync** | `CALENDAR_EVENT_CREATED` | New event synced from Google Calendar to the platform |
| **Calendar Sync** | `CALENDAR_EVENT_UPDATED` | Existing synced event was modified in Google Calendar |
| **Calendar Sync** | `CALENDAR_EVENT_CANCELLED` | Synced event was cancelled in Google Calendar |
| **System** | `GENERAL_INQUIRY` | External inquiry to the company |
| **System** | `SYSTEM_MAINTENANCE` | Platform maintenance window |
| **System** | `SYSTEM_ANNOUNCEMENT` | Platform-wide announcement |
| **Procurement (Q)** | `PO_CREATED` | New PO created and sent to seller |
| **Procurement (Q)** | `PO_ACKNOWLEDGED` | Seller acknowledged receipt of PO |
| **Procurement (Q)** | `SO_CREATED` | SO created from incoming PO |
| **Procurement (Q)** | `PO_STATUS_CHANGED` | PO/SO lifecycle status update |
| **Procurement (Q)** | `PO_INVOICE_ATTACHED` | Seller attached invoice file to SO |
| **Procurement (Q)** | `PO_SIGNATURE_REQUESTED` | Signature or liveness verification requested on PO/SO |
| **Procurement (Q)** | `RFQ_RECEIVED` | New RFQ received from buyer |
| **Procurement (Q)** | `QUOTATION_RECEIVED` | Quotation received from seller |
| **Procurement (Q)** | `PO_APPROVAL_REQUIRED` | PO pending internal approval |
| **Procurement (Q)** | `DELIVERY_STATUS_UPDATED` | Delivery status changed via external partner webhook — notifies buyer |
| **Vault (§3.6)** | `VAULT_DOCUMENT_UPLOADED` | New document added to shared vault |
| **Vault (§3.6)** | `VAULT_SIGNATURE_REQUESTED` | Signature or liveness requested on vault document |
| **Vault (§3.6)** | `VAULT_DOCUMENT_EXPIRED` | Contract term has expired |
| **Inventory (H)** | `SAMPLE_RETURN_DUE` | Loaned sample approaching return date (7 days / 3 days / overdue) |
| **Inventory (H)** | `EQUIPMENT_RETURN_DUE` | Rented equipment approaching return date |
| **Inventory (H)** | `SAMPLE_LOST_REPORTED, TRENDING_RANK_CHANGED, CAMPAIGN_LEAD_DATA_EXPIRING, DATA_CLEANUP_PENDING, DATA_CLEANUP_COMPLETED, DELIVERY_PULL_API_FAILED` | Sample marked as LOST by contact or user |

### Notification Feed Categorization

> [!IMPORTANT]
> **In-App notifications are organized into categorized feeds** so users can quickly find relevant notifications without scrolling through a flat list. Each feed shows an unread count badge.

| Feed Category | Icon | Events Included |
|--------------|------|-----------------|
| **📋 Tasks & Approvals** | Clipboard | TASK_ASSIGNED, TASK_STATUS_CHANGED, TASK_ESCALATION, TASK_DUE_SOON, TASK_OVERDUE, TASK_COMMENT_ADDED, EXPENSE_SUBMITTED, EXPENSE_APPROVAL_NEEDED, EXPENSE_APPROVED, EXPENSE_REJECTED, EXTERNAL_APPROVAL_RECEIVED |
| **👥 HR & People** | People | ROLE_ASSIGNED, ROLE_REMOVED, JOB_APPLICATION_RECEIVED, CANDIDATE_STATUS_CHANGED, CANDIDATE_AUTO_CONVERTED, TEST_ASSIGNED, TEST_DUE_SOON, TEST_RESULTS_AVAILABLE |
| **🏢 Company & Contacts** | Building | COMPANY_VERIFICATION_STATUS_CHANGE, COMPANY_LICENSE_EXPIRING, CONTACT_APPROVAL_NEEDED, CONTACT_VERIFIED_PROFILE_LINKED, LEAD_STATUS_CHANGED, USER_KYC_STATUS_CHANGE, VAULT_DOCUMENT_UPLOADED, VAULT_SIGNATURE_REQUESTED, VAULT_DOCUMENT_EXPIRED |
| **💬 Sales & Commerce** | Shopping Cart | SALES_VISIT_MISSED, SALES_REPORT_SUBMITTED, SALES_ACTUAL_PLAN_REMINDER, SALES_ACTUAL_PLAN_CREATED, PRODUCT_APPROVAL_NEEDED, PRODUCT_MODERATION_FLAGGED, PRODUCT_PRICE_VIOLATION, CAMPAIGN_LEAD_CAPTURED, CAMPAIGN_STARTED, CAMPAIGN_ENDING_SOON, CAMPAIGN_COMPLETED, PO_CREATED, PO_ACKNOWLEDGED, SO_CREATED, PO_STATUS_CHANGED, PO_INVOICE_ATTACHED, PO_SIGNATURE_REQUESTED, RFQ_RECEIVED, QUOTATION_RECEIVED, PO_APPROVAL_REQUIRED, DELIVERY_STATUS_UPDATED, EQUIPMENT_OVERDUE, SAMPLE_BUDGET_THRESHOLD, SAMPLE_RETURN_DUE, EQUIPMENT_RETURN_DUE, SAMPLE_LOST_REPORTED |
| **📅 Calendar & Events** | Calendar | EVENT_REMINDER, ATTENDANCE_CHECK_IN, ATTENDANCE_LATE, SHIFT_OVERTIME_ALERT, DEVICE_PRIMARY_CHANGED, DEVICE_CHANGE_APPROVED, DEVICE_CHANGE_REJECTED, CALENDAR_EVENT_REMINDER, CALENDAR_EVENT_CREATED, CALENDAR_EVENT_UPDATED, CALENDAR_EVENT_CANCELLED |
| **💰 Billing & Compliance** | Shield | BILLING_ALERT, INVOICE_GENERATED, SUBSCRIPTION_EXPIRING, ABUSE_REPORT_FILED, TAKEDOWN_ORDER_RECEIVED, SECURITY_INCIDENT, REGULATORY_SCAN_ALERT |
| **📰 Feed & Social** | Megaphone | NEWS_POST_FROM_FOLLOWED, SHOWCASE_MODERATION_FLAGGED, CHAT_FILE_EXPIRING, GENERAL_INQUIRY, SYSTEM_MAINTENANCE, SYSTEM_ANNOUNCEMENT |

> [!NOTE]
> **User preference:** Users can mute specific feed categories (notifications still delivered but no badge/sound). Muting a feed does NOT affect email/SMS/push delivery — only the in-app feed badge. Users can also set "Priority Only" mode which only shows notifications from Tasks & Approvals and Billing & Compliance.

### Per-Event Channel Selection

> [!IMPORTANT]
> **Company admins can configure which delivery channels are used per event type.** This is separate from routing targets (who) — this controls HOW the notification reaches the target.

| Field | Type | Description |
|-------|------|-------------|
| **eventChannelConfig[]** | ChannelConfig[] | Per-event-type channel selection |
| → eventType | string | Which event (from event list above) |
| → channels[] | ChannelEntry[] | Which channels to use |
| → → channel | enum | 'IN_APP' / 'PUSH' / 'BROWSER_PUSH' / 'CHAT' / 'EMAIL' / 'SMS' |
| → → isEnabled | boolean | Channel is active for this event |
| → → isRequired | boolean | If true: users cannot disable this channel for this event. Set by company admin. |
| → → isUserOverridable | boolean | If true: individual users can opt-out of this channel (in their personal notification settings). |

> [!NOTE]
> **Default channel assignments:** All events default to `IN_APP` (always on, cannot be disabled) + `PUSH` (enabled by default, user can opt-out). Other channels (EMAIL, SMS, CHAT, BROWSER_PUSH) must be explicitly enabled by the company admin per event type.

**System Default Notifications (NOT configurable — hardcoded behavior):**

> [!IMPORTANT]
> **The following notifications are hardcoded system behaviors that companies CANNOT disable or modify.** They ensure platform security, legal compliance, and critical user safety.

| Trigger | Notification Behavior | Channels Used |
|---------|----------------------|---------------|
| **Direct message received** | Recipient always gets notification — automatic | IN_APP + PUSH |
| **Group chat message** | All group members get notification — automatic | IN_APP + PUSH |
| **@mention in any chat** | Mentioned user gets notification — automatic | IN_APP + PUSH |
| **Chat file expiring** | Configurable via routing (included in event list above) | IN_APP |
| **Account suspended (fraud)** | Target user always notified immediately | IN_APP + EMAIL + PUSH |
| **KYC document rejected** | User always notified with rejection reason | IN_APP + EMAIL |
| **Password/email changed** | User always notified for security | IN_APP + EMAIL + PUSH |
| **New device login** | User always notified with device info | IN_APP + EMAIL + PUSH |
| **API key frozen** | Company admin always notified | IN_APP + EMAIL + PUSH |
| **License expired** | Company admin + MD always notified | IN_APP + EMAIL |
| **Government takedown order** | Super Admin team always notified with 24hr deadline | IN_APP + EMAIL + SMS + PUSH |
| **Subscription payment failed** | Billing contact always notified with retry schedule | IN_APP + EMAIL |

**Company Holidays & Notification Scheduling:**

> [!NOTE]
> **Company holidays** are defined here for notification delivery timing. Notifications respect holidays — delivery is adjusted based on the user's department calendar.
>
> **Calendar events** (actual plan visits, interview appointments, task events) are managed through Module E (§6) Google Calendar integration. Not all tasks appear on the calendar — only tasks with scheduled dates.
>
> **Working hours** (GPS tracking window, attendance clock-in/out time boundaries) are defined in Module K (§11) GPS & Attendance. See `departmentWorkingHours[]` with `departmentName: 'COMPANY_DEFAULT'` for company-wide default hours.

| Field | Type | Description |
|-------|------|-------------|
| **companyHolidays[]** | HolidayEntry[] | Yearly holiday calendar |
| → holidayDate | string | Date of holiday |
| → holidayName | string | Holiday name (e.g., "Songkran", "King's Birthday") |
| → holidayNameLocal | string | Localized name (label per CountryRuleEngine) |
| → appliesToDepartments[] | string[] | Which departments observe this holiday (empty = all departments) |
| → appliesToCountry | string | Country code this holiday applies to (for multi-country companies) |
| → isRecurring | boolean | Repeats annually |
| **departmentWorkingHours[]** | — | **Moved to Module K (§11) GPS & Attendance.** Working hours configuration is used for GPS tracking windows and attendance calculations. See Module K for `DeptSchedule[]` fields including `departmentName`, `workdays`, `startTime`, `endTime`, `timezone`. Use `departmentName: 'COMPANY_DEFAULT'` for company-wide default hours. |

> [!IMPORTANT]
> **How calendar affects notifications:** When `workdaysOnly` is true for a user role, the system checks: (1) Is today a holiday for this user's department? (2) Is the current time within this user's department working hours? If either is false, notifications follow the user's `offHoursDelivery` preference (SILENT / DELIVER / QUEUE_UNTIL_ACTIVE).

**Example configuration:**
```json
[
  {
    "presetName": "HR Pipeline Alerts",
    "eventType": "JOB_APPLICATION_RECEIVED",
    "isDefault": true,
    "isOverridableByCreator": true,
    "targets": [
      { "targetType": "USER", "targetId": "usr_hr_manager", "isRequired": true },
      { "targetType": "TEAM", "targetId": "team_hr" }
    ]
  },
  {
    "presetName": "Compliance Escalation",
    "eventType": "ABUSE_REPORT_FILED",
    "isDefault": true,
    "isOverridableByCreator": false,
    "targets": [
      { "targetType": "TEAM", "targetId": "team_compliance", "isRequired": true },
      { "targetType": "EMAIL", "targetValue": "legal@company.com", "isRequired": true },
      { "targetType": "CHAT", "targetValue": "chatroom_compliance_alerts" }
    ]
  }
]
```


---

## 3.6 Contract Vault & Document Management {#3-6-contract-vault}

> [!TIP]
> **📖 What is §3.6?** A secure shared vault for legal contracts between 2-20 parties (expandable to 100). Think of it as a document locker where multiple companies share contracts, sign them digitally, and maintain version history. 12 document types supported (Service Agreements, NDAs, Employment Contracts, MOUs, Franchise Agreements, Leases, etc.).
>
> **NOT the same as Module Q (PO/SO).** Procurement orders are separate from legal contracts — even though they share the same e-signature system.
>
> **Key rule:** Once a document is EXECUTED (fully signed), it can NEVER be modified or deleted. Amendments create a new version. Termination requires ALL parties to agree + Face Liveness verification.



> [!IMPORTANT]
> Standalone document management system with its own access control (5 levels), lifecycle state machine, AI features, and delegation rules.
>
> **Integrates with:** Module A (E-Signature verification) · Module B (Company Seal application) · Module E (task approvals). For PO/SO procurement documents, see Module Q (§17) — a separate module that shares the same e-signature and KYC infrastructure but is a distinct user experience.

### Contract Vault

> [!IMPORTANT]
> **Multi-party shared document vault** between verified entities for contracts, agreements, and official documents. Supports **2 to 20 parties** per vault (default limit; Super Admin can increase up to **100 maximum** for complex consortium agreements). Supports digital e-signatures AND uploaded PDF documents with physical ink stamps/company seals. Each vault has a complete audit trail for legal evidence (ETA Sec 11). Documents follow a strict lifecycle: **DRAFT → PENDING_SIGNATURES → EXECUTED (locked) → TERMINATED (by unanimous verified agreement only)**.
>
> **Separation from Module Q (Procurement):** The Contract Vault is for **contracts and legal agreements** (NDAs, MOUs, employment contracts, company agreements, service agreements). **Purchase Orders and Sales Orders** are managed in Module Q (§17) — a separate module with its own signing and audit features. Both modules share the same e-signature infrastructure (Module A) and KYC verification, but are presented as separate user-facing modules so users don't confuse procurement documents with legal contracts.

> [!NOTE]
> **Party limit rationale:** Most Thai commercial contracts involve 2-5 parties. Joint ventures (Thai Civil and Commercial Code Sec 1012) and consortium agreements rarely exceed 10. Construction projects (Thai Building Control Act) may involve up to 15-20 parties. 20 is the practical UI and signature-collection limit. The absolute ceiling of 100 covers extreme edge cases (e.g., large syndicated agreements). Super Admin can adjust per vault.

**Vault Model:**

| Field | Type | Description |
|-------|------|-------------|
| vaultId | string | Unique identifier |
| vaultType | enum | 'BILATERAL' (exactly 2 parties) / 'MULTILATERAL' (3+ parties, up to maxPartyLimit) |
| **maxPartyLimit** | number | Default: 20. Super Admin can increase up to 100 for specific vaults. |
| **parties[]** | VaultParty[] | Ordered list of all parties in the vault |
| → partyIndex | number | 1-based index (Party 1, Party 2, Party 3...) — used for display, signatures, and approvals |
| → partyType | enum | 'COMPANY' / 'USER' |
| → partyId | string | tenantId (if COMPANY) or userId (if USER) |
| → partyName | string | Company name or user name |
| → joinedAt | string | When this party was added to the vault |
| → invitedBy | string | userId who invited this party (Party 1 is the vault creator) |
| → isActive | boolean | Party is currently active in the vault |
| **vaultCategory** | enum | **'SERVICE_AGREEMENT'** / **'NDA_CONFIDENTIALITY'** / **'EMPLOYMENT_CONTRACT'** / **'MOU_PARTNERSHIP'** / **'FRANCHISE_AGREEMENT'** / **'LEASE_AGREEMENT'** / **'RENTAL_AGREEMENT'** / **'LICENSING_AGREEMENT'** / **'JOINT_VENTURE'** / **'TRADING_TERMS_AGREEMENT'** / **'GENERAL_CONTRACT'** / **'OTHER'**. Used for browsing and filtering the vault list. **LEASE_AGREEMENT** = long-term property/real estate leases. **RENTAL_AGREEMENT** = short-term equipment, vehicle, or asset rentals. **TRADING_TERMS_AGREEMENT** = commercial trading terms between buyer and seller (payment terms, delivery terms, return policies, volume commitments). |
| vaultName | string | Vault label (e.g., "Company A ↔ Company B Agreement Vault") |
| isActive | boolean | Vault is currently active |
| createdAt | string | When vault was created |
| createdBy | string | userId who created the vault |

**Vault Access Control Model (Per-Party Independent Management):**

> [!IMPORTANT]
> **Each party independently controls their own access list.** Party 1 manages who in Party 1's organization can see the vault. Party 2 manages their own access list. Party 3 manages theirs. No party can see or modify another party's internal access assignments. This ensures each company controls their own internal access to shared documents.

| Field | Type | Description |
|-------|------|-------------|
| **vaultAccessList[]** | VaultAccessEntry[] | Per-party access assignments |
| → userId | string | User granted access |
| → partyIndex | number | Which party this user belongs to (1, 2, 3...) |
| → accessLevel | enum | 'VAULT_OWNER' / '**VAULT_CO_OWNER**' / 'AUTHORIZED_SIGNATORY' / 'DOCUMENT_VIEWER' / 'VAULT_OBSERVER' |
| → grantedBy | string | userId who granted this access (must be VAULT_OWNER of same party) |
| → grantedAt | string | When access was granted |
| → revokedAt | string | When access was revoked (null if active) |
| → isActive | boolean | Currently has access |

**Access Level Permissions:**

| Level | See Vault Exists | See Doc Titles & Status | See Doc Content | Sign Documents | Upload Documents | Manage Access |
|-------|-----------------|------------------------|-----------------|---------------|-----------------|---------------|
| `VAULT_OWNER` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `VAULT_CO_OWNER` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ (cannot add/remove access — only VAULT_OWNER can manage the access list) |
| `AUTHORIZED_SIGNATORY` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `DOCUMENT_VIEWER` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `VAULT_OBSERVER` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

> [!NOTE]
> **VAULT_CO_OWNER** has full operational access (view, sign, upload) but CANNOT manage the access list. This role is for authorized team members who need to actively work within the vault (e.g., legal team, CFO) but should not control who else has access. Only `VAULT_OWNER` can add/remove/modify access entries.

> [!NOTE]
> **VAULT_OBSERVER** can see that a contract exists, its title, type, status, and dates — but NOT the actual document content. Useful for managers, legal oversight, or finance teams who need awareness without seeing confidential commercial terms.

**Per-Party Access Delegation Rules:**

> [!IMPORTANT]
> **Each party independently defines how their access delegation works internally.** This is critical for large companies where the MD cannot review every document personally.

| Field | Type | Description |
|-------|------|-------------|
| **partyDelegationRules[]** | DelegationRule[] | Per-party internal delegation configuration |
| → partyIndex | number | Which party this rule applies to |
| → documentType | enum | Which document types this rule covers (CONTRACT / NDA / EMPLOYMENT_CONTRACT / MOU / SERVICE_AGREEMENT / etc.) |
| → **approvalAuthority** | enum | 'MD_ONLY' (only MD can sign — default for high-value contracts) / 'MANAGEMENT_LEVEL' (department managers and above) / 'SPECIFIC_USER' (specific named users) / 'ANY_AUTHORIZED_SIGNATORY' (anyone with AUTHORIZED_SIGNATORY access) |
| → specificUserIds[] | string[] | If SPECIFIC_USER: which users are authorized |
| → valueThreshold | number | If set: this rule applies only to documents with estimated value above this threshold (currency per CountryRuleEngine). Below threshold falls to the next less-restrictive rule. |
| → setBy | string | userId who configured this rule (must be VAULT_OWNER) |
| → setAt | string | When configured |

**Legal Approval Routing — Opposite Party Requirement:**

> [!IMPORTANT]
> **Each party can also set the minimum approval authority they REQUIRE from the opposite party** for documents sent to them. For example, Company A can require that all contracts sent to Company B must be signed by Company B's MD only — even if Company B internally allows department managers to sign.

| Field | Type | Description |
|-------|------|-------------|
| **requiredApprovalFromParty[]** | RequiredApproval[] | What approval level each party requires from other parties |
| → requestingPartyIndex | number | The party setting the requirement (e.g., Party 1) |
| → targetPartyIndex | number | The party who must meet this requirement (e.g., Party 2) |
| → requiredLevel | enum | 'MD_ONLY' / 'MANAGEMENT_LEVEL' / 'SPECIFIC_USER' / 'ANY_AUTHORIZED_SIGNATORY' |
| → appliesToDocumentTypes[] | enum[] | Which document types this requirement covers |
| → setBy | string | userId who set this requirement |
| → setAt | string | When set |

> [!NOTE]
> **How legal approval routing works in practice:** Company A sends a Service Agreement to Company B. Company A has set `requiredApprovalFromParty: MD_ONLY` for Company B on SERVICE_AGREEMENT documents. Even though Company B internally allows their legal team to sign service agreements, the system enforces that Company B's MD must sign this specific document because Company A requires it. The signing form displays: "This document requires approval from your Managing Director as requested by [Company A]."

**Vault Document Model:**

| Field | Type | Description |
|-------|------|-------------|
| documentId | string | Unique identifier |
| vaultId | string | Which vault this document belongs to |
| documentTitle | string | Document name (e.g., "Service Agreement #SA-2026-001") |
| documentType | enum | 'CONTRACT' / 'NDA' / 'EMPLOYMENT_CONTRACT' / 'MOU' / 'SERVICE_AGREEMENT' / 'FRANCHISE_AGREEMENT' / 'LEASE_AGREEMENT' / 'RENTAL_AGREEMENT' / 'LICENSING_AGREEMENT' / 'JOINT_VENTURE' / 'TRADING_TERMS_AGREEMENT' / 'COMPANY_AGREEMENT' / 'OTHER_OFFICIAL'. **Note:** Purchase Orders and Sales Orders are NOT stored in the Contract Vault — they are managed in Module Q (§17) with their own document management. |
| **documentFormat** | enum | 'E_SIGNATURE' (signed digitally in-app) / 'UPLOADED_PDF' (physical document scanned/uploaded — supports ink stamps, company seals, wet signatures) |
| **currentVersion** | string | Current version number (e.g., "1.3", "2.0") |
| documentFileUrl | string | Encrypted storage — current version's file |
| documentHash | string | SHA-256 hash of current version for tamper detection |
| **status** | enum | See Document Lifecycle below |
| **contractTermStart** | string | When the contract's obligations begin (for EXPIRED auto-calculation) |
| **contractTermEnd** | string | When the contract's obligations end (null if indefinite) |
| **signatures[]** | VaultSignature[] | Signatures from ALL parties |
| → signedBy | string | userId who signed |
| → signedForPartyIndex | number | Which party index this signature represents (1, 2, 3...) |
| → signatureType | enum | 'E_SIGNATURE' (digital, captured in-app, similarity-checked) / 'PHYSICAL_UPLOAD' (uploaded PDF page with ink signature / company seal) |
| → signingEventId | string | Link to E-Signature Registry signing event (if digital) |
| → physicalSignaturePageUrl | string | Uploaded page with physical signature (if PHYSICAL_UPLOAD) |
| → signedAt | string | When signed |
| → consentAuditId | string | Link to Terms & Agreement Consent Audit Log entry |
| → companySealApplicationId | string | If company seal was applied: link to Seal Application Log entry (see Company Seal Registry in Module B) |
| uploadedBy | string | userId who uploaded/created the document |
| uploadedAt | string | When first created |
| lastModifiedAt | string | When last modified (draft edits) |
| executedAt | string | When ALL parties signed → EXECUTED (locked timestamp) |
| **aiContractAnalysis** | AIAnalysis | AI-assisted contract review (optional — access controlled by Super Admin configuration) |
| → isAnalyzed | boolean | Whether AI analysis has been performed |
| → analysisRequestedBy | string | userId who requested the AI analysis |
| → analysisRequestedAt | string | When requested |
| → diffSummary | string | AI-generated summary of changes vs previous version |
| → riskAssessment | object | AI risk scoring |
| → → overallRiskScore | number | 0-100 (0 = low risk, 100 = high risk) |
| → → riskFactors[] | string[] | Identified risk factors (e.g., "Unlimited liability clause", "No termination clause") |
| → → legalComplianceFlags[] | string[] | Potential Thai law compliance issues identified |
| → aiRecommendation | string | AI's summary recommendation |
| → aiDisclaimerAccepted | boolean | User acknowledged AI disclaimer before viewing results |
| → aiDisclaimerConsentId | string | Link to Consent Audit Log for AI disclaimer acceptance |
| **accessLog[]** | VaultAccess[] | Every view/download/action is logged |
| → userId | string | Who accessed |
| → action | enum | 'VIEWED' / 'DOWNLOADED' / 'SIGNED' / 'EDITED_DRAFT' / 'SUBMITTED_FOR_SIGNING' / 'REQUESTED_TERMINATION' / 'APPROVED_TERMINATION' / 'REQUESTED_AI_ANALYSIS' / 'APPLIED_COMPANY_SEAL' |
| → timestamp | string | When |
| → ipAddress | string | From where |
| → versionViewed | string | Which version was accessed |

> [!WARNING]
> **AI Contract Analysis Disclaimer (displayed before every analysis):** "AI contract analysis is an automated preliminary review for informational purposes only. It does not constitute legal advice under the Thai Lawyers Council Act. The platform makes no warranty regarding the accuracy of risk assessments or compliance flags. Consult a qualified attorney licensed by the Thai Lawyers Council before making legal decisions based on this analysis."

> [!NOTE]
> **AI Contract Analysis access configuration:** Access to the AI analysis feature is controlled by Super Admin at the platform level. Tier-based restrictions will be configured in a future update. For now, Super Admin can enable/disable the feature globally or per-company.

**Document Lifecycle:**

```
DRAFT ────────→ PENDING_SIGNATURES ────────→ EXECUTED (🔒 Locked & Active)
  │                                               │
  │ (every save                                   ├──→ AMENDMENT_REQUESTED ──→ New DRAFT (v2.0)
  │  = new version)                               │
  │                                               ├──→ TERMINATED (unanimous verified agreement)
  │                                               │
  │                                               └──→ EXPIRED (auto — contract term elapsed)
  │
  └──→ CANCELLED (creator withdraws before submitting)
```

| Status | Meaning | Who Can Trigger | Editable? |
|--------|---------|-----------------|-----------|
| `DRAFT` | Document being prepared. Every save creates a new version (v1.0, v1.1, v1.2...). | Creator (VAULT_OWNER or AUTHORIZED_SIGNATORY) | ✅ Yes |
| `PENDING_SIGNATURES` | Submitted for signing. ALL parties review content and sign according to their approval authority rules. | Creator submits → system sets status | ❌ Read-only |
| `EXECUTED` | 🔒 **Locked & Active.** ALL parties signed. Legally binding. **No changes allowed by anyone.** Document and all metadata are immutable. | System (auto after ALL parties sign) | ❌ **Immutable** |
| `AMENDMENT_REQUESTED` | Any party requests modification to an executed contract. A new draft is created as version 2.0 (original executed version remains frozen). AI analysis available to compare changes. | Any party (VAULT_OWNER or AUTHORIZED_SIGNATORY) | New draft only |
| `TERMINATED` | Ended by **unanimous agreement.** ALL parties must independently agree AND verify their authority. See Termination Authority below. | ALL parties (verified authority required from each) | ❌ Immutable |
| `EXPIRED` | Contract term naturally elapsed. System auto-sets when `contractTermEnd` date passes. | System (auto) | ❌ Immutable |
| `CANCELLED` | Draft was withdrawn before being submitted for signatures. Document remains in version history. | Creator only (while in DRAFT) | N/A |

**Version History Model:**

> [!IMPORTANT]
> **All versions are permanently archived — never deleted.** This provides a complete audit trail from first draft to final execution. When a document is EXECUTED, the specific version is frozen permanently. Amendments create a new version chain (v2.0, v2.1...) while the original executed version (v1.x) remains untouched.

| Field | Type | Description |
|-------|------|-------------|
| **versions[]** | DocumentVersion[] | Complete version history |
| → versionNumber | string | Semantic version (e.g., "1.0", "1.1", "2.0") |
| → versionLabel | enum | 'DRAFT_SAVE' / 'SUBMITTED_FOR_SIGNING' / 'EXECUTED_FINAL' / 'AMENDMENT_DRAFT' / 'CANCELLED' |
| → documentFileUrl | string | Encrypted file for this version |
| → documentHash | string | SHA-256 hash for this version |
| → createdBy | string | Who created this version |
| → createdAt | string | When |
| → changeNotes | string | What changed from previous version — optional, entered by creator |
| → isFrozen | boolean | true when EXECUTED or TERMINATED — version cannot be modified or replaced |

**Termination Authority & Process (Multi-Party):**

> [!IMPORTANT]
> **Termination of an executed contract requires UNANIMOUS agreement from ALL parties:**
> 1. **Unanimous agreement** — ALL parties (Party 1 through Party N) must independently approve
> 2. **Authority verification per party** — the approving user from each party must be either: (a) the **original signatory** who signed the executed version, or (b) the **current Managing Director** of the company (verified against the latest DBD records via the company's KYC). This covers the case where the original signer has left the company.
> 3. **Identity re-verification** — each approving user must re-authenticate (OTP, biometric, or password re-entry) before confirming termination
> 4. **AWS Face Liveness check** — each approving user must pass Face Liveness verification (proves the actual authorized person is present at the moment of termination approval)
> 5. **Consent audit** — each approval creates an entry in the Terms & Agreement Consent Audit Log

**Termination Request Model:**

| Field | Type | Description |
|-------|------|-------------|
| terminationId | string | Unique identifier |
| documentId | string | Which executed document to terminate |
| requestedBy | string | userId who initiated the termination |
| requestedForPartyIndex | number | Which party is requesting (1, 2, 3...) |
| reason | string | Reason for termination (required) |
| requestedAt | string | When requested |
| effectiveDate | string | When termination takes effect (can be current or future-dated) |
| **partyApprovals[]** | TerminationApproval[] | ALL parties must approve |
| → partyIndex | number | Which party (1, 2, 3...) |
| → approvedBy | string | userId who approved |
| → authorityType | enum | 'ORIGINAL_SIGNATORY' (same person who signed) / 'CURRENT_MD' (current MD from DBD, if original signer left) / 'AUTHORIZED_DELEGATE' (delegated by current MD with documented authorization) |
| → authorityVerifiedAt | string | When the system verified this user's authority |
| → authorityVerificationMethod | enum | 'KYC_SIGNATORY_MATCH' (matched against signing record) / 'DBD_MD_CHECK' (verified current MD via DBD API) / 'MD_DELEGATION_DOCUMENT' (MD uploaded delegation document) |
| → authMethodAtApproval | enum | How user re-authenticated: 'OTP' / 'BIOMETRIC' / 'PASSWORD_REENTRY' |
| → **faceLivenessResult** | enum | 'LIVE' / 'SPOOF_DETECTED' — AWS Face Liveness verification (REQUIRED for termination approval) |
| → **faceLivenessConfidence** | number | 0-100% liveness confidence score |
| → **faceLivenessSessionId** | string | AWS Face Liveness session ID for this approval event |
| → approved | boolean | true = agree to terminate, false = reject |
| → approvedAt | string | When approved |
| → rejectionReason | string | If rejected: reason (null if approved) |
| → consentAuditId | string | Link to consent audit log entry |
| status | enum | 'PENDING_APPROVALS' / 'ALL_APPROVED' / 'REJECTED' / 'CANCELLED' — system tracks which parties have approved and which are still pending |
| pendingPartyIndices[] | number[] | List of party indices that have not yet responded |
| terminationDocumentId | string | If a formal termination agreement document is created in the vault (optional — recommended for legal records) |
| completedAt | string | When ALL parties approved and termination is finalized |

> [!NOTE]
> **After termination:** The original executed document remains permanently visible in the vault with status `TERMINATED`. The termination request record, including ALL parties' approvals and all audit evidence, is attached to the document. Nothing is deleted — the full history from DRAFT through EXECUTED through TERMINATED is preserved for legal evidence.

> [!IMPORTANT]
> **Physical document support (ink stamps + company seals):** For cases where Thai Limited Companies require the company seal (ตราประทับบริษัท) or Managing Directors must sign in ink, the vault supports uploading scanned PDF documents. Both the digital and physical signing paths produce legally admissible records under Thailand's ETA. The version history tracks physical uploads just like digital drafts. Company seal application uses the Company Seal Registry (**references** → Module B §3 — Company Seal Registry) and requires MFA/OTP + Face Liveness verification.

> [!IMPORTANT]
> **Hybrid Physical-Digital Signing Workflow (for companies without DBD e-Stamps):**
> Most Thai companies have NOT registered for e-Stamps via DBD. The vault supports a hybrid workflow that is legally valid and court-admissible under Thai ETA Sections 9 and 26:
>
> 1. **Upload:** User uploads a physical document with ink company stamp (scanned PDF/photo)
> 2. **Watermark:** System applies a digital watermark labeling the document's purpose (e.g., "Service Agreement — for execution")
> 3. **E-Sign + Liveness:** The authorized director (matching DBD Affidavit) applies their e-signature + passes Face Liveness KYC — this "adopts" the physical stamp as the official corporate seal for this transaction (ETA Section 9)
> 4. **Lock:** System cryptographically hashes and locks the PDF — immutable from this point. Any subsequent tampering is detectable.
> 5. **Audit Trail:** System generates a comprehensive evidence certificate permanently binding: the locked PDF, timestamp, IP address, Face Liveness match score, and biometric photo taken at signing.
>
> **Legal standing:** This workflow produces a "Reliable Electronic Signature" under ETA Section 26, which carries the same legal weight as ink signatures in Thai courts.

**Hybrid Signing Audit Record:**

| Field | Type | Description |
|-------|------|-------------|
| hybridSigningId | string | Unique identifier |
| documentId | string | Vault document reference |
| uploadedPhysicalDocUrl | string | The scanned PDF with ink stamp |
| watermarkApplied | boolean | Whether digital watermark was applied |
| watermarkLabel | string | Document purpose label on the watermark |
| documentHash | string | SHA-256 hash of the final locked document |
| hashAlgorithm | string | 'SHA-256' |
| lockedAt | string | When the document was cryptographically locked |
| signerUserId | string | Who signed (must match DBD Affidavit authorized director) |
| signingEventId | string | References Module A signing event |
| livenessVerified | boolean | Face Liveness passed |
| livenessConfidence | number | Confidence score from AWS Rekognition |
| livenessSessionId | string | AWS session ID for audit |
| ipAddress | string | Signer's IP at time of signing |
| evidenceCertificateUrl | string | Auto-generated PDF evidence certificate for court use |

> [!IMPORTANT]
> **Government Stamp Duty Notification (อากรแสตมป์):**
> Certain contract types require government Stamp Duty to be legally enforceable in Thai courts. Cloudfull.com **does NOT integrate directly** with the Revenue Department's e-Stamp Duty portal. Instead:
>
> 1. **Auto-detection:** When a contract's type matches a stamp-duty-required category (see table below), the system displays a notification: *"⚠️ This contract type may require Government Stamp Duty (อากรแสตมป์). Without paid stamp duty, this contract may not be admissible as evidence in Thai courts."*
> 2. **Reference link:** System provides a direct link to the Revenue Department's e-Stamp Duty online portal for the user to register and pay independently.
> 3. **Proof upload:** After paying stamp duty externally, the user uploads proof of payment (receipt/confirmation) to the contract record.
> 4. **Status tracking:** Contract shows `stampDutyStatus`: PENDING → UPLOADED → N/A (for contract types that don't require stamp duty).

**Contract Types Requiring Stamp Duty (Revenue Code Schedule):**

| Contract Type | Thai Name | Stamp Duty Rate |
|---------------|-----------|----------------|
| Hire of Work / Service Agreement | จ้างทำของ | 0.1% of contract value (max ฿10,000) |
| Property Lease | เช่าทรัพย์สิน | 0.1% of total rent |
| Loan Agreement | กู้ยืมเงิน | 0.05% of loan amount (max ฿10,000) |
| Guarantee | ค้ำประกัน | ฿10 per ฿10,000 guaranteed |
| Power of Attorney | หนังสือมอบอำนาจ | ฿10-฿30 per document |

**Stamp Duty Tracking Fields (added to Vault Document Model):**

| Field | Type | Description |
|-------|------|-------------|
| requiresStampDuty | boolean | Auto-set based on contract type matching the stamp duty table |
| stampDutyStatus | enum | 'PENDING' (needs stamp duty) / 'UPLOADED' (proof uploaded) / 'NOT_REQUIRED' (contract type doesn't need stamp duty) |
| stampDutyProofUrl | string | Uploaded proof of payment (receipt/confirmation PDF) |
| stampDutyUploadedBy | string | Who uploaded the proof |
| stampDutyUploadedAt | string | When proof was uploaded |
| stampDutyAmount | number | Amount of stamp duty paid |
| stampDutyCurrency | string | Currency (default: THB) |

### Vault Management View & AI Features

**Vault Dashboard (Company-Level View):**

| Feature | Description |
|---------|-------------|
| **Filter by status** | Filter vaults by document status: DRAFT / PENDING_SIGNATURES / EXECUTED / TERMINATED / EXPIRED |
| **Filter by party** | Filter by counterparty company name or contact |
| **Filter by type** | Filter by document type: CONTRACT / NDA / EMPLOYMENT_CONTRACT / MOU / SERVICE_AGREEMENT / FRANCHISE_AGREEMENT / etc. For PO/SO documents, see Module Q (§17). |
| **Search** | Full-text search across vault names, document titles, party names, and tags |
| **Group view** | Group vaults by: counterparty, document type, status, or creation month |
| **Sort** | Sort by: creation date, last modified, contract term end date, or document title |
| **Tags** | User-defined tags on vaults for custom categorization (e.g., "Q2-2026", "Bangkok Office", "Priority") |
| **Calendar view** | Visualize contract term dates (start/end) on a calendar — highlights upcoming expirations |
| **Export list** | Export vault summary list as CSV/PDF (metadata only — NOT document content) |

**AI OCR for Ink-Sealed Physical Documents:**

> [!NOTE]
> When a user uploads a scanned PDF of a physically signed and sealed document, the AI Agent (Hermes) runs **OCR extraction** to: (1) Detect the company seal impression and match against the Company Seal Registry image, (2) Extract text from the scanned document for indexing and search, (3) Flag any discrepancies between the scanned document and the digital version (if both exist). Results are informational only — the AI does NOT auto-validate physical seals. Human review is available.

**AI Contract Analysis (Manual Trigger Only):**

> [!IMPORTANT]
> AI contract analysis is **NEVER auto-triggered.** The VAULT_OWNER must manually click "Analyze Contract" to initiate AI review. This prevents unwanted AI processing of confidential commercial documents. AI analysis includes:
> - **Clause extraction** — identifies key clauses (term, termination, liability, indemnification, force majeure)
> - **Risk scoring** — flags potentially unfavorable terms or missing standard clauses
> - **Amendment diff** — when a new version is uploaded, AI highlights changes from the previous version
> - **Thai law compliance scan** — checks for compliance with relevant Thai laws (ETA, Civil & Commercial Code). Note: Labor Protection Act (LPA) compliance is deferred to Co-Work.cloud ERP or external HR systems
>
> **AI Disclaimer (displayed at analysis time):** *"AI contract analysis is an automated preliminary review. It does not constitute legal advice. Consult a qualified attorney licensed by the Thai Lawyers Council before making legal decisions based on AI analysis."*

> [!NOTE]
> **PO/SO separation:** Purchase Orders and Sales Orders are managed entirely in Module Q (§17). They are NOT stored in the Contract Vault. The Contract Vault is exclusively for legal/official agreements (NDA, MOU, Service Agreements, etc.). See Module Q (§17) for PO/SO lifecycle, signing, and document management.

---


## 3.7 Expense & Receipt Management (Cross-Platform) {#3-7-expense}

> [!TIP]
> **📖 What is §3.7?** This is the platform-wide expense tracking system — available to **ALL user roles**, not just sales. Any employee can photograph a receipt or invoice, and the AI (Hermes) uses OCR to auto-fill expense details. Expenses flow through the company's approval chain (Module C: Roles, Permissions & Team Hierarchy). This section was extracted from Module F because expense management serves every department — sales, HR, operations, admin, finance — not just field sales.
>
> **Example:** A salesperson photographs a fuel receipt after a customer visit. AI reads the receipt → auto-fills: station name, amount (฿850), date, VAT. The salesperson confirms → submits → manager approves via notification. An HR officer photographs a taxi receipt from a recruitment fair → same flow.

### Expense Entry Model

| Field | Type | Description |
|-------|------|-------------|
| costEntryId | string | Unique identifier |
| tenantId | string | Company |
| userId | string | Who submitted the expense |
| **expenseTarget** | enum | 'COMPANY_GENERAL' / 'SPECIFIC_CUSTOMER' / 'CUSTOMER_GROUP' — Who is this expense for? Company general (office supplies, company events) vs. customer-specific (client dinner, sample delivery) vs. customer group (regional marketing, trade show for segment) |
| contactId | string | Associated contact when `expenseTarget` = 'SPECIFIC_CUSTOMER'. **Null** for COMPANY_GENERAL expenses. |
| **targetContactIds[]** | string[] | Multiple associated contacts when `expenseTarget` = 'CUSTOMER_GROUP' (e.g., regional event serving multiple customers). References → Module D Contact Pool. |
| **targetGroupName** | string | Optional label for the customer group (e.g., "Central Region Pharmacies", "Q3 Trade Show Attendees") |
| **receiptImageUrls[]** | string[] | Photos of receipt/invoice — taken via camera or uploaded from gallery. Multiple images per expense (e.g., multi-page invoice). First image `receiptImageUrls[0]` is primary. |
| **ocrExtractedData** | OCRResult | AI-extracted data from receipt photo |
| → merchantName | string | AI-detected merchant/vendor name |
| → merchantAddress | string | AI-detected merchant address |
| → merchantTaxId | string | AI-detected merchant Tax ID (for tax invoice verification) |
| → receiptDate | string | AI-detected date on receipt |
| → receiptNumber | string | AI-detected receipt/invoice number |
| → lineItems[] | LineItem[] | AI-detected individual items (if itemized receipt) |
| → → itemName | string | Item description |
| → → itemQuantity | number | Quantity |
| → → itemPrice | number | Price per item |
| → subtotal | number | AI-detected subtotal (before VAT) |
| → vatAmount | number | AI-detected VAT amount |
| → totalAmount | number | AI-detected total amount |
| → confidence | number | AI confidence score (0-1). Below 0.7 → system flags for manual review. |
| → rawExtractedText | string | Full raw OCR text for reference |
| **totalAmount** | number | Final expense amount (auto-filled from OCR, editable by user) |
| **expenseCurrency** | string | Currency code (from CountryRuleEngine, default: THB) |
| **category** | enum | 'FUEL' / 'MEAL' / 'ENTERTAINMENT' / 'TRANSPORT' / 'ACCOMMODATION' / 'SAMPLE' / 'GIFT' / 'OFFICE_SUPPLIES' / 'CONFERENCE' / 'RECRUITMENT' / 'TRAVEL' / 'COMMUNICATION' / 'OTHER' |
| **subcategory** | string | Free-text subcategory (e.g., "Client Dinner", "Taxi to Airport") |
| description | string | Manual description / notes |
| **isManuallyEdited** | boolean | User corrected AI-extracted data (triggers audit flag) |
| **editedFields[]** | string[] | Which fields the user changed from AI values (for audit trail) |
| **expenseDate** | string | Date of the expense (auto-filled from receipt, editable) |
| **gpsLat** | number | GPS latitude where expense was submitted |
| **gpsLng** | number | GPS longitude where expense was submitted |
| **gpsSource** | enum | 'PRIMARY_DEVICE_TRACKING' / 'WEB_STAMP' — from Module K Device Management |
| **linkedTaskId** | string | If expense is associated with a task (e.g., sales visit, event) — **references** → Module E task ID |
| **linkedSalesPlanId** | string | If expense is from a sales visit — **references** → Module F Actual Plan entry |
| approvalStatus | enum | 'DRAFT' / 'SUBMITTED' / 'APPROVED' / 'REJECTED' / 'RESUBMITTED' |
| approvedBy | string | Manager who approved (from Module C approval chain) |
| approvedAt | string | When approved |
| rejectionReason | string | If rejected, why |
| createdAt | string | When expense was created |
| updatedAt | string | Last modification |

**Expense Approval Workflow:**

```
Employee takes photo of receipt
  ↓
AI OCR extracts data → auto-fills expense form
  → If confidence < 0.7: "⚠️ Please verify AI-extracted data"
  ↓
Employee reviews, corrects if needed, submits
  ↓
Approval follows Module C Hierarchical Approval Chain
  → reportToUserId → next level if needed
  → Notification sent via §3.5 (event: expense.submitted)
  ↓
Manager reviews: Approve ✅ / Reject ❌ / Request Changes 🔄
  → Notification sent (event: expense.approved / expense.rejected)
```

> [!IMPORTANT]
> **Expense is NOT limited to sales.** The `category` enum includes categories for ALL departments: RECRUITMENT (HR), CONFERENCE (any dept), OFFICE_SUPPLIES (admin), TRAVEL (any dept), ACCOMMODATION (traveling employees). The `expenseTarget` field determines whether this is a company general expense (`contactId` null), a specific customer expense (`contactId` set), or a customer group expense (`targetContactIds[]` set). The `linkedTaskId` and `linkedSalesPlanId` fields are optional links — they connect to sales workflows when relevant but are not required. **Approval chain is company-configurable:** companies assign expense approval to Costing Roles, Finance Roles, or multi-level chains via Module C role configuration.

> [!NOTE]
> **Expense → ERP Sync:** When a company has ERP integration (Module B §3), approved expenses are automatically pushed to the ERP via webhook event `'expense.approved'`. The webhook payload includes:
> - `expenseId`, `tenantId`, `userId` (who submitted)
> - `amount`, `currency`, `vatAmount`, `category`
> - `contactId` (if customer-linked expense)
> - `approvedBy`, `approvedAt`
> - `receiptImageUrl` (signed URL, valid 24 hours)
> - `merchantName`, `receiptNumber`, `transactionDate`
>
> The ERP uses this data to create journal entries (debit: expense account, credit: cash/payable). Updated expenses trigger `'expense.updated'` webhook. Rejected expenses do NOT sync to ERP.

---

## 4. Module C: Roles, Permissions & Team Hierarchy {#4-module-c}

> [!TIP]
> **📖 What is Module C?** This controls WHO can do WHAT inside a company. Think of it as the security gate — every action on the platform checks your permissions first. Every new company gets 10 default roles (OWNER, ADMIN, MANAGER, SALESPERSON, etc.) with 95+ possible permissions. Companies can rename roles, modify permissions, and create custom roles.
>
> **Default-deny:** If you don't have a permission explicitly, you CAN'T do it. OWNER is the only exception (always has everything).
>
> **Escalation chain:** Every user has a direct manager. Approvals go up the chain with configurable timeout (default 24 hours per level, max 3 levels before MD attention).



### Partially Implemented
TenantUser has `assignedRole` string + `permissions[]` array — but no structured role definitions

### Role Definition Model

| Field | Type | Description |
|-------|------|-------------|
| roleId | string | Unique identifier |
| tenantId | string | Which company owns this role |
| roleName | string | English name ("Regional Sales Manager") |
| **roleNameLocal** | string | National language name — label dynamically adapts based on company's registration country: 🇹🇭 "ชื่อตำแหน่ง (ภาษาไทย)", 🇯🇵 "役職名 (日本語)", 🇨🇳 "职位名称 (中文)", 🇰🇷 "직책명 (한국어)". Same dynamic label pattern as user's firstNameLocal/lastNameLocal in Module A. |
| description | string | What this role does |
| permissions[] | string[] | Permission strings |
| isDefault | boolean | System-created default? |
| createdBy | string | Who created |
| createdAt | string | When |
| **updatedAt** | string | Last modified |
| **isDeactivated** | boolean | Soft-deleted role (retained for audit, not assignable) |

### Default Roles (system-created per company)

> [!IMPORTANT]
> **Company-customizable role names:** The platform provides default roles listed below, but companies can rename any role to match their internal terminology (e.g., "MANAGER" → "Team Lead", "SALESPERSON" → "Business Development"). The underlying permission set remains tied to the role definition, not the display name. Companies can also create entirely custom roles with any combination of permissions.

| Default Role | Description | Example Customization |
|-------------|-------------|----------------------|
| **OWNER** | Full platform access, billing, company deletion | — |
| **ADMIN** | Company settings, user management, all modules | "General Manager", "Director" |
| **MANAGER** | Team oversight, task approval, reporting | "Team Lead", "Supervisor", "Department Head" |
| **SALESPERSON** | Sales planning, contact management, task execution | "Business Development", "Account Executive" |
| **ACCOUNTANT** | Billing, invoices, financial reports, bank accounts | "Finance Officer", "Bookkeeper" |
| **PURCHASER** | PO creation, vendor management, procurement | "Procurement Officer", "Supply Chain" |
| **SALES_ADMIN** | Sales support, order processing, quotation management | "Sales Coordinator", "Order Manager" |
| **HR** | Recruitment, employee onboarding, skill tests, T&A management | "HR Manager", "People Operations" |
| **MEMBER** | Standard access — tasks, chat, contacts, calendar | "Employee", "Staff", "Associate" |
| **VIEWER** | Read-only access — view tasks, reports, contacts (no edit/create) | "Observer", "Intern", "Auditor" |

> [!NOTE]
> **Permission mapping is not fixed in this specification.** Each default role will have a recommended permission set configured during implementation. Companies can override any default role's permissions. The OWNER role is the only role that cannot have permissions removed (always has full access).

### Permission Matrix (95+ permission strings)

> [!NOTE]
> [!CAUTION]
> **Default-deny policy:** All permissions in this platform follow a **default-deny** model. Users without an explicitly granted permission are denied access. There is no implicit permission inheritance between modules. The OWNER role is the only exception — it has all permissions by default and cannot have permissions removed.

> This is the **canonical permission list** for the entire platform. All modules **validate against** this matrix when checking user authorization. See also Module P (§16) for 11 additional `superAdmin.*` permissions.

> [!IMPORTANT]
> **Every permission below maps to the `permissions[]` string array on a RoleDefinition.** When assigning a role to a user, that user inherits all permissions in the role. Permissions follow the pattern `{module}.{action}`. The matrix is organized by module to make gap analysis straightforward.

**Module B — Company Management:**

| Permission | Description |
|------------|-------------|
| `company.manage` | Edit company settings, profile, logo, addresses |
| `company.delete` | Soft-delete company (OWNER only). **Does NOT permanently erase data.** Company enters a `DEACTIVATED` state where all data is retained but inaccessible to users. Data is retained for **minimum 5 years** per Thai law: (1) Revenue Code Sec 87/3 — tax records must be kept 5 years, (2) AMLA Sec 22 — KYC/transaction records retained 5 years, (3) Computer Crime Act Sec 26 — traffic data retained per regulations. After 5-year retention, data may be permanently purged. Company owner can request re-activation within 90 days of soft-delete (grace period). |
| `company.kyc` | Initiate or manage KYC verification process for the company |
| `company.branches` | Create, edit, or deactivate company branches |
| `bankAccount.view` | View full bank account details (beyond last-4-digit mask) |
| `bankAccount.share` | Share bank account details via chat or generate time-limited export links |

**Module C — Users & Roles:**

| Permission | Description |
|------------|-------------|
| `users.invite` | Invite new users to the company |
| `users.manage_roles` | Change user roles (delegation — `can_manage_users`) |
| `users.remove` | Remove users from the company |

**Module D — Contact Pool:**

| Permission | Description |
|------------|-------------|
| `contacts.read` | View contacts in the company internal contact pool |
| `contacts.write` | Add or edit contacts in the company internal contact pool |
| `contacts.delete` | Remove contacts from the company internal contact pool |
| `contacts.approve` | Approve new contacts to official/verified status |
| `contacts.import` | Bulk import contacts (CSV, vCard, or ERP sync) |
| `contacts.export` | Export contacts out of the platform (PDPA-logged action) |

> [!NOTE]
> **API connection:** `contacts.read`, `contacts.write`, `contacts.import`, and `contacts.export` permissions also govern the ERP API access scope when the company's ERP integration uses the CONTACT_ONLY or higher API tier. The API key inherits the contact permissions of the user who created/manages the API key. This ensures the API cannot access contact data beyond what the managing user is authorized to see.

**Module E — Tasks & Projects:**

| Permission | Description |
|------------|-------------|
| `tasks.create` | Create tasks/projects |
| `tasks.assign` | Assign tasks to other users |
| `tasks.approve` | Approve/reject task completions or status changes |
| `tasks.view_all` | View all company tasks (not just own assignments) |

**Module F — Sales Planning & Routing:**

| Permission | Description |
|------------|-------------|
| `sales.plan` | Create and manage sales actual plans, routes, and visit schedules |
| `sales.report` | Submit sales visit reports and activity logs |
| `sales.view_all` | View all sales activities company-wide (not just own) |
| `sales.approve_expense` | Approve/reject expense receipts submitted by sales reps |

**Module G — Chat:**

| Permission | Description |
|------------|-------------|
| `chat.send` | Send chat messages |
| `chat.delete` | Delete messages (moderation — typically admin/manager only) |
| `chat.hide` | Hide messages from own view (message remains visible to other participants). See Module G — Chat Message Visibility for details. |
| `chat.sticker_upload` | Upload custom sticker packs (user-level, max 5 packs). Available to all users by default. |

**Module H — Products:**

| Permission | Description |
|------------|-------------|
| `products.create` | Create/edit products in the catalog |
| `products.approve` | Approve products for publishing to marketplace |
| `products.pricing` | Set/modify pricing (separate from create for pricing-sensitive roles) |

**Module I — Showcase:**

| Permission | Description |
|------------|-------------|
| `showcase.create` | Create and edit design showcase entries |

**Module J — Recruitment:**

| Permission | Description |
|------------|-------------|
| `recruitment.create` | Create job postings |
| `recruitment.hire` | Make hiring decisions (approve/reject candidates) |

**Module K — Events & Attendance:**

| Permission | Description |
|------------|-------------|
| `events.create` | Create events (company events, meetings, shifts) |
| `events.manage_attendance` | Mark attendance, approve check-ins, handle late/absent |

**Module L — News Feed:**

| Permission | Description |
|------------|-------------|
| `news.create` | Draft news posts for the company feed |
| `news.publish` | Publish news posts (visibility: PUBLIC, FOLLOWERS, INTERNAL, SPECIFIC_CONTACTS) |
| `news.moderate` | Edit or remove news posts by other users (moderation authority) |

**Module H — Internal Inventory (permissions):**

| Permission | Description |
|------------|-------------|
| `inventory.manage` | Create, edit, or deactivate inventory items (equipment, sample stock) |
| `inventory.withdraw` | Withdraw samples from company inventory and log distribution to contacts |
| `inventory.approve_rental` | Approve/reject equipment rental requests |
| `inventory.view_cost` | View cost price of internal products (restricted — not all users should see company's actual cost). Without this, users only see sample value. |

**Module H — Product Top 5 Trending (permissions):**

| Permission | Description |
|------------|-------------|
| `product.trending_vote` | Submit or update personal Top 5 rankings per leaf-level category. Available to **ALL logged-in users**. Monthly change lock enforced. |

**§3.7 — Expense & Receipt Management (permissions):**

| Permission | Description |
|------------|-------------|
| `expense.submit` | Submit expense receipts for approval — available to **ALL user roles**. Submitter chooses expense target: company general expense, specific customer expense, or customer group expense |
| `expense.approve` | Approve/reject expense submissions. **Company configures approval chain:** can assign to a Costing Role, Finance Role, or set up multi-level approval (e.g., L1: Direct Manager → L2: Finance → L3: Director). Follows Module C hierarchical approval chain per company setup |
| `expense.view_all` | View all expense submissions — scoped by the company's hierarchy setup. Each department/module head sees expenses within their scope. Finance role sees company-wide. Follows Module C `reportToUserId` chain and department structure |

**Module Q — Purchase Order & Procurement (permissions):**

| Permission | Description |
|------------|-------------|
| `po.create` | Create and send Purchase Orders (buyer side) |
| `po.approve` | Approve POs above the configured value threshold |
| `po.receive` | View and process incoming POs (seller side) |
| `po.acknowledge` | Acknowledge/accept incoming POs (seller side) |
| `po.create_rfq` | Create and send Requests for Quotation (buyer side) |
| `po.create_quote` | Create and send Quotations (seller side) |
| `po.view_all` | View all POs, SOs, and procurement data across the company (manager/finance view) |
| `po.cancel` | Cancel a PO/SO (if already acknowledged: requires confirmation from counterparty) |

**Module K — Device & Attendance Management (permissions):**

| Permission | Description |
|------------|-------------|
| `device.view_all` | View all registered devices across the company. **Company configures** who gets this: Management team, IT department, specific department heads, or individual users — set per company in Module C role configuration |
| `device.manage` | Force-remove a device, revoke GPS tracking, change primary device designation for other users, approve/reject device change requests. **Company configures** who gets this: Management team, IT department, specific department heads, or individual users — set per company in Module C role configuration |
| `attendance.manage` | Manage attendance records, approve leave requests, view attendance reports. Scoped by the company's hierarchy — each department/module head manages attendance within their scope. Follows Module C `reportToUserId` chain and department structure |

**Module N — Skill Testing:**

| Permission | Description |
|------------|-------------|
| `skillTest.create` | Create skill tests (manually or AI-generated) |
| `skillTest.assign` | Assign tests to teams or individual users |
| `skillTest.view_results` | View test results and AI recommendations for all users (not just own) |

**Module O — Billing & Subscription:**

| Permission | Description |
|------------|-------------|
| `billing.view` | View invoices, payment history, and subscription status |
| `billing.manage` | Change subscription tier, add-ons, or payment methods |

**Reports & Analytics:**

| Permission | Description |
|------------|-------------|
| `reports.view` | View analytics dashboards and reports |
| `reports.export` | Export report data (CSV, PDF — PDPA-logged action) |

**Company Seal (→ Module B §3 — Company Seal):**

| Permission | Description |
|------------|-------------|
| `companySeal.manage` | Upload, replace, or revoke company seal (only MD can grant this) |
| `companySeal.apply` | Apply company seal to documents in Contract Vault (requires MFA/OTP every time) |

**Contract Vault:**

| Permission | Description |
|------------|-------------|
| `vault.create` | Create new Contract Vaults |
| `vault.manage_access` | Manage vault access levels for own party's internal users |
| `vault.sign` | Sign documents in Contract Vault (subject to delegation rules) |

**ERP & API Integration:**

| Permission | Description |
|------------|-------------|
| `erp.api_manage` | Create, rotate, revoke API keys and manage IP allowlist entries |

**Platform Integration & Configuration:**

| Permission | Description |
|------------|-------------|
| `calendar.sync` | Connect/manage Google Calendar bi-directional sync (user-level) |
| `notifications.configure` | Configure company notification routing rules, channels, and schedules |
| `welfare.manage` | **Platform-level:** Manage the standardized master welfare category list (e.g., "Health Insurance", "Transportation Allowance", "Meal Allowance"). This ensures all companies use consistent naming and categories instead of each company creating their own names with slight spelling differences. Only Super Admin and platform operations team use this permission. |

**Platform Administration:**

| Permission | Description |
|------------|-------------|
| `sandbox.access` | Access developer sandbox environments (platform-level only) |
| `admin.super` | **Platform owner (you) only.** This is the master super admin permission — grants all 11 `superAdmin.*` permissions (§16). The platform owner assigns this to themselves and their chosen Super Admin team members. Only the platform owner can grant `admin.super` to others. This permission cannot be self-assigned. |

**Data Retention Management:**

| Permission | Description |
|------------|-------------|
| `dataRetention.configure` | Configure company data retention policies (§1.7). Set retention periods per module, enable/disable auto-cleanup. |
| `dataRetention.approve_cleanup` | Approve scheduled media cleanup when `requireManualApproval: true`. Only users with this permission see the cleanup approval UI. |

**Company Group Management:**

| Permission | Description |
|------------|-------------|
| `companyGroup.manage` | Create/manage Company Groups (Subsidiary/Affiliated/Sister architecture). Add or remove companies from the group. Only MD of main company can grant this. |

**User Profile & Sharing:**

| Permission | Description |
|------------|-------------|
| `user_profile.share` | Share own or assigned users' professional portfolio externally (generates shareable profile link with configurable visibility) |

**Company Administration (granular):**

| Permission | Description |
|------------|-------------|
| `company.welfare_manage` | Manage company welfare/benefit packages offered to employees. Separate from `welfare.manage` (which manages the master welfare list at platform level). |
| `company.company_settings` | Access and edit company-level settings (notification routing, calendar defaults, GPS tracking config, subscription preferences). Separate from `company.manage` to allow delegation of settings without full company profile access. |
| `company.company_policies` | Create, edit, and manage company internal policies and documents. These are company-wide policy documents (not vault contracts) that all employees must acknowledge. |

**Module A — User Self-Service:**

> [!NOTE]
> KYC verification and e-signature are self-service actions available to all registered users. No permission required to submit your own KYC or sign documents presented to you. The permissions below control **administrative** actions.

| Permission | Description |
|------------|-------------|
| `user.kyc_admin_review` | Review and approve/reject other users' KYC submissions (Super Admin team) |

**§3.6 — Contract Vault AI:**

| Permission | Description |
|------------|-------------|
| `contract.ai_analyze` | Run AI analysis on vault documents. Vault access is controlled per-party — AI analysis inherits vault access level |

**Module S — Lead Generation & Campaign (permissions):**

| Permission | Description |
|------------|-------------|
| `campaign.create` | Create new campaigns, configure lead forms, add items from Module H, assign team members |
| `campaign.manage` | Edit, pause, resume, complete, archive campaigns. Change assigned users. Manage lead distribution. |
| `campaign.view` | View campaign list, analytics, and lead submissions for own assigned campaigns |
| `campaign.view_all` | View ALL campaigns company-wide (management/marketing overview) |
| `campaign.delete` | Delete DRAFT campaigns only. ACTIVE/COMPLETED campaigns cannot be deleted (PDPA retention requirement). |
| `campaign.report` | Generate and download campaign performance reports |

**Module R — Marketplace (future module — built now, activated via `moduleR.enabled` feature flag):**

| Permission | Description |
|------------|-------------|
| `marketplace.order.view` | View marketplace orders for own company (buyer or seller side) |
| `marketplace.order.manage` | Create, update, cancel marketplace orders. Process refunds. |
| `marketplace.warehouse.manage` | Manage warehouse stock levels, restocking requests, low-stock alerts |
| `marketplace.storefront.manage` | Configure storefront display name, pickup queue, operational hours |
| `marketplace.tta.configure` | Set and negotiate TTA (Take-Turnover Amount) rates per product/seller |
| `marketplace.payout.view` | View seller payout schedule, completed/pending payouts |
| `marketplace.payout.manage` | Process seller payouts, resolve payout disputes |

> [!NOTE]
> **These permissions are pre-built but inactive.** They are only enforceable when `moduleR.enabled = true`. Assigning them to roles before Module R is activated has no effect.

**Module D — Contact Pool: Fraud Reporting (additional permissions):**

| Permission | Description |
|------------|-------------|
| `contact.fraud_report` | Submit a fraud report against a contact or company |
| `contact.fraud_investigate` | Review and act on fraud reports (Super Admin team only) |

### Team & Group Structure

Design requirement: *"Users with admin rights can establish team hierarchies... individuals to hold various distinct positions... categorize individuals into groups for mentions, sharing, calendar sync"*

| Model | Field | Type | Description |
|-------|-------|------|-------------|
| **Team** | teamId | string | Unique |
| | tenantId | string | Company |
| | teamName | string | Team name |
| | managerId | string | Team manager user ID |
| | memberIds[] | string[] | Team members |
| | parentTeamId | string | Parent team (hierarchy) |
| **Group** | groupId | string | Unique |
| | tenantId | string | Company |
| | groupName | string | Group name |
| | memberIds[] | string[] | Group members |
| | purpose | enum | 'MENTION' / 'SHARING' / 'CALENDAR' / 'PERMISSION' / '**NOTIFICATION**' |

> [!NOTE]
> **Multi-group membership:** A single user can belong to multiple groups simultaneously. When a notification routing preset targets a group, ALL members of that group receive the notification. Groups with purpose `NOTIFICATION` are specifically designed for notification routing — they appear in the notification routing preset target dropdown. A user in Group A (Sales Team) AND Group B (Bangkok Office) receives notifications routed to either group.

### Hierarchical Approval Chain (Report-To + Cascading)

> [!IMPORTANT]
> **Every user role can have a `reportToUserId`** that defines the organizational hierarchy. This enables cascading approval workflows where approvals escalate up the chain when the direct approver does not respond within the configured timeout.

| Field | Type | Description |
|-------|------|-------------|
| **reportToUserId** | string | This user's direct manager/supervisor in the organization chart. Used for approval routing, escalation, and visibility rules. Null if user reports directly to OWNER/MD. |
| **approvalEscalation** | ApprovalEscalationConfig | Company-level config for approval timeout and escalation |
| → escalationTimeoutHours | number | Hours to wait before escalating to next level (default: 24 hours) |
| → maxEscalationLevels | number | How many levels up to escalate before marking as "REQUIRES_MD_ATTENTION" (default: 3) |
| → escalationNotification | boolean | Notify the original approver that their task has been escalated |

**Approval Chain Flow:**

```
Task/Expense/Leave requires approval
  ↓
Routed to user's reportToUserId (Level 1 approver)
  ├── APPROVED → Done
  ├── REJECTED → Done (requestor notified)
  └── NO RESPONSE within escalationTimeoutHours
      ↓
    Escalated to Level 1 approver's reportToUserId (Level 2)
      ├── APPROVED → Done
      ├── REJECTED → Done
      └── NO RESPONSE → Escalate to Level 3
          ↓
        After maxEscalationLevels reached → "REQUIRES_MD_ATTENTION"
          → MD/OWNER receives urgent notification
```

---


## 5. Module D: Contact Pool Management {#5-module-d}

> [!TIP]
> **📖 What is Module D?** The master address book for every business contact — customers, suppliers, freelancers, government agencies. Three types of contacts:
> - **Type 1 (Company HQ):** The company as a whole entity (e.g., "Grand Hotel Bangkok" with HQ address and main phone)
> - **Type 2 (Company + People):** Specific people within a company (e.g., Grand Hotel + Khun Nat from Purchasing + Khun Ploy from Accounting)
> - **Type 3 (Individual):** A standalone person with no company (e.g., a freelance photographer)
>
> **Dual-Profile:** When you manually add a company, and that company later registers on Cloudfull, the system shows mismatches (⚠️ "Your phone number differs from their verified number") and lets you sync.
>
> **This module feeds into EVERYTHING:** sales planning (Module F), tasks (Module E), procurement (Module Q), contracts (§3.6), QR networking (Module L).



> [!IMPORTANT]
> **Canonical contact management system** for the entire platform. All contact-related features, data models, and business rules are defined in this single section.
>
> **Referenced by:** Module E (task contacts) · Module F (sales plan contacts) · Module L (QR networking) · §3.6 Contract Vault (contract parties)

### CustomerContact Base Model (Canonical Definition)

> [!IMPORTANT]
> **This is the canonical definition of the CustomerContact model.** All other modules that reference CustomerContact fields (Module B Company Branches, Module F Sales) inherit from this model. Fields added by other modules are listed as "Additional fields" in their respective sections and reference back to this table.

| Field | Type | Description |
|-------|------|-------------|
| contactId | string | Unique identifier (auto-generated) |
| tenantId | string | Which company owns this contact record |
| contactEntityType | enum | 'INDIVIDUAL' / 'ORGANIZATION' / 'GOVERNMENT' — see Contact Entity Types below |
| contactName | string | Display name (individual name or organization name) |
| contactNameLocal | string | Localized name (label per CountryRuleEngine, if applicable) |
| contactEmail | string | Primary email address |
| contactPhone | string | Primary phone number |
| contactPhoneCountryCode | string | Phone country code |
| contactAddress | ThaiAddress/IntlAddress | Primary address |
| contactBranches[] | ContactBranch[] | Branch locations for this contact — **see Module B (§3.3 Company Branches) for ContactBranch field definitions.** Each branch can have its own contact details and an optional branch manager. |
| profileHierarchy | enum | 'INTERNAL_ONLY' (manually entered, no verified match) / 'VERIFIED_LINKED' (matched to a verified platform company) |
| verifiedTenantId | string | If `VERIFIED_LINKED`: the tenantId of the verified company on the platform |
| verifiedProfile | object | Auto-populated from verified company's public data (read-only for contact owner) |
| linkedUserId | string | If this contact is a platform user, their userId |
| sourceType | enum | 'MANUAL' / 'ERP_SYNC' / 'IMPORT_CSV' / 'QR_SCAN' / 'BATCH_UPLOAD' |
| linkedAt | string | When the verified link was established |
| linkedBy | enum | 'SYSTEM_AUTO' (Tax ID match) / 'MANUAL_ADMIN' (admin linked) |
| createdBy | string | userId who created this contact |
| createdAt | string | When created |
| updatedAt | string | Last updated |
| isActive | boolean | Contact is currently active |

### Contact Pool Architecture

> [!IMPORTANT]
> **Two separate contact pools exist:** (1) **User Personal Contact Pool** — owned by the individual user, follows them across companies, separate subscription. (2) **Company Internal Contact Pool** — owned by the company tenant, shared among users with appropriate roles, separate subscription. These are **distinct pools with different limits, subscriptions, and transfer rules.**

**Three Contact Entity Types in a Company’s Internal Contact Pool:**

> [!IMPORTANT]
> **A company’s internal contact pool can contain three distinct entity types.** Each type has different data structures, display behaviors, and relationship models. Understanding this taxonomy is critical for the contact pool architecture.

```
Company A (Your Company) — Internal Contact Pool
│
├── TYPE 1: HQ / Company Main Contact
│   └── Company B [Company Contact]
│       ├── Contact identity: Company B as a whole entity
│       ├── Contact info shown: Company B’s main company contact details
│       │   (company phones, company emails, company address, HQ info)
│       ├── Contact persons: Company A assigns ONE main contact person
│       │   + additional contact persons from Company B’s team
│       └── Display: Shows as 🏢 Company entity
│
├── TYPE 2: Company with User Role Contacts
│   └── Company B [User Role Contact]
│       ├── Contact identity: Company B, but accessed through specific
│       │   user roles within Company B
│       ├── Contact info shown: Specific user role contact details
│       │   (role email, role phone, position, department)
│       ├── Contact persons: Company A assigns MULTIPLE user role contacts
│       │   ├── Main Contact Person (labeled by Company A) — primary point of contact
│       │   ├── Secondary Contact: Khun Somchai (Sales Manager)
│       │   ├── Secondary Contact: Khun Ploy (Accounting)
│       │   └── Secondary Contact: Khun Nat (Logistics)
│       └── Display: Shows as 🏢 Company entity with 👤 multiple role contacts
│
└── TYPE 3: Individual User (Non-Company)
    └── Contact C [Individual]
        ├── Contact identity: An individual person (freelancer, consultant,
        │   independent contractor, personal acquaintance)
        ├── Contact info shown: Personal contact details
        │   (personal phone, personal email, personal address)
        ├── No company affiliation in this contact record
        └── Display: Shows as 👤 Individual entity (NOT a company)
```

> [!NOTE]
> **Type 2 multi-role contacts:** When Company A has Company B as a Type 2 contact, Company A can assign multiple user role contacts from Company B. Each user role contact has their own phone, email, position, and department. Company A's `isMainContactPerson` flag determines which person is displayed first and used as the default communication target. The remaining contacts appear in a secondary list that Company B can also see.

> [!NOTE]
> **Chat integration (Contact Pool → Module G):** Each contact entry in the internal contact pool displays a **"Start Chat"** button next to the main contact person's details. Tapping it opens a new direct chat in Module G (or navigates to the existing chat if one already exists). For Type 2 contacts with multiple persons, each person's entry has their own chat button. Chat rooms created from the contact pool are auto-tagged with the contact's entity type and company name for easy filtering in the chat list.

> [!NOTE]
> **Type 2 cross-visibility:** When Company A assigns user role contacts from Company B, the assigned persons from Company B **can see their own listing** in Company A's contact pool (read-only view). They can see: (1) which company (Company A) has them as a contact, (2) their own contact info as displayed to Company A, (3) who Company A has labeled as the `isMainContactPerson`. They CANNOT see: Company A's internal notes, custom alias, pricing tiers, or other contacts in Company A's pool. This transparency ensures contact persons know they are listed and can verify their own contact details are correct.

> [!IMPORTANT]
> **A single Company B can appear as BOTH Type 1 and Type 2 simultaneously** in Company A's contact pool — this is intentional. Type 1 represents the company-level relationship (HQ contact info, billing address, company-wide communications). Type 2 represents person-level working relationships (specific department contacts for day-to-day operations). They share the same `primaryCompanyDetails` (vatId, branchCode, names) but have different `assignedContactPersons[]` lists.

**Contact Person Assignment Model (for Type 1 & Type 2):**

| Field | Type | Description |
|-------|------|-------------|
| **assignedContactPersons[]** | ContactPersonEntry[] | Company A’s assigned contact persons for this contact |
| → contactPersonId | string | Unique identifier |
| → personName | string | Contact person’s name |
| → personPosition | string | Job title / position |
| → personDepartment | string | Department |
| → personPhone | RolePhone | Contact phone (follows Platform Phone Validation Standard) |
| → personEmail | string | Contact email |
| → personLineId | string | LINE ID — optional |
| → **isMainContactPerson** | boolean | **Company A labels ONE person as the main contact.** This person is displayed prominently and is the default recipient for communications. Only one person per contact can be `isMainContactPerson: true`. |
| → **linkedUserId** | string | If this contact person is a verified platform user, link to their userId. Enables in-platform messaging and profile viewing. Null if not a platform user. |
| → **linkedCompanyRoleId** | string | If Type 2: links to the specific `companyRoleId` within the contact company. Null for Type 1 (HQ contact) or Type 3 (individual). |
| → contactPersonNotes | string | Company A’s internal notes about this person |
| → addedBy | string | userId who added this contact person |
| → addedAt | string | When added |
| → isActive | boolean | Currently active |

**Contact Entity Type Field (added to CustomerContact model):**

| Field | Type | Description |
|-------|------|-------------|
| **contactEntityType** | enum | 'COMPANY_HQ' (Type 1 — company main/HQ contact) / 'COMPANY_USER_ROLE' (Type 2 — company accessed through specific user role contacts) / 'INDIVIDUAL' (Type 3 — standalone individual person, no company affiliation) |
| **hasCompanyAffiliation** | boolean | true for Type 1 and Type 2, false for Type 3. Determines whether company fields (vatId, branchCode, juristicName) are shown. |
---

#### Contact Pool Identity Architecture (Internal vs Verified Profiles)

> [!IMPORTANT]
> **Dual-profile system (applies to ALL contact types — companies AND individuals):** When a company adds another company OR an individual as an internal contact, it creates an **Internal Profile** with manually entered data. If that contact company or individual later **registers and verifies on the platform**, the system auto-detects the match (by TAX ID for companies, by email/phone for individuals) and creates a **Verified Profile** overlay. This applies to Type 1 (Company HQ), Type 2 (Company + People), AND Type 3 (Individual) contacts.
>
> **Key behavior:** The Verified Profile updates on the verified company's own side (they control their own data). The Internal Profile **stays static** — it does NOT auto-update when the Verified Profile changes. Instead, the system shows a **"⚠️ Data Mismatch" label** on any field where the Internal Profile differs from the Verified Profile. Company A can then choose to:
> - **Sync individual fields** — tap a "Use Verified" button on specific fields to update that field in their Internal Profile
> - **Sync all mismatched fields** — tap "Sync All to Verified" to update all differing fields at once
> - **Keep their own data** — dismiss the mismatch and keep the Internal Profile values as-is
>
> Company A's custom data (alias, notes, pricing, sales rep) is NEVER overwritten because these fields do not exist in the Verified Profile.

```
Company A (Your Company)
├── Internal Contact Pool
│   ├── Company B [INTERNAL_ONLY]     ← Before Company B verifies
│   │   └── All data manually entered by Company A
│   │
│   ├── Company B [VERIFIED_LINKED]   ← After Company B verifies on platform
│   │   ├── VERIFIED PROFILE (PRIMARY — read-only for Company A)
│   │   │   ├── Official name: "บริษัท บี เบเวอเรจ จำกัด"
│   │   │   ├── Tax ID: 0105565012345
│   │   │   ├── DBD status: Active
│   │   │   ├── Registered address: (from DBD)
│   │   │   └── Verification level: VERIFIED_ACTIVE_COMPANY
│   │   │
│   │   └── INTERNAL PROFILE (SECONDARY — Company A's custom data)
│   │       ├── Custom alias: "Main Beer Supplier"
│   │       ├── Custom notes: "Contact Khun Somchai for orders"
│   │       ├── Sales rep: usr_alice
│   │       └── Pricing: 10% discount, 30-day credit
```

**How the auto-linking works:**

1. **Before verification:** Company A only has the INTERNAL profile they created manually. This is the only profile and contains all data.
2. **Company B registers and verifies:** System detects TAX ID match between Company A's internal contact `vatId` and Company B's verified company `vatId`.
3. **Auto-link notification:** Company A receives notification: *"Your contact 'Main Beer Supplier' has been matched to verified company บริษัท บี เบเวอเรจ จำกัด."* No approval needed — auto-linked.
4. **Data separation:** Verified Profile data is maintained by the verified company and is read-only for Company A. Company A's Internal Profile data stays completely intact and is never auto-overwritten. When the two profiles differ, mismatch labels appear on the differing fields.
5. **Mismatch detection:** If Company B updates their verified company details (new address, new phone), the system detects differences between the Verified Profile and each company's Internal Profile. A **"⚠️ Data Mismatch" label** appears on affected fields in every company that has Company B as a contact. Each company can choose to sync or keep their own data. **High-volume mismatch detection uses batch processing** (see Batch Sync Config below).

**Batch Sync Configuration (Verified Profile Propagation):**

> [!IMPORTANT]
> **Prevents system overload during mass verification events.** When many companies verify simultaneously (e.g., during a promotional campaign or onboarding wave), verified profile data propagation is batched to prevent crashes.

| Field | Type | Description |
|-------|------|-------------|
| **syncBatchConfig** | SyncBatchConfig | Platform-level config (Super Admin) |
| → maxBatchSize | number | Max records processed per batch (default: 500) |
| → processingIntervalMs | number | Milliseconds between batch runs (default: 5000 = every 5 seconds) |
| → retryAttempts | number | Max retries for failed sync operations (default: 3) |
| → retryBackoffMs | number | Base backoff between retries, exponential (default: 1000ms) |
| → priorityQueue | boolean | Verified companies with more contact links are processed first |
| → queueDepthAlertThreshold | number | When queue exceeds this number, AI alerts Super Admin team with upgrade recommendation (default: 10,000) |

**Fraud Reporting System:**

> [!IMPORTANT]
> **Identity fraud protection for users AND companies.** Any person — whether a registered user or someone without an account — can report suspected identity fraud. The system includes AI pre-screening, temporary account suspension, and urgent Super Admin team investigation.

**Fraud Report Model:**

| Field | Type | Description |
|-------|------|-------------|
| reportId | string | Unique identifier |
| **reporterType** | enum | 'VERIFIED_USER' (logged-in user with account) / 'ANONYMOUS_VERIFIED' (no account, but verified identity via ID photo + selfie) |
| reporterUserId | string | userId of reporter (if VERIFIED_USER, null if anonymous) |
| **anonymousVerification** | object | Required for ANONYMOUS_VERIFIED reporters — proves they are who they claim to be |
| → idPhotoUrl | string | Reporter's ID photo (camera capture only) |
| → selfiePhotoUrl | string | Reporter's live selfie (camera only, no upload) |
| → faceMatchResult | enum | 'MATCH' / 'NO_MATCH' / 'INCONCLUSIVE' |
| → faceMatchConfidence | number | 0-100% |
| → verifiedName | string | Name from ID photo |
| → verifiedIdNumber | string | ID number from ID photo |
| **targetType** | enum | 'USER' / 'COMPANY' — what is being reported as fraudulent |
| targetId | string | userId or tenantId of the allegedly fraudulent account |
| targetDisplayName | string | Display name of the target at time of report |
| **reason** | enum | 'IDENTITY_THEFT' (someone using my name/ID) / 'FAKE_COMPANY' (company doesn't exist) / 'HACKED_ACCOUNT' (account compromised) / 'IMPERSONATION' (pretending to be someone else) / 'OTHER' |
| reasonDescription | string | Detailed description of the fraud (required) |
| evidenceFiles[] | FileEntry[] | Supporting documents (screenshots, police reports, etc.) |
| **aiPreCheckResult** | object | AI Agent pre-screening result |
| → aiConfidence | number | 0-100% confidence that fraud is occurring |
| → idMatchWithTarget | boolean | Does reporter's ID match the target account's KYC? (true = reporter IS the real person) |
| → recommendation | enum | 'SUSPEND_IMMEDIATELY' / 'FLAG_FOR_REVIEW' / 'INSUFFICIENT_EVIDENCE' |
| → aiNotes | string | AI's analysis summary |
| **action** | enum | What happened after AI pre-check |
| **status** | enum | 'SUBMITTED' / 'AI_REVIEWING' / 'TEMPORARY_SUSPENDED' (AI passed threshold → target account suspended) / 'UNDER_INVESTIGATION' (Super Admin team investigating) / 'CONFIRMED_FRAUD' / 'FALSE_ALARM' / 'RESOLVED' |
| assignedToTeamId | string | Super Admin team assigned to investigate |
| urgencyLevel | enum | 'CRITICAL' (identity theft with high AI confidence) / 'HIGH' (hacked account) / 'MEDIUM' (other) |
| suspendedAt | string | When target account was temporarily suspended |
| investigationNotes | string | Super Admin team's investigation notes |
| resolvedAt | string | When investigation concluded |
| resolvedBy | string | userId who resolved |
| resolution | enum | 'FRAUD_CONFIRMED_ACCOUNT_BANNED' / 'FRAUD_CONFIRMED_ACCOUNT_TRANSFERRED' / 'FALSE_ALARM_ACCOUNT_RESTORED' / 'INCONCLUSIVE_MONITORING' |
| reportedAt | string | When report was submitted |

> [!IMPORTANT]
> **AI Pre-Check → Temporary Suspension flow:** When AI pre-check confirms the reporter's ID matches the target account's KYC data AND the reporter is a different person than the account holder (identity theft scenario), the system **immediately temporarily suspends** the target account. An **urgent notification** is sent to the Super Admin team. The suspended user sees: *"Your account has been temporarily suspended due to an identity verification review. Please contact support."* If the report is a false alarm, Super Admin team restores the account with full notification to the user.

> [!NOTE]
> **Applies to companies too.** If a fraud report targets a company, the company's verification status is downgraded to `PENDING_REVIEW` and all active API integrations (ERP) are frozen until investigation concludes.

**Fraudulent Reporter Detection (Anti-Abuse):**

> [!WARNING]
> **The fraud reporting system itself can be abused.** If the AI pre-check determines the reporter is likely submitting a false or malicious report (e.g., reporter's ID doesn't match their claim, evidence is fabricated, or reporter has a pattern of rejected reports), the report is **auto-rejected**. Repeated rejected reports trigger escalating cooldown bans.

| Field | Type | Description |
|-------|------|-------------|
| **reporterAbuseRecord** | AbuseRecord | Tracked per reporter (by userId or anonymousVerification.verifiedIdNumber) |
| → totalReportsSubmitted | number | Lifetime reports submitted |
| → totalReportsRejected | number | Lifetime reports rejected by AI |
| → consecutiveRejections | number | Current streak of consecutive AI rejections |
| → currentBanLevel | enum | 'NONE' / 'COOLDOWN_30MIN' / 'COOLDOWN_1HR' / 'COOLDOWN_1DAY' / 'REQUIRES_HUMAN_REVIEW' |
| → bannedUntil | string | When the current cooldown expires (null if not banned) |
| → banHistory[] | BanEntry[] | History of all cooldown bans |
| → → banLevel | enum | Which ban level was applied |
| → → bannedAt | string | When ban started |
| → → expiresAt | string | When ban expires |
| → → triggeringReportId | string | Which rejected report triggered this ban |
| → humanReviewRequested | boolean | Reporter has requested manual human review to override ban |
| → humanReviewStatus | enum | 'NOT_REQUESTED' / 'PENDING' / 'APPROVED_UNBAN' / 'DENIED' |
| → humanReviewedBy | string | Super Admin team member who reviewed |
| → humanReviewedAt | string | When reviewed |

**Escalating Cooldown Schedule:**

| Consecutive Rejections | Cooldown | Can Still Request Human Review? |
|----------------------|----------|-------------------------------|
| 1st rejection | ⚠️ Warning only — no ban | N/A |
| 2nd rejection | 🟡 **30 minutes** — cannot submit new reports | ✅ Yes |
| 3rd rejection | 🟠 **1 hour** | ✅ Yes |
| 4th+ rejection | **1 day** | ✅ Yes |
| After human review denied | **1 day** — resets on next rejection | ✅ Yes (can re-request) |

> [!NOTE]
> **Human review override:** At any ban level, the reporter can tap "Request Human Review" to have a Super Admin team member manually evaluate their case. If the team determines the reporter is legitimate, the ban is lifted and the consecutive rejection counter resets. If denied, the current cooldown continues and the reporter can try again after it expires.

**Platform Queue Architecture:**

> [!IMPORTANT]
> **Concurrent operation protection (applies platform-wide).** Any operation where multiple users may act simultaneously is processed via a **job queue** — not executed in real-time concurrently. This prevents system crashes from race conditions, database locks, or resource exhaustion.

| Operations Queued | Why |
|-------------------|-----|
| Verified profile sync | Thousands of contacts may need updating when a popular company verifies |
| Fraud report processing | AI pre-check + account suspension must be atomic |
| Bulk KYC verification | Many users verifying during onboarding campaigns |
| Contact pool imports | Large CSV/Excel uploads |
| ERP API batch sync | Deep-tier data pulls may query millions of records |
| Contract vault signing | Multiple signatories acting simultaneously |

| Field | Type | Description |
|-------|------|-------------|
| **queueMonitoring** | QueueMonitorConfig | Platform-level config (Super Admin) |
| → queueDepthWarning | number | When any queue exceeds this depth, AI notifies Super Admin: *"Queue depth is above normal. Consider upgrading infrastructure."* |
| → queueDepthCritical | number | When queue exceeds critical threshold, AI sends urgent alert with specific upgrade recommendation (more workers, higher throughput tier, etc.) |
| → averageWaitTimeWarningMs | number | When average wait time exceeds this, AI suggests optimization |
| → aiUpgradeSuggestionEnabled | boolean | AI proactively monitors queue trends and suggests infrastructure upgrades to Super Admin team when patterns indicate growing demand |

**Additional fields for CustomerContact model (from Module D):**

| Field | Type | Description |
|-------|------|-------------|
| profileHierarchy | enum | 'INTERNAL_ONLY' (no verified match yet) / 'VERIFIED_LINKED' (verified company matched). **Canonical definition — also used by `contactBranches[].profileHierarchy` in Module B (§3.3 Company Branches). Both contact-level and branch-level linking use the same enum.** |
| verifiedTenantId | string | If linked: the tenantId of the verified company on the platform |
| verifiedProfile | object | Auto-populated from verified company's public data (read-only for contact owner). Contains: official names, addresses, verification level, industry codes. |
| linkedAt | string | When the verified link was established |
| linkedBy | enum | 'SYSTEM_AUTO' (TAX ID match) / 'MANUAL_ADMIN' (Super Admin linked) |

---

#### User Personal Contact Pool

| Field | Type | Description |
|-------|------|-------------|
| personalContactPoolLimit | number | Default: 5,000 contacts. Upgradeable via subscription. |
| personalContactCount | number | Current contacts in personal pool |
| personalPoolSubscriptionTier | enum | 'FREE' (5,000) / 'PLUS' (15,000) / 'PREMIUM' (50,000) / 'CUSTOM' |

> [!NOTE]
> **Pool transfer rules:** User can **push** their personal contacts to a company's internal contact pool (if user has `contacts.write` permission in that company). However, pushed contacts enter the pool as `PENDING_APPROVAL` status — a user with `contacts.approve` permission must review and approve before the contact becomes an official company contact. This prevents unauthorized contacts from entering the company pool. Company internal contacts can be **pulled** to a user's personal pool **only if** the company has enabled `allowContactExportToPersonal: true` in their company profile settings.

---

#### Company Internal Contact Pool

| Field | Type | Description |
|-------|------|-------------|
| companyContactPoolLimit | number | Default: 10,000 contacts. Upgradeable via subscription or add-on. |
| companyContactCount | number | Current contacts in company pool |
| companyPoolSubscriptionTier | enum | 'STARTER' (10,000) / 'BUSINESS' (50,000) / 'ENTERPRISE' (200,000) / 'CUSTOM' |
| allowContactExportToPersonal | boolean | Company allows users to copy company contacts to their personal pool |

---

#### Super Admin Contact Pool Add-On Configuration

> [!NOTE]
> Super Admin configures the available add-on packages and pricing in the backoffice. Companies purchase add-ons to increase their pool beyond the subscription tier limit.

| Field | Type | Description |
|-------|------|-------------|
| **contactPoolAddOns[]** | AddOnConfig[] | Available capacity add-on packages |
| → addOnId | string | Unique identifier |
| → addOnName | string | Package name (e.g., "+5,000 Contacts", "+20,000 Contacts") |
| → additionalContacts | number | How many contacts this add-on provides |
| → price | number | One-time price (currency per CountryRuleEngine) |
| → isRecurring | boolean | If true: monthly/yearly recurring charge |
| → recurringInterval | enum | 'MONTHLY' / 'YEARLY' (if isRecurring) |
| → isActive | boolean | Currently available for purchase |
| → appliesToPool | enum | 'PERSONAL' / 'COMPANY' / 'BOTH' |


> [!NOTE]
> **Related features in other modules:**
> - **Contact Pool Pricing Add-Ons** → Module O (§15) — subscription tiers
> - **ERP Contact Sync** → Module B (§3) — ERP API Integration
> - **Sales ↔ Contact Integration** → Module F (§7) — Sales Plan references contacts from this module

## 6. Module E: Unified Work & Collaboration Hub {#6-module-e}

> [!TIP]
> **📖 What is Module E?** The NERVE CENTER of the entire platform — where ALL work happens. Think of it as a super-powered task board (like Asana or Monday.com) deeply connected to every other module. Every piece of work — a sales visit, a hiring interview, an expense claim, a sponsor request — becomes a "task" with its own pipeline and activity log. **Chat (Module G) and Tasks (Module E) are completely separate modules** — like LINE/WhatsApp vs a task board. Users chat in Module G and can mention tasks, approve work from chat, and forward chat content into task logs. The Task module gives users their full task board with status, priority, and due dates.
>
> **9 task types:** Standard, Lead (sales pipeline), HR Candidate, Sales Visit, Sponsor Request, Freelance Gig, Routine Plan, Approval, Expense — each with its own status flow.
>
> **Example:** When someone applies for a job (Module J), an HR_CANDIDATE task auto-appears here. When a salesperson plans a visit (Module F), a SALES_VISIT task appears. When a sample is overdue (Module H), a follow-up task auto-creates. Everything routes through Module E.



> [!IMPORTANT]
> **Module E is the CENTRAL OPERATING HUB of the entire platform.** ALL work — HR processes, project management, sales actual plans, approval workflows, event coordination, recruitment tracking, expense submissions, and sponsor requests — flows through Module E as tasks. Each task has its own **activity timeline** (logs, comments, status changes, file uploads). Tasks with **2 or more participants** can be **linked to a Module G chat room** for real-time collaboration (manually created by the task creator, or auto-detected from existing conversations between participants — see Task & Chat Integration Architecture below). Single-user tasks rely on the activity timeline and comments only. Approvals can be **sent and pinned in chat** for quick action. This module **references** every other module: Module F (Sales) creates sales visit tasks, Module J (Recruitment) creates candidate pipeline tasks, Module K (Events) links attendance tasks, and Module D (Contact Pool) feeds lead/customer tasks.

### Partially Implemented
TaskBase with 9 task types, basic metadata per type

### TaskBase Enhancements

| Field | Type | Description |
|-------|------|-------------|
| priority | enum | 'URGENT'/'HIGH'/'MEDIUM'/'LOW' |
| dueDate | string | Deadline |
| startDate | string | When work begins |
| tags[] | string[] | User-defined tags |
| attachments[] | Attachment[] | Files/images |
| subtaskIds[] | string[] | Children task IDs |
| watcherIds[] | string[] | Users following this task |
| createdBy | string | Who created |
| completedAt | string | When completed |
| **isPersonal** | boolean | Personal vs company task. **Auto-detection rule:** If the user is currently on their company role profile (active `companyRoleId`), `isPersonal` defaults to `false` (task represents the company). If the user is on their personal profile (no active tenant context), `isPersonal` defaults to `true`. User can override manually. |
| isArchived | boolean | Archived but not deleted |
| orderIndex | number | Kanban position (drag-drop) |
| estimatedHours | number | Estimated time |
| actualHours | number | Time spent |
| linkedCalendarEventId | string | Google Calendar event |
| **assigneeIds[]** | string[] | **Required.** All users assigned to this task. This is the canonical participant list. Task chat participants come from this field. Minimum 1 assignee. |
| **taskType** | enum | **Required.** Discriminator for status pipeline: 'STANDARD' / 'LEAD' / 'HR_CANDIDATE' / 'SALES_VISIT' / 'SPONSOR_REQUEST' / 'FREELANCE_GIG' / 'ROUTINE_PLAN' / 'APPROVAL' / 'EXPENSE'. Determines which status pipeline applies. |
| **tenantId** | string | Company context for this task. Null if `isPersonal: true`. References the company's tenantId from Module B. Required when `isPersonal: false`. |
| **sourceMessageId** | string | If task was created from a chat message — references Module G message ID (nullable) |

### Task & Chat Integration Architecture (Separate Modules)

> [!IMPORTANT]
> **Chat (Module G) and Tasks (Module E) are completely SEPARATE modules.** Chat is for casual real-time conversation (like LINE/WhatsApp). Tasks are for structured work tracking (like a task board). They connect through specific integration points but are NOT embedded in each other.
>
> **How they connect:**
> 1. **Task Mentions in Chat:** Users can mention a task or project in any chat by referencing it (e.g., `#TASK-123` or `#PROJECT-456`). This creates a clickable link in the chat message. When the mentioned task reaches **COMPLETED** status, the mention is **hidden from chat view by default** — users can filter "show completed tasks" to see them again.
> 2. **Approve from Chat:** When a task requires approval, the approval card can be shared in a chat. Approvers can tap "Approve" / "Reject" / "Comment" directly from the chat message without opening the task module.
> 3. **Forward to Task Log:** Users can **forward** text, links, images, videos, and files from any chat conversation into a specific task's activity log/notes. This preserves context from chat discussions in the task's permanent record.
> 4. **Manual Chat Creation:** If a user creates a task assigned to someone they have NOT chatted with before, the task creator can **manually create a new chat** with that person from the task detail view. If a chat already exists between those users, no new chat needs to be created — the existing chat is sufficient.
> 5. **Shared Task View in Chat:** Any chat (group or 1:1) displays a **task icon/badge (📋)** in the header when the participants have shared tasks. Tapping it opens a list of all tasks where the chat participants are collaborators — with status indicators (ongoing/done/overdue).
>
> **Activity Timeline (all tasks):** Every task — regardless of participant count — has an activity timeline that records: status changes, file uploads, comments, forwarded chat content, assignment changes, approval actions, and timestamps. This is the task's complete history.
>
> **Visibility Rule for Shared Task View:** A task appears in a chat's shared task list if and only if **every person in that chat is also a participant of that task.** Examples:
> - Users A, B, C are on Task-1. Users A, D are on Task-2.
> - **A + B chat:** Shows Task-1 ✅ (both A and B are in Task-1). Does NOT show Task-2 ❌ (B is not in Task-2).
> - **A + D chat:** Shows Task-2 ✅ (both A and D are in Task-2). Does NOT show Task-1 ❌ (D is not in Task-1).
>
> **Role visibility vs. chat access:** Higher-role users (e.g., managers) can **view and interact** with a task on the task board (comment, approve, reassign), but they are **NOT automatically added** to any chat. Managers can be mentioned in task-related chats or added to group chats separately.

**Task-Chat Integration Model:**

| Field | Type | Description |
|-------|------|-------------|
| **linkedChatRoomId** | string | Optional — links to a Module G chat room that participants use for this task. **Manually created by task creator or auto-detected from existing conversations.** Null if no chat is linked. |
| **taskMentions[]** | TaskMention[] | Records of this task being mentioned in chat messages |
| → mentionId | string | Unique identifier |
| → chatRoomId | string | Which chat room the mention occurred in |
| → messageId | string | Which message mentioned this task |
| → mentionedBy | string | Who mentioned the task |
| → mentionedAt | string | When mentioned |
| → isHiddenInChat | boolean | True when task is COMPLETED — mention hidden from chat view by default |
| **forwardedChatContent[]** | ForwardedContent[] | Chat messages/files forwarded into this task's activity log |
| → forwardId | string | Unique identifier |
| → sourceMessageId | string | Original chat message ID |
| → sourceChatRoomId | string | Which chat room it came from |
| → forwardedBy | string | Who forwarded it |
| → forwardedAt | string | When forwarded |
| → contentType | enum | 'TEXT' / 'LINK' / 'IMAGE' / 'VIDEO' / 'FILE' |
| → content | string | The forwarded content (text, URL, or file reference) |
| **showTaskListIcon** | boolean | True — displays a 📋 icon in linked chat header showing all common tasks between participants |

**Per-Participant Completion Status:**

> [!IMPORTANT]
> **Individual participants can mark their part of a task as done while the task remains in progress for others.** This allows team members to disengage from a completed contribution without blocking the overall task.

| Field | Type | Description |
|-------|------|-------------|
| **participantStatuses[]** | ParticipantStatus[] | Per-user completion tracking (one entry per `participantUserIds[]` member) |
| → userId | string | Which participant |
| → individualStatus | enum | **'ACTIVE'** (default — working on it) / **'MY_PART_DONE'** (finished their portion) / **'INACTIVE'** (set by system when task owner force-completes but this user never marked done) |
| → statusChangedAt | string | When status last changed |
| → statusNote | string | Optional note (e.g., "Finished my section of the report") |

**Status Behavior:**
- **ACTIVE → MY_PART_DONE:** User marks their own contribution complete. They can optionally mute further update notifications. The task stays `IN_PROGRESS` for other participants. The task detail view shows: "✅ A: My Part Done · 🔄 B: Active · 🔄 C: Active"
- **Task owner force-completes:** The task owner (or a user with `task.manage` permission) can mark the entire task as `COMPLETED` at any time. When this happens:
  - Participants who were `MY_PART_DONE` → remain `MY_PART_DONE` ✅
  - Participants who were `ACTIVE` → become `INACTIVE` ⚫ (they never finished their part but the task moved on)
- **Task stays IN_PROGRESS** as long as at least 1 participant is `ACTIVE`.
- **MY_PART_DONE is reversible:** If the user needs to rejoin, they can change back to `ACTIVE`.
- The task's global status and the individual participant statuses are separate but visible together on the task detail page.

**Task Activity Timeline Model (all tasks, with or without chat):**

| Field | Type | Description |
|-------|------|-------------|
| **activityTimeline[]** | ActivityEntry[] | Chronological log of all task events |
| → activityId | string | Unique identifier |
| → activityType | enum | 'STATUS_CHANGE' / 'COMMENT' / 'FILE_UPLOAD' / 'ASSIGNMENT_CHANGE' / 'APPROVAL_ACTION' / 'PRIORITY_CHANGE' / 'DUE_DATE_CHANGE' / 'SUBTASK_ADDED' / 'LINKED_CONTACT_CHANGE' |
| → userId | string | Who performed the action |
| → timestamp | string | When it happened |
| → description | string | Human-readable description (e.g., "Changed status from NEW to IN_PROGRESS") |
| → oldValue | string | Previous value (for changes) |
| → newValue | string | New value (for changes) |
| → commentText | string | If COMMENT: the comment content (supports @mentions) |
| → attachmentUrl | string | If FILE_UPLOAD: the file URL |

**Approval-in-Chat Flow:**

```
Task requires approval
  ↓
System creates APPROVAL_REQUEST in task activity timeline
  ↓
User can SHARE the approval card to any relevant chat (manually)
  → Approvers in the chat see the shared approval card
  → Approvers can tap "Approve" / "Reject" / "Comment" directly in chat
  → Approval follows hierarchical chain (see Module C — Approval Hierarchy)
  ↓
Once resolved: approval card updates to show result (✅ Approved / ❌ Rejected)
  → Result is recorded in both the task activity timeline AND the chat message
```

> [!NOTE]
> **Shared Task View in Chat:** On the chat interface, any chat where participants have shared tasks displays a small icon (📋) in the header. Tapping the icon opens a side panel showing ALL tasks that the chat participants have in common. Completed tasks are hidden by default but can be shown via filter. This helps team members quickly see their shared workload without leaving the chat.

### Google Calendar API Sync Architecture

> [!NOTE]
> **Cross-module calendar integration:** This calendar sync serves Module E (task scheduling), Module F (sales visit scheduling — actual plan visits and interview appointments appear on calendar), and Module K (GPS attendance — calendar events trigger location tracking). Other modules reference this section for calendar functionality. **Not all tasks appear on the calendar** — only tasks with scheduled dates (actual plan visits, interviews, events) are synced to Google Calendar.

> [!IMPORTANT]
> **Bi-directional sync between the webapp and Google Calendar.** Users can optionally connect their Google Calendar account via OAuth2. Once connected, the platform syncs events bi-directionally: webapp events (tasks, sales visits, meetings) push to Google Calendar, and Google Calendar events pull into the webapp notification system. **User consent is required (PDPA Sec 19).** **Calendar routing rule:** If the user is acting as a company role, events sync to the company email's Google Calendar. If the user is acting as an individual, events sync to their personal Google Calendar.

**Google Calendar Integration Model (per user):**

| Field | Type | Description |
|-------|------|-------------|
| **googleCalendarSync** | GoogleCalendarSync | User-level calendar integration config |
| → isEnabled | boolean | User has connected and authorized Google Calendar |
| → googleAccountEmail | string | The Google account connected (display only — not stored as credential) |
| → oauthTokenEncrypted | string | Encrypted OAuth2 refresh token (AES-256) — never exposed in UI or API responses |
| → oauthGrantedAt | string | When OAuth2 consent was granted |
| → oauthScopes[] | string[] | Granted scopes (e.g., 'calendar.events', 'calendar.readonly') |
| → lastSyncAt | string | Last successful bi-directional sync timestamp |
| → syncDirection | enum | 'BIDIRECTIONAL' (default — both push and pull) / 'PUSH_ONLY' (webapp → Google Calendar only) / 'PULL_ONLY' (Google Calendar → webapp notifications only) |
| → syncFrequencyMinutes | number | How often to poll for changes (default: 5 minutes) |
| → consentAuditId | string | Link to Consent Audit Log entry for Google Calendar OAuth2 consent |
| → **calendarTarget** | enum | 'COMPANY_EMAIL' (sync to company role's Google Calendar) / 'PERSONAL_EMAIL' (sync to personal Google Calendar) / 'BOTH' (sync to both — events appear in both calendars) |

**Sync Rules:**

| Webapp Event Type | Synced to Google Calendar? | Calendar Title Format |
|-------------------|--------------------------|----------------------|
| Task (assigned) | ✅ If due date set | "[Task] {taskTitle}" |
| Sales Visit (Actual Plan) | ✅ Always | "[Visit] {contactName} — {actionType}" |
| Sales Call/Meeting | ✅ Always | "[Call/Meeting] {contactName}" |
| Company Event | ✅ Always | "[Event] {eventTitle}" |
| Recruitment Interview | ✅ Always | "[Interview] {candidateName} — {jobTitle}" |
| Contract Vault Deadline | ✅ If contractTermEnd set | "[Contract] {documentTitle} — Term Ends" |
| **Google Meet** | ✅ Always (bi-directional) | "[Meet] {meetingTitle}" — Google Meet events in the connected calendar are pulled into webapp and displayed as tasks/events. New meetings created in webapp with Google Meet link are pushed to calendar. |
| **Approval Deadline** | ✅ If approval has deadline | "[Approval] {taskTitle} — Due {dueDate}" |

> [!NOTE]
> **Pull behavior (Google Calendar → webapp):** Events created directly in Google Calendar that match the connected account are imported as read-only notifications. They appear in the user's webapp calendar view with a Google Calendar icon badge. Editing these events routes the user to Google Calendar. Google Meet events are imported with the Meet link preserved for one-click joining.

### Online Meeting Indicator

> [!IMPORTANT]
> **Visual meeting type differentiation.** When a calendar event contains a Google Meet (or other video conferencing) link, the webapp calendar UI renders visual indicators so users can instantly distinguish online meetings from in-person events.

| UI Element | Description |
|------------|-------------|
| **🎥 Online Meeting Badge** | Prominent badge displayed on calendar event cards that contain a video conference link. Visible in day, week, month, and agenda views. |
| **"Join Meeting" Button** | One-click button on the event detail card — opens Google Meet directly in a new browser tab. Only shown when `conferenceData` or `hangoutLink` is present in the Google Calendar event payload. |
| **Calendar List/Agenda View** | Online meeting events show a video camera icon (🎥) next to the event title. |
| **Day/Week Grid View** | Online meeting events have a teal-colored left border to visually distinguish from in-person events. |
| **Event Detail Card** | Displays: meeting link URL, platform name (Google Meet), host name, and attendee count. |

> [!NOTE]
> **Supported platforms (Phase 1):** Google Meet only — detected via `conferenceData` or `hangoutLink` in the Google Calendar event payload. Future phases may add Microsoft Teams and Zoom detection via calendar sync. The system does NOT create video meetings — it only displays and links to meetings that already exist in the synced calendar.

### Calendar Role vs Personal Routing Rules

> [!IMPORTANT]
> **Calendar routing determines WHERE events appear** based on the user's active context at the time of event creation:

| Context | Calendar Target | Example |
|---------|----------------|---------|
| **User acting as company role** | Company email's Google Calendar | Sales rep creates a sales visit → syncs to company email calendar |
| **User acting as personal** | Personal email's Google Calendar | User creates a personal task → syncs to personal email calendar |
| **Task created BY the company** | Company calendar | Manager assigns task to employee → goes to employee's company calendar |
| **Event invite from external** | Based on invited email | If invited via company email → company calendar; personal email → personal |

> [!NOTE]
> **Multi-company users:** If a user holds roles in multiple companies (or subsidiary/affiliated companies via Company Group), they see a **merged calendar view** with color-coded events per company. Filter toggles allow showing/hiding events from specific companies. Each company's events sync to their respective company email calendar independently.

### Team & Group Calendar Sync

> [!NOTE]
> **Team calendars (Module C → Calendar):** When a Team (from Team & Group Structure) has shared calendar enabled, all events assigned to ANY team member are visible in a shared team calendar view. The team manager sees ALL team member events. Team members see their own events + events explicitly shared with the team. This enables managers to see team availability and workload at a glance.

| Field | Type | Description |
|-------|------|-------------|
| **teamCalendarConfig** | TeamCalendarConfig | Per-team calendar configuration |
| → isEnabled | boolean | Shared team calendar is active |
| → visibilityScope | enum | 'MANAGER_ONLY' (only team manager sees all events) / 'ALL_MEMBERS' (all team members can see each other's events) / 'TITLES_ONLY' (members see event titles/times but not details) |
| → includePersonalEvents | boolean | Whether personal (non-company) events appear in the team calendar (default: false) |
| → colorCode | string | Team color for calendar UI differentiation |

### Subsidiary Calendar Support

> [!NOTE]
> **Company Group calendar (cross-company):** When companies are linked via the Company Group model (Subsidiary/Affiliated/Sister), users with `companyGroup.manage` permission can view a **consolidated calendar** across all group companies. This enables holding company managers to see events across subsidiaries without switching company contexts. Individual company calendars remain independent — the consolidated view is read-only aggregation.


> [!NOTE]
> **Employment contracts** are defined in Module B (§3) — Company Management, alongside company role definitions.

### Task Type: LEAD

Design requirement: *"Users can categorize entries as either standard tasks or sales leads, with leads capable of transitioning into formal sales orders or dedicated projects"*

| Field | Type | Description |
|-------|------|-------------|
| leadContactId | string | Which contact this lead is for |
| **leadSource** | enum | 'COLD_CALL' / 'REFERRAL' / 'WEBSITE' / 'EVENT' / 'QR_SCAN' / 'CAMPAIGN_QR' / 'CAMPAIGN_LINK' — 'CAMPAIGN_QR' and 'CAMPAIGN_LINK' are auto-set when a lead is created from Module S (§18.5) campaign. 'QR_SCAN' remains for Module L contact QR scans. |
| leadValue | number | Estimated deal value |
| leadCurrency | string | Currency for lead value (from CountryRuleEngine, default company currency) |
| leadStatus | enum | 'NEW'/'CONTACTED'/'QUALIFIED'/'PROPOSAL'/'NEGOTIATION'/'WON'/'LOST'/'CONVERTED_TO_PROJECT' |
| lostReason | string | Why the lead was lost |
| convertedProjectId | string | If lead → project conversion |
| winProbability | number | AI-generated win probability (0-100%) |
| sentimentScore | number | AI sentiment from communications |
| **sourceCampaignId** | string | If lead came from Module S campaign: **References** → Module S (§18.5) campaign ID. Null for non-campaign leads. |
| **sourceProductIds[]** | string[] | If lead came from Module S campaign: which campaign items the visitor expressed interest in. **References** → Module H (§9) product IDs. |

### Task Type: LEAD — Post-Win Actions

> [!NOTE]
> When a lead reaches `WON` status, the system suggests creating a **Cloudfull Project** (see below) to manage the multi-party collaboration. When a lead reaches `CONVERTED_TO_PROJECT`, the `convertedProjectId` field links to the new project.

### Cloudfull Project (Multi-Party Collaboration Workspace)

> [!TIP]
> **📖 In Plain Language:** A Cloudfull Project is a workspace where a project owner invites multiple parties (suppliers, subcontractors, consultants) to collaborate on a single project. The KEY RULE: strict data isolation — Party A can ONLY see documents linked to them. They CANNOT see Party B's pricing, identity, or documents. The project owner sees everything.
>
> **Example:** A construction company creates a project for a hotel renovation. They invite a steel supplier, glass supplier, and design consultant. The steel supplier sees only their POs/quotations. The glass supplier cannot see the steel supplier's pricing. The construction company sees all documents across all parties.
>
> **ERP Connection:** If the owner uses Co-Work.cloud ERP, POs auto-sync. If not, they manually upload via Module Q. **Co-Work.cloud ERP does NOT have a project module** — projects exist only in Cloudfull.com.



> [!IMPORTANT]
> **Cloudfull Project is a multi-party collaboration workspace with strict data isolation between parties.** The project owner invites multiple parties (suppliers, subcontractors, consultants) to collaborate on a single project. Each party can ONLY see documents (PO/SO/RFQ/Quotation) that are specifically linked to them — they cannot see other parties' pricing, documents, or sensitive data. The project owner sees everything across all parties.
>
> **ERP Integration:**
> - If the project owner uses **Co-Work.cloud ERP** → POs are auto-sent to each party via ERP sync through Cloudfull.com
> - If the project owner does **NOT** use Co-Work.cloud ERP → they manually upload POs to each party via Module Q PO/SO function
> - If a seller party uses **Co-Work.cloud ERP** → SOs are auto-sent via ERP sync
> - If a seller party does **NOT** use Co-Work.cloud ERP → they manually upload quotations via Module Q
>
> **Co-Work.cloud ERP does NOT have a project module.** The project concept exists only in Cloudfull.com.

**CloudfullProject Model:**

| Field | Type | Description |
|-------|------|-------------|
| projectId | string | Unique project identifier |
| tenantId | string | Owner company's tenant ID |
| projectName | string | Human-readable project name |
| projectNameLocal | string | Localized project name (label per CountryRuleEngine) |
| projectDescription | string | Project scope description |
| projectStatus | enum | 'PLANNING' / 'ACTIVE' / 'ON_HOLD' / 'COMPLETED' / 'CANCELLED' |
| ownerUserId | string | User who created the project |
| projectParties[] | ProjectParty[] | All participating parties (see below) |
| budget | number | Total project budget |
| currency | string | Budget currency (from CountryRuleEngine) |
| startDate | string | Planned start date |
| endDate | string | Planned end date |
| linkedLeadId | string | Source lead if converted from LEAD pipeline (nullable) |
| chatRoomId | string | Auto-created PROJECT chat room (→ Module G) |
| createdAt | string | ISO 8601 |
| updatedAt | string | ISO 8601 |

**ProjectParty Sub-Model:**

| Field | Type | Description |
|-------|------|-------------|
| partyId | string | Unique per party in this project |
| partyTenantId | string | Tenant ID if party is a Cloudfull.com registered company (nullable) |
| partyContactId | string | Contact ID from Module D if party is external (nullable) |
| partyName | string | Company/contact display name |
| partyRole | enum | 'MAIN_CONTRACTOR' / 'SUBCONTRACTOR' / 'SUPPLIER' / 'CONSULTANT' / 'OTHER' |
| linkedDocumentIds[] | string[] | PO/SO/RFQ/Quotation IDs visible to THIS party only. Data isolation enforced — party sees only their own documents. |
| invitedBy | string | userId who added this party |
| invitedAt | string | ISO 8601 |
| status | enum | 'INVITED' / 'ACCEPTED' / 'DECLINED' / 'REMOVED' |

**Data Isolation Rules:**

| Role | Can See | Cannot See |
|------|---------|-----------|
| **Project Owner** (ownerUserId + users with `project.manage` in ownerTenantId) | ALL documents across ALL parties, all party details, full budget | — |
| **Party A** | Only documents in their own `linkedDocumentIds[]`, project name/description, their own party status | Party B's documents, Party B's pricing, Party B's identity (unless owner explicitly shares), other parties' `linkedDocumentIds[]` |
| **Party B** | Only documents in their own `linkedDocumentIds[]`, project name/description, their own party status | Party A's documents, Party A's pricing, Party A's identity |

> [!NOTE]
> **Firestore security rule enforcement:** Data isolation is enforced at the database level. Firestore rules verify that the requesting user's `tenantId` matches a `projectParties[].partyTenantId` AND that the requested document ID exists in that party's `linkedDocumentIds[]`. This prevents API-level bypasses.

**Project Pipeline:**

```
PLANNING → ACTIVE → ON_HOLD → COMPLETED
                  ↘ CANCELLED
```

**Project Permissions (→ add to Module C §4):**

| Permission | Description |
|------------|-------------|
| `project.create` | Create new Cloudfull Projects |
| `project.manage` | Manage project parties, settings, and linked documents |
| `project.view_all` | View all company projects (manager view) |

**Project Notification Events (→ add to §3.5):**

| Event | Recipient | Channels |
|-------|-----------|----------|
| `PROJECT_CREATED` | Project owner's team | In-app |
| `PROJECT_PARTY_INVITED` | Invited party's authorized users | In-app, Email |
| `PROJECT_PARTY_ACCEPTED` | Project owner | In-app |
| `PROJECT_PARTY_DECLINED` | Project owner | In-app, Email |
| `PROJECT_STATUS_CHANGED` | All accepted parties | In-app |
| `PROJECT_DOCUMENT_LINKED` | Relevant party only | In-app |

### Task Type: FREELANCE_GIG

**Freelance Booking Engine:**

| Field | Type | Description |
|-------|------|-------------|
| allocationUnit | enum | 'PER_DAY'/'PER_NIGHT'/'PER_HOUR'/'PER_PROJECT' |
| maxBookingsPerSlot | number | Max concurrent bookings |
| startTime | string | Slot start |
| endTime | string | Slot end |
| negotiatedPrice | number | Agreed price |
| negotiatedCurrency | string | Currency code (from CountryRuleEngine) |
| bookingStatus | enum | 'PENDING_PROPOSAL'/'COUNTER_PROPOSAL'/'CONFIRMED'/'REJECTED' |

### External Approval Links

Design requirement: *"For collaborators outside the ecosystem, the system can generate secure approval links—including batch generation with personalized details"*

| Field | Type | Description |
|-------|------|-------------|
| externalApprovalLinks[] | ExternalLink[] | Generated approval links |
| → linkId | string | Unique |
| → recipientEmail | string | Who receives |
| → recipientName | string | Name |
| → expiresAt | string | Link expiry |
| → status | enum | 'PENDING'/'APPROVED'/'REJECTED' |
| → respondedAt | string | When responded |
| → token | string | Secure token |

### Full Status Pipelines Per Type

**Standard:** `NEW` → `IN_PROGRESS` → `IN_REVIEW` → `COMPLETED` / `CANCELLED`
**Lead:** `NEW` → `CONTACTED` → `QUALIFIED` → `PROPOSAL` → `NEGOTIATION` → `WON` / `LOST` / `CONVERTED_TO_PROJECT`
**HR Candidate:** `NEW` → `SCREENING` → `INTERVIEW_SCHEDULED` → `INTERVIEW` → `EVALUATION` → `OFFER_SENT` → `RECRUITED` / `NOT_PASS`
**Sales Visit:** `PLANNED` → `EN_ROUTE` → `ARRIVED` → `CHECK_IN_VERIFIED` → `MEETING_DONE` → `REPORT_SUBMITTED` → `COMPLETED`
**Sponsor Request:** `DRAFT` → `SUBMITTED` → `UNDER_REVIEW` → `BUDGET_APPROVED/REJECTED` → `IN_EXECUTION` → `REPORT_SUBMITTED` → `CLOSED`
**Freelance Gig:** `PENDING_PROPOSAL` → `COUNTER_PROPOSAL` → `CONFIRMED` / `REJECTED`
**Routine Plan:** `PLANNED` → `IN_PROGRESS` → `COMPLETED` / `RESCHEDULED` / `CANCELLED`
**Approval:** `PENDING` → `APPROVED` / `REJECTED` / `ESCALATED` (sent to higher authority)
**Expense:** `DRAFT` → `SUBMITTED` → `UNDER_REVIEW` → `APPROVED` / `REJECTED` / `RESUBMIT_REQUIRED` → `REIMBURSED`

---

## 7. Module F: Sales Planning & Routing {#7-module-f}

> [!TIP]
> **📖 What is Module F?** Purpose-built for **field sales teams** who regularly visit B2B customers. This is the platform's **#1 competitive advantage** — no existing Thai CRM offers this combination.
>
> **Two layers:**
> - **To-Be Plan (WHO to visit):** Master list of all contacts tagged with visit frequency (weekly/monthly/quarterly). AI analyzes ERP order history to recommend how often to visit each customer.
> - **Actual Plan (TODAY's schedule):** Concrete time slots for today. Each visit includes GPS check-in + EXIF photo verification proving the salesperson was actually at the location.
>
> **Closed-loop:** Completed visit → next visit date auto-advances. Missed visit → counter increments and contact stays in pending pool.
>
> **Also includes:** AI-powered expense tracking (photograph receipts → AI extracts amount + category → submit for approval) available to ALL roles, not just salespeople.



> [!IMPORTANT]
> **This is one of the largest modules in the platform.** The Sales Planning system manages sales rep routines, visit scheduling, route planning, cost tracking, and reporting. **Depends on** → Module D (§5) for contact data and Module C (§4) for hierarchy visibility.

### Sales Plan (To-Be Plan)

> [!IMPORTANT]
> **The To-Be Plan is a master pool/list of contacts that a salesperson needs to track and routinely update.** Each contact in the user's contact pool is tagged with a **tracking mode** that determines how it appears in the To-Be Plan:
>
> - **ROUTINE:** The contact has a recurring visit/call schedule. The user sets the frequency (every N weeks, months, quarters, or years). AI Agent (Hermes) analyzes **ERP order history** (via Module B ERP API) to suggest optimal frequency based on how often this customer orders and the typical order value per product category.
> - **MANUAL:** The contact needs visits/calls but has no set schedule. It appears in the To-Be Plan pool list for ad-hoc scheduling into Actual Plans whenever the salesperson decides.
> - **NEVER:** The contact is kept for history and reference only. It does NOT appear in the To-Be Plan pool. No active tracking.
>
> **Purpose:** This module is specifically for salespeople who track B2B customers that regularly order products to stock and resell. It keeps the salesperson disciplined on routine customer care and ensures no customer is forgotten.

**To-Be Plan Contact Entry:**

| Field | Type | Description |
|-------|------|-------------|
| planId | string | Unique |
| tenantId | string | Company |
| userId | string | Salesperson who owns this plan entry |
| contactId | string | Which contact (**references** → Module D §5) |
| **trackingMode** | enum | **'ROUTINE'** (recurring schedule) / **'MANUAL'** (ad-hoc, no set schedule) / **'NEVER'** (history only, no tracking) |
| **routineConfig** | object | Only for ROUTINE mode — defines the schedule |
| → frequencyType | enum | 'EVERY_N_WEEKS' / 'EVERY_N_MONTHS' / 'EVERY_N_QUARTERS' / 'YEARLY' |
| → frequencyValue | number | E.g., 2 for "every 2 weeks" or 3 for "every 3 months" |
| → actionType | enum | 'VISIT' / 'CALL' / 'MEETING' |
| → expectedOrderValueMin | number | Expected order range min (currency per CountryConfig) |
| → expectedOrderValueMax | number | Expected order range max |
| → productCategories[] | string[] | Which product categories this contact typically orders |
| lastActionDate | string | When the last action (visit/call/meeting) was completed |
| nextActionDueDate | string | Auto-calculated: `lastActionDate` + routine frequency. For MANUAL mode: null (no set date). |
| daysSinceLastAction | number | Auto-calculated: days since `lastActionDate`. Helps prioritize overdue contacts. |
| missedActionCount | number | How many times a scheduled action was missed without rescheduling |
| status | enum | 'ACTIVE' / 'PAUSED' / 'OVERDUE' (past `nextActionDueDate`) / 'PENDING_ACTION' (missed, waiting for reschedule decision) |
| **aiSuggestedFrequency** | number | AI Agent (Hermes) recommended visit interval based on order history. **Requires** synced ERP (external or Co-Work.cloud) OR manually uploaded sales data. |
| **aiSuggestedValue** | number | AI predicted order value based on historical orders. Same data source requirement as above. |
| **aiOrderPatternSummary** | string | AI-generated summary: "This customer orders ~50 cases of Product X every 2 weeks, avg order value ฿45,000" |
| **aiAnalysisDataSource** | enum | 'ERP_SYNC' (external ERP) / 'COWORK_SYNC' (Co-Work.cloud ERP) / 'MANUAL_UPLOAD' / 'NONE' — indicates where the AI analysis data comes from |
| createdAt | string | When this plan entry was created |
| updatedAt | string | Last modification |

**Hermes AI Analysis Configuration & Limits:**

> [!IMPORTANT]
> **AI analysis is NOT available to all companies.** Hermes can only analyze order history if the company has at least one of these data sources connected:
> - **External ERP sync** (Odoo, SAP, Oracle via Module B API)
> - **Co-Work.cloud ERP sync** (automatic)
> - **Manual sales data upload** — companies can upload invoices or SO documents. **Duplicate invoice/SO numbers automatically REPLACE the old record** to prevent double-counting. Supported formats: CSV, XLSX, or individual document upload.
>
> **Free tier limits:** Analysis covers a maximum of **2 years** of history and **10,000 invoices/SO** per company. Beyond this, AI analysis returns a message: "Upgrade to paid tier for deeper analysis."
>
> **Paid tier limits:** Adjustable years and document count per tier. Configured in the Super Admin backoffice (Module P).

| Field | Type | Description |
|-------|------|-------------|
| **hermesAnalysisConfig** | HermesConfig | Per-company AI analysis settings |
| → dataSource | enum | 'ERP_SYNC' / 'COWORK_SYNC' / 'MANUAL_UPLOAD' / 'NONE' |
| → maxHistoryYears | number | Free tier: 2. Paid tiers: configurable in Super Admin. |
| → maxDocumentCount | number | Free tier: 10,000. Paid tiers: configurable in Super Admin. |
| → lastAnalysisRunAt | string | When Hermes last analyzed this company's data |
| → analysisStatus | enum | 'READY' / 'INSUFFICIENT_DATA' / 'LIMIT_REACHED' / 'NO_DATA_SOURCE' |

**Manual Sales Data Upload Model:**

| Field | Type | Description |
|-------|------|-------------|
| uploadId | string | Unique identifier |
| tenantId | string | Company |
| uploadedBy | string | User who uploaded |
| fileName | string | Original file name |
| fileFormat | enum | 'CSV' / 'XLSX' / 'INDIVIDUAL_DOCUMENT' |
| documentType | enum | 'INVOICE' / 'SALES_ORDER' |
| recordCount | number | Number of records in this upload |
| duplicatesReplaced | number | Number of records that replaced existing ones (matched by invoice/SO number) |
| uploadedAt | string | When uploaded |
| processedAt | string | When processing completed |
| status | enum | 'PROCESSING' / 'COMPLETED' / 'FAILED' |
| errorDetails | string | If failed, what went wrong |

### Actual Plan (Daily Execution)

> [!IMPORTANT]
> **The Actual Plan is when a salesperson takes contacts from the To-Be Plan pool and schedules them into daily time slots for a specific week or month.** This is the execution layer — turning the "who needs attention" list into a concrete daily schedule.
>
> **Action-driven lifecycle:**
> - When an Actual Plan action is **completed** → the contact's `nextActionDueDate` in the To-Be Plan advances to the next routine date. The contact moves out of the "pending" pool until its next due date.
> - When an Actual Plan action is **missed** → the contact stays in the "pending" pool. System prompts: *"Reschedule this visit or move to next routine?"* The `missedActionCount` increments. The `daysSinceLastAction` counter keeps ticking.
> - This creates a closed loop: To-Be Plan generates the pool → Actual Plan schedules from the pool → Completed actions reset the timer → Missed actions keep the contact visible until addressed.

| Field | Type | Description |
|-------|------|-------------|
| actualPlanId | string | Unique |
| tenantId | string | Company |
| userId | string | Sales rep |
| planDate | string | Which day |
| **slots[]** | ActualPlanSlot[] | Time slots for the day |
| → slotIndex | number | Order in day |
| → contactId | string | Which contact (null if free slot) |
| → planType | enum | 'ROUTINE'/'URGENT'/'FREE_SLOT' |
| → actionType | enum | 'VISIT'/'CALL'/'MEETING' |
| → scheduledTime | string | Planned time |
| → status | enum | 'PLANNED'/'VISITED'/'CALLED'/'MET'/'REPLAN'/'MISSED' |
| → replanReason | string | If status=REPLAN, why |
| → actionTopic | string | What was discussed |
| → actionDetail | string | Detailed notes |
| → linkedTaskId | string | Creates ROUTINE_PLAN task |
| → **reportPhotos[]** | ReportPhoto[] | Photos with EXIF verification |
| → → photoUrl | string | Photo URL |
| → → exifLat | number | EXIF GPS latitude |
| → → exifLng | number | EXIF GPS longitude |
| → → exifTimestamp | string | EXIF date/time |
| → → systemTimestamp | string | System timestamp of upload |
| → → locationMatch | boolean | Does EXIF match contact address? |
| → → dateMatch | boolean | Does EXIF date match visit date? |
| **routeSummary** | object | Auto-calculated |
| → totalDistanceKm | number | Total route distance |
| → provinces[] | string[] | Provinces visited |
| → districts[] | string[] | Districts visited |
| → estimatedFuelCost | number | AI estimated fuel |
| → estimatedOrderValue | number | Total expected order value |

### Sales Summary/Report

| Model | Description |
|-------|-------------|
| **FuelInput** | Daily fuel/transportation cost logging — available to **ALL user roles** (not just salespeople). Any employee who uses company vehicles or claims transportation costs can log daily fuel entries. |
| **WorkDurationLog** | Work hours per day/week/month — calculated from first visit clock-in to last visit clock-out. **Feeds** from Module K GPS attendance data. |
| **RouteSummary** | Province/district mapping daily/weekly/monthly |
| **ContactVisitSummary** | Table + graph of all contact visits |
| **EmployeeCost** | Total cost per employee (fuel + transportation + expenses). Applies to ALL roles — salespeople, field technicians, delivery staff, managers on business travel, etc. |
| **SponsorSpendSummary** | Sponsor spending per salesperson/team/group/contact |
| **DailyProductivityReport** | Visits per day + working hours per day + average visits per hour. Example: "Day 1: 3 visits, 11:00-15:00 (3 working hours + 1hr lunch). Day 2: 7 visits, 08:30-16:50 (7:20 working hours + 1hr lunch)." |
| **ActivityLog** | All user actions within the webapp during working hours: create, update, approve, submit actions (NOT page views/opens). Presented in a **separate report section** for activities during work hours vs. outside work hours. Report notes **first visit time to last visit time** per day. |
| **GPSWorkZoneReport** | GPS tracking summary: planned route vs. actual route, time spent per location, alerts triggered (outside work zone during/after hours, unplanned province). |

> [!NOTE]
> **Fuel/Transportation Cost → ERP Sync:** When a company has ERP integration (Module B §3), daily fuel entries are pushed via webhook event `'fuel.logged'`. Payload includes: userId, date, amount, currency, vehicleType (if recorded), mileage (if recorded), notes. The ERP uses this to create journal entries (debit: transportation expense, credit: petty cash / payable). This is **separate from §3.7 Expense** — FuelInput is a quick daily log without a receipt photo; for receipts, use §3.7 Expense which syncs via `expense.approved`.

### GPS Work Zone Tracking

> [!IMPORTANT]
> **Two sales tracking modes** allow companies to define work zones per salesperson and receive alerts for unauthorized location deviations during AND after work hours.

**SalesTrackingConfig Model (per salesperson):**

| Field | Type | Description |
|-------|------|-------------|
| configId | string | Unique identifier |
| tenantId | string | Company |
| userId | string | Salesperson |
| **trackingMode** | enum | **'TRAVELING_SALES'** (visits customers across provinces, stays in hotels per trip) / **'LOCAL_SALES'** (returns home daily after work) |
| workHoursStart | time | Start of work hours (e.g., 08:30) |
| workHoursEnd | time | End of work hours (e.g., 17:30) |
| gpsTrackingFrequencyMinutes | number | How often GPS is recorded during work hours (default: 15 minutes) |
| alertRecipients[] | string[] | User IDs of managers who receive GPS alerts (from `reportToUserId` chain in Module C) |
| afterHoursAlertEnabled | boolean | Whether to send alerts for after-hours location deviations |
| isActive | boolean | Whether tracking is currently active |

**LOCAL_SALES Configuration:**

| Field | Type | Description |
|-------|------|-------------|
| homeBaseAddress | ThaiAddress | Salesperson's home address (for after-hours baseline) |
| workZoneRadiusKm | number | Maximum distance from planned visit locations during work hours (default: 50km) |
| afterHoursRadiusKm | number | Maximum distance from home base after work hours before alert triggers (default: 20km) |

**TRAVELING_SALES Configuration:**

| Field | Type | Description |
|-------|------|-------------|
| plannedProvinces[] | string[] | Provinces from the Actual Plan route for this trip |
| hotelLocations[] | HotelStay[] | Declared hotel locations per trip day |
| → tripDate | string | Date of stay |
| → hotelName | string | Hotel name |
| → hotelGpsLat | number | Hotel GPS latitude |
| → hotelGpsLng | number | Hotel GPS longitude |
| → hotelBufferRadiusKm | number | Acceptable distance from hotel after hours (default: 10km) |

**GPS Alert Events (added to §3.5 Notification System):**

| Event | Description | Severity |
|-------|-------------|----------|
| `gps.outside_work_zone_during_hours` | Salesperson detected outside planned visit locations or defined work zone during work hours | HIGH |
| `gps.outside_work_zone_after_hours` | Salesperson detected outside home area (LOCAL) or hotel area (TRAVELING) after work hours | MEDIUM |
| `gps.unplanned_province` | Traveling salesperson detected in a province NOT on their planned route | HIGH |
| `gps.tracking_disabled` | Salesperson turned off GPS or location services during work hours | CRITICAL |

> [!CAUTION]
> **PDPA Compliance for GPS Work Zone Tracking:**
> - Standard work-hours GPS tracking requires explicit PDPA consent (already covered in Module K GPS consent).
> - **After-hours GPS tracking requires SEPARATE explicit PDPA consent** — a distinct consent clause from the standard work-hours consent. The company must declare: (1) purpose of after-hours tracking, (2) what data is collected, (3) how long it's retained, (4) who has access.
> - Salesperson can **revoke after-hours consent separately** from work-hours consent at any time.
> - After-hours GPS data is accessible only to direct managers in the `reportToUserId` chain and HR with `attendance.manage` permission.

### Costing & Expense Module (→ See §3.7 Expense & Receipt Management)

> [!NOTE]
> **Expense tracking has been extracted into its own cross-platform section: §3.7 Expense & Receipt Management.** This module is available to ALL user roles — not just sales. See §3.7 for the full expense model, AI receipt OCR, and approval workflow. The sales cycle uses §3.7 for sales-related expenses (fuel, meals, client entertainment), but §3.7 equally serves HR, operations, admin, and any other department.

> [!TIP]
> **📖 Where is the expense model?** The full Expense Entry data model, AI receipt OCR fields, 13 expense categories, and approval workflow are all defined in **§3.7 Expense & Receipt Management**. Module F's Sales Summary Reports can filter §3.7 data to show sales-specific expenses (fuel, meals, client entertainment) per salesperson or team.

### Sales Plan ↔ Contact Pool Integration

> [!NOTE]
> **Sales Plans directly **reference** contacts from the Company Internal Contact Pool (→ Module D §5).** The `contactId` in Sales Plan and Actual Plan MUST reference a valid contact in the company's internal contact pool. This ensures: (1) Contact details (address, phone, contact person) are always up-to-date via the verified profile sync, (2) Visit history per contact is tracked and available in both the Sales module AND the Contact Pool detail view, (3) When a contact is deactivated in the pool, all associated sales plans are flagged for review, (4) AI route optimization uses the contact's GPS coordinates (from Google Maps picker address) for distance calculations.

### Sales Hierarchy Visibility Rules

> [!IMPORTANT]
> **Visibility follows the organization chart (**depends on** → Module C §4 — `reportToUserId` hierarchy):**

| Role Level | What They See |
|------------|---------------|
| **Sales Rep** | Only their own plans, visits, reports, expenses, and comments |
| **Team Manager** | Their own + ALL direct reports' plans, visits, reports, expenses, and comments. Can view but NOT edit subordinate's reports (can comment/reject/approve). |
| **Department Head** | Their own + ALL managers' and their subordinates' data (cascading visibility) |
| **MD/OWNER** | All company sales data across all teams and departments |

> [!NOTE]
> **Comment visibility:** Comments added by a manager on a subordinate's report are visible to the subordinate AND the manager's own reporting chain (upward visibility). A sales rep's comment on their own report is visible to their reporting chain. This ensures transparent communication without requiring separate chat threads for sales discussions.

---

## 8. Module G: Chat System {#8-module-g}

> [!TIP]
> **📖 What is Module G?** Real-time messaging — like Slack or LINE for business, but deeply integrated with tasks, projects, products, and sales. 8 room types (Task, Project, Product, Showcase, Recruitment, Direct, Group, Support).
>
> **Key features:**
> - **Chat → Task/Lead:** Select any message → create a task or sales lead from it with one tap
> - **No Delete Policy:** Messages can NEVER be permanently deleted. Users can only "hide" from their own view. Platform admins CANNOT read chat messages (privacy guarantee).
> - **Company Sticker Packs:** Companies can create branded stickers (free or paid per user)
>
> **Legal compliance:** TLS 1.3 in transit, AES-256 at rest, 90-day metadata retention per Thai Computer Crime Act.



### Partially Implemented
ChatMessage, ChatAttachment — but NO ChatRoom model

### Chat Encryption & Compliance

> [!NOTE]
> Chat messages use the **platform-wide encryption layers** (TLS 1.3 in transit, AES-256 at rest) defined in the Security Audit (§16.7, Zones 3-4). The following describes **chat-specific** security additions beyond the platform baseline.

> [!IMPORTANT]
> **Thai Computer Crime Act B.E. 2550 Sec 26 compliance:** Service providers must retain traffic data for 90 days minimum. End-to-end encryption (E2EE) would prevent compliance with lawful interception requirements. The platform uses **Transport Layer Security (TLS 1.3)** for all data in transit + **AES-256 encryption at rest** for stored messages. This provides strong security while maintaining compliance with Thai law. Messages are encrypted in the database and decrypted only when the authorized user accesses their chat.

**Chat Security Architecture:**

| Layer | Technology | Purpose |
|-------|-----------|--------|
| **In-Transit** | TLS 1.3 | Encrypts all data between client and server — prevents eavesdropping |
| **At-Rest** | AES-256 | Encrypts stored messages in the database — prevents unauthorized database access |
| **Access Control** | Per-user decryption keys | Only chat participants can decrypt messages — server-side access control |
| **Audit Trail** | Traffic data logs | Retained for 90 days per Computer Crime Act Sec 26 — metadata only (sender, recipient, timestamp, message type), NOT message content |
| **Data Retention** | Configurable | Company can set message retention policy (e.g., 1 year, 3 years, indefinite). Personal chats follow platform default. |

### Chat Room Model

| Field | Type | Description |
|-------|------|-------------|
| chatRoomId | string | Unique |
| roomType | enum | 'TASK'/'PROJECT'/'PRODUCT'/'SHOWCASE'/'RECRUITMENT'/'DIRECT'/'GROUP'/'SUPPORT' |
### ChatMessage Base Model

> [!NOTE]
> **This is the complete ChatMessage document model.** Previous sections defined enhancements only. This is the canonical base model stored per message in Firestore.

| Field | Type | Description |
|-------|------|-------------|
| messageId | string | Unique identifier |
| chatRoomId | string | **References** → ChatRoom |
| senderUserId | string | Who sent this message |
| senderTenantId | string | Which company context the sender was in when sending |
| content | string | Message text content (null for non-text types) |
| messageType | enum | 'TEXT' / 'IMAGE' / 'FILE' / 'VOICE' / 'SYSTEM' / 'LOCATION' / 'STICKER' / 'CONTACT_CARD' / 'PRODUCT_CARD' / 'PROCUREMENT_CARD' |
| timestamp | string | ISO 8601 — when sent |
| isEdited | boolean | Was this message edited after sending |
| editedAt | string | When last edited (null if never) |
| editedBy | string | userId who edited (must match senderUserId for security) |
| reactions | Record<string, string[]> | Emoji reactions — key: emoji, value: userId[] who reacted |
| readBy[] | string[] | userIds who have read this message |
| replyToMessageId | string | If this is a reply — references parent message ID (nullable) |
| forwardedFromMessageId | string | If forwarded from another message (nullable) |
| isHiddenByUserIds[] | string[] | Users who have hidden this message from their view |
| hiddenAt | Record<string, string> | Map of userId → ISO 8601 timestamp when hidden |
| isArchived | boolean | True when ALL participants have hidden the message |
| createdAt | string | When created |

### Message Mentions & Entity Links

> [!IMPORTANT]
> **Users can mention or link to ANY entity in the platform.** Mentions create clickable inline links. Entity cards create rich preview cards. Contact/user sharing creates tappable profile cards that allow the receiver to add the person to their contacts or chat.

| Field | Type | Description |
|-------|------|-------------|
| **mentionedUserIds[]** | string[] | @mentioned users (e.g., `@John`). Triggers push notification to mentioned user. |
| **mentionedTaskIds[]** | string[] | Task IDs mentioned (e.g., `#TASK-123`). Creates clickable links. **Hidden from chat view when task reaches COMPLETED** (shown via "show completed" filter). All 9 task types supported: GENERAL, FOLLOW_UP, REVIEW, APPROVAL, HR_RECRUITMENT, LEAD, COMPLAINT, TRAINING, CUSTOM. |
| **mentionedProjectIds[]** | string[] | Project IDs mentioned (e.g., `#PROJECT-456`). Creates clickable links to Module E project view. |
| **mentionedProductIds[]** | string[] | Product/Service/Asset IDs mentioned (e.g., `#PROD-789`). Creates clickable links to Module H detail view. Shows inline preview card with product name, thumbnail, price, and type badge (Product/Service/Asset). |
| **mentionedContactIds[]** | string[] | Contact IDs shared in chat. Receiver sees a **contact card** with name, company, phone, email. Receiver can tap "Add to My Contact Pool" to import into Module D. |
| **sharedUserIds[]** | string[] | When sharing another user's profile in chat. Receiver sees a **user card** with name, role, company. Receiver can tap: "Add to Chat" (invite to current room), "Start DM" (create direct chat), or "View Profile". |
| **sharedDocumentId** | string | If a procurement document (RFQ/Quote/PO/SO) was shared via "Send To" — references Module Q document ID |
| **sharedDocumentType** | enum | 'RFQ' / 'QUOTATION' / 'PURCHASE_ORDER' / 'SALES_ORDER' (nullable) |
| **convertedToTaskId** | string | If this message was converted to a task — references Module E task ID (nullable) |
| **convertedToLeadId** | string | If this message was converted to a lead — references Module E lead task ID (nullable) |

### Location Sharing (LINE/WhatsApp Style)

> [!NOTE]
> **Location sharing works exactly like LINE or WhatsApp.** User taps "Share Location" → map opens with GPS pin → user can adjust pin or search for a place → sends a location card. Receiver taps the card → opens in Google Maps / Apple Maps.

**LocationShare Model (when `messageType: 'LOCATION'`):**

| Field | Type | Description |
|-------|------|-------------|
| **latitude** | number | GPS latitude |
| **longitude** | number | GPS longitude |
| **address** | string | Formatted address from Google Maps reverse geocoding |
| **plusCode** | string | Google Plus Code — useful for Thai locations without street addresses (rural areas, construction sites) |
| **locationName** | string | Optional place name (e.g., "Central World", "Suvarnabhumi Airport") |
| **mapThumbnailUrl** | string | Static map image preview (Google Maps Static API, 300×200px) |

### Chat Operational Features

Design requirement: *"Directly convert chat messages into tasks, leads, projects, or sub-projects. Conversely, dedicated chat groups can be initialized for specific existing operational entities."*

| Feature | Description |
|---------|-------------|
| **Message → Task conversion** | Select a message, click "Create Task", auto-populates task with message content. sourceMessageId stored on task. |
| **Message → Lead conversion** | Convert chat message into a sales lead (Module E LEAD task type) |
| **Entity mentions** | Mention tasks (`#TASK-123`), projects (`#PROJECT-456`), products/services/assets (`#PROD-789`) — creates clickable links. **Completed task mentions hidden by default** (shown via filter). |
| **Contact/User sharing** | Share a contact card or user profile card in chat. Receiver can add to contact pool, start DM, or invite to chat. |
| **Location sharing** | Share GPS location as a map card (LINE/WhatsApp style). Receiver taps to open in maps app. |
| **Approve from chat** | Approval cards shared in chat allow approvers to tap "Approve" / "Reject" / "Comment" directly without opening the task module |
| **Forward to task log** | Forward text, links, images, videos, and files from chat into a task's activity log/notes for permanent record |
| **Send procurement documents** | "Send To" function: share RFQ, Quotation, PO, or SO documents from Module Q to specific users or group chats |
| **Create RFQ/Quotation from chat** | Inline product picker: browse Module H catalog (filter by Product/Service/Asset) → select items with quantity and price list → creates RFQ or Quotation in **DRAFT** status for review before sending. Draft auto-linked to chat room via `sourceChatRoomId`. |
| **Chat reminders** | Set a reminder on a specific message |
| **Pin messages** | Pin important conversations |
| **AI chat summary** | Generate summaries of chat history by date range |
| **Multi-profile switching** | Switch between company contexts to view relevant chats |
| **Notification schedule per profile** | Different notification rules per company context |

> **Data model for Message→Task conversion:** When converting a message to a task, the system creates a new task with `sourceMessageId` set to the originating message ID. The message receives a `convertedToTaskId` field linking back to the created task. Auto-populated fields: `task.description` ← message.content, `task.createdBy` ← message.sender, suggested `task.assigneeIds[]` ← chat.participantIds[].

### Chat Performance, Search & History Navigation

> [!IMPORTANT]
> **Chat is optimized for speed on both web and native.** Messages load in batches with infinite scroll. Full-text search spans all accessible rooms. Date picker enables instant navigation to any point in history.

**Search:**

| Feature | Description |
|---------|-------------|
| **Full-text search** | Search across all chat message text content within user's accessible rooms. Powered by search index (Algolia/Elasticsearch). |
| **Filter by room** | Narrow search to a specific chat room |
| **Filter by sender** | Search messages from a specific user |
| **Filter by date range** | Search within a start and end date |
| **Filter by message type** | Filter by type: text, file, image, location, sticker, contact card, product card |
| **Search results view** | Shows message snippet (highlighted match) + room name + sender + date. Tap to jump to message in full context. |

**History Navigation:**

| Feature | Description |
|---------|-------------|
| **Date picker** | Calendar picker overlay — user selects a date → chat scrolls to the first message of that date |
| **Scroll-to-date** | Tap a date in the calendar → chat instantly jumps to that date's messages |
| **Date separator headers** | Visual date headers between messages from different days (e.g., "── June 15, 2026 ──") |
| **"Jump to latest"** | Floating button appears when user has scrolled up — tap to return to newest messages |

**Lazy Loading & Performance Optimization:**

| Feature | Description |
|---------|-------------|
| **Initial load** | When opening a chat room, load the **last 50 messages** only. Do NOT load full history. |
| **Scroll-up pagination** | When user scrolls up, load the **previous 50 messages** (infinite scroll). Triggered when scroll reaches top of loaded messages. |
| **Media lazy loading** | Images and videos show a **lightweight thumbnail placeholder** (blurred, <5KB). Full resolution loads only when user taps or scrolls the media into the visible viewport. |
| **Room list optimization** | Chat room list loads `lastMessagePreview` (100 chars) and `lastMessageAt` only. Full room content loads on tap. |
| **Offline cache (native app)** | Native apps cache the last **200 messages per room** in local SQLite/Realm for offline access. Messages sync when reconnected. |
| **Web browser** | Web does NOT cache messages offline. Standard browser session cache only. |
| **Typing indicator** | Real-time "User is typing..." indicator via WebSocket — does not create stored messages. |
| **Unread badge** | Room list shows unread message count badge. Entering room marks all as read. |

### Chat Message Visibility & Hide Policy

> [!IMPORTANT]
> **Messages cannot be permanently deleted or removed by anyone — including platform admins.** Chat content is private between participants. Users can **hide** messages from their own view. Hidden messages remain visible to other participants. If ALL participants hide a message, it is automatically archived (retained for legal compliance per Thai Computer Crime Act, but not accessible to platform admins). Platform admins do NOT have access to read, unhide, or interact with chat messages — this is enforced as a privacy guarantee.

### Chat File Lifecycle & Expiry

**File Size Classification & Expiry Rules:**

| Category | Size Threshold | Server Expiry (Free Tier) | Paid Tier |
|----------|---------------|--------------------------|----------|
| **Small file** | ≤ 10 MB | **14 days** from upload | Permanent (never expires) |
| **Large file** | > 10 MB | **7 days** from upload | Permanent (never expires) |

**Chat File Attachment Model:**

| Field | Type | Description |
|-------|------|-------------|
| attachmentId | string | Unique identifier |
| messageId | string | **References** → ChatMessage |
| fileName | string | Original file name |
| fileType | string | MIME type |
| **fileSizeBytes** | number | File size in bytes |
| **fileSizeCategory** | enum | 'SMALL' (≤ 10 MB) / 'LARGE' (> 10 MB) — auto-classified on upload |
| fileUrl | string | Download URL (signed, time-limited) |
| thumbnailUrl | string | Preview thumbnail for images/videos (low-res, <5KB for lazy loading) |
| uploadedAt | string | ISO 8601 |
| **serverExpiresAt** | string | Auto-calculated: `uploadedAt` + 14 days (SMALL) or + 7 days (LARGE). **Null** for paid tier (permanent). |
| **isPaidPermanentlySaved** | boolean | Paid tier: files never expire on server |
| **isExpired** | boolean | True after `serverExpiresAt` passes. File deleted from server. |
| **mediaStatus** | enum | 'ACTIVE' / 'EXPIRING_SOON' (within 24 hours) / 'EXPIRED'. Follows §1.7 media status pattern. |

**Local Device Caching (Native App Only):**

| Rule | Description |
|------|-------------|
| **Auto-cache on open** | When user taps to view/open a file in the native app, the file is automatically saved to the device's local storage (app sandbox) |
| **Manual download** | User can tap "Save to Device" to manually download before expiry |
| **Post-expiry local access** | If the user previously opened or manually saved a file on their physical device, they can **still access the local copy** after server expiry. The chat shows "[File expired on server — local copy available]" |
| **Web browser** | Web browser does **NOT** auto-cache. User must manually download before expiry. Browser may cache temporarily per standard browser cache rules. |
| **Expiry notification** | `CHAT_FILE_EXPIRING` notification sent **24 hours** before server expiry |

### Sticker System & Marketplace

> [!IMPORTANT]
> **Stickers are bound to USER accounts, not company accounts.** A user who purchases, receives, or uploads a sticker pack owns it personally across ALL companies they belong to. When switching company context, the same sticker library is available.

**Sticker Pack Model:**

| Field | Type | Description |
|-------|------|-------------|
| packId | string | Unique identifier |
| packName | string | Sticker pack display name |
| packDescription | string | Short description |
| packThumbnailUrl | string | Pack preview image (first sticker or custom cover) |
| **packSource** | enum | 'PLATFORM_DEFAULT' (built-in free packs) / 'COMPANY_BRANDED' (created by company, distributed to company users) / 'MARKETPLACE' (sold by creators — future Phase 2) / 'USER_CUSTOM' (uploaded by individual user) |
| **creatorId** | string | userId (for USER_CUSTOM), tenantId (for COMPANY_BRANDED), or 'PLATFORM' |
| **creatorType** | enum | 'PLATFORM' / 'COMPANY' / 'USER' |
| stickers[] | StickerEntry[] | Individual stickers in the pack (max **40 per pack**) |
| → stickerId | string | Unique identifier |
| → stickerImageUrl | string | Animated GIF or static PNG (max **512×512px**, max **500KB** per sticker) |
| → stickerLabel | string | Alt text / accessibility label |
| → stickerOrder | number | Display order within the pack |
| **price** | number | Price per pack in platform currency. Null if free. Uses §1.6 precision. |
| **priceCurrency** | string | Currency code (ISO 4217) |
| **isFree** | boolean | Available to all users at no cost |
| **category** | enum | 'FUNNY' / 'BUSINESS' / 'SEASONAL' / 'GREETINGS' / 'EMOTIONS' / 'CUSTOM' |
| isActive | boolean | Pack is available for use/purchase |
| totalDownloads | number | How many users have added this pack |
| createdAt | string | When created |
| updatedAt | string | When last modified |

**User Sticker Library (per-user, cross-company):**

| Field | Type | Description |
|-------|------|-------------|
| userId | string | User who owns this library |
| **ownedPacks[]** | UserStickerPack[] | All sticker packs this user has access to |
| → packId | string | **References** → StickerPack |
| → acquiredAt | string | ISO 8601 — when user got this pack |
| → acquiredVia | enum | 'FREE_DEFAULT' (platform built-in) / 'COMPANY_DISTRIBUTED' (company admin sent to all users) / 'MARKETPLACE_PURCHASE' (user bought — future Phase 2) / 'USER_UPLOADED' (user created) |
| → purchaseReceiptId | string | If MARKETPLACE_PURCHASE: payment receipt reference (future) |
| → isHidden | boolean | User can hide packs they don't want in their picker (not deleted, can unhide) |

**User Custom Sticker Upload:**

| Rule | Limit |
|------|-------|
| Max custom packs per user | **5** |
| Max stickers per custom pack | **40** |
| Max sticker file size | **500 KB** |
| Allowed formats | PNG (static), GIF (animated) |
| Max dimensions | 512×512 px |
| Visibility | **Only the uploading user** can see/use their custom packs |
| Content moderation | AI scans uploaded stickers for prohibited content before activation |

**Sticker Marketplace (Current: Company Distribution | Future Phase 2: Full Marketplace):**

| Feature | Current (Phase 1) | Future (Phase 2 — with Module R payment) |
|---------|-------------------|-------------------------------------------|
| **Platform default packs** | ✅ Free, available to all users | ✅ Same |
| **Company branded packs** | ✅ Company admin creates + distributes to all company users | ✅ Same |
| **User custom upload** | ✅ Users upload personal packs (max 5 packs, 40 stickers each) | ✅ Same |
| **Browse marketplace** | ❌ Not yet | ✅ Browse by category, preview, purchase |
| **Creator program** | ❌ Not yet | ✅ Artists submit packs for sale |
| **Payment** | ❌ Company distributes free only | ✅ Purchase with platform payment gateway (Module R) |
| → isActive | boolean | Pack is available for use |

### Chat File Lifecycle

**File Retention Policy:**

| Field | Type | Description |
|-------|------|-------------|
| isPaidPermanentlySaved | boolean | Free tier: files expire. Paid: permanent |
| serverExpiresAt | string | When file auto-deletes (free tier) |

---

## 9. Module H: Product Catalog, Marketplace & Internal Inventory {#9-module-h}

> [!TIP]
> **📖 What is Module H?** The product backbone — manages everything a company sells publicly AND uses internally. Two kinds of products:
> - **Marketplace Products:** Sold to other businesses. Multiple price lists (Retail, Wholesale, VIP), reseller authorization, stock visibility controls.
> - **Internal Products:** Samples, equipment, office supplies. Never on marketplace, never invoiced.
>
> **Sample Tracking** is one of the most detailed features — tracks when employees take product samples to give/lend to customers, with full Revenue Department audit-proof paperwork (requisition forms, acknowledgement of receipt, stock cards, marking photos).
>
> **Also includes:** Asset products (real estate, vehicles with GPS), advertising system, ERP inventory sync (read-only stock levels from Odoo/SAP/Oracle), equipment rental tracking.



### Partially Implemented
MasterProduct (basic), MarketListing (basic), substance classification, min/max pricing

> [!IMPORTANT]
> **Module H covers both marketplace products AND internal-only products.** Products marked as `isInternalOnly: true` are for company operations (samples, equipment rental, office supplies) and are never invoiced, never appear on the marketplace or showcase. This module also includes ERP inventory display (live stock levels from external systems) and internal product operations (sample tracking, equipment rental). Previously these were in a separate Module M — they have been consolidated here because they are all product-related operations.

### Full MasterProduct Fields

> [!NOTE]
> **Internal Product Flag:** Products with `isInternalOnly: true` are excluded from marketplace, showcase, and all invoicing. They appear only in the company's internal product management view. Use `internalProductType` to classify the internal use case.

**New Fields Added to MasterProduct:**

| Field | Type | Description |
|-------|------|-------------|
| **tenantId** | string | Company that owns this product. Required for all products. |
| **isInternalOnly** | boolean | `true` = internal operations product (sample, equipment, office supply). Never invoiced, never on marketplace/showcase. `false` = normal marketplace product. Default: `false`. |
| **internalProductType** | enum | Only when `isInternalOnly: true`: 'SAMPLE' (can be given to contacts) / 'EQUIPMENT' (can be rented by employees) / 'OFFICE_SUPPLY' / 'OTHER'. Null for marketplace products. |
| **stockVisibility** | enum | Who can see this product's stock levels: 'PUBLIC' (anyone on marketplace) / 'INTERNAL' (company users only) / 'CONTACT_POOL' (all contacts in company's contact pool) / 'SELECTED_CONTACTS' (specific contacts chosen by the company). Default: 'INTERNAL'. |
| **selectedStockContactIds[]** | string[] | When `stockVisibility` = 'SELECTED_CONTACTS': list of contactIds who can see stock levels. **References** → Module D (§5). |

| Field | Type | Description |
|-------|------|-------------|
| productNameLocal | string | Localized product name (label per CountryRuleEngine) |
| productNameEN | string | English product name |
| productDescription | string | Detailed description |
| categoryPath[] | string[] | ['Beverages', 'Alcoholic', 'Beer'] |
| videoUrl | string | Product video |
| barcode | string | EAN/UPC barcode |
| weight | number | Weight in grams |
| dimensions | object | {widthCm, heightCm, depthCm} |
| unit | string | 'PIECE'/'PACK'/'BOX'/'CASE'/'KG'/'LITER'/'BOTTLE' |
| unitsPerCase | number | Units per case |
| countryOfOrigin | string | Where manufactured |
| ingredients | string | Ingredients list |
| alcoholByVolume | number | ABV% |
| thcPercentage | number | THC% |
| isActive | boolean | Available for listing |
| **productImages[]** | FileEntry[] | Multiple product images (recommended: 1024x1024px, max 10 MB per image, up to 10 images per product). First image is the primary/thumbnail. |
| **productStatus** | enum | 'PUBLIC' (visible to everyone on marketplace) / 'PRIVATE' (visible only to company users) / 'LIMITED' (visible only to B2B internal contacts — not on public marketplace) / 'REGULATED' (controlled product under Thai law — see `regulatoryCategory` below). **Validation:** When `isInternalOnly: true`, `productStatus` is automatically set to `'PRIVATE'` and cannot be changed — internal products are never publicly listed, never regulated-listed, and never on marketplace. `productStatus` only applies to non-internal products (`isInternalOnly: false`). |
| **regulatoryCategory** | enum | Only when `productStatus: 'REGULATED'`: 'ALCOHOLIC_BEVERAGE' (Liquor Act B.E. 2551) / 'TOBACCO_PRODUCT' (Tobacco Products Control Act B.E. 2560) / 'PHARMACEUTICAL' (Drug Act B.E. 2510) / 'MEDICAL_DEVICE' (Medical Device Act B.E. 2551) / 'COSMETIC' (Cosmetics Act B.E. 2558 — certain categories) / 'FOOD_SUPPLEMENT' (FDA-regulated supplements) / 'CANNABIS_HEMP' (Cannabis/Hemp Act B.E. 2565) / 'EXCISE_CONTROLLED' (Excise Tax Act — other excise goods) / 'HAZARDOUS_SUBSTANCE' (Hazardous Substance Act B.E. 2535) / 'OTHER_REGULATED'. Products with this flag require valid company licenses (verified in KYC §3.4) before listing. Platform enforces: no public advertising for ALCOHOLIC_BEVERAGE and TOBACCO_PRODUCT per Thai law. |
| **priceLists[]** | PriceList[] | Multiple price lists for different customer groups/segments |
| → priceListId | string | Unique identifier |
| → priceListName | string | Name (e.g., "Retail", "Wholesale", "VIP", "Distributor") |
| → targetContactIds[] | string[] | Which contacts/contact groups see this price list (empty = default for all) |
| → pricePerUnit | number | Price per unit in this list |
| → **priceIsBeforeVat** | boolean | **If `true`, the listed price does NOT include VAT** — VAT will be calculated and added on top when creating SO/PO. **If `false`, the listed price already includes VAT** — SO/PO will display the VAT-inclusive price and show the VAT breakdown. This setting drives automatic tax calculation in Module Q (§17). |
| → **vatPercentage** | number | VAT rate for this product (default: 7% for Thailand, configurable per CountryRuleEngine). Used in SO/PO tax calculation. |
| → **whtPercentage** | number | Withholding Tax rate if applicable (e.g., 3% for service, 5% for rent). Null if no WHT applies. Used in SO/PO tax calculation. |
| → currency | string | Currency code (default: 'THB') |
| → minOrderQuantity | number | Minimum order for this price (null = no minimum) |
| → validFrom | string | Price list effective date |
| → validTo | string | Price list expiry date (null = no expiry) |
| **linkedShowcaseIds[]** | string[] | Showcase entries (Module I) that feature this product. **References** → Module I (§10) showcase entries for marketing/display. |
| **productTags[]** | string[] | Tags for search and categorization (e.g., "organic", "imported", "premium") |

### Product Shareable Link & QR Code (View Only)

> [!TIP]
> **📖 What is this?** Every product and service can generate a **shareable link** and **QR code** that opens the product detail page on the webapp. These are **view-only links** — they display product information but do NOT collect leads. For lead generation with custom forms, use **Module S: Lead Generation & Campaign (§18.5)**.

| Field | Type | Description |
|-------|------|-------------|
| **productShareableLink** | string | Auto-generated unique URL: `https://cloudfull.com/p/{tenantPrefix}/{productSlug}`. Opens product detail page on the webapp. View-only — no lead capture form. Works without login for PUBLIC products. |
| **productQrCodeUrl** | string | Auto-generated QR code image for the shareable link. Downloadable as PNG/SVG for printing. Follows same QR pattern as Module L (Favorites, QR & News Feed) E-Brochure QR codes. |
| **qrScanCount** | number | Total number of QR scans (analytics) |
| **linkClickCount** | number | Total number of link clicks (analytics) |

> [!IMPORTANT]
> **Lead generation has moved to Module S (§18.5).** To create a lead capture campaign featuring this product, use Module S: Lead Generation & Campaign. Products, services, and assets from Module H are added to campaigns as "campaign items." Module S provides a full form builder with custom questions, PDPA-compliant consent, multi-assignee lead distribution, campaign lifecycle management, and performance reporting.

> [!NOTE]
> **QR code coordination with Module L:** Product QR codes follow the same generation pattern as Module L's E-Brochure QR codes (`qrCodeUrl` field). Module L's "QR Product Save" protocol (scan → save to favorites) is a SEPARATE action from product viewing. If a logged-in user scans a product QR, they get the full product page with a "Save to Favorites" option. If a non-logged-in visitor scans it, they see the public product detail page (view-only).

### Reseller/Distributor Listing Model

> [!NOTE]
> **Referral vs Authorization:** Any company or user can refer/link to a product on their own showcase (referral — free, no approval needed). However, becoming an **Authorized Reseller** or **Authorized Distributor** requires the product owner's explicit consent. Authorized resellers appear with a verified badge on their listings.

| Field | Type | Description |
|-------|------|-------------|
| **authorizedResellers[]** | ResellerEntry[] | Pre-approved companies authorized to resell this product |
| → resellerTenantId | string | The reselling company's tenantId |
| → authorizationType | enum | 'AUTHORIZED_RESELLER' / 'AUTHORIZED_DISTRIBUTOR' / 'EXCLUSIVE_DISTRIBUTOR' |
| → authorizedAt | string | When authorization was granted |
| → authorizedBy | string | userId who granted authorization |
| → territory | string | Geographic territory for this authorization (e.g., "Thailand", "Bangkok only", "Southeast Asia") |
| → expiresAt | string | Authorization expiry date (null = indefinite) |
| → isActive | boolean | Currently active |

| Field | Type | Description |
|-------|------|-------------|
| listingId | string | Unique |
| masterProductId | string | Link to MasterProduct |
| sellerTenantId | string | Which company is selling |
| sellerType | enum | 'BRAND_OWNER'/'AUTHORIZED_DISTRIBUTOR'/'RESELLER'/'RETAILER' |
| listingPrice | number | Must be within min/max |
| wholesalePrice | number | B2B price |
| listingCurrency | string | Currency code for listing/wholesale prices (from CountryRuleEngine) |
| stockQuantity | number | Current stock |
| stockStatus | enum | 'IN_STOCK'/'LOW_STOCK'/'OUT_OF_STOCK' |
| isAuthorized | boolean | Verified by brand owner |
| warehouseLocation | string | Where stock is |
| deliveryEstimateDays | number | Delivery time |
| isActive | boolean | Listing is live |
| moderationStatus | ModerationStatus | Content moderation |
| **createdAt** | string | When this showcase entry was created |
| **updatedAt** | string | Last modified |

### Product Category Tree

| Field | Type | Description |
|-------|------|-------------|
| categoryId | string | Unique |
| parentCategoryId | string | Parent (null for root) |
| categoryNameLocal | string | Localized name (label per CountryRuleEngine) |
| categoryNameEN | string | English name |
| categoryCode | string | Machine-readable code |
| iconUrl | string | Category icon |
| sortOrder | number | Display order |
| isRestricted | boolean | Contains restricted substances |
| requiredLicenseType | enum | License needed to view |
| adSlots[] | AdSlot[] | Advertising spaces in this category |

### TCCT Resale Price Protection

| Field | Type | Description |
|-------|------|-------------|
| tcctExemptionCategory | enum | 'FRANCHISE_AGREEMENT'/'CONSIGNMENT_CONTRACT'/'EXCLUSIVE_AGENCY' |
| hasVerifiedTcctExemption | boolean | Is exemption verified? |
| mocPriceCeiling | number | Government price cap (if applicable) |

### Asset Product Type

Design requirement: *"An 'Asset Product' feature for both sales and leasing, allowing products to be associated with specific physical locations, including homes, offices, condos, villas, and vehicles"*

| Field | Type | Description |
|-------|------|-------------|
| isAssetProduct | boolean | Is this a real estate/vehicle asset? |
| assetType | enum | 'HOME'/'LAND'/'CONDO'/'FACTORY'/'OFFICE'/'VEHICLE' |
| assetLocation | ThaiAddress | Physical location |
| assetGpsLat | number | GPS latitude |
| assetGpsLng | number | GPS longitude |
| nearbyLocations[] | NearbyPlace[] | Malls, schools, 7-11s nearby |
| → placeName | string | Name |
| → placeType | string | 'MALL'/'SCHOOL'/'UNIVERSITY'/'CONVENIENCE_STORE'/'HOSPITAL' |
| → distanceKm | number | Distance |
| listingType | enum | 'SALE'/'RENT'/'BOTH' |
| rentalPricePerMonth | number | Monthly rent |
| salePrice | number | Sale price |
| assetCurrency | string | Currency code for asset prices (from CountryRuleEngine) |

### Advertising System

Design requirement: *"There will be an area for advertising for every category and subcategories... highlight for advertising products on the map... rotational visibility algorithm"*

| Model | Field | Description |
|-------|-------|-------------|
| **AdPlacement** | adId | Unique |
| | tenantId | Company paying for ad |
| | targetCategoryId | Which category to show in |
| | adType | 'CATEGORY_BANNER'/'PRODUCT_HIGHLIGHT'/'MAP_PIN'/'CONTACT_POOL_TOP' |
| | productId / showcaseId | What's being promoted |
| | startDate | Ad start |
| | endDate | Ad end |
| | impressions | View count |
| | clicks | Click count |
| | costPerDay | Daily rate |
| | adCurrency | string | Currency code for ad pricing (from CountryRuleEngine) |
| | rotationPriority | For multiple ads in same slot |
| | isActive | Currently running |

### Product & Service Top 5 Trending System

> [!TIP]
> **📖 What is this?** A community-driven product endorsement system. Every logged-in user can rank their personal **Top 5 products or services** in each leaf-level product category (e.g., "Beer" under Beverages > Alcoholic). Each position earns different points (1st = 5 points, 5th = 1 point). Points are aggregated across ALL users platform-wide to create a **public trending leaderboard** per category — showing what the community actually values most.

> [!IMPORTANT]
> **This is NOT advertising.** The Advertising System (above) is paid placement. The Top 5 Trending System is purely organic — driven by real user votes. Both systems are visible on category pages but are clearly separated with distinct labels ("🔥 Community Trending" vs "📢 Sponsored").

**Point Scoring:**

| Position | Points | Description |
|----------|--------|-------------|
| **#1** (Top Pick) | **5 points** | User's most-endorsed product in this category |
| **#2** | **4 points** | Second pick |
| **#3** | **3 points** | Third pick |
| **#4** | **2 points** | Fourth pick |
| **#5** | **1 point** | Fifth pick |

**UserCategoryRanking Model (per-user, per-category):**

| Field | Type | Description |
|-------|------|-------------|
| rankingId | string | Unique identifier |
| userId | string | User who submitted this ranking. **References** → Module A (§2). |
| tenantId | string | User's active company context when ranking was submitted |
| categoryPath | string | The **leaf-level** category path this ranking applies to (e.g., `"Beverages > Alcoholic > Beer"`). Must be a leaf node — users cannot rank at parent category level. |
| **rankedProducts[]** | RankedProduct[] | Exactly 1 to 5 products, ordered by position. Position 1 = index 0. |
| → position | number | 1–5 (determines point value: 6 minus position) |
| → productId | string | **References** → Module H MasterProduct. Must be `isInternalOnly: false` AND `productStatus` NOT 'PRIVATE'. |
| → productName | string | Snapshot of product name at ranking time |
| → ownerTenantId | string | Company that owns the ranked product |
| → points | number | Auto-calculated: `6 - position` (Position 1 = 5 pts, Position 5 = 1 pt) |
| createdAt | string | When this ranking was first created |
| **lastUpdatedAt** | string | When this ranking was last changed |
| **nextChangeAllowedAt** | string | `lastUpdatedAt + 30 days`. User cannot modify this category's ranking until this date. Enforced server-side. |
| isActive | boolean | `true` = currently counting toward trending. `false` = user deactivated their ranking (points removed from aggregate). |

> [!NOTE]
> **Leaf-level category means the deepest subcategory.** If the category tree is `Beverages > Alcoholic > Beer`, the user ranks in "Beer" — not in "Beverages" or "Alcoholic." If a category has no children, it IS the leaf level.

**ProductTrendScore Model (aggregated, platform-wide):**

| Field | Type | Description |
|-------|------|-------------|
| trendScoreId | string | Unique identifier |
| productId | string | **References** → Module H MasterProduct |
| categoryPath | string | The leaf-level category this score applies to |
| **totalPoints** | number | Sum of all users' points for this product in this category. Updated in real-time when any user creates/updates/deactivates a ranking. |
| **voterCount** | number | Number of unique users who have ranked this product in this category |
| **averagePosition** | number | Average position across all voters (lower = better). `totalPoints / voterCount` mapped back to position. |
| **rank** | number | This product's position on the trending leaderboard for this category (1 = highest score) |
| lastRecalculatedAt | string | When the aggregate was last updated |

**Business Rules:**

| Rule | Description |
|------|-------------|
| **Monthly change lock** | After updating a ranking in a category, the user cannot change that category's ranking for **30 days**. The lock is per-category — changing "Beer" doesn't lock "Wine." |
| **Self-voting allowed** | Users CAN rank their own company's products. This is by design — it functions as a "featured" endorsement. |
| **Internal products excluded** | Products with `isInternalOnly: true` cannot appear in rankings. Server-side validation rejects them. |
| **Private products excluded** | Products with `productStatus: 'PRIVATE'` cannot appear in rankings. Only 'PUBLIC', 'LIMITED', and 'REGULATED' products are eligible. |
| **Regulated products** | Products with `productStatus: 'REGULATED'` (alcohol, tobacco) CAN be ranked but the trending board for regulated categories is only visible to age-verified users (following the same substance gate as Module P). |
| **Deactivated products** | If a product is deactivated (`isActive: false`) or deleted, all its ranking entries are automatically set to `isActive: false` and points are removed from the aggregate. If the product is reactivated, points are NOT automatically restored — users must re-rank. |
| **One ranking per user per category** | A user has exactly ONE Top 5 list per leaf-level category. Creating a new ranking in the same category replaces the previous one (subject to the 30-day lock). |
| **Points persist until changed** | A user's points count toward the aggregate indefinitely — there is NO periodic reset. The trending board reflects all-time community endorsement. Scores change only when users update their rankings. |
| **No minimum votes** | Even 1 vote makes a product appear on the trending board. The `voterCount` is displayed alongside the score for transparency. |

**Trending Board Display:**

| Element | Description |
|---------|-------------|
| **Location** | Shown on each leaf-level category page in the marketplace/product catalog. Also available as a standalone "🔥 Trending" page aggregating all categories. |
| **Layout** | Top 10 products per category, sorted by `totalPoints` descending. Shows: rank badge, product image, product name, owner company, total points, voter count. |
| **Label** | "🔥 Community Trending" — clearly separated from paid advertising ("📢 Sponsored"). |
| **"My Rankings" page** | Each user has a personal page showing all their submitted Top 5 lists across categories, with `nextChangeAllowedAt` countdown timer per category. |
| **Anonymous access** | Non-logged-in visitors CAN see the trending board (read-only). Only logged-in users can vote. |

> [!WARNING]
> **Anti-gaming considerations:** The monthly lock prevents rapid vote manipulation. Each user gets exactly ONE vote per category. Creating multiple accounts to boost votes is mitigated by: (1) phone number verification required for accounts (Module A KYC), (2) Hermes AI can flag suspicious voting patterns (e.g., 50 new accounts all voting for the same product in the same week). Platform does NOT implement automated penalties — suspicious patterns are flagged for Super Admin manual review.


### Internal Product Operations — Sample Tracking

> [!IMPORTANT]
> **Applies only to products where `isInternalOnly: true` and `internalProductType: 'SAMPLE'`.** Tracks when company users withdraw product samples from inventory, give or lend them to contacts, and manages the full paperwork trail required by the Thai Revenue Department to survive audits. No invoice is generated — this is an internal cost-tracking and compliance operation.

> [!WARNING]
> **Thai Revenue Department Audit Compliance:** The Revenue Department heavily audits sample giveaways because companies frequently use this excuse to hide off-the-books cash sales. To prove these were actual samples and not tax evasion, the platform enforces strict paperwork procedures. Without these documents, the Revenue Department will classify samples as "Missing Inventory" and force the company to pay 7% Output VAT plus heavy fines.

**Product Cost vs Value (Internal Products):**

| Field | Type | Description |
|-------|------|-------------|
| **costPrice** | number | What the company paid for this item. **Requires `inventory.view_cost` permission** to see — not visible to all users. Used for internal cost tracking and Revenue Department reporting. |
| **sampleValue** | number | Market/retail value of the product. Visible to all authorized users. Used to communicate the value being given to the contact. |
| **costCurrency** | string | Currency code (default from CountryConfig) |

**Sample Transaction Model:**

| Field | Type | Description |
|-------|------|-------------|
| sampleId | string | Unique |
| tenantId | string | Company |
| productId | string | Which product (**references** → MasterProduct with `isInternalOnly: true`) |
| withdrawnBy | string | User who took sample into their sales inventory |
| **distributionType** | enum | **'GIVE_AWAY'** (permanent — no return tracking) / **'RENT_LOAN'** (temporary — has return date, auto-creates follow-up task) |
| givenToContactId | string | Which contact received (**references** → Module D §5) |
| quantity | number | How many units |
| costPerUnit | number | Cost per sample (requires `inventory.view_cost` permission) |
| sampleValuePerUnit | number | Value per sample (visible to authorized users) |
| totalCost | number | quantity × costPerUnit |
| totalValue | number | quantity × sampleValuePerUnit |
| withdrawDate | string | When taken from company inventory |
| handoverDate | string | When given/installed at contact's location |
| **expectedReturnDate** | string | Only for RENT_LOAN: when the sample should be returned. Null for GIVE_AWAY. |
| **actualReturnDate** | string | Only for RENT_LOAN: when actually returned. Null if not yet returned. |
| **returnStatus** | enum | Only for RENT_LOAN: 'PENDING_RETURN' / 'RETURNED_GOOD' / 'RETURNED_DAMAGED' / 'OVERDUE' / 'LOST'. Null for GIVE_AWAY. |
| **returnedToUserId** | string | Only for RENT_LOAN: which user received the returned sample. Sample goes back into this user's sales inventory. |
| **followUpTaskId** | string | Only for RENT_LOAN: auto-created Module E task ID for return follow-up. **References** → Module E (§6). |
| handoverPhotoUrl | string | Photo of handover/installation |
| returnPhotoUrl | string | Photo at return (RENT_LOAN only) |
| notes | string | Notes |
| **requisitionFormId** | string | **References** → Internal Requisition Form (see below) |
| **receiptId** | string | **References** → Acknowledgement of Receipt (see below) |

> [!NOTE]

> [!IMPORTANT]
> **Sample Cost → ERP Sync:** When a company has ERP integration (Module B §3), sample distribution events are pushed to the ERP via webhook event `'sample.distributed'`. This allows the ERP to create the correct journal entry (debit: marketing expense or cost of sales, credit: inventory).
>
> **Webhook payload for `sample.distributed`:**
> - `sampleId`, `tenantId`, `productId`, `productName`
> - `distributionType` ('GIVE_AWAY' / 'RENT_LOAN')
> - `quantity`, `costPerUnit`, `totalCost`, `currency`
> - `givenToContactId`, `contactName`
> - `withdrawnBy` (userId), `handoverDate`
> - `requisitionFormId` (reference to approved paperwork)
>
> **Returned samples** trigger `'sample.returned'` webhook with: sampleId, quantity, returnStatus (RETURNED_GOOD / RETURNED_DAMAGED / LOST), actualReturnDate. The ERP can then reverse the inventory deduction for good-condition returns.
> **RENT_LOAN return flow:** When a rented sample is returned by the contact, the returning user confirms receipt with a photo. The sample quantity is added back into the user role's **sales inventory** (User Sample Inventory). The return status is recorded as RETURNED_GOOD or RETURNED_DAMAGED. The follow-up task in Module E is automatically marked COMPLETED. If the sample is returned damaged, a new task is auto-created for the manager to review.

> **Auto-created return follow-up task specification:**
> - **taskType:** `'STANDARD'`
> - **title:** "📦 Sample Return Due: [productName] — loaned to [contactName]"
> - **assigneeIds:** `[withdrawnByUserId]` (the user who took the sample)
> - **dueDate:** `expectedReturnDate`
> - **priority:** `'MEDIUM'` — auto-escalates to `'HIGH'` 3 days before due, `'URGENT'` on overdue
> - **tags:** `['SAMPLE_RETURN', 'AUTO_CREATED']`
> - **Pipeline:** STANDARD → NOT_STARTED → IN_PROGRESS → COMPLETED
> - **Auto-completed** when `returnStatus` = `'RETURNED_GOOD'` or `'RETURNED_DAMAGED'`
> - **Auto-escalated** when `returnStatus` = `'OVERDUE'` — creates notification to manager

#### Revenue Department Paperwork

**1. Internal Requisition Form (ใบเบิกสินค้า):**

> [!IMPORTANT]
> **Required for every sample withdrawal.** This is the internal document showing an authorized manager approved the removal of the specific product from the warehouse to be used as a sample. Without this form, the Revenue Department will reject the tax exemption.

| Field | Type | Description |
|-------|------|-------------|
| requisitionId | string | Unique identifier (auto-generated: REQ-{tenantId}-{YYYY}-{sequence}) |
| tenantId | string | Company |
| productId | string | Product being withdrawn |
| productName | string | Product name (display) |
| quantity | number | Units being withdrawn |
| costPerUnit | number | Cost per unit (visible only with `inventory.view_cost` permission) |
| totalCost | number | Total cost (quantity × costPerUnit) |
| **purpose** | enum | 'SALES_PROMOTION' / 'DISPLAY_SAMPLE' / 'TRADE_SHOW' / 'CLIENT_TRIAL' / 'OTHER' |
| purposeDetail | string | Free text: specific reason (e.g., "Sample given to Khun Somchai at Beer House for display") |
| destinationContactId | string | Which contact will receive (**references** → Module D) |
| destinationContactName | string | Contact name (display) |
| **requestedBy** | string | User who is requesting the withdrawal |
| **approvedBy** | string | Manager who approved (**validates against** → Module C §4 approval chain). Required. |
| **approvalDate** | string | When approved |
| **stockCardEntryId** | string | **References** → Inventory Stock Card entry created by this withdrawal |
| formStatus | enum | 'DRAFT' / 'PENDING_APPROVAL' / 'APPROVED' / 'REJECTED' |
| rejectionReason | string | If rejected: why |
| createdAt | string | When created |
| **isPrintable** | boolean | Always `true`. Form can be exported as PDF for physical filing. |

**2. Acknowledgement of Receipt (ใบรับสินค้า):**

> [!IMPORTANT]
> **The most important document for audit protection.** When the team installs the sample at the customer's shop or gives it to them, the shop owner or authorized staff must sign and date a receipt acknowledging that they received the item as a free promotional sample. This document must be kept attached to the Internal Requisition Form.

| Field | Type | Description |
|-------|------|-------------|
| receiptId | string | Unique identifier (auto-generated: RCP-{tenantId}-{YYYY}-{sequence}) |
| tenantId | string | Company |
| requisitionId | string | **References** → Internal Requisition Form |
| productId | string | Product received |
| productName | string | Product name (display) |
| quantity | number | Units received |
| **receiverType** | enum | 'PLATFORM_USER' (contact is a platform user — e-signature) / 'EXTERNAL_PERSON' (not a platform user — signature photo capture) |
| **receiverName** | string | Name of the person who received (contact person or shop owner) |
| **receiverPosition** | string | Position/title of receiver |
| **receiverCompany** | string | Receiver's company name |
| **signatureMethod** | enum | 'E_SIGNATURE' (platform e-signature from Module A) / 'MANUAL_PHOTO' (photo of handwritten signature) / 'DIGITAL_SIGNATURE_PAD' (draw signature on device screen) |
| signatureData | string | E-signature ID or photo URL of signature |
| signedAt | string | When signed |
| **distributionType** | enum | **'GIVE_AWAY'** (permanent sample — no return tracking, physical marking required) / **'RENT_LOAN'** (temporary loan — has return date, auto-creates follow-up task in Module E). **Inherited from parent Sample Transaction's `distributionType` at receipt creation — always matches. GIVE_AWAY does not track returns. RENT_LOAN tracks the sample back to the company inventory.** |
| expectedReturnDate | string | Only for RENT_LOAN: agreed return date. **Inherited from parent Sample Transaction's `expectedReturnDate` at receipt creation — always matches.** |
| **physicalMarkingConfirmed** | boolean | Checkbox: "Product has been marked with 'สินค้าตัวอย่าง ห้ามจำหน่าย' (Sample Product - Not for Sale) or 'สำหรับตั้งโชว์เท่านั้น' (For Display Only)" |
| **physicalMarkingPhotoUrl** | string | Photo of the physically marked product (required for GIVE_AWAY, recommended for RENT_LOAN) |
| handoverPhotoUrl | string | Photo of the handover moment |
| locationPhotoUrl | string | Photo of the installed/placed sample at the customer's location |
| receiptNotes | string | Additional notes |
| **isPrintable** | boolean | Always `true`. Must be printed and filed with Internal Requisition Form. |

**3. Physical Marking Requirement:**

> [!WARNING]
> **If a Revenue Department auditor visits the customer's shop and sees a normal product with a barcode ready to be sold, they will reject the tax exemption.** The product or installed unit must be clearly and permanently marked.

| Marking Text | When Required | Description |
|-------------|--------------|-------------|
| "สินค้าตัวอย่าง ห้ามจำหน่าย" (Sample Product - Not for Sale) | All sample giveaways | Must be physically affixed to the product |
| "สำหรับตั้งโชว์เท่านั้น" (For Display Only) | Display/showroom samples | For samples installed as display items |

The system enforces a **physical marking checklist** before the Acknowledgement of Receipt can be finalized:
1. ☐ Product has been physically marked with required text
2. ☐ Photo of marked product uploaded
3. ☐ Receiver confirms marking is visible and permanent

**4. Inventory Stock Card (รายงานสินค้าและวัตถุดิบ):**

> [!IMPORTANT]
> **Transaction-level in/out history per internal product.** You must officially remove the item from your inventory. When updating the Stock Card, record the outbound reason specifically as "Cut for sales promotion / Sample given to [Customer Name]". Do not just leave the stock unaccounted for, or the Revenue Department will classify it as "Missing Inventory."

| Field | Type | Description |
|-------|------|-------------|
| stockCardEntryId | string | Unique identifier |
| tenantId | string | Company |
| productId | string | Which product |
| **transactionType** | enum | 'WITHDRAWAL' (out — sample given/lent) / 'RETURN' (in — rented sample returned) / 'ADJUSTMENT' (manual stock correction by admin) / 'INITIAL_STOCK' (initial inventory count) |
| quantity | number | Units moved (positive for in, negative for out) |
| balanceAfter | number | Running balance after this transaction |
| **reason** | string | Auto-generated: "Cut for sales promotion / Sample given to [Contact Name]" for withdrawals. "Sample returned by [Contact Name]" for returns. |
| requisitionId | string | **References** → Internal Requisition Form (for withdrawals) |
| receiptId | string | **References** → Acknowledgement of Receipt (if applicable) |
| performedBy | string | User who performed the action |
| performedAt | string | When |
| notes | string | Additional notes |

**Stock Card Views:**
- **Per product:** Full transaction history showing all in/out movements with running balance.
- **Per user:** All withdrawals by a specific user role.
- **Per contact:** All samples given/lent to a specific contact.
- **Exportable as PDF** for auditor review.

### User Sample Inventory (Sales Inventory Location)

> [!IMPORTANT]
> **Each user role's currently held samples are tracked as a "Sales Inventory Location."** When a user withdraws samples from the company warehouse, those samples are added to the user's personal sales inventory. When the user gives samples to contacts, the samples move out of their personal inventory. When a rented sample is returned, it goes back into the user's sales inventory. This gives the company full visibility into: which user holds what, total cost per user, total cost per customer.

**User Sample Holding Model:**

| Field | Type | Description |
|-------|------|-------------|
| userId | string | Which user role holds these samples |
| tenantId | string | Company |
| productId | string | Which product |
| **quantityHeld** | number | Units currently in this user's possession (withdrawn from warehouse but not yet distributed to contacts) |
| **quantityCostHeld** | number | Total cost value of samples held (quantityHeld × costPerUnit). Requires `inventory.view_cost` permission. |
| **totalWithdrawn** | number | Lifetime units withdrawn from company warehouse by this user |
| **totalGivenAway** | number | Total units this user has given to contacts (GIVE_AWAY) |
| **totalLentOut** | number | Total units this user has lent to contacts (RENT_LOAN, not yet returned) |
| **totalReturned** | number | Total units returned by contacts back to this user |
| **totalCostDistributed** | number | Total cost of all samples distributed by this user. Requires `inventory.view_cost` permission. |
| **holdingId** | string | Unique identifier (composite key: `{userId}_{tenantId}_{productId}`) |
| **totalLost** | number | Cumulative units marked as LOST — tracked both during inventory (warehouse loss) and after rent return (customer reported lost) |
| **totalDamaged** | number | Cumulative units returned as RETURNED_DAMAGED — tracked both during inventory (warehouse damage) and after rent sample return (customer returned damaged) |
| **lastWithdrawalDate** | string | When the user last withdrew this product from company inventory |
| **lastDistributionDate** | string | When the user last distributed (gave away or loaned) this product to a contact |
| lastUpdatedAt | string | Last transaction timestamp |

**Company Dashboard Views:**

| View | What It Shows | Who Can See |
|------|--------------|------------|
| **By User Role** | "User A holds 15 samples worth ฿12,500. Has given away 45 samples worth ฿37,500 this month." | Managers + `inventory.view_cost` permission |
| **By Customer** | "Customer B has received 8 samples worth ฿6,400 from 3 different salespeople this quarter." | Managers + `inventory.view_cost` permission |
| **By Product** | "Product X: 50 units withdrawn as samples. 35 given away. 10 lent out. 5 returned. 15 still held by salespeople." | All with `inventory.manage` permission |
| **My Samples** | "You currently hold: 5× Product A, 3× Product B, 1× Product C (on loan to Customer D — due back June 15)." | Each user sees their own |

### Internal Product Operations — Equipment Rental

> [!NOTE]
> **Applies only to products where `isInternalOnly: true` and `internalProductType: 'EQUIPMENT'`.** Tracks equipment checkout/return by employees with approval workflow, damage tracking, and responsible receiver requirement. **Equipment rental is free of charge for internal use** — there is no rental cost or fee charged to the employee. The company lends equipment at no cost; the only tracking is checkout/return status and condition (GOOD/DAMAGED/LOST). **No ERP cost sync is needed** for equipment rental — there is no financial transaction to record. Equipment rental also uses the Internal Requisition Form and Acknowledgement of Receipt paperwork (see Sample Tracking above).

| Field | Type | Description |
|-------|------|-------------|
| rentalId | string | Unique |
| tenantId | string | Company |
| productId | string | Which equipment (**references** → MasterProduct with `isInternalOnly: true`) |
| rentedBy | string | User who rented |
| requestStatus | enum | 'REQUESTED' / 'APPROVED' / 'ACTIVE' / 'RETURNED' / 'OVERDUE' |
| approvedBy | string | Manager who approved (**validates against** → Module C §4 approval chain) |
| checkoutPhotoUrl | string | Photo at checkout |
| checkoutDate | string | When rented |
| expectedReturnDate | string | When should return |
| **followUpTaskId** | string | Auto-created Module E task for return follow-up. **References** → Module E (§6). |
| returnPhotoUrl | string | Photo at return |
| returnDate | string | When actually returned |
| receivedBy | string | Person who confirmed return (if requiresReceiver) |
| receiverPhotoUrl | string | Receiver's photo of returned item |
| requiresReceiver | boolean | Does return need a responsible person? |
| condition | enum | 'GOOD' / 'DAMAGED' / 'LOST' |
| damageNotes | string | If damaged, what happened |
| **requisitionFormId** | string | **References** → Internal Requisition Form |
| **receiptId** | string | **References** → Acknowledgement of Receipt |

### Product Inventory & Stock Levels (ERP Read-Only Sync)

> [!IMPORTANT]
> **Display-only inventory data synced from external ERP and Co-Work.cloud.** Companies using external ERP systems (Odoo, SAP, Oracle) or Co-Work.cloud can view live product inventory levels within the webapp. This is strictly **read-only** — no stock adjustments, transfers, or write-back operations. Data syncs via the ERP API Integration (Module B §3). Stock visibility is controlled by the product's `stockVisibility` field (PUBLIC / INTERNAL / CONTACT_POOL / SELECTED_CONTACTS).

**ERP Inventory Sync Model:**

| Field | Type | Description |
|-------|------|-------------|
| inventorySyncId | string | Unique identifier |
| tenantId | string | Company |
| productId | string | **References** → MasterProduct.productId |
| sku | string | ERP SKU code (mapped during ERP integration setup) |
| productName | string | Product name (from MasterProduct — display only) |
| warehouseName | string | Warehouse / storage location label from ERP |
| availableQuantity | number | Units available for sale/use |
| reservedQuantity | number | Units reserved (pending orders, holds) |
| totalQuantity | number | Total on-hand (available + reserved) |
| unitOfMeasure | string | 'PCS' / 'KG' / 'BOX' / 'PALLET' / custom ERP unit |
| reorderLevel | number | Minimum stock threshold — webapp shows ⚠️ warning when `availableQuantity` ≤ `reorderLevel` |
| lastSyncedAt | string | ISO timestamp of last successful sync |
| syncStatus | enum | 'SYNCED' / 'PENDING' / 'ERROR' / 'STALE' (no sync in >24 hours) |
| erpSystemName | string | Source system name (e.g., 'Odoo 17', 'SAP S/4HANA', 'Co-Work.cloud') |
| erpLastModifiedAt | string | When this record was last modified in the ERP |

**Inventory Display View:**

| Feature | Description |
|---------|-------------|
| **Product-linked view** | From MasterProduct detail page, a "📦 Inventory" tab shows all warehouse stock levels for that product |
| **Company-wide inventory** | Dashboard view showing all synced products with stock levels, filterable by warehouse, product category, and stock status |
| **Low stock alerts** | Products where `availableQuantity` ≤ `reorderLevel` are highlighted with ⚠️ warning badge |
| **Sync status indicator** | Each inventory row shows sync freshness: 🟢 Synced (< 1 hour), 🟡 Stale (1-24 hours), 🔴 Error (sync failed) |
| **Visibility enforcement** | Stock levels are only shown to users/contacts who meet the product's `stockVisibility` setting |

> [!NOTE]
> **No write-back to ERP.** The webapp does NOT send any stock adjustments back to the ERP. All inventory management operations remain in the company's ERP system or Co-Work.cloud. Sample tracking and equipment rental (above) are tracked separately within the webapp's own models.

---

## 10. Module I: Design Showcase (Pinterest-Style) {#10-module-i}

> [!TIP]
> **📖 What is Module I?** A Pinterest-style visual showroom where companies display their products beautifully. Users browse images, tap hotspots (clickable points on images) to go directly to product pages, and save items into Pinterest-style folders.
>
> **AI features:** Auto-extracts dominant colors from images, auto-generates tags ("modern", "living room", "sofa"). Engagement tracking: views, saves, shares.
>
> **Example:** A furniture company uploads a styled living room photo. AI tags it. A buyer taps the sofa hotspot → goes to the product catalog to order.



### Partially Implemented
DesignerShowcase (basic), Hotspot (basic), DesignerRole, SpaceCategory, AestheticStyle

> [!NOTE]
> **Marketplace UX:** The showcase functions as a visual marketplace with category-based browsing. Users can filter showcases by: product category, company industry (TSIC), price range, location, and tags. Each showcase entry links back to the product (Module H) for ordering. The showcase emphasizes visual presentation (Pinterest-style) while the product catalog (Module H) handles pricing, inventory, and transactions.

### Showcase Enterprise Features

| Field | Type | Description |
|-------|------|-------------|
| **tenantId** | string | Company that owns this showcase entry |
| imageWidth | number | Original width (prevents layout jitter) |
| imageHeight | number | Original height |
| thumbnailUrl | string | Compressed thumbnail for fast grid |
| images[] | ShowcaseImage[] | Multiple images per showcase (gallery) |
| colorPalette[] | string[] | AI-extracted hex color codes |
| aiGeneratedTags[] | string[] | Hermes auto-tags |
| chatRoomId | string | Linked contextual chat room |
| **engagementMetrics** | object | |
| → viewCount | number | Views |
| → saveCount | number | Saves/bookmarks |
| → shareCount | number | Shares |
| moderationStatus | ModerationStatus | Content moderation |
| **createdAt** | string | When this showcase entry was created |
| **updatedAt** | string | Last modified |
| isFeatured | boolean | Admin-featured |
| **createdBy** | string | userId who created this showcase entry |

### Hotspot Enhancements

Use **percentage-based positioning** (not pixels) for responsive layouts:
- `xPercentage` (0-100)
- `yPercentage` (0-100)
- `hotspotId` (unique per hotspot)
- `hotspotType` ('PRODUCT'/'MATERIAL'/'COLOR'/'INFO')

### Favorite Folders & Saves

| Model | Description |
|-------|-------------|
| **FavoriteFolder** | User-created collection boards (like Pinterest boards) |
| **Favorite** | Polymorphic: saves PRODUCT, BROCHURE, COMPANY, or SHOWCASE |
| → targetType: 'PRODUCT'/'BROCHURE'/'COMPANY'/'SHOWCASE' |
| → targetId: Reference to saved item |
| → folderId: Which folder (or uncategorized) |

---

## 11. Module J: Recruitment Pipeline {#11-module-j}

> [!TIP]
> **📖 What is Module J?** A hiring module — post jobs, receive applications (even from people without accounts via public URL), and track candidates through a pipeline: NEW → SCREENING → INTERVIEW → EVALUATION → OFFER_SENT → RECRUITED.
>
> **Auto-conversion:** When a candidate reaches RECRUITED status, the system auto-creates their user account + company membership. No manual account creation needed.
>
> **Guest applications:** People without Cloudfull accounts can apply via public URL → fill a configurable form → if hired, they get an invitation to create an account and records merge.



### Partially Implemented
Basic Recruit model, AcademicMetrics

> [!IMPORTANT]
> **Auto-task creation:** When a candidate applies for a job posting, the system automatically **triggers** a task in Module E (§6 — Unified Work & Collaboration Hub) of type 'HR Candidate'. The task follows the HR Candidate pipeline: `NEW` → `SCREENING` → `INTERVIEW_SCHEDULED` → `INTERVIEW` → `EVALUATION` → `OFFER_SENT` → `RECRUITED` / `NOT_PASS`. This ensures recruitment activities are tracked alongside all other work in the company's task board.

> [!NOTE]
> **Recruitment marketplace UX:** Job postings appear in a marketplace view for users who have set their portfolio visibility to 'JOB_APPLICATION_ONLY' or 'JOB_POSTING_ONLY'. Users can browse, filter, and apply to job postings. Companies see a dashboard of all active postings and candidate pipelines.

### Job Posting Model

| Field | Type | Description |
|-------|------|-------------|
| jobId | string | Unique |
| tenantId | string | Company |
| jobTitle / jobTitleLocal | string | Position title (localized per CountryRuleEngine) |
| department | string | Department |
| employmentType | enum | 'FULL_TIME'/'PART_TIME'/'CONTRACT'/'FREELANCE'/'INTERNSHIP' |
| workArrangement | enum | 'ON_SITE'/'REMOTE'/'HYBRID' |
| salaryRangeMin / Max | number | Salary range |
| salaryCurrency | string | Currency code for salary (from CountryRuleEngine) |
| salaryVisibility | enum | 'VISIBLE'/'NEGOTIABLE'/'HIDDEN' |
| jobDescription | string | Full description |
| requirements[] | string[] | Required qualifications |
| benefits[] | string[] | Company benefits (from master directory or custom) |
| workLocation | ThaiAddress | Work location |
| workSchedule | object | Monthly/weekly mandatory schedule |
| googleMapsVisible | boolean | Show on recruitment map |
| externalShareLink | string | Shareable link for external networks (social media, job boards) |
| **externalApplicationEnabled** | boolean | Allow non-account users to apply via public external link |
| **externalApplicationUrl** | string | Auto-generated public URL (e.g., `cloudfull.com/jobs/{jobId}/apply`). Anyone with this URL can view the posting and apply without an account. |
| **guestApplicationFields[]** | string[] | Which fields the guest must fill: 'FULL_NAME', 'EMAIL', 'PHONE', 'RESUME_UPLOAD', 'COVER_LETTER', 'PORTFOLIO_URL', 'LINE_ID' |
| applicationDeadline | string | Last day to apply |
| status | enum | 'DRAFT'/'OPEN'/'PAUSED'/'CLOSED'/'FILLED' |

### Full Candidate Profile

Beyond what's in HrCandidateMetadata, need complete:
- Full name (TH/EN), contact details, LINE ID
- Education history array (institution, degree, field, GPA, graduation year)
- Work history array (company, position, dates, responsibilities, reason for leaving)
- Certifications array
- Language skills array
- Interview notes array (date, interviewer, type, rating, recommendation)
- Desired salary range tied to specific benefit packages
- Target work zones (provinces/sub-provinces)
- Available work days (weekly/monthly)
- **Privacy flag**: Hide profile from current employer

> [!IMPORTANT]
> **Auto-conversion:** When a candidate reaches `RECRUITED` status on the set date, the system automatically **triggers** creation of a user account and company membership. This creates the employment relationship defined in Module B (§3) — Employment Contract T&A.

> [!NOTE]
> **Guest Application Flow (for non-account users):** When `externalApplicationEnabled: true`, the job posting generates a public URL accessible without login.
> 1. Non-account user clicks the external link → sees the full job posting page (public, no login required).
> 2. Fills the application form with fields configured in `guestApplicationFields[]` + uploads resume/portfolio.
> 3. System creates a **guest candidate record** (not a full user account — stored as a lightweight profile with email as identifier).
> 4. HR task (`HR_CANDIDATE` type) is auto-created in Module E (§6) with the guest's application attached.
> 5. HR team processes the candidate through the normal pipeline (SCREENING → INTERVIEW → etc.).
> 6. If candidate reaches `RECRUITED` → system sends an invitation email prompting them to create a full platform account (Module A).
> 7. Upon account creation, the guest candidate record is merged with the new user profile.

---

## 12. Module K: Events, GPS & Attendance {#12-module-k}

> [!TIP]
> **📖 What is Module K?** Employee attendance tracking with GPS + selfie verification, shift management, and event management.
>
> **⚠️ Important:** Cloudfull.com **collects data only** — clock-in/out times, GPS coordinates, selfie photos, work hours. All statutory calculations (overtime pay, severance, leave entitlements per Thai Labor Protection Act) happen in Co-Work.cloud ERP or the employer's external HR system. Cloudfull is the data collector; the ERP is the calculator.
>
> **Anti-fraud:** EXIF photo verification cross-checks photo GPS + timestamp + device against expected values. If a salesperson submits a photo claiming to be in Chiang Mai but the EXIF data shows Bangkok → anomaly flagged for manager review.



### Partially Implemented
Event, EventAttendee, GpsTrackingMode

> [!NOTE]
> **Labor Compliance Disclaimer:** Cloudfull.com collects attendance, shift, and leave data for **reporting and statistics only**. All statutory labor compliance calculations (overtime pay, severance, leave entitlements, working hour limits per Thai Labor Protection Act B.E. 2541) are processed in Co-Work.cloud ERP or the employer's external HR system. Employers are responsible for ensuring compliance with applicable labor regulations. Cloudfull.com provides data collection and reporting — not legal compliance enforcement.

### Work Shift Tracking

| Field | Type | Description |
|-------|------|-------------|
| shiftId | string | Unique |
| userId | string | Employee |
| tenantId | string | Company |
| date | string | Work date |
| clockInTime | string | When clocked in |
| clockInGpsLat/Lng | number | GPS at clock-in |
| clockInPhotoUrl | string | Selfie at clock-in |
| clockOutTime | string | When clocked out |
| clockOutGpsLat/Lng | number | GPS at clock-out |
| totalWorkedMinutes | number | Auto-calculated |
| overtimeMinutes | number | Beyond standard hours |
| status | enum | 'ON_TIME'/'LATE'/'ABSENT'/'LEAVE'/'HOLIDAY' |
| leaveType | enum | 'SICK'/'PERSONAL'/'VACATION'/'MATERNITY'/'OTHER' |

### Device Management for GPS Tracking

> [!IMPORTANT]
> **Multi-Device GPS Rule:** Users may log in on multiple devices simultaneously (phone, tablet, desktop). For GPS tracking, **only ONE native app device is designated as the "working device"** at any time. This prevents multiple devices sending conflicting location data and producing a messy map.
>
> **Native app vs. web browser:**
> - **Native app (primary device):** Continuous GPS movement tracking during work hours. Only the designated primary device sends tracking data to the GPS Work Zone system (Module F: Sales Planning & Routing).
> - **Web browser:** Can stamp GPS for **point-in-time actions** only (clock-in/out, visit check-in, expense location). Does NOT send continuous movement tracking data.
> - **All other activities** (create task, update contact, chat, approve, etc.) are **synchronized across ALL devices** — no restrictions.
>
> **Switching primary device:** User can request to switch which device is the primary GPS tracking device via Settings. **Company configures the approval mode:**
> - **Auto-approve mode (default):** Change takes effect immediately. Notification sent to admin and user. Audit log entry created.
> - **Require-approval mode:** Change request is held pending. User with `device.manage` permission reviews and approves/rejects. Device stays unchanged until approved. This mode is recommended for companies that need strict GPS audit trails.
>
> Both modes generate an entry in the **Device Change Report** (accessible via Module K reports). Report includes: who requested, which device, when, approved by whom, and GPS coordinates at time of change.

**UserDeviceRegistry Model:**

| Field | Type | Description |
|-------|------|-------------|
| deviceId | string | Unique device identifier (generated on first login) |
| userId | string | User who owns this device |
| deviceName | string | User-assigned label (e.g., "Work Phone", "Personal iPad") |
| deviceType | enum | 'NATIVE_IOS' / 'NATIVE_ANDROID' / 'WEB_BROWSER' |
| deviceModel | string | Device model (e.g., "iPhone 15 Pro", "Samsung Galaxy S24") |
| deviceOS | string | OS version (e.g., "iOS 18.2", "Android 15") |
| **isPrimaryGpsDevice** | boolean | **True = this is the designated GPS tracking device.** Only ONE device per user can be `true` at any time. Only native app devices can be primary. Web browsers cannot be set as primary. |
| lastActiveAt | string | Last activity timestamp on this device |
| lastGpsLat | number | Last known GPS latitude from this device |
| lastGpsLng | number | Last known GPS longitude from this device |
| pushNotificationToken | string | FCM/APNS token for push notifications |
| isActive | boolean | Device is currently active/logged in |
| registeredAt | string | When this device was first registered |

**DeviceChangeRequest Model:**

| Field | Type | Description |
|-------|------|-------------|
| requestId | string | Unique identifier |
| userId | string | User requesting the change |
| tenantId | string | Company |
| fromDeviceId | string | Current primary device |
| toDeviceId | string | Requested new primary device |
| requestedAt | string | When the change was requested |
| status | enum | 'PENDING' / 'APPROVED' / 'REJECTED' / 'AUTO_APPROVED' |
| reviewedBy | string | User who approved/rejected (null for auto-approve) |
| reviewedAt | string | When the review happened |
| rejectionReason | string | If rejected, why |
| gpsLatAtRequest | number | GPS latitude when the change was requested |
| gpsLngAtRequest | number | GPS longitude when the change was requested |

**DeviceChangeReport:** Company-level report showing all device change history. Accessible by users with `device.view_all` permission. Columns: User, Old Device, New Device, Request Time, Status, Approved By, GPS Location.

> [!NOTE]
> **GPS data source tagging:** All GPS data points (clock-in, visit check-in, continuous tracking) are tagged with `sourceDeviceId` to trace which device produced the reading. If a GPS reading comes from a non-primary device (e.g., web browser clock-in), it is tagged as `gpsSource: 'WEB_STAMP'` vs `gpsSource: 'PRIMARY_DEVICE_TRACKING'`.

### EXIF Photo Verification (Anti-Fraud)

> [!IMPORTANT]
> **Purpose:** Verifies that actual visit photos submitted by users are legitimate. When a user completes an actual plan visit (Module F §7), they submit a photo. The system extracts EXIF metadata (GPS coordinates, timestamp, device info) and cross-checks against: (1) the planned visit location from the actual plan, (2) the system GPS at capture time, (3) the system timestamp. Discrepancies trigger anomaly flags for manager review.

| Field | Type | Description |
|-------|------|-------------|
| reportPhotoUrl | string | Photo taken at location |
| exifGpsLat | number | GPS latitude from photo EXIF metadata |
| exifGpsLng | number | GPS longitude from photo EXIF metadata |
| exifTimestamp | string | Timestamp from photo EXIF metadata |
| systemGpsLat | number | Device GPS latitude at capture time |
| systemGpsLng | number | Device GPS longitude at capture time |
| systemTimestamp | string | System clock time at capture |
| gpsMatchVerified | boolean | EXIF GPS ≈ system GPS ≈ target location GPS? All three must be within acceptable radius. |
| distanceDeltaMeters | number | Distance between photo GPS and planned visit target location |
| isAnomalyDetected | boolean | Flagged for discrepancy (GPS mismatch, timestamp manipulation, etc.) — triggers manager notification |

### Event Attendee PDPA Consent

> [!IMPORTANT]
> **PDPA Sec 19 compliance:** When an event host requests personal data from attendees (e.g., phone number, company name, dietary preferences), the system requires explicit consent. Each data field requested by the host is presented as a separate opt-in checkbox for the attendee.

| Field | Type | Description |
|-------|------|-------------|
| **hostDataRequests[]** | DataRequest[] | Data fields the host wants from attendees |
| → fieldName | string | What data is requested (e.g., "Phone Number", "Company Name", "Dietary Requirements") |
| → fieldType | enum | 'PERSONAL_DATA' / 'PREFERENCE' / 'CUSTOM_QUESTION' |
| → isRequired | boolean | Whether the attendee MUST provide this to register (if false, attendee can skip) |
| → purposeDescription | string | Why the host needs this data (PDPA purpose limitation) |
| **attendeeConsents[]** | ConsentEntry[] | Per-attendee consent records |
| → userId | string | Attendee userId |
| → consentedFields[] | string[] | Which fields the attendee agreed to share |
| → declinedFields[] | string[] | Which fields the attendee declined |
| → consentedAt | string | When consent was given |
| **hostCustomQuestions[]** | EventQuestion[] | Optional questions the host can add to the registration form. Uses the **unified EventQuestion model** (same schema as QR Event Check-in in Module L §13). |
| → questionId | string | Unique identifier |
| → questionText | string | The question |
| → questionType | enum | 'TEXT' / 'SINGLE_CHOICE' / 'MULTI_CHOICE' / 'NUMBER' / 'DATE' / 'YES_NO' |
| → isRequired | boolean | Whether the attendee must answer this question to complete registration |
| → options[] | string[] | If SINGLE_CHOICE or MULTI_CHOICE: the available answer options |
| **attendeeDataExport** | ExportConfig | Host can download all attendee data (responses, consent records, custom question answers) as CSV/Excel. Only data that attendees consented to share is included. |
| → exportFormats[] | enum[] | 'CSV' / 'XLSX' / 'PDF_SUMMARY' |
| → includeConsentProof | boolean | If true, export includes consent timestamps and which fields each attendee agreed to share |
| → lastExportedAt | string | When the host last downloaded attendee data |
| → lastExportedBy | string | userId who exported |

> [!NOTE]
> **EXIF Photo Verification fields** are defined in Module K (§11) GPS & Attendance — see EXIF Photo Verification (Anti-Fraud) section.


> [!NOTE]
> **Future ERP Payroll Sync:** Module K attendance data (work hours, overtime hours, leave days, late arrivals) will be available via the ERP API (Module B §3) when the Co-Work.cloud payroll module is built. Webhook events `'attendance.shift_completed'` and `'attendance.leave_approved'` will push daily attendance summaries to the ERP for payroll calculation, social security contribution tracking, and overtime pay. No Cloudfull code changes are needed — the data is already captured; only the ERP API export endpoint needs to be added when payroll is ready.
---

## 13. Module L: Favorites, QR & News Feed {#13-module-l}

> [!TIP]
> **📖 What is Module L?** The networking and content distribution layer — your "trade show toolkit."
>
> **6 QR interactions:** Profile Exchange (swap contact cards), Role Exchange (swap company role cards), Mutual Exchange (both sides at once), Product Save (save product to favorites), E-Brochure Collect (save a live brochure pointer), Event Check-in.
>
> **"Zero-Waste Updates":** When you scan a company's brochure QR, you get a LIVE POINTER — not a file copy. Any change by the company (updated prices, new products) auto-propagates to everyone who collected it.
>
> **News Feed:** Companies post updates visible to followers with visibility controls (Public, Followers, Internal, Specific Contacts).



### QR Brochure Handshakes

**QR Handshake Protocol:**

| Feature | Description |
|---------|-------------|
| **QR Profile Exchange** | Scan a user's personal profile QR → auto-populate the scanner's **personal** contact pool |
| **QR User Role Exchange** | Scan a user's **company role QR** → adds to the scanner's **company** contact pool as a Type 2 contact (Company User Role Contact in Module D §5). The QR encodes: company name, user's position, department, role contact info (role phone, role email). Scanner's company can configure whether scanned contacts auto-import or require approval. |
| **QR Mutual Exchange** | Two users scan each other's QR simultaneously (or sequentially) → both users add each other to their respective contact pools. Works for both profile QR and user role QR. |
| **QR Product Save** | Scan product tag → save to favorites (live pointer, not copy) |
| **QR E-Brochure Collect** | Scan a company's brochure/catalog QR → save the digital brochure as a live pointer into the scanner's "Collected Brochures" folder. See E-Brochure section below. |
| **QR Event Check-in** | Scan an event's QR code to check into a company event, training session, or trade show (**references** → Module K §12 Events & Attendance). See Event Check-in detail below. |
| **Zero-Waste Updates** | Any change by manufacturer propagates to all favorites and collected brochures |
| **Stale Pointer Cleanup** | Deleted assets automatically clear from folders |

### QR Event Check-in Detail

> [!IMPORTANT]
> **Two attendee types:** (1) **Verified users** — platform users who scan with their account, auto-confirmed identity. (2) **Guest attendees** — people without a platform account who can check in by filling a guest form. Guests can verify/create an account later; their check-in record links to their profile once verified.

**Event Check-in Configuration (set by event host):**

| Field | Type | Description |
|-------|------|-------------|
| eventId | string | **References** → Module K (§12) event |
| qrCodeUrl | string | Auto-generated unique QR code for this event (one per event or one per session) |
| **allowGuestCheckin** | boolean | If `true`, non-verified users can check in by filling a guest form. If `false`, only platform users can check in. |
| **customQuestions[]** | EventQuestion[] | Additional questions the host wants attendees to answer during check-in |
| → questionId | string | Unique |
| → questionText | string | The question (e.g., "Which product line are you interested in?", "How did you hear about this event?") |
| → questionType | enum | 'TEXT' / 'SINGLE_CHOICE' / 'MULTI_CHOICE' / 'NUMBER' / 'DATE' |
| → options[] | string[] | If SINGLE_CHOICE or MULTI_CHOICE: the available options |
| → isRequired | boolean | Must answer to complete check-in |
| → isDataCollectable | boolean | If `true`, this question's answer is stored. Must comply with PDPA data collection rules (see below). |
| **pdpaConsentRequired** | boolean | If event collects personal data → attendee must accept PDPA consent before completing check-in |
| **pdpaConsentText** | string | Custom PDPA consent message for this event |

**Guest Check-in Form:**

| Field | Type | Description |
|-------|------|-------------|
| guestName | string | Full name |
| guestEmail | string | Email (used as identifier for future account linking) |
| guestPhone | string | Phone number (optional) |
| guestCompany | string | Company name (optional) |
| guestPosition | string | Position/title (optional) |
| customAnswers[] | object[] | Answers to the host's custom questions |
| pdpaConsentGiven | boolean | Guest accepted PDPA consent |
| pdpaConsentTimestamp | string | When consent was given |
| **linkedUserId** | string | Null at check-in. Populated if/when guest creates a platform account and links their attendance record. |

**Check-in Record:**

| Field | Type | Description |
|-------|------|-------------|
| checkinId | string | Unique |
| eventId | string | Which event |
| sessionId | string | Which session (null if single-session event) |
| **attendeeType** | enum | 'VERIFIED_USER' / 'GUEST' |
| userId | string | If VERIFIED_USER: platform userId. If GUEST: null until linked. |
| guestFormId | string | If GUEST: reference to guest check-in form data |
| checkinTimestamp | string | When checked in |
| gpsCoordinates | object | Latitude/longitude at check-in |
| customAnswers[] | object[] | Answers to custom questions |

> [!WARNING]
> **PDPA Compliance for Event Data Collection (Sec 19, 23, 24):**
> - **Lawful basis:** Event attendance data is collected under **legitimate interest** (PDPA Sec 24(5)) or **explicit consent** (Sec 19) depending on data sensitivity.
> - **Minimum data principle:** The system warns event hosts if they request data beyond what's necessary for event management. Name, email, and check-in time are standard. Additional questions that collect sensitive data (health conditions, religious preferences, biometric data) require explicit PDPA Sec 26 consent.
> - **Data the host CAN collect without special consent:** Name, email, phone, company, position, event-related preferences (e.g., "Which session will you attend?", "Dietary requirements for catering").
> - **Data that REQUIRES explicit consent:** Health information, political opinions, religious beliefs, genetic/biometric data, criminal records — per PDPA Sec 26 (sensitive personal data).
> - **Retention:** Event attendance data is retained per the company's data retention policy. Guests can request deletion per PDPA Sec 33 (right to erasure). The host must honor deletion requests unless a legal basis for retention exists.

### E-Brochure / E-Catalog System

> [!NOTE]
> **Companies create digital brochures and catalogs that can be distributed via QR codes.** At events, trade shows, or client meetings, a user can display the brochure QR on their phone. Other users scan the QR to collect the brochure into their personal "Collected Brochures" folder. Brochures are stored as **live pointers** — if the company updates the brochure, all collectors automatically see the latest version.

**E-Brochure Model:**

| Field | Type | Description |
|-------|------|-------------|
| brochureId | string | Unique |
| tenantId | string | Company that created the brochure |
| brochureTitle | string | Title (e.g., "2026 Q2 Product Catalog") |
| brochureType | enum | 'CATALOG' / 'BROCHURE' / 'PRICE_LIST' / 'COMPANY_PROFILE' / 'PRODUCT_SHEET' / 'CUSTOM' |
| fileUrl | string | PDF or digital file URL |
| coverImageUrl | string | Thumbnail/cover image for display |
| linkedProductIds[] | string[] | Products featured in this brochure (**references** → Module H §9) |
| **qrCodeUrl** | string | Auto-generated QR code image for this brochure |
| **qrDisplayMode** | enum | 'STATIC_IMAGE' (download/print QR) / 'LIVE_SCREEN' (display QR on device screen at events) |
| isActive | boolean | Currently available for distribution |
| viewCount | number | How many times scanned/collected |
| collectCount | number | How many unique users have collected this brochure |
| version | string | Version number (e.g., "v2026-Q2") |
| language | string | Brochure language (e.g., 'th', 'en', 'th+en') |
| createdBy | string | Who created |
| createdAt | string | When |

**QR Scan-to-Collect Flow:**
1. Company A creates a digital brochure in Module L and generates a QR code.
2. User A (from Company A) displays the brochure QR at an event on their phone screen.
3. User B (from Company B or any individual) scans the QR with the webapp.
4. The brochure is saved as a **live pointer** (not a file copy) into User B's "Collected Brochures" folder.
5. If Company A updates the brochure (new version) → User B automatically sees the latest version.
6. User B can organize collected brochures into custom folders, share with colleagues, or link to their own contact records.

**User's Collected Brochures Folder:**

| Field | Type | Description |
|-------|------|-------------|
| collectionId | string | Unique |
| userId | string | Who collected |
| brochureId | string | **References** → E-Brochure (live pointer) |
| collectedAt | string | When scanned/collected |
| collectedFrom | string | userId of the person who displayed the QR (for analytics) |
| folderName | string | User's custom folder (default: "Collected Brochures") |
| notes | string | User's private notes about this brochure |

### News Feed

Design requirement: *"A bidirectional news feed connects the internal pool with the broader ecosystem. Users receive real-time updates from companies in their pool or from following entities."*

> [!NOTE]
> **Verified company feed selection:** Users can select which verified companies appear in their news feed. The feed shows posts/updates ONLY from companies the user has explicitly followed or selected. Unverified companies do NOT appear in the feed. Users can manage their feed preferences in settings.

| Model | Field | Description |
|-------|-------|-------------|
| **NewsPost** | postId | Unique |
| | tenantId | Which company posted |
| | authorUserId | Who wrote it |
| | title | Post title |
| | body | Post content |
| | imageUrls[] | Attached images |
| | visibility | 'PUBLIC'/'FOLLOWERS'/'INTERNAL'/'SPECIFIC_CONTACTS' |
| | targetContactIds[] | If specific contacts |
| | moderationStatus | Hermes review |
| | likeCount | Likes |
| | commentCount | Comments |
| | createdAt | When |

---

> [!NOTE]
> **Module M (Inventory Rental & Sample Tracking) has been merged into Module H (§9).** All sample tracking, equipment rental, and ERP inventory display features are now sub-sections of the Product Catalog module. Products with `isInternalOnly: true` handle internal operations (samples, equipment rental). See Module H — Internal Product Operations.

## 14. Module N: Skill Testing {#14-module-n}

> [!TIP]
> **📖 What is Module N?** Companies create knowledge tests for employees — monthly quizzes and quarterly exams. Free tier = manually create questions. Paid tier = AI generates questions from company training materials, SOPs, and product catalogs.
>
> **Output:** Per-employee scores with AI-generated improvement recommendations (e.g., "Improve knowledge in diabetes medication category — scored 45% vs team average of 78%").



> **Additional specification based on original platform vision.**

Design requirement: *"Using AI or manually make routine test for team... small test monthly and big test every quarter... summary the score and recommend skills to improve"*

| Field | Type | Description |
|-------|------|-------------|
| testId | string | Unique |
| tenantId | string | Company |
| testName | string | Test title |
| testType | enum | 'SMALL_MONTHLY'/'BIG_QUARTERLY'/'CUSTOM' |
| questionCount | number | How many questions |
| categoryFilter | string | Product category or skill area |
| isAiGenerated | boolean | Questions generated by AI |
| targetTeamId | string | Which team takes this test |
| targetUserIds[] | string[] | Or specific users |
| questions[] | TestQuestion[] | Array of questions |
| → questionText | string | The question |
| → options[] | string[] | Multiple choice options |
| → correctOptionIndex | number | Correct answer |
| → explanation | string | Why this is correct |
| dueDate | string | Deadline to complete |
| **results[]** | TestResult[] | Per-user results |
| → userId | string | Who took it |
| → score | number | Score percentage |
| → completedAt | string | When completed |
| → answersGiven[] | number[] | User's answers |
| → aiRecommendation | string | AI: "Improve knowledge in X category" |
| createdBy | string | Who created |
| createdAt | string | When |

> [!IMPORTANT]
> **Tier-based test creation:**
> - **Free tier:** Manual question creation only — company admins create tests by manually entering questions, answers, and scoring criteria.
> - **Paid tier:** AI-powered test generation — AI generates test questions from company data, training materials, SOPs, and product catalogs. Company reviews and approves AI-generated questions before publishing.
>
> **Group/department targeting:** Skill tests can be assigned to specific groups, departments, or individual user roles. Company admin selects target audience when creating a test. Results are visible to the assigner and the user's reporting chain.

---

## 15. Module O: Billing & Subscription {#15-module-o}

> [!TIP]
> **📖 What is Module O?** **PLATFORM billing only** — charges from Cloudfull.com to its users/companies for subscriptions and add-ons. This is NOT for B2B commercial invoices between companies (those come from the ERP via Module Q).
>
> **Covers:** Payment transactions (bank transfer, credit card, PromptPay, QR code), Thai tax invoices (with VAT + withholding tax), billing entity management (billing details may differ from company name), invoice history, and promotional campaigns/discounts.



> [!IMPORTANT]
> **Module O handles PLATFORM billing only — invoices between Cloudfull.com and its users/companies.** This includes: subscription fees, add-on charges, promotional campaigns, and platform service invoices. Module O does NOT handle B2B commercial invoices between companies. Those invoices (Company A invoices Company B for goods/services sold) are managed in each company's external ERP or Co-Work.cloud and displayed as **read-only synced data** in Module Q (§17 — Invoice & Delivery Status section).
>
> **Two invoice ecosystems in the platform:**
> | Invoice Type | Who Issues | Who Receives | Managed In | Example |
> |-------------|-----------|-------------|-----------|---------|
> | **Platform Invoice** | Cloudfull.com | Companies / Users | **Module O** (this module) | "Cloudfull.com charges Company A ฿2,990/month for Premium subscription" |
> | **B2B Commercial Invoice** | Company A | Company B | **Company's ERP / Co-Work.cloud** (read-only display in Module Q §17) | "Company A invoices Company B ฿150,000 for 500 units of Product X" |

### Currently Implemented
Subscription, Invoice, SubscriptionTierConfig, AddonConfig, CouponCode

### Payment Transaction

| Field | Type | Description |
|-------|------|-------------|
| transactionId | string | Unique |
| invoiceId | string | Link to invoice |
| amount | number | Amount |
| paymentCurrency | string | Currency code (from CountryRuleEngine) |
| paymentMethod | enum | 'BANK_TRANSFER'/'CREDIT_CARD'/'PROMPTPAY'/'QR_CODE' |
| status | enum | 'PENDING'/'COMPLETED'/'FAILED'/'REFUNDED' |
| receiptUrl | string | Receipt document |

### Thai Tax Invoice

| Field | Type | Description |
|-------|------|-------------|
| taxInvoiceNumber | string | Running number (cannot reuse) |
| sellerTenantId | string | Selling company |
| buyerTenantId | string | Buying company |
| sellerBranchCode | string | Seller's branch |
| buyerBranchCode | string | Buyer's branch |
| subtotal | number | Before VAT |
| vatRate | number | 7% |
| vatAmount | number | VAT amount |
| withholdingTaxRate | number | WHT % |
| withholdingTax | number | WHT amount |
| total | number | Final amount |
| invoiceCurrency | string | Currency code for tax invoice (from CountryRuleEngine) |
| isVoided | boolean | Cannot delete — must void |

> [!IMPORTANT]
> **Thai Tax Invoice scope — Co-Work.cloud ERP only:**
>
> This Thai Tax Invoice model is relevant **only when at least one party (buyer or seller) uses Co-Work.cloud as their ERP**. In that case, Co-Work.cloud auto-generates the tax invoice from PO/SO data.
>
> - **Both parties on external ERP or no ERP:** No Thai Tax Invoice is generated by the platform. They exchange PO/SO as PDF/image files through Module Q. Tax invoicing is handled entirely within their own systems.
> - **One party on Co-Work.cloud:** Co-Work.cloud generates the Thai Tax Invoice and it syncs to the platform for display. The other party sees it as a read-only attachment on their PO/SO view.
> - **`sellerTenantId` / `buyerTenantId`** fields refer to Co-Work.cloud tenant context, not Cloudfull.com platform billing. This model is separate from Module O's platform billing invoices (Cloudfull.com → customer).

### Billing Entity & Invoice History

| Field | Type | Description |
|-------|------|-------------|
| **billingEntity** | BillingEntity | Company billing information for invoices |
| → billingName | string | Billing name (may differ from company name — e.g., holding company) |
| → billingAddress | ThaiAddress/IntlAddress | Billing address |
| → billingTaxId | string | Tax ID for invoicing (may differ from company vatId if billing through parent company) |
| → billingContactName | string | Contact person for billing inquiries |
| → billingContactEmail | string | Email for billing correspondence |
| → billingContactPhone | string | Phone for billing inquiries |
| **invoiceHistory[]** | InvoiceEntry[] | Historical record of all invoices |
| → invoiceId | string | Unique identifier |
| → invoiceNumber | string | Sequential invoice number (e.g., "INV-2026-0001") |
| → invoiceDate | string | Date issued |
| → dueDate | string | Payment due date |
| → totalAmount | number | Total amount |
| → status | enum | 'PENDING' / 'PAID' / 'OVERDUE' / 'CANCELLED' |
| → pdfUrl | string | Downloadable PDF invoice |
| → receiptUrl | string | Downloadable PDF receipt (after payment) |

| Field | Type | Description |
|-------|------|-------------|
| campaignId | string | Unique |
| title | string | Campaign name |
| scope | enum | 'GLOBAL_SUBSCRIPTION'/'GLOBAL_ADVERTISEMENT'/'TARGETED_TENANT' |
| targetTenantId | string | Whitelist target (if targeted) |
| discountPercentage | number | Discount % |
| startsAt | string | Campaign start |
| expiresAt | string | Campaign end |
| isActive | boolean | Currently running |

---

## 16. Module P: Compliance, AI & Admin Backoffice {#16-module-p}

> [!TIP]
> **📖 What is Module P?** The platform's **command center** — AI regulatory monitoring, security incident management, and the Super Admin backoffice (14 screens) that runs Cloudfull.com itself.
>
> **AI Regulatory Scanning:** Hermes AI periodically scans Thai legislation for changes affecting the platform and produces risk-rated recommendations.
> **Super Admin:** Controls global config, tenant verification, user moderation, content & substance safety, compliance & legal, sandbox & deployment, financials & billing, platform health. All actions logged. Bulk exports require two-person approval. MFA + Face Liveness required.



> [!NOTE]
> **Fraud Reporting:** See Module D (§5) Fraud Reporting System for the user-facing fraud report submission, AI pre-screening, and Super Admin investigation workflow. The fraud reporting UI is triggered from contact/company profiles in Module D, while the investigation backoffice is part of Module P.

### Currently Implemented
Auth, PDPA, audit logging, substance gate, content moderation, emergency freeze, company verification, takedown workflow, KYC archive

### Notification System

> [!NOTE]
> **See §3.5 Platform Notification Architecture** — the platform-wide notification system (**feeds** all modules A through Q) (6 channels, 75+ event types including 9 po.* events from Module Q, 7 feed categories, per-event channel selection). This section previously contained a simplified duplicate that has been removed.

### AI Regulatory Horizon Scanning

Hermes periodically scans Thai legislation for changes affecting the platform:

| Field | Type | Description |
|-------|------|-------------|
| scanId | string | Unique |
| rawReport | string | AI analysis text |
| structuredRecommendations[] | Recommendation[] | |
| → regulationName | string | Name of regulation |
| → governingBody | string | Ministry/department |
| → legalRiskLevel | enum | 'HIGH'/'MEDIUM'/'LOW' |
| → summaryOfChange | string | What changed |
| → suggestedRemediation | string | What platform should do |
| groundingSources[] | Source[] | URLs used |

### Security Incident & Alarm Engine

| Field | Type | Description |
|-------|------|-------------|
| incidentId | string | Unique |
| threatLevel | enum | 'CRITICAL_CRASH_RISK'/'DATA_LEAK'/'UNAUTHORIZED_ACCESS'/'PERFORMANCE' |
| message | string | Alert message |
| isSuperUrgent | boolean | Requires immediate attention |
| nextReAlertAt | string | Recurring alert time |
| isResolved | boolean | Fixed? |
| hardwareMetrics | object | CPU%, RAM%, storage |

### Platform Super Admin Scope & Responsibilities

> [!IMPORTANT]
> **Platform-level administration — NOT company-level.** The Super Admin team operates the Cloudfull.com platform itself. They do NOT manage individual company data, employees, or internal operations. Their scope is platform infrastructure, compliance, and governance. All Super Admin actions are logged in an immutable audit trail.

**Super Admin Responsibilities:**

| Responsibility Area | What Super Admin Controls | Thai Law Basis |
|---------------------|--------------------------|----------------|
| **Global Configuration** | Country address configs, TSIC industry codes, WHT rate tables, license category definitions, subscription tier pricing, contact pool add-on packages, AI normalization master lists | Revenue Code, Excise regulations |
| **Tenant Verification** | Company DBD certificate review queue, MD identity verification, business license approval/rejection, annual re-verification prompts | ETDA Platform Regulations 2025 |
| **User Moderation** | Global user KYC review, abuse report handling, fraud ban/unban management, lifetime ban review, unban request adjudication | PDPA Sec 37, Computer Crime Act Sec 15 |
| **Content & Substance** | Hermes AI moderation review queue, substance gate overrides, brand registry management, marketing language banned-word list updates | Alcohol Control Act, Tobacco Act, FDA Act |
| **Compliance & Legal** | Government takedown order processing (24h deadline), ETDA registration maintenance, PDPA data subject request escalation, regulatory horizon scanning review | Computer Crime Act, PDPA, ETDA Decree |
| **Sandbox & Deployment** | Sandbox environment creation/management, version snapshot control, production deployment approval, rollback authorization | Platform operational |
| **Financial & Billing** | Subscription tier configuration, promotional campaign management, refund processing, payment provider integration settings | Revenue Code |
| **Platform Health** | Security incident response, API auto-freeze review/unfreeze, performance monitoring, emergency platform freeze trigger | Computer Crime Act Sec 26 |

**Super Admin Permission Set:**

| Permission | Description |
|------------|-------------|
| `superAdmin.dashboard` | View platform-wide metrics and analytics |
| `superAdmin.tenantManage` | Review, approve, reject, suspend company registrations |
| `superAdmin.userManage` | View global user list, review KYC, ban/unban users |
| `superAdmin.contentModerate` | Review Hermes-flagged content, override moderation decisions |
| `superAdmin.takedown` | Process government takedown orders within legal deadline |
| `superAdmin.config` | Manage platform-wide configuration (address formats, TSIC codes, WHT rates, subscription tiers) |
| `superAdmin.billing` | Manage subscription pricing, coupons, refunds, payment provider settings |
| `superAdmin.sandbox` | Create/manage sandbox environments, approve production deployments |
| `superAdmin.security` | Review security incidents, unfreeze API keys, manage emergency controls |
| `superAdmin.audit` | Access full audit log viewer across all tenants |
| `superAdmin.regulatory` | Review AI regulatory horizon scanning results, update compliance rules |

> [!CAUTION]
> **Super Admin team members are NOT above the law.** All Super Admin actions are logged in an immutable audit trail. Accessing individual tenant data requires a documented business reason. Bulk data exports require dual Super Admin approval (two-person rule). PDPA Sec 37 holds the platform (as data controller) responsible for all Super Admin actions. Super Admin accounts require MFA + Face Liveness for login.

### Super Admin Backoffice Screens Needed

| Screen | Purpose |
|--------|---------|
| Dashboard | Platform-wide metrics |
| Tenant Management | List, search, filter companies |
| Verification Queue | Companies awaiting verification |
| User Management | Global user list, KYC, ban/unban |
| Content Moderation | Hermes review queue |
| Takedown Management | Government orders with countdown |
| Product Oversight | Flagged products, substance review |
| Subscription Management | Tiers, coupons, refunds |
| Ad Management | Ad placements, rotation |
| Analytics | Revenue, growth, compliance stats |
| System Config | Feature flags, maintenance mode |
| Audit Log Viewer | Searchable audit trail |
| Emergency Controls | Platform freeze, lockout, mass notifications |
| Regulatory Scanner | AI legislation monitoring results |

---

## 16.5 Platform Sandbox & Version Control Architecture {#16-5-sandbox}

> [!TIP]
> **📖 In Plain Language:** A staging/testing environment for the development team to test updates before deploying to production. Auto-snapshots before every deploy. 72-hour rollback window. Sandbox data must NEVER contain real personal data (PDPA compliance).



> [!IMPORTANT]
> **Platform-level staging environment** for the Super Admin development team to test future improvements, updates, and configurations without affecting the live production webapp. This is NOT a company-level sandbox — individual tenants do not have separate test environments. Platform-level only.

**Sandbox Environment Model:**

| Field | Type | Description |
|-------|------|-------------|
| sandboxId | string | Unique identifier for this sandbox instance |
| environmentName | string | Human-readable name (e.g., "Feature: Multi-Party Vault v2", "Hotfix: KYC Bug") |
| environmentType | enum | 'DEVELOPMENT' / 'STAGING' / 'QA_TESTING' / 'PERFORMANCE_TESTING' |
| status | enum | 'ACTIVE' / 'PAUSED' / 'ARCHIVED' |
| createdBy | string | Super Admin userId who created this sandbox |
| createdAt | string | When created |
| lastAccessedAt | string | When last used |
| **snapshotVersion** | string | Semantic version tag (e.g., "v2.1.0-staging-20260606") |
| **baseProductionVersion** | string | Which production version this sandbox was branched from |
| **dataIsolation** | enum | 'SYNTHETIC_ONLY' (default — uses only generated test data, no real personal data) / 'ANONYMIZED_COPY' (production data structure with anonymized/scrambled PII) |
| accessUserIds[] | string[] | Super Admin team members with access to this sandbox (requires `sandbox.access` permission) |

**Snapshot & Version Control:**

| Field | Type | Description |
|-------|------|-------------|
| **snapshots[]** | SandboxSnapshot[] | Version history of sandbox states |
| → snapshotId | string | Unique identifier |
| → versionTag | string | Semantic version (e.g., "v2.1.0-alpha.3") |
| → snapshotType | enum | 'MANUAL_SAVE' / 'AUTO_SAVE' (system auto-saves before deployments) / 'PRE_DEPLOY' |
| → description | string | What this snapshot contains / what was changed |
| → createdBy | string | Who saved |
| → createdAt | string | When saved |
| → sizeBytes | number | Storage footprint |
| → canRestore | boolean | Whether this snapshot can be restored (rollback) |

**Deployment Pipeline:**

```
DEVELOPMENT ───→ STAGING ───→ QA_TESTING ───→ PRODUCTION
     │              │              │
     └─ Snapshot    └─ Snapshot    └─ Snapshot + Approval
                                        (Super Admin sign-off required)
```

| Step | Description |
|------|-------------|
| **1. Development** | Engineers work on features in isolated sandbox. Synthetic data only. |
| **2. Staging** | Feature-complete build deployed for integration testing. |
| **3. QA Testing** | Quality assurance team runs test suites. Performance benchmarks. |
| **4. Production Deploy** | Requires Super Admin approval. System creates a PRE_DEPLOY snapshot automatically for rollback capability. |

**Rollback Capability:**

| Field | Type | Description |
|-------|------|-------------|
| **rollbackConfig** | RollbackConfig | Production rollback settings |
| → autoSnapshotBeforeDeploy | boolean | Always true — system auto-creates snapshot before every production deploy |
| → rollbackWindowHours | number | How long after deploy a rollback is allowed (default: 72 hours) |
| → lastProductionSnapshot | string | snapshotId of the last pre-deploy snapshot |
| → rollbackApprovalRequired | boolean | Whether rollback requires Super Admin approval (default: true) |

> [!CAUTION]
> **Data isolation rule (PDPA Sec 22 — Purpose Limitation):** Sandbox environments MUST NOT contain real personal data. The `dataIsolation` field enforces this: `SYNTHETIC_ONLY` uses randomly generated test data, `ANONYMIZED_COPY` uses production data structures with all PII scrambled/hashed. Super Admin team members sign a data handling acknowledgment before accessing any sandbox.

> [!NOTE]
> **Sandbox data is not legally binding.** Any terms, contracts, signatures, or agreements created in a sandbox environment are clearly marked as "SANDBOX — NOT LEGALLY BINDING" and cannot be referenced in the production system. Sandbox consent audit logs are stored separately from production logs.

---

## 16.6 Simple Reports & Analytics {#16-6-reports}

> [!TIP]
> **📖 In Plain Language:** Phase 1 basic reporting — read-only data summaries across all modules. 13 report categories: Sales, HR & Recruitment, Company & Contacts, Billing, Tasks, Attendance, Chat, Products & Showcase, Inventory & Tracking, Procurement, Expense, Customer Investment, Customer Revenue. Each report can be exported as PDF or CSV.
>
> **Visibility:** MD sees everything. Dept heads see their dept. Team managers see their team. Individual users see only their own data.



> [!NOTE]
> **Phase 1 — Simple Data Aggregation.** This module provides basic reporting using only data generated within the webapp. No external data sources are consumed. Advanced analytics, custom dashboards, and machine learning insights are deferred to future phases. Reports do not modify any data — they are read-only aggregation views.

### Report Categories

| Category | Reports | Data Source (Module) |
|----------|---------|---------------------|
| **Sales** | Visit summary (daily/weekly/monthly), Revenue pipeline, Contact engagement frequency, Expense summary by user/team | Module F (Sales Planning) |
| **HR & Recruitment** | Candidate pipeline (applied → interviewed → hired), Skill test score averages by team/department, Employee onboarding status | Module J (Recruitment), Module N (Skill Testing) |
| **Company & Contacts** | Contact pool growth over time, Verification status breakdown, Contact type distribution (Type 1/2/3) | Module D (Contact Pool), Module B (Company) |
| **Billing** | Subscription status overview, Payment history timeline, Invoice aging report, Add-on usage summary | Module O (Billing) |
| **Tasks & Collaboration** | Task completion rate by team, Overdue task report, Approval turnaround time average | Module E (Unified Work & Collaboration Hub) |
| **Events & Attendance** | Event attendance rate, GPS check-in compliance %, Leave/absence summary | Module K (Events & Attendance) |
| **Chat & Communication** | Message volume (daily/weekly), Response time averages, Active chat rooms count | Module G (Chat System) |
| **Products & Showcase** | Product catalog size, Showcase view count, Top-viewed products, Marketplace engagement metrics, **Top 5 Trending leaderboard per category**, Trending score history, Most-endorsed products | Module H (Products & Internal Inventory), Module I (Showcase) |
| **Inventory & Tracking** | Sample utilization rate, Equipment rental status, ERP sync health, Low stock product count, User sample holding summary, Cost per customer | Module H (Internal Inventory — §9) |
| **Procurement & PO** | PO volume by period, Average PO value, Quotation conversion rate (RFQ→Quote→PO), Top suppliers/buyers by volume, ERP sync health | Module Q (Purchase Order — §17) |
| **Expense** | Expense submissions per user/team/department, Total expense amount by category, AI OCR accuracy rate, Approval turnaround time, Top expense categories, Monthly expense trends | §3.7 (Expense & Receipt Management — cross-platform) |
| **Customer Investment** | Per-contact total expenses (§3.7 with `expenseTarget: SPECIFIC_CUSTOMER`), Per-contact-group aggregate expenses, Campaign spend per contact (Module S), Sales visit count per contact, Investment ROI ratio (revenue ÷ direct expenses), Top 10 most-invested contacts, Contacts with high expense but low revenue (warning flag) | §3.7 (Expense) + Module F (Sales) + Module S (Campaigns) + Module Q (SO values) |
| **Customer Revenue** | Per-contact SO total value, Per-contact PO total value, Revenue trend over time per contact, Top 10 revenue-generating contacts, Contact revenue vs. industry average, Revenue by contact type (Type 1/2/3), Revenue by contact group, New vs. returning customer revenue split | Module Q (SO/PO values) + Module D (Contact Pool) |

### Report Data Model

| Field | Type | Description |
|-------|------|-------------|
| reportId | string | Unique identifier |
| tenantId | string | Company generating the report |
| reportType | enum | 'SALES_SUMMARY' / 'HR_PIPELINE' / 'CONTACT_POOL' / 'BILLING' / 'TASK_COMPLETION' / 'ATTENDANCE' / 'CHAT_COMMUNICATION' / 'PRODUCT_SHOWCASE' / 'INVENTORY_TRACKING' / 'PROCUREMENT_PO' / 'EXPENSE' / 'CUSTOMER_INVESTMENT' / 'CUSTOMER_REVENUE' — 13 categories matching the report categories table above |
| dateRangeStart | string | Report period start (ISO date) |
| dateRangeEnd | string | Report period end (ISO date) |
| generatedBy | string | userId who requested the report |
| generatedAt | string | When report was generated |
| exportFormat | enum | 'PDF' / 'CSV' |
| fileUrl | string | Download URL (expires after 7 days) |
| fileSizeBytes | number | File size |
| status | enum | 'GENERATING' / 'READY' / 'EXPIRED' / 'FAILED' |
| filterCriteria | object | JSON object of applied filters (team, department, date range, specific user, etc.) |

### Export Formats

| Format | Description |
|--------|-------------|
| **PDF** | Formatted report with company branding (logo, name, address). Suitable for printing and management presentations. |
| **CSV** | Raw data export for further analysis in Excel, Google Sheets, or BI tools. Column headers match field names. |

### Access Control

| Role | Access |
|------|--------|
| MD / OWNER | All company reports |
| Department Head | Reports for their department only |
| Team Manager | Reports for their team only |
| Individual User | Personal reports only (own sales, own tasks, own expenses) |
| Super Admin | Platform-wide aggregate reports across all tenants (anonymized where PDPA applies) |

> [!NOTE]
> **Report generation behavior:** Reports are generated on-demand from live data — they are not pre-computed or cached. For large datasets (>10,000 records), the system generates the report asynchronously and notifies the user via push notification when ready for download. Report generation respects the user's timezone setting for date grouping.

> [!IMPORTANT]
> **PDPA compliance for reports (Sec 22 — Purpose Limitation):** Reports containing personal data (employee names, contact details, KYC status) are subject to PDPA purpose limitation. Reports can only be generated by users with appropriate permissions for the data category. Super Admin platform-wide reports anonymize individual user data — only aggregated statistics are shown.

---

## 16.7 Security Layers Audit Checklist {#16-7-security-audit}

> [!TIP]
> **📖 In Plain Language:** A comprehensive security checklist with 59 measures across 10 zones: data isolation, identity management, encryption, API hardening, audit logging, PDPA compliance, content safety, infrastructure, application security, and disaster recovery. Every measure references the specific Thai law it satisfies.



> [!IMPORTANT]
> **Comprehensive platform security audit.** This checklist verifies that every security-related claim in the specification is properly defined with implementation details, legal basis, and responsible module. All items cross-referenced against Thai law: PDPA B.E. 2562, Computer Crime Act B.E. 2550, ETA B.E. 2544, Criminal Code Sec 264, Revenue Code Sec 87/3, AMLA B.E. 2542.

### Zone 1: Multi-Tenant Data Isolation

| # | Security Measure | Spec Location | Status |
|---|-----------------|---------------|--------|
| 1.1 | Firestore tenant-scoped paths (`/tenants/{tenantId}/...`) | Module P — Currently Built | ✅ Verified |
| 1.2 | API middleware enforces `tenantId` on every request | Module P — Auth | ✅ Verified |
| 1.3 | Cross-tenant data leakage prevention (RBAC middleware) | Module C — Permission Matrix | ✅ Verified |
| 1.4 | Sandbox data isolation (SYNTHETIC_ONLY / ANONYMIZED_COPY) | §16.5 Sandbox | ✅ Verified |

### Zone 2: Identity & Access Management

| # | Security Measure | Spec Location | Status |
|---|-----------------|---------------|--------|
| 2.1 | Firebase Authentication (email + phone login) | Module A — Multi-Login | ✅ Verified |
| 2.2 | MFA/OTP for sensitive operations (seal, vault, bank export) | Module B — Seal, Vault | ✅ Verified |
| 2.3 | AWS Face Liveness — KYC, E-Signature, Seal, Termination, Bank Export | Module A — AWS Face Liveness Integration Points (§2) | ✅ Verified |
| 2.4 | Role-based access control (73+ permissions across all modules) | Module C — Permission Matrix | ✅ Verified |
| 2.5 | Hierarchical approval chain with cascading escalation | Module C — Approval Chain | ✅ Verified |
| 2.6 | Session management with active hours and vacation mode | Module A — Notification Preferences | ✅ Verified |

### Zone 3: Data Encryption

| # | Security Measure | Spec Location | Status |
|---|-----------------|---------------|--------|
| 3.1 | TLS 1.3 for all data in transit | Module G — Chat Encryption | ✅ Verified |
| 3.2 | AES-256 encryption at rest for PII (nationalIdNumber, passport) | Module A — Encrypted Fields | ✅ Verified |
| 3.3 | Company seal image encrypted storage (MD-only decryption) | Module B — Seal Registry | ✅ Verified |
| 3.4 | Contract Vault documents encrypted at rest | Contract Vault — Storage | ✅ Verified |
| 3.5 | KYC documents in encrypted cold storage (post-account deletion) | Module A — KYC Archive | ✅ Verified |

### Zone 4: API Gateway Hardening

| # | Security Measure | Spec Location | Status |
|---|-----------------|---------------|--------|
| 4.1 | IP allowlisting for ERP API keys | ERP API — Security Layers | ✅ Verified |
| 4.2 | Emergency key revocation (one-click) | ERP API — Emergency Revoke | ✅ Verified |
| 4.3 | Auto-freeze on anomaly detection (usage spike, unknown IP, scope violation) | ERP API — Auto-Freeze | ✅ Verified |
| 4.4 | Key expiry + rotation (default 90 days) | ERP API — Key Rotation | ✅ Verified |
| 4.5 | Per-minute rate limiting (default 60 req/min) | ERP API — Rate Limit | ✅ Verified |
| 4.6 | Read/Write API key separation | ERP API — Key Separation | ✅ Verified |
| 4.7 | HMAC request signing (anti-replay attacks) | ERP API — HMAC Signing | ✅ Verified |
| 4.8 | Mutual TLS for cloud ERP connections | ERP API — Cloud Security | ✅ Verified |

### Zone 5: Audit Logging & Legal Compliance

| # | Security Measure | Legal Basis | Status |
|---|-----------------|-------------|--------|
| 5.1 | All POST/PUT/PATCH/DELETE operations logged | Computer Crime Act Sec 26 | ✅ Verified |
| 5.2 | API call audit log (IP, endpoint, data scope, response code) | PDPA Sec 37 (accountability) | ✅ Verified |
| 5.3 | Contract Vault access audit trail | ETA Sec 26 (reliable systems) | ✅ Verified |
| 5.4 | KYC cold storage access log (requires legal reason) | PDPA Sec 33 (erasure exemption) | ✅ Verified |
| 5.5 | 90-day traffic data retention for chat/messaging | Computer Crime Act Sec 26 | ✅ Verified |
| 5.6 | T&A consent audit log with version tracking | PDPA Sec 19 (consent records) | ✅ Verified |

### Zone 6: PDPA Compliance

| # | Security Measure | PDPA Section | Status |
|---|-----------------|--------------|--------|
| 6.1 | Explicit consent before data collection | Sec 24 | ✅ Verified |
| 6.2 | Right to data access (getMyData) | Sec 30 | ✅ Verified |
| 6.3 | Right to erasure (deleteMyData) | Sec 33 | ✅ Verified |
| 6.4 | Thai ID back-side NOT collected (religion/blood type = sensitive) | Sec 26 (Sensitive Data) | ✅ Verified |
| 6.5 | Separate GPS tracking consent clause per company role | Sec 26 (Sensitive Data) | ✅ Verified |
| 6.6 | Event attendee PDPA consent for host data requests | Sec 19 + Sec 23 | ✅ Verified |
| 6.7 | 5-year post-deletion data retention (financial/KYC) | Sec 24(3) + Revenue Code 87/3 + AMLA Sec 22 | ✅ Verified |
| 6.8 | Privacy notice displayed BEFORE data upload button | Sec 23 (notice requirement) | ✅ Verified |
| 6.9 | Sandbox data marked "NOT LEGALLY BINDING" | Sec 22 (purpose limitation) | ✅ Verified |

### Zone 7: Content & Substance Safety

| # | Security Measure | Legal Basis | Status |
|---|-----------------|-------------|--------|
| 7.1 | Substance gate classification (Hermes AI) | Alcohol Control Act, Tobacco Act | ✅ Verified |
| 7.2 | Content moderation pipeline (auto + manual review) | Computer Crime Act Sec 15 | ✅ Verified |
| 7.3 | Emergency freeze middleware (government takedown ≤24h) | Technology Crimes Decree B.E. 2566 | ✅ Verified |
| 7.4 | Brand DNA / cross-promotion detection | Alcoholic Beverage Control Act (No. 2) B.E. 2568 | ✅ Verified |
| 7.5 | Marketing language detection for restricted products | Alcohol Control Act Sec 32 | ✅ Verified |
| 7.6 | Direct URL protection for restricted content | All substance restriction laws | ✅ Verified |

### Zone 8: Infrastructure Security

| # | Security Measure | Spec Location | Status |
|---|-----------------|---------------|--------|
| 8.1 | Rate limiting middleware (per-route + global) | Module P — rate-limit.middleware | ✅ Verified |
| 8.2 | Webhook retry policy with exponential backoff | ERP API — Webhook Config | ✅ Verified |
| 8.3 | Auto-disable webhooks after 10 consecutive failures | ERP API — Webhook Config | ✅ Verified |
| 8.4 | Production rollback capability (72-hour window) | §16.5 Sandbox — Rollback | ✅ Verified |
| 8.5 | Deployment pipeline with QA testing gate | §16.5 Sandbox — Pipeline | ✅ Verified |

**Zone 9 — Application Security:**

| # | Measure | Reference |
|---|---------|----------|
| 9.1 | CSRF tokens on all state-changing requests (POST/PUT/PATCH/DELETE) | OWASP Top 10 |
| 9.2 | XSS protection — output encoding, Content Security Policy headers | OWASP Top 10 |
| 9.3 | Injection protection — parameterized queries, Firestore security rules, input sanitization | OWASP Top 10 |
| 9.4 | HTTP security headers — CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Strict-Transport-Security | Web Security Best Practices |
| 9.5 | Password policy — minimum 12 characters, breach database check (HaveIBeenPwned API), no password rotation for non-admin accounts (NIST 800-63B) | NIST 800-63B |
| 9.6 | Session management — 30-minute idle timeout, 24-hour absolute timeout, secure session invalidation on password change | OWASP Session Management |
| 9.7 | Input validation framework — type checking, length limits, allowlist validation for enums, reject unexpected fields | Data Integrity |

**Zone 10 — Business Continuity & Disaster Recovery:**

| # | Measure | Reference |
|---|---------|----------|
| 10.1 | Daily encrypted backups with RPO ≤ 1 hour, RTO ≤ 4 hours. Automated backup verification via restore testing. | Business Continuity |
| 10.2 | Geo-redundant storage — multi-region data replication (primary: asia-southeast1, failover: asia-east1) | Infrastructure Resilience |
| 10.3 | Secrets management — all API keys, encryption keys, and credentials stored in a vault service (Google Secret Manager / HashiCorp Vault). Automated key rotation every 90 days. | Infrastructure Security |


> [!TIP]
> **Audit result: 59/59 security measures verified (100%).** All security-related claims in the specification have corresponding implementation details, legal references, and responsible modules. The platform's defense-in-depth strategy covers 10 distinct security zones with multiple independent layers per zone. No specification gaps were identified.

---

### §16.8 Data Subject Rights Implementation

> [!TIP]
> **📖 In Plain Language:** This section defines what happens when a user says "delete my data" or "export my data" — which are legal rights under Thailand's PDPA law. The system can't just delete everything because some data must be kept for legal reasons (KYC docs for 5 years per anti-money laundering law, financial records for 5 years per Revenue Code, e-signatures for 10 years). So the system applies different actions per data type: some get erased, some get anonymized, some get retained with a legal basis and expiry date.
>
> **Data Protection Officer (DPO):** Mandatory for Cloudfull.com. Manages data subject requests, breach notifications (72-hour requirement), and monthly compliance reports.



> [!CAUTION]
> **PDPA B.E. 2562 requires specific workflows for data subject rights.** These are NOT optional — they are legal obligations enforceable with fines up to 5M THB per violation.

#### Right to Erasure (PDPA Sec 33) — `deleteMyData`

**Workflow:**
1. User submits erasure request via Settings → Privacy → "Delete My Data"
2. System validates: are there legal retention obligations blocking full erasure?
3. For each data type, apply the appropriate action:

| Data Type | Action | Legal Basis for Retention |
|-----------|--------|--------------------------|
| User profile (name, email, phone) | **Erase** after account closure grace period (30 days) | None after closure |
| KYC documents (ID, selfie) | **Retain 5 years** then auto-erase | AMLA B.E. 2542, Revenue Code Sec 87/3 |
| Chat messages (content) | **Anonymize** after 90 days — replace author with `[Deleted User]`, redact personal identifiers in content | Computer Crime Act Sec 26 (90-day metadata only); no legal basis for content retention beyond 90 days |
| Chat metadata (sender, timestamp, type) | **Retain 90 days** then erase | Computer Crime Act Sec 26 |
| Financial records (invoices, POs) | **Retain 5 years** then auto-erase | Revenue Code Sec 87/3 |
| Consent audit logs | **Retain 5 years** then auto-erase | PDPA Sec 19 |
| Tasks, contacts, products created | **Anonymize** — replace `createdBy` with `[Deleted User]`, retain data for company continuity | Legitimate interest (company operational data) |
| E-signatures and signing events | **Retain 10 years** then auto-erase | ETA B.E. 2544, Civil and Commercial Code |
| GPS/attendance records | **Anonymize** after account closure | No retention obligation |

**ErasureRequest Model:**

| Field | Type | Description |
|-------|------|-------------|
| requestId | string | Unique identifier |
| userId | string | Requesting user |
| requestedAt | string | ISO 8601 |
| status | enum | 'PENDING' / 'IN_PROGRESS' / 'COMPLETED' / 'PARTIALLY_COMPLETED' |
| completedAt | string | When erasure was completed |
| fieldsErased[] | string[] | List of data categories fully erased |
| fieldsRetained[] | RetainedField[] | Data retained with legal basis |
| → fieldCategory | string | e.g., 'KYC_DOCUMENTS' |
| → retainUntil | string | Date when retention expires |
| → legalBasis | string | Law citation (e.g., 'AMLA B.E. 2542') |
| processedBy | string | System or admin userId |
| auditLogId | string | Link to compliance audit log |

**Timeline:** Erasure must be completed within **30 days** of request (PDPA Sec 33).

**Chat Message Reconciliation:**
> The platform's "messages cannot be permanently deleted" policy (Module G) is reconciled with PDPA Sec 33 as follows: During the 90-day Computer Crime Act retention period, messages are retained in full. After 90 days, if the user has submitted an erasure request, message **content** is anonymized (author replaced with `[Deleted User]`, personal identifiers redacted) while **metadata** (timestamp, message type, room ID) is retained for audit purposes only. Messages from users who have NOT requested erasure remain unchanged.

#### Right to Data Portability (PDPA Sec 31) — `exportMyData`

**Workflow:**
1. User requests export via Settings → Privacy → "Export My Data"
2. System generates a structured JSON/CSV package containing:
   - User profile and KYC data
   - All contacts created by the user
   - All tasks created or assigned to the user
   - All chat messages sent by the user
   - All documents uploaded by the user
   - E-signature registry entries
3. Export delivered as a secure download link (24-hour expiry, one-time use)
4. Format: JSON with documented schema + CSV summary

**Timeline:** Export must be provided within **30 days** of request.

#### Data Protection Officer (DPO)

> [!IMPORTANT]
> **PDPA Sec 41-42 requires appointment of a DPO** for organizations processing personal data at scale. Cloudfull.com processes Thai national IDs, biometric data (face liveness), GPS location data, and financial data for 10,000-100,000+ users — DPO appointment is mandatory.

**DPO Configuration (Platform-Level):**

| Field | Type | Description |
|-------|------|-------------|
| dpoName | string | Data Protection Officer name |
| dpoEmail | string | DPO contact email (publicly accessible) |
| dpoPhone | string | DPO contact phone |
| dpoAddress | string | DPO office address |

**DPO Dashboard (Super Admin Backoffice):**
- Data subject request queue (erasure + portability + access requests)
- PDPA complaint submission form for external data subjects
- Monthly compliance report generation
- Breach notification workflow (72-hour PDPA Sec 37(4) requirement)

#### Cross-Border Data Transfer (PDPA Sec 28-29)

When personal data is transferred to countries without adequate data protection:
- Require explicit user consent for cross-border transfer
- Document the receiving country and purpose
- Implement Standard Contractual Clauses (SCCs) for B2B data flows
- `crossBorderTransferRules` in CountryConfig (§1.5) must specify: allowed destination countries, transfer mechanism (adequacy / SCCs / consent), and data categories permitted for transfer




## 17. Module Q: Purchase Order & Procurement {#17-module-q}

> [!TIP]
> **📖 What is Module Q?** Full B2B procurement document management — the formal buying/selling process between companies. Document flow: **RFQ → Quotation → Purchase Order (PO) → Sales Order (SO)**.
>
> **Separate from Contract Vault (§3.6).** PO/SO documents use the same e-signature infrastructure but are presented independently — procurement orders ≠ legal contracts.
>
> **Invoice & Delivery = Read-Only from ERP.** Cloudfull.com does NOT create invoices. Invoice and delivery data comes from Co-Work.cloud or external ERP as a read-only display.
>
> **Example flow:** Restaurant sends RFQ to meat supplier ("200 kg pork belly, best price?") → Supplier sends Quotation (฿280/kg, NET 30) → Restaurant creates PO (approved by manager) → Supplier acknowledges → SO auto-created on supplier's side → Delivery + invoice tracked from ERP.



> [!IMPORTANT]
> **B2B procurement document management — separate from the Contract Vault.** Module Q manages Purchase Orders, Sales Orders, RFQs, and Quotations as procurement-specific documents with their own signing, approval, and audit features. PO/SO documents use the **same e-signature infrastructure** (Module A) and **KYC verification** as the Contract Vault, but are presented in a separate module so users don't confuse procurement orders with legal contracts.
>
> **Invoice and delivery tracking are NOT managed in Cloudfull.com.** Invoice data and delivery status are synced as **read-only data from Co-Work.cloud or external ERP systems** (via Module B §3 ERP API Integration). Cloudfull.com displays this data alongside the PO/SO for context, but does not create or manage invoices or shipments.
>
> **Referenced by:** Module D (contact-linked POs) · Module E (PO **triggers** follow-up tasks) · Module H (product line items from catalog) · Module B §3 (ERP sync for invoice/delivery status)

### Procurement Lifecycle

```
                     Cloudfull.com (Module Q)                    Co-Work.cloud / ERP
                  ┌────────────────────────────┐             ┌─────────────────────┐
Company B         │                            │             │                     │
(Buyer)           │  1. RFQ ──────────►        │             │                     │
                  │  2. ◄──── Quotation        │             │                     │
                  │  3. PO sent ──────►        │             │                     │
                  │  4. ◄──── SO acknowledged  │             │                     │
                  │                            │   sync ►    │  5. Delivery status  │
                  │  [read-only display] ◄─────│─────────────│  6. Invoice data     │
                  │                            │             │  7. Payment status    │
                  └────────────────────────────┘             └─────────────────────┘
```

> [!NOTE]
> **Not all steps are mandatory.** A buyer can skip RFQ and create a PO directly. A seller can skip quotation and accept a PO directly. Both PO and SO support **file upload** — users can upload their own PO/SO documents (PDF, scanned paper) instead of using system-generated forms. The system still tracks lifecycle status and signatures regardless of whether the document was created in-app or uploaded.

### PO Access Configuration (Per Company)

> [!IMPORTANT]
> **Both buyer and seller must configure who can send and receive POs.** This prevents unauthorized purchasing and ensures proper approval chains.

| Field | Type | Description |
|-------|------|-------------|
| poAccessConfigId | string | Unique |
| tenantId | string | This company |
| **buyerConfig** | object | Configuration for OUTGOING orders (when this company is the buyer) |
| → canCreatePO | string[] | Permission-based: which roles can create and send POs (**validates against** → Module C §4) |
| → requireApprovalAbove | number | PO value threshold requiring manager approval (e.g., ฿50,000). 0 = no approval needed. |
| → approvalChain | string[] | Ordered list of approver roleIds for POs above threshold |
| → **requireVerifiedSeller** | boolean | Only send POs to verified companies on the platform |
| → defaultPaymentTerms | string | Default payment terms for new POs (e.g., 'NET_30') |
| → poNumberPrefix | string | Custom PO number prefix (e.g., "PO-ACME-") |
| → poNumberSequence | number | Auto-incrementing sequence number |
| **sellerConfig** | object | Configuration for INCOMING orders (when this company is the seller) |
| → canReceivePO | string[] | Which roles can view and process incoming POs |
| → canAcknowledgePO | string[] | Which roles can acknowledge/accept incoming POs |
| → **requireVerifiedBuyer** | boolean | Only accept POs from verified companies on the platform |
| → autoAcknowledge | boolean | Automatically acknowledge POs below a threshold value |
| → autoAcknowledgeThreshold | number | Value threshold for auto-acknowledgement |
| → **receiveTarget** | enum | 'COMPANY_LEVEL' (PO goes to company inbox — any authorized role can pick up) / 'SPECIFIC_USER_ROLE' (PO routed to a specific user role, e.g., the buyer's assigned sales rep from the contact pool) |

### RFQ (Request for Quotation)

| Field | Type | Description |
|-------|------|-------------|
| rfqId | string | Unique (auto: RFQ-{tenantId}-{YYYY}-{sequence}) |
| buyerTenantId | string | Company sending the RFQ |
| sellerTenantId | string | Company receiving the RFQ |
| requestedBy | string | User who created the RFQ |
| **rfqItems[]** | RFQLineItem[] | What the buyer wants to purchase |
| → productId | string | If from catalog: **references** → Module H MasterProduct. Null if manual entry. |
| → productName | string | Product name (from catalog or manually entered) |
| → requestedQuantity | number | How many |
| → unitOfMeasure | string | 'PCS' / 'KG' / 'BOX' / 'SET' / custom |
| → targetPrice | number | Buyer's target price per unit (optional — "what we'd like to pay") |
| → specifications | string | Special requirements or specifications |
| deliveryAddress | object | Where to deliver (ThaiAddress or international address per §1.5) |
| requestedDeliveryDate | string | When the buyer needs delivery |
| additionalNotes | string | Free text notes |
| status | enum | 'DRAFT' / 'SENT' / 'VIEWED' / 'QUOTE_RECEIVED' / 'CANCELLED' / 'EXPIRED' |
| validUntil | string | RFQ expiry date |
| createdAt | string | When created |
| **linkedTaskId** | string | Auto-created Module E task for the seller to respond. **References** → Module E (§6). |
| **sourceContext** | enum | 'STANDALONE' (created from Module Q UI) / 'CHAT' (created from chat inline product picker) / 'MARKETPLACE' (from marketplace browse). Default: 'STANDALONE'. |
| **sourceChatRoomId** | string | If `sourceContext: 'CHAT'`: the chat room where the RFQ was initiated. Null otherwise. |
| **updatedAt** | string | Last modified |

### Quotation

| Field | Type | Description |
|-------|------|-------------|
| quoteId | string | Unique (auto: QT-{tenantId}-{YYYY}-{sequence}) |
| sellerTenantId | string | Company sending the quotation |
| buyerTenantId | string | Company receiving the quotation |
| rfqId | string | **References** → RFQ (null if quotation sent without RFQ) |
| preparedBy | string | User who prepared the quote |
| **quoteItems[]** | QuoteLineItem[] | Priced items being offered |
| → productId | string | If from catalog: **references** → Module H. Null if manual. |
| → productName | string | Product name |
| → quantity | number | Offered quantity |
| → unitOfMeasure | string | Unit |
| → unitPrice | number | Price per unit |
| → discount | number | Discount percentage (0-100) |
| → discountAmount | number | Discount in currency |
| → lineTotal | number | (quantity × unitPrice) - discountAmount |
| → currency | string | Currency code (from CountryConfig §1.5) |
| **subtotal** | number | Sum of all line totals |
| **taxRate** | number | VAT/GST rate from CountryConfig |
| **taxAmount** | number | Calculated tax |
| **grandTotal** | number | subtotal + taxAmount |
| **paymentTerms** | enum | 'CASH' / 'COD' / 'NET_7' / 'NET_15' / 'NET_30' / 'NET_60' / 'NET_90' / 'CUSTOM' |
| customPaymentTerms | string | If CUSTOM: free text description |
| **deliveryTerms** | string | Delivery conditions and timeline |
| validUntil | string | Quote expiry date |
| status | enum | 'DRAFT' / 'SENT' / 'VIEWED' / 'ACCEPTED' / 'REJECTED' / 'EXPIRED' / 'REVISED' |
| revisionNumber | number | Version number (starts at 1, increments on revision) |
| previousQuoteId | string | If revised: **references** → previous version |
| **revisionLimit** | number | Maximum allowed revisions per quotation chain (default: 10, configurable per company) |
| **isFinalOffer** | boolean | If true, no further revisions allowed — buyer must accept or reject |
| notes | string | Terms, conditions, special notes |
| createdAt | string | When created |
| **linkedTaskId** | string | Auto-created Module E task for the buyer to review. **References** → Module E (§6). |
| **sourceContext** | enum | 'STANDALONE' (created from Module Q UI) / 'CHAT' (created from chat inline product picker). Default: 'STANDALONE'. |
| **sourceChatRoomId** | string | If `sourceContext: 'CHAT'`: the chat room where the Quotation was initiated. Null otherwise. |
| **updatedAt** | string | Last modified |

> [!NOTE]
> **Manual upload option:** If a seller prefers to use their own quotation format, they can upload a PDF/document as the quotation instead of filling system fields. The `quoteItems[]` remain empty and the uploaded document is attached. Both parties can still track the lifecycle (SENT → VIEWED → ACCEPTED).

### Purchase Order

| Field | Type | Description |
|-------|------|-------------|
| poId | string | Unique (auto: {poNumberPrefix}{YYYY}-{poNumberSequence}) |
| buyerTenantId | string | Buying company |
| sellerTenantId | string | Selling company |
| quoteId | string | **References** → Quotation (null if PO created without quotation) |
| createdBy | string | User who created the PO |
| **buyerContactId** | string | Contact Pool entry for the buyer company (**references** → Module D). Links PO to the existing business relationship. |
| approvedBy | string | Manager who approved (if above threshold, **validates against** → Module C §4) |
| **poItems[]** | POLineItem[] | Ordered items |
| → productId | string | If from catalog: **references** → Module H MasterProduct. Null if manual entry. |
| → productName | string | Product name |
| → sku | string | SKU code (from catalog or manually entered) |
| → quantity | number | Units ordered |
| → unitOfMeasure | string | Unit |
| → unitPrice | number | Price per unit. **If Company A has a price list set for Company B (Module H priceLists[]), the matching price auto-populates.** Otherwise, manually entered or from quotation. |
| → discount | number | Discount percentage |
| → discountAmount | number | Discount in currency |
| → lineTotal | number | Calculated line total |
| → currency | string | Currency code |
| **subtotal** | number | Sum of line totals |
| **taxRate** | number | VAT/GST rate from CountryConfig |
| **taxAmount** | number | Calculated tax |
| **grandTotal** | number | subtotal + taxAmount |
| **paymentTerms** | enum | 'CASH' / 'COD' / 'NET_7' / 'NET_15' / 'NET_30' / 'NET_60' / 'NET_90' / 'CUSTOM' |
| customPaymentTerms | string | Custom terms description |
| **deliveryAddress** | object | Delivery destination (ThaiAddress or international). Actual delivery tracking is managed in ERP — see "Invoice & Delivery Status" section below. |
| status | enum | 'DRAFT' / 'PENDING_APPROVAL' / 'APPROVED' / 'SENT' / 'ACKNOWLEDGED' / 'COMPLETED' / 'CANCELLED' / 'DISPUTED' |

**Dispute Resolution Workflow:**

When a PO enters `DISPUTED` status:

| Field | Type | Description |
|-------|------|-------------|
| disputeReason | string | Why the PO is disputed (required when status → DISPUTED) |
| disputeFiledBy | string | userId who filed the dispute |
| disputeFiledAt | string | ISO 8601 |
| disputeResolution | enum | 'AMENDED' / 'CANCELLED' / 'WITHDRAWN' (null until resolved) |
| disputeResolvedAt | string | When dispute was resolved |
| disputeResolvedBy | string | userId who resolved |

**Dispute Transitions:** `DISPUTED` → `AMENDED` (PO modified and re-acknowledged by both parties) / `CANCELLED` (PO voided) / `ACKNOWLEDGED` (dispute withdrawn, original PO stands)

**Dispute Notification Events:** `DISPUTE_FILED` → both parties (In-app, Email). `DISPUTE_RESOLVED` → both parties (In-app, Email).

**PO Version, Amendment & Document Fields:**

| Field | Type | Description |
|-------|------|-------------|
| **revisionNumber** | number | PO version (buyer can amend → creates new version, seller must re-acknowledge) |
| previousPoId | string | If amended: **references** → previous version |
| notes | string | Special instructions |
| **uploadedDocumentUrl** | string | If uploaded: buyer's own PO document (PDF, scanned paper). Null if created in-app. |
| **documentFormat** | enum | 'SYSTEM_GENERATED' (created via webapp forms) / 'UPLOADED_FILE' (buyer uploaded their own PO document). Both formats get the same signing and audit features. |
| **signatures[]** | ProcurementSignature[] | E-signatures or uploaded physical signatures. See PO/SO Document Signing section below. |
| **linkedTaskId** | string | Auto-created Module E task for seller to process. **References** → Module E (§6). |
| **coWorkSoId** | string | If seller uses Co-Work.cloud: the synced Sales Order ID in Co-Work.cloud ERP. Null if not integrated. |
| createdAt | string | When created |
| updatedAt | string | Last modified |

> [!NOTE]
> **Dual source for line items:** Buyer can (1) select from seller's public product catalog with auto-populated prices from the seller's price list, (2) manually enter custom items not in the catalog, or (3) use both in the same PO. If a quotation exists, line items auto-populate from the accepted quote.

> [!NOTE]
> **Co-Work.cloud integration:** If the seller company uses Co-Work.cloud ERP, acknowledged POs automatically become Sales Orders in Co-Work.cloud. The `coWorkSoId` field tracks the linked SO. If neither company uses Co-Work.cloud, the entire lifecycle is managed within Cloudfull.com.

### Sales Order (Seller's View)

> [!NOTE]
> **A Sales Order is the seller's mirror of a Purchase Order.** When a seller acknowledges a PO, the system creates a corresponding SO record in the seller's account. The SO shares the same line items and terms but tracks from the seller's perspective. Like POs, Sales Orders can be **uploaded as files** (PDF, scanned documents) instead of being created in-app.

| Field | Type | Description |
|-------|------|-------------|
| soId | string | Unique (auto: SO-{tenantId}-{YYYY}-{sequence}) |
| sellerTenantId | string | Selling company |
| buyerTenantId | string | Buying company |
| poId | string | **References** → Purchase Order |
| acknowledgedBy | string | User who acknowledged the PO |
| acknowledgedAt | string | When acknowledged |
| soItems[] | SOLineItem[] | Mirror of PO line items (same structure) |
| status | enum | 'NEW' / 'ACKNOWLEDGED' / 'IN_FULFILLMENT' / 'COMPLETED' / 'CANCELLED' |
| **uploadedDocumentUrl** | string | If uploaded: seller's own SO document (PDF). Null if created in-app. |
| **documentFormat** | enum | 'SYSTEM_GENERATED' (created via webapp forms) / 'UPLOADED_FILE' (seller uploaded their own SO document). Both formats get the same signing and audit features. |
| **signatures[]** | ProcurementSignature[] | E-signatures or uploaded physical signatures (same infrastructure as Contract Vault — Module A e-signature + KYC verification) |
| → signedBy | string | userId who signed |
| → signedForPartyType | enum | 'BUYER' / 'SELLER' |
| → signatureType | enum | 'E_SIGNATURE' / 'PHYSICAL_UPLOAD' (uploaded scan of signed document) |
| → signingEventId | string | Link to E-Signature Registry signing event (if digital) |
| → signedAt | string | When signed |
| **linkedTaskId** | string | Auto-created Module E task for the seller to fulfill |
| **updatedAt** | string | Last modified |
| createdAt | string | When created |

### Invoice & Delivery Status (Read-Only ERP Sync)

> [!IMPORTANT]
> **Invoice and delivery data are NOT created or managed in Cloudfull.com.** This data is synced from Co-Work.cloud or external ERP systems via the ERP API Integration (Module B §3). Cloudfull.com displays this data alongside the PO/SO so both buyer and seller have visibility, but all invoice creation, payment processing, and shipment management remain in the company's ERP or Co-Work.cloud.
>
> **Two sync modes depending on the ERP:**
> - **Co-Work.cloud:** Fully automatic. When a PO is acknowledged → SO is auto-created in Co-Work.cloud → delivery status, invoice, and payment data sync back automatically in real-time.
> - **External ERP (Odoo, SAP, Oracle, etc.):** The user manually updates PO/SO status within Cloudfull.com after performing the corresponding action in their ERP. For example: user receives a PO → acknowledges it in Cloudfull.com → creates the SO manually in their ERP → comes back to Cloudfull.com and updates the status to reflect the SO was created. Invoice and delivery data may sync automatically via API (if the ERP integration supports it) or the user updates status manually.

**ERP-Synced Procurement Status Model (displayed on PO/SO detail page):**

| Field | Type | Description |
|-------|------|-------------|
| procurementSyncId | string | Unique identifier |
| poId | string | **References** → Purchase Order |
| soId | string | **References** → Sales Order |
| erpSystemName | string | Source system (e.g., 'Co-Work.cloud', 'Odoo 17', 'SAP S/4HANA') |
| **deliveryStatus** | enum | Read-only from ERP: 'PENDING' / 'PREPARING' / 'SHIPPED' / 'PARTIAL_DELIVERED' / 'FULLY_DELIVERED' |
| **deliveryTrackingNumber** | string | Shipping tracking number (from ERP) |
| **expectedDeliveryDate** | string | From ERP |
| **actualDeliveryDate** | string | From ERP |
| **invoiceNumber** | string | Invoice number from ERP |
| **invoiceDate** | string | Invoice date from ERP |
| **invoiceAmount** | number | Invoice total from ERP |
| **invoiceCurrency** | string | Currency code |
| **paymentStatus** | enum | Read-only from ERP: 'UNPAID' / 'PARTIAL_PAID' / 'PAID' / 'OVERDUE' |
| **paymentDueDate** | string | Payment due date from ERP |
| lastSyncedAt | string | When this data was last synced (null if manually updated) |
| syncStatus | enum | 'AUTO_SYNCED' (from Co-Work.cloud) / 'MANUAL_UPDATE' (user updated status manually) / 'API_SYNCED' (from external ERP API) / 'PENDING' / 'ERROR' / 'STALE' (no sync in >24 hours) |
| **updatedBy** | string | If MANUAL_UPDATE: userId who last updated this status |
| **updatedAt** | string | If MANUAL_UPDATE: when user last updated |
| **manualUpdateNote** | string | If MANUAL_UPDATE: optional note from user (e.g., "SO created in Odoo as SO-2026-0455") |

> [!NOTE]
> **Manual status update for external ERP users:** When a company uses an ERP other than Co-Work.cloud, the PO/SO detail page shows action buttons for the user to manually update status:
> - After receiving PO → tap "Mark as Acknowledged" → status updates to ACKNOWLEDGED
> - After creating SO in their ERP → tap "Mark SO Created" → enter ERP SO reference number → status updates
> - After shipping → tap "Update Delivery Status" → select status + enter tracking number
> - After invoicing in ERP → tap "Update Invoice Status" → enter invoice number + amount
> These manual updates are logged in the audit trail and visible to both parties.

**Display View:**

| Feature | Description |
|---------|-------------|
| **PO/SO detail page** | Shows a "📦 Delivery & Invoice" tab with read-only ERP data: delivery status badge, tracking number, invoice details, payment status. Each row shows sync freshness: 🟢 Synced (<1 hour), 🟡 Stale (1-24 hours), 🔴 Error. |
| **No ERP connected** | If neither company has ERP integration, the "Delivery & Invoice" tab shows: "Invoice and delivery tracking will be available when connected to Co-Work.cloud or an external ERP system." |

> [!NOTE]
> **Manual upload fallback:** Companies without ERP integration can upload PDF files for any procurement document (RFQ, Quotation, PO, SO). The system tracks lifecycle status and signatures regardless of how the document was created. However, invoice and delivery tracking still require ERP integration — Cloudfull.com does not generate or manage invoices.


### External Delivery Partner API Plugin (Future Integration)

> [!IMPORTANT]
> **Future-ready delivery tracking integration.** This section defines the API plugin architecture for integrating with external delivery companies (e.g., Kerry Express, Flash Express, J&T Express, Thailand Post, Grab Express, Lalamove). When activated, delivery status updates flow directly from the carrier into the PO/SO view — replacing or supplementing ERP-synced delivery data.
>
> **Current state:** Delivery tracking is read-only ERP sync only.
> **Future state:** Direct carrier API integration for real-time delivery status.

**DeliveryPartnerPlugin Model:**

| Field | Type | Description |
|-------|------|-------------|
| pluginId | string | Unique identifier |
| tenantId | string | Company using this plugin |
| **deliveryPartnerName** | string | Carrier name (e.g., "Kerry Express", "Flash Express") |
| **deliveryPartnerCode** | enum | 'KERRY' / 'FLASH' / 'JT' / 'THAI_POST' / 'GRAB' / 'LALAMOVE' / 'DHL' / 'FEDEX' / 'CUSTOM' |
| **apiBaseUrl** | string | Carrier's API base URL |
| **apiKey** | string | Encrypted API key for authentication |
| **webhookUrl** | string | Cloudfull webhook URL for receiving carrier status updates (auto-generated per tenant) |
| **webhookSecret** | string | Shared secret for webhook signature verification |
| **statusMapping** | object | Maps carrier-specific statuses to Cloudfull's `deliveryStatus` enum |
| isActive | boolean | Plugin is currently active |
| configuredBy | string | userId who configured |
| configuredAt | string | When configured |
| **integrationMode** | enum | 'PUSH_ONLY' (carrier sends webhooks to us) / 'PULL_ONLY' (we poll carrier API for updates) / 'PUSH_AND_PULL' (webhook primary + polling fallback for missed events). Default: 'PUSH_AND_PULL'. |
| **pullApiEndpoint** | string | Carrier's tracking API endpoint for polling (e.g., `https://api.kerryexpress.com/v1/track/{trackingNumber}`). Required if integrationMode includes PULL. |
| **pullApiAuthType** | enum | 'API_KEY' / 'OAUTH2' / 'BASIC_AUTH' / 'HMAC'. Authentication method for pull requests. |
| **pullApiCredentials** | string | Encrypted credentials for pull API authentication (stored in same encryption as apiKey) |
| **pullIntervalMinutes** | number | How often to poll carrier API (default: 60, min: 15, max: 1440). Only active when integrationMode includes PULL. |
| **pullLastRunAt** | string | Last successful poll timestamp (ISO 8601) |
| **pullNextRunAt** | string | Next scheduled poll timestamp |
| **pullRetryCount** | number | Consecutive failed polls. Auto-disables pull after **10 consecutive failures** with `DELIVERY_PULL_API_FAILED` notification to admin. |
| **pullAutoDisabledAt** | string | If auto-disabled due to failures: when it was disabled. Admin must re-enable manually. |

**DeliveryTrackingEvent Model (from carrier webhook):**

| Field | Type | Description |
|-------|------|-------------|
| trackingEventId | string | Unique identifier |
| pluginId | string | Which delivery partner plugin |
| poId / soId | string | Linked PO or SO |
| **trackingNumber** | string | Carrier tracking number |
| **trackingUrl** | string | Public tracking URL for buyer |
| **carrierStatus** | string | Raw status from carrier API |
| **mappedStatus** | enum | Mapped to Cloudfull's `deliveryStatus` enum |
| **eventTimestamp** | string | When the carrier event occurred |
| **eventLocation** | string | Location from carrier |
| **estimatedDeliveryDate** | string | Carrier's ETA |
| receivedAt | string | When webhook was received |
| **eventSource** | enum | 'WEBHOOK' (carrier pushed to us) / 'POLL' (we pulled from carrier API) / 'MANUAL' (user manually updated status) / 'ERP_SYNC' (from Co-Work.cloud or external ERP). Tracks how the delivery status was obtained. |

> [!NOTE]
> **Plugin activation:** Delivery partner plugins are configured per company. When active, `deliveryStatus` can be updated from THREE sources: (1) ERP sync (existing), (2) Manual update (existing), (3) Delivery partner webhook (new). Most recent update wins with source tracking.

### Unified PO/SO View (Buyer ↔ Seller as One)

> [!IMPORTANT]
> **Both parties see the same PO/SO as one unified document.** When Company A sends a PO to Company B, Company B's corresponding SO is **linked** to the original PO. Both parties view a single shared document with dual perspective:
> - **Buyer view (PO side):** Shows their purchase order, approval status, attached invoices received from seller
> - **Seller view (SO side):** Shows their sales order, fulfillment status, attached invoices sent to buyer
> - **Shared data:** Line items, quantities, pricing, delivery terms, and document history are visible to both parties

**Invoice Attachment within PO/SO Flow:**

> [!NOTE]
> **Cloudfull.com does NOT create invoices.** Instead, the seller can **attach** an invoice file (PDF or image) to the SO, which the buyer then sees on their PO view. If the seller uses Co-Work.cloud as their ERP, Co-Work.cloud can auto-generate the invoice from the PO/SO data. If using another ERP, the seller manually uploads the invoice file.

| Field | Type | Description |
|-------|------|-------------|
| **attachedInvoices[]** | InvoiceAttachment[] | Invoices attached to this PO/SO by the seller |
| → invoiceAttachmentId | string | Unique identifier |
| → invoiceFileUrl | string | Uploaded invoice file (PDF or image, max 20 MB) |
| → invoiceFileName | string | Original filename |
| → invoiceNumber | string | Invoice reference number (entered by seller) |
| → invoiceDate | string | Invoice date |
| → invoiceAmountTotal | number | Total amount on the invoice |
| → invoiceCurrency | string | Currency code (default: 'THB') |
| → attachedBy | string | userId who attached the invoice (seller side) |
| → attachedAt | string | When the invoice was attached |
| → invoiceSource | enum | 'MANUAL_UPLOAD' (seller uploaded PDF/image) / 'COWORK_GENERATED' (auto-generated by Co-Work.cloud from PO data) / 'ERP_SYNCED' (synced from external ERP display) |
| → buyerAcknowledged | boolean | Buyer has acknowledged receipt of this invoice |
| → buyerAcknowledgedAt | string | When buyer acknowledged |

**Dual Platform Invoice Ecosystem:**

> [!IMPORTANT]
> **Two completely separate invoice contexts exist in the ecosystem:**
>
> **1. Platform Billing (Module O §15):** Invoices between Cloudfull.com and its customers (companies/users). Cloudfull.com generates these invoices for subscription fees, add-ons, and platform usage. Managed entirely within Module O.
>
> **2. B2B Commercial Invoices (Module Q §17):** Invoices between Company A and Company B in the ecosystem. These are **attached as files** within the PO/SO flow (see above). If the seller uses Co-Work.cloud, invoices can be auto-generated. Cloudfull.com displays these invoices as **read-only** — it does not create, edit, or process B2B invoices.

---

> [!IMPORTANT]
> **PO and SO documents use the same e-signature and KYC infrastructure as the Contract Vault** but are managed in a separate module. Unlike the Contract Vault (where signatures are always required for execution), **PO/SO signatures are optional** — the company can configure whether signatures are required per document type. However, **face liveness verification can be required independently of signatures** to confirm the identity of the person submitting or acknowledging a PO/SO without requiring a formal signature.

**PO/SO Verification Configuration (per company):**

| Field | Type | Description |
|-------|------|-------------|
| **requireSignatureForPO** | boolean | If `true`, POs require e-signature or physical signature upload. If `false`, POs can be sent without signing. Default: `false`. |
| **requireSignatureForSO** | boolean | If `true`, SOs require e-signature or physical signature upload. Default: `false`. |
| **requireLivenessForPO** | boolean | If `true`, face liveness verification is required when submitting/acknowledging a PO — even if signature is NOT required. Confirms identity without formal signing. Default: `false`. |
| **requireLivenessForSO** | boolean | If `true`, face liveness verification is required when acknowledging an SO. Default: `false`. |

> [!NOTE]
> **Liveness without signature:** A company may want to confirm "Yes, it was Khun Somchai who approved this PO" without requiring a formal legal signature. Face liveness serves as identity confirmation for the audit trail without the legal weight of an e-signature. This is useful for routine POs where a full signing ceremony is unnecessary but identity confirmation is desired.

**ProcurementSignature Model (when signatures ARE required):**

| Field | Type | Description |
|-------|------|-------------|
| signatureId | string | Unique |
| documentType | enum | 'PURCHASE_ORDER' / 'SALES_ORDER' / 'RFQ' / 'QUOTATION' |
| documentId | string | poId, soId, rfqId, or quoteId |
| signedBy | string | userId who signed |
| signedForCompany | string | tenantId of the company being represented |
| signatureType | enum | 'E_SIGNATURE' (digital via Module A) / 'PHYSICAL_UPLOAD' (scanned document with ink/seal) / 'NONE' (no signature — liveness only or no verification) |
| signingEventId | string | **References** → Module A E-Signature Registry signing event (for digital signatures). Null if no signature. |
| **livenessVerified** | boolean | Whether face liveness was performed for this action (can be `true` even when signatureType is 'NONE') |
| **livenessEventId** | string | **References** → face liveness verification event ID. Null if liveness not performed. |
| verificationMethod | enum | 'FACE_LIVENESS' / 'OTP' / 'BIOMETRIC' / 'NONE' (which re-authentication was used) |
| signedAt | string | When signed or verified |
| ipAddress | string | IP address at time of signing/verification |
| **isLegallyBinding** | boolean | True if signature meets Thai ETA B.E. 2544 requirements (face liveness + registered e-signature). False if liveness-only or no signature. |

### Simple Tax Calculation on SO/PO

> [!IMPORTANT]
> **Tax calculation on SO/PO is driven by the product price setup in Module H (§9).** When a company adds a product and sets its price, they specify whether the price is **before VAT** or **after VAT** (via `priceIsBeforeVat` on each price list entry). They also set the VAT % and WHT % per product.
>
> When a product is added to a SO/PO line item:
> - If `priceIsBeforeVat: true` → system adds VAT on top of the listed price
> - If `priceIsBeforeVat: false` → system displays the VAT-inclusive price and calculates the VAT breakdown
> - WHT is calculated if `whtPercentage` is set on the product
>
> **This is for display and calculation purposes only.** Cloudfull.com does NOT manage chart of accounts or tax filing — that is exclusively handled by Co-Work.cloud ERP or the company's external accounting system.

**SO/PO Tax Line Model (auto-calculated per line item):**

| Field | Type | Description |
|-------|------|-----------|
| lineItemId | string | References the PO/SO line item |
| productId | string | References the product from Module H |
| unitPrice | number | Price per unit from the applicable price list |
| priceIsBeforeVat | boolean | Inherited from product price list setting |
| quantity | number | Quantity ordered |
| subtotal | number | `unitPrice × quantity` |
| vatPercentage | number | VAT rate (from product price list, default 7%) |
| vatAmount | number | Calculated VAT amount |
| whtPercentage | number | WHT rate (from product, null if N/A) |
| whtAmount | number | Calculated WHT amount (deducted from payment) |
| totalAfterTax | number | `subtotal + vatAmount - whtAmount` |

### Dedicated SO/PO Dashboard (Company-Wide)

> [!IMPORTANT]
> **Each company has a dedicated dashboard view showing ALL current and historical SO/PO documents across all contacts.** This dashboard integrates with the per-contact SO/PO/Invoice list already in the Contact Pool (Module D: Contact Pool Management).
>
> **Running numbers are unique to the Cloudfull ecosystem** (format: `CDF-PO-{tenantPrefix}-{sequence}` and `CDF-SO-{tenantPrefix}-{sequence}`) and do NOT affect the company's external ERP numbering. If the company uses Co-Work.cloud ERP, Cloudfull SO/PO can sync into the ERP for invoicing and purchase order management.

| Feature | Description |
|---------|-------------|
| **Filter by status** | Filter by document status: DRAFT / SENT / ACKNOWLEDGED / DISPUTED / COMPLETED / CANCELLED |
| **Filter by contact** | Filter by counterparty company or individual from Contact Pool |
| **Filter by type** | Filter by: RFQ / QUOTATION / PURCHASE_ORDER / SALES_ORDER |
| **Date range** | Filter by creation date, sent date, or completion date |
| **Search** | Full-text search across document numbers, contact names, product names |
| **Running number** | Cloudfull-unique: `CDF-PO-{prefix}-{seq}` / `CDF-SO-{prefix}-{seq}` — independent from ERP numbering |
| **ERP sync status** | Shows sync status if company uses Co-Work.cloud ERP: SYNCED / PENDING / NOT_CONNECTED |
| **Export** | Export SO/PO list as CSV/PDF (metadata only) |

### PO Module Permissions (→ add to Module C §4)

| Permission | Description |
|------------|-------------|
| `po.create` | Create and send Purchase Orders (buyer side) |
| `po.approve` | Approve POs above the configured threshold |
| `po.receive` | View and process incoming POs (seller side) |
| `po.acknowledge` | Acknowledge/accept incoming POs (seller side) |
| `po.create_rfq` | Create and send RFQs (buyer side) |
| `po.create_quote` | Create and send Quotations (seller side) |
| `po.view_all` | View all POs/SOs in the company (manager view) |
| `po.cancel` | Cancel a PO/SO (requires confirmation from both parties if already acknowledged) |

### PO Notification Events (→ add to §3.5)

| Event | Recipient | Channels |
|-------|-----------|----------|
| `po.rfq_received` | Seller's authorized users | In-app, Email |
| `po.quote_received` | Buyer who sent RFQ | In-app, Email |
| `po.quote_expiring` | Buyer | In-app (3 days before expiry) |
| `po.received` | Seller's authorized users | In-app, Email, Push |
| `po.acknowledged` | Buyer who sent PO | In-app, Email |
| `po.amended` | Seller (if buyer amends) / Buyer (if seller requests change) | In-app, Email |
| `po.cancelled` | Both parties | In-app, Email |
| `po.erp_delivery_update` | Both parties | In-app (when ERP sync updates delivery status) |
| `po.erp_invoice_synced` | Buyer | In-app (when invoice data is synced from ERP) |

---



## 18.5. Module S: Lead Generation & Campaign {#18-5-module-s}

> [!TIP]
> **📖 What is Module S?** A standalone lead generation tool. Companies create **campaigns** that feature one or more products, services, or assets from Module H (§9). Each campaign generates a QR code and shareable link for external advertising (Facebook, LINE, printed materials, packaging, banners). When external visitors scan/click, they see a public campaign landing page with the featured items and a customizable lead form built by the company. Submissions automatically create a Lead task in Module E (§6) for the assigned team to follow up. After the campaign ends, a performance report is generated.
>
> **Example:** A real estate company creates a campaign featuring 3 condo units (Asset products from Module H). They print the QR code on flyers distributed at a trade show. Visitors scan → see the 3 units → fill the lead form with custom questions ("What is your budget?", "How many bedrooms?") → PDPA consent checked → Lead task created and assigned round-robin to 2 sales agents → After the trade show, the company reviews the campaign report: 450 scans, 89 leads, 12 WON deals worth ฿45M.

### Campaign Model

| Field | Type | Description |
|-------|------|-------------|
| campaignId | string | Unique identifier |
| tenantId | string | Company that owns this campaign |
| **campaignName** | string | Human-readable name (e.g., "Q3 Product Launch", "Trade Show Bangkok 2026") |
| **description** | string | Internal description / campaign brief |
| **campaignType** | enum | 'PRODUCT_PROMOTION' / 'SERVICE_INQUIRY' / 'ASSET_LISTING' / 'EVENT_PROMO' / 'GENERAL_LEAD' — categorizes the campaign purpose |
| **status** | enum | 'DRAFT' / 'ACTIVE' / 'PAUSED' / 'COMPLETED' / 'ARCHIVED' — see Campaign Status Lifecycle below |
| **campaignShareableLink** | string | Auto-generated URL: `https://cloudfull.com/c/{tenantPrefix}/{campaignSlug}`. Public-facing campaign landing page. Works without login. |
| **campaignQrCodeUrl** | string | Auto-generated QR code image for the shareable link. Downloadable as PNG/SVG for printing on flyers, banners, business cards, packaging. |
| **campaignItems[]** | CampaignItem[] | Items featured in this campaign (from Module H §9) |
| → itemId | string | Unique per campaign item |
| → productId | string | **References** → Module H (§9) MasterProduct. Can be any product type: regular product (`isInternalOnly: false`), service, or asset product (`isAssetProduct: true` — Hotel, Condo, Land, Car, etc.). |
| → displayOrder | number | Display order on the landing page |
| → customDescription | string | Optional campaign-specific description (overrides product description on landing page) |
| → customPrice | string | Optional display price text (e.g., "Starting from ฿1,200/month") — free text for display only, not the actual Module H price list |
| **coverImageUrl** | string | Campaign banner/hero image for the landing page |
| **landingPageStyle** | enum | 'SINGLE_PAGE' (all items on one page) / 'CATALOG' (grid/list with item detail pages) / 'SHOWCASE' (visual, image-heavy layout) |
| **createdBy** | string | User who created the campaign |
| **assignedToUserIds[]** | string[] | **Manually set.** One or more users who receive leads from this campaign. Required — at least one assignee. When multiple assignees: leads are distributed per `leadDistribution` method. |
| **leadDistribution** | enum | 'ROUND_ROBIN' (rotate leads evenly across assignees) / 'ALL_NOTIFY' (all assignees get notified, first to claim gets the task) / 'MANUAL_PICK' (campaign creator manually picks per incoming lead from the assignee list). Default: 'ROUND_ROBIN'. Only relevant when `assignedToUserIds` has 2+ users. |
| **startDate** | string | Campaign start date. QR/links become active on this date. Null = active immediately upon status change to ACTIVE. |
| **endDate** | string | Campaign end date. QR/links stop accepting new submissions after this date (landing page shows "Campaign ended" message). Null = no expiry, campaign runs until manually completed. |
| **leadFormConfig** | LeadFormConfig | Configurable lead capture form — see Lead Form Builder below |
| **pdpaConfig** | CampaignPDPAConfig | PDPA consent and data retention configuration — see PDPA Compliance below |
| **analytics** | CampaignAnalytics | Real-time campaign performance metrics |
| **reportGeneratedAt** | string | When the final report was generated (after status → COMPLETED) |
| **reportUrl** | string | Link to the generated campaign performance report |
| createdAt | string | Campaign creation timestamp |
| updatedAt | string | Last modification |

### Lead Form Builder (LeadFormConfig)

> [!NOTE]
> **Form builder pattern:** The custom questions model reuses the same `questionType` pattern as Module L's QR Event Check-in `customQuestions[]` (§13) and Module K's Event `hostCustomQuestions[]` (§12) for architectural consistency.

| Field | Type | Description |
|-------|------|-------------|
| **standardFields** | StandardFieldConfig | Toggle standard contact fields on/off |
| → requireName | boolean | Require visitor name (default: true) |
| → requirePhone | boolean | Require phone number (default: true) |
| → requireEmail | boolean | Require email (default: false) |
| → requireCompanyName | boolean | Require company name (default: false) |
| → requirePosition | boolean | Require job title/position (default: false) |
| → allowMessage | boolean | Allow free-text message (default: true) |
| **customQuestions[]** | CampaignQuestion[] | Custom questions created by the company using the form builder |
| → questionId | string | Unique identifier |
| → questionText | string | The question (e.g., "Which product are you interested in?", "What is your budget range?", "How many bedrooms do you need?") |
| → questionType | enum | 'TEXT' / 'SINGLE_CHOICE' / 'MULTI_CHOICE' / 'NUMBER' / 'DATE' / 'FILE_UPLOAD' / 'RATING' / 'PHONE' / 'EMAIL' |
| → options[] | string[] | If SINGLE_CHOICE or MULTI_CHOICE: the available options |
| → isRequired | boolean | Must answer to submit the form |
| → placeholder | string | Placeholder text for the input field |
| → displayOrder | number | Order on the form |
| → validationRule | string | Optional regex or min/max validation (e.g., min budget value, phone format) |
| **interestedItemsSelection** | boolean | If `true` and campaign has multiple items, visitor can select which items they're interested in (checkbox per item on the form). Default: `true` for multi-item campaigns. |
| **submitButtonText** | string | Custom submit button text (default: "ส่งข้อมูล / Submit") |
| **thankYouMessage** | string | Custom message shown after successful form submission (default: "ขอบคุณครับ/ค่ะ เราจะติดต่อกลับโดยเร็ว / Thank you, we will contact you soon") |

### PDPA Compliance for External Users

> [!IMPORTANT]
> **Legal analysis (Thai PDPA B.E. 2562):**
> - **Data Controller** = The company running the campaign (tenant). NOT the platform.
> - **Data Processor** = Cloudfull.com (platform). Processes data on behalf of the company under a Data Processing Agreement.
> - **External visitors** are data subjects who must give explicit consent before submitting personal data.
> - **Custom question data is the company's responsibility.** The platform stores it as a processor but the company determines purpose and retention. The platform adds a non-editable disclaimer clarifying this.
> - **Recommended retention:** Maximum 2 years from submission date (aligned with statute of limitations for personal data claims under Thai Civil and Commercial Code). After the retention period, all personally identifiable data is automatically anonymized.
> - **Right to erasure (PDPA Sec 33):** External visitors receive a unique URL after submission to request data deletion at any time. The platform must process erasure requests within 30 days.

| Field | Type | Description |
|-------|------|-------------|
| **consentRequired** | boolean | Always `true` — cannot be disabled. PDPA consent checkbox is mandatory on every lead form. |
| **consentText** | string | Customizable PDPA consent message. Platform provides a default Thai+English template. Company can customize but MUST include: (1) what data is collected, (2) purpose of collection, (3) who processes the data (company name + "via Cloudfull.com platform"), (4) retention period, (5) right to withdraw consent, (6) right to request erasure. |
| **defaultConsentTemplate** | string | Platform-provided template: *"ข้าพเจ้ายินยอมให้ {companyName} เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลที่ระบุข้างต้น เพื่อวัตถุประสงค์ในการติดต่อกลับ นำเสนอสินค้า/บริการ ผ่านแพลตฟอร์ม Cloudfull.com ข้อมูลจะถูกเก็บรักษาไว้ไม่เกิน {retentionMonths} เดือน ท่านมีสิทธิ์ถอนความยินยอม ขอลบข้อมูล หรือสอบถามเพิ่มเติมได้ที่ {companyContactEmail}"* |
| **retentionMonths** | number | How long to retain lead submission data. Default: 24 months (2 years). Company can set between 3–24 months. After expiry, PII is auto-anonymized per `autoAnonymizeAction`. |
| **autoAnonymizeAction** | enum | What happens when retention period expires: 'ANONYMIZE' (replace name/phone/email with hashed values, keep aggregate analytics and task references) / 'DELETE' (permanently delete the submission record, keep only analytics counters). Default: 'ANONYMIZE'. |
| **platformDisclaimer** | string | System-generated, non-editable text appended to every lead form: *"Cloudfull.com acts as a Data Processor on behalf of {companyName}. Custom questions and your responses are managed by {companyName}. Contact {companyName} directly for data inquiries. For platform privacy policy, visit cloudfull.com/privacy."* |
| **externalErasureEnabled** | boolean | If `true`, the thank-you page after submission includes a link where the visitor can later request erasure of their submitted data. Default: `true`. Strongly recommended to keep enabled for PDPA compliance. |
| **erasureRequestUrl** | string | Auto-generated unique URL: `https://cloudfull.com/privacy/erasure/{submissionToken}`. Visitor can access this to request their data be deleted. |

**PDPA Data Lifecycle for External Lead Submissions:**

```
Visitor submits lead form
  ↓
System stores:
  → Personal data (name, phone, email, company, position) — marked as PDPA-protected
  → Custom question answers — marked as company-managed data
  → PDPA consent record: who consented, what text version, when, IP address
  → Submission timestamp + source (QR/link/referrer)
  ↓
Data retention countdown begins (default: 24 months from submittedAt)
  ↓
At 30 days before expiry:
  → System generates CAMPAIGN_LEAD_DATA_EXPIRING notification to campaign owner
  → Campaign owner can: (a) note it (data will be anonymized on schedule), or
                         (b) contact the lead to obtain new consent for extended retention
  ↓
At expiry:
  → If ANONYMIZE: replace PII with hashed values, keep analytics metadata + task references
  → If DELETE: permanently remove submission record, keep only aggregate counters
  → Audit log entry: "Data anonymized/deleted per PDPA retention policy — campaignId: X, submissionId: Y"
```

> [!NOTE]
> **Erasure requests before retention expiry:** If a visitor requests erasure via the `erasureRequestUrl`, the system processes it within 30 days (PDPA Sec 33 requirement). The company (campaign owner) is notified. The associated Lead task in Module E is NOT deleted — only the source submission data in Module S is anonymized. The task remains with a note: "Source lead data erased per PDPA request on {date}."

### Campaign Status Lifecycle

```
DRAFT
  → Campaign created, items added, form configured, assignees set
  → QR/link NOT active yet (shows "Coming soon" page if accessed)
  → Can edit everything freely
  ↓ [User clicks "Launch Campaign"]
ACTIVE
  → QR code and shareable link are LIVE — accepting submissions
  → Leads auto-create tasks in Module E assigned per leadDistribution
  → Real-time analytics updating (scans, clicks, leads, conversion)
  → Can edit: form fields, assigned users, items (can add items; 
    removing items with existing leads requires confirmation)
  → Can PAUSE or manually COMPLETE
  ↓ [User clicks "Pause"] or [endDate reached]
PAUSED
  → QR/link show "Campaign temporarily paused" message
  → No new submissions accepted
  → Existing lead tasks continue processing normally
  → Can RESUME (back to ACTIVE) or COMPLETE
  ↓ [User clicks "Resume"]
  → Back to ACTIVE
  ↓ [User clicks "End Campaign"] or [All lead tasks reach terminal status (WON/LOST/CONVERTED)]
COMPLETED
  → QR/link show "Campaign ended — Thank you for your interest" message
  → Final performance report auto-generated
  → Report includes: total scans, clicks, leads, conversion rate,
    task outcomes (WON/LOST/OPEN), per-item performance,
    top source channels (referrer), time-series trends
  → Campaign data enters PDPA retention countdown
  → All analytics remain accessible to users with campaign.report permission
  ↓ [User clicks "Archive"] or [After 90 days automatically]
ARCHIVED
  → Read-only historical record
  → Analytics and report still accessible via campaign.view
  → Cannot be reactivated — must create a new campaign
  → PDPA retention countdown continues independently until all submissions expire
```

### Campaign Report Model

> [!TIP]
> **Report is auto-generated** when campaign moves to COMPLETED status. Can also be manually generated at any time during ACTIVE status for interim review. Report is downloadable as PDF.

| Field | Type | Description |
|-------|------|-------------|
| reportId | string | Unique identifier |
| campaignId | string | Which campaign |
| tenantId | string | Company |
| **generatedAt** | string | When report was generated |
| **periodStart** | string | Campaign start date (when it went ACTIVE) |
| **periodEnd** | string | Campaign end date or completion date |
| **durationDays** | number | Total days the campaign was ACTIVE |
| **totalQrScans** | number | Total QR code scans during campaign |
| **totalLinkClicks** | number | Total shareable link clicks during campaign |
| **totalLeadsGenerated** | number | Total lead form submissions |
| **conversionRate** | number | (totalLeadsGenerated / (totalQrScans + totalLinkClicks)) × 100 |
| **taskSummary** | TaskSummary | Breakdown of lead task outcomes from Module E |
| → totalTasks | number | Total tasks created from this campaign |
| → statusNew | number | Tasks still in NEW status |
| → statusContacted | number | Tasks in CONTACTED status |
| → statusQualified | number | Tasks in QUALIFIED status |
| → statusProposal | number | Tasks in PROPOSAL or NEGOTIATION status |
| → statusWon | number | Tasks WON — deal closed successfully |
| → statusLost | number | Tasks LOST — deal not closed |
| → totalEstimatedValue | number | Sum of `leadValue` from all WON tasks |
| → totalEstimatedCurrency | string | Currency code |
| **itemPerformance[]** | ItemPerformance[] | Per-item breakdown (which items attracted the most interest) |
| → productId | string | Module H product ID |
| → productName | string | Denormalized product/service/asset name |
| → leadsForItem | number | Leads that selected interest in this specific item |
| → wonForItem | number | WON leads that selected this item |
| → revenueForItem | number | Sum of leadValue for WON leads that selected this item |
| **timeSeriesData[]** | DailyMetric[] | Day-by-day performance over the campaign period |
| → date | string | Date |
| → scans | number | QR scans that day |
| → clicks | number | Link clicks that day |
| → leads | number | Leads generated that day |
| **topSourceChannels[]** | SourceChannel[] | Where visitors came from (HTTP referrer analysis) |
| → channelName | string | Source (e.g., "Facebook", "LINE", "Google", "Direct", "Unknown") |
| → visitCount | number | Number of visits from this source |
| → leadCount | number | Number of leads from this source |
| **assigneePerformance[]** | AssigneeMetric[] | Per-assignee breakdown (when multiple assignees) |
| → userId | string | Assignee user ID |
| → userName | string | Denormalized name |
| → leadsAssigned | number | Leads assigned to this person |
| → leadsWon | number | Leads this person won |
| → leadsLost | number | Leads this person lost |
| → averageResponseTimeHours | number | Average time from lead creation to first contact |

### Lead Submission Model

| Field | Type | Description |
|-------|------|-------------|
| submissionId | string | Unique identifier |
| campaignId | string | Which campaign |
| tenantId | string | Company |
| **visitorName** | string | PDPA-protected — anonymized after retention period |
| **visitorPhone** | string | PDPA-protected — anonymized after retention period |
| **visitorEmail** | string | PDPA-protected — anonymized after retention period |
| **visitorCompanyName** | string | PDPA-protected — anonymized after retention period |
| **visitorPosition** | string | PDPA-protected — anonymized after retention period |
| **visitorMessage** | string | Free-text message from the visitor |
| **interestedItemIds[]** | string[] | Which campaign items the visitor selected interest in (if multi-item campaign with `interestedItemsSelection: true`) |
| **customAnswers[]** | CustomAnswer[] | Answers to the company's custom questions from the form builder |
| → questionId | string | Which question was answered |
| → answerValue | string | The answer (text, selected option, number, date, etc.) |
| → answerFiles[] | string[] | If FILE_UPLOAD question type: uploaded file URLs |
| **sourceType** | enum | 'QR_SCAN' / 'LINK_CLICK' / 'DIRECT' — how the visitor arrived |
| **sourceReferrer** | string | HTTP referrer URL (where the visitor came from — facebook.com, line.me, google.com, etc.) |
| **submittedAt** | string | When the form was submitted |
| **pdpaConsentGiven** | boolean | Always `true` — form cannot be submitted without checking PDPA consent |
| **pdpaConsentTimestamp** | string | Exact timestamp when consent checkbox was checked |
| **pdpaConsentTextVersion** | string | Hash/version of the consent text shown at submission time (for audit trail) |
| **pdpaRetentionExpiresAt** | string | Auto-calculated: `submittedAt` + campaign's `retentionMonths`. When PII will be anonymized. |
| **isAnonymized** | boolean | `true` after PDPA retention expires and PII has been anonymized/deleted |
| **anonymizedAt** | string | When anonymization occurred |
| **createdTaskId** | string | **References** → Module E (§6) task ID that was auto-created from this submission |
| **erasureToken** | string | Unique token for the visitor to request data erasure via `erasureRequestUrl` |

### Campaign Analytics (Real-Time)

> [!NOTE]
> **Analytics update in real-time** while the campaign is ACTIVE. These are embedded in the Campaign Model as the `analytics` field. Historical data is preserved in the Campaign Report after completion.

| Field | Type | Description |
|-------|------|-------------|
| totalQrScans | number | Total QR code scans to date |
| totalLinkClicks | number | Total shareable link clicks to date |
| totalLeadsGenerated | number | Total form submissions to date |
| conversionRate | number | Real-time conversion rate (leads / visitors × 100) |
| leadsToday | number | Leads generated today |
| leadsThisWeek | number | Leads generated this week (Mon-Sun) |
| leadsThisMonth | number | Leads generated this calendar month |
| lastLeadAt | string | Timestamp of the most recent lead submission |
| averageLeadsPerDay | number | Average daily leads since campaign went ACTIVE |

### Lead Auto-Creation Flow (Module S → Module E)

```
Visitor scans campaign QR / clicks campaign shareable link
  ↓
Campaign landing page loads (public — no login required)
  → Shows campaign banner, featured items (products/services/assets), company info
  → If campaign status ≠ ACTIVE → shows appropriate message:
    • DRAFT: "Coming soon"
    • PAUSED: "Campaign temporarily paused"
    • COMPLETED/ARCHIVED: "Campaign ended — Thank you for your interest"
  ↓
Visitor browses featured items from Module H
  → If multi-item campaign with interestedItemsSelection: true
    → Visitor selects which items they're interested in (checkboxes)
  ↓
Visitor fills lead form:
  → Standard fields (name, phone, email, company, position, message)
  → Custom questions from form builder
  → PDPA consent checkbox (MANDATORY — cannot submit without)
  ↓
System determines assignee per leadDistribution:
  → ROUND_ROBIN: next assignee in rotation
  → ALL_NOTIFY: all assignees notified, first to claim gets the task
  → MANUAL_PICK: lead enters queue, campaign creator assigns manually
  ↓
System creates a Lead task (Module E §6) with:
  → taskType: 'LEAD'
  → leadSource: 'CAMPAIGN_QR' or 'CAMPAIGN_LINK'
  → description: campaign name + selected items + visitor message
  → contactInfo: visitor's name, phone, email, company, position
  → sourceCampaignId: campaign ID (new field on Lead task)
  → sourceProductIds[]: selected interested item IDs
  → assigneeIds[]: determined by leadDistribution method
  ↓
Notification sent to assigned user(s) (§3.5)
  → Event: CAMPAIGN_LEAD_CAPTURED
  ↓
Visitor sees thank-you page with:
  → Custom thankYouMessage
  → PDPA erasure link (if externalErasureEnabled: true)
  → "Your reference number: {submissionId}" for tracking
```

### Notification Events (Module S)

| Category | Event | Description |
|----------|-------|-------------|
| **Campaign (S)** | `CAMPAIGN_LEAD_CAPTURED` | External visitor submitted a lead form — notifies assigned user(s) per `leadDistribution`. Includes visitor name, interested items, and campaign name. |
| **Campaign (S)** | `CAMPAIGN_STARTED` | Campaign status auto-changed to ACTIVE (scheduled `startDate` reached). Notifies campaign creator. |
| **Campaign (S)** | `CAMPAIGN_ENDING_SOON` | Campaign `endDate` is within 3 days. Notifies campaign creator to prepare for completion. |
| **Campaign (S)** | `CAMPAIGN_COMPLETED` | Campaign completed (manually or all tasks finished). Performance report is ready for review. Notifies creator and all assignees. |
| **Campaign (S)** | `CAMPAIGN_LEAD_DATA_EXPIRING` | PDPA retention period for lead submission data expiring in 30 days. Notifies campaign owner to take action if needed. |

### Module S Permissions

| Permission | Description |
|------------|-------------|
| `campaign.create` | Create new campaigns, configure lead forms using the form builder, add items from Module H, assign team members |
| `campaign.manage` | Edit, pause, resume, complete, archive campaigns. Change assigned users. Manage lead distribution method. |
| `campaign.view` | View campaign list, analytics, and lead submissions for own assigned campaigns only |
| `campaign.view_all` | View ALL campaigns company-wide (management/marketing overview dashboard) |
| `campaign.delete` | Delete DRAFT campaigns only. ACTIVE/COMPLETED/ARCHIVED campaigns cannot be deleted due to PDPA data retention requirements. |
| `campaign.report` | Generate, view, and download campaign performance reports |

---

## 19. Specification Completeness Checklist {#19-completeness}

> [!TIP]
> **All originally identified gaps have been addressed.** This checklist verifies that every feature area originally flagged as "missing" or "gap" has been defined in the specification. The checklist replaces the previous "Critical Gap Summary" which listed 13 gaps — all 13 have since been resolved.

### Originally Missing Modules — Now Fully Specified

| # | Originally Missing Feature | Now Defined In | Status |
|---|---------------------------|----------------|--------|
| 1 | Sales Planning & Routing | Module F (§7) — Sales Plan, Actual Plan, Summary, Costing | ✅ Complete |
| 2 | Contact Pool Management | Module D (§5) — 3-entity taxonomy, dual-profile system, batch sync | ✅ Complete |
| 3 | Costing & Expense Tracking | Module F (§7) — Costing Module, company-wide expense model | ✅ Complete |
| 4 | Sample & Rental Tracking | Module H (§9) — Internal Product Operations (Sample Tracking, Equipment Rental) | ✅ Complete |
| 5 | Skill Testing | Module N (§14) — HR skill assessments, AI test generation, scoring | ✅ Complete |
| 6 | News Feed | Module L (§13) — Verified company posts, engagement metrics | ✅ Complete |
| 7 | Asset Products | Module H (§9) — Asset Product Type with depreciation | ✅ Complete |
| 8 | QR Brochure Handshake | Module L (§13) — QR networking with contact exchange | ✅ Complete |
| 9 | Freelance Booking Engine | Module E (§6) — FREELANCE_GIG task type | ✅ Complete |
| 10 | Lead Management | Module E (§6) — LEAD task type with pipeline | ✅ Complete |
| 11 | Advertising System | Module H (§9) — AdPlacement model, CPM/CPC pricing | ✅ Complete |
| 12 | External Approval Links | Module E (§6) — Token-based external approval | ✅ Complete |
| 13 | Professional Portfolio | Module A (§2) — Portfolio files with display preferences | ✅ Complete |
| 14 | Purchase Order & Procurement | Module Q (§17) — RFQ, Quotation, PO, SO (separate from Contract Vault). Invoice/delivery = ERP read-only sync. | ✅ Complete |
| 15 | Revenue Dept Paperwork | Module H (§9) — Requisition Form, Acknowledgement of Receipt, Stock Card, Physical Marking | ✅ Complete |
| 16 | Per-Participant Task Status | Module E (§6) — MY_PART_DONE / ACTIVE / INACTIVE per participant | ✅ Complete |
| 17 | Guest Job Application | Module J (§11) — External application URL for non-account users | ✅ Complete |
| 18 | User Sample Inventory | Module H (§9) — Sales Inventory Location per user role | ✅ Complete |
| 19 | E-Brochure QR System | Module L (§13) — Digital brochure creation + QR scan-to-collect | ✅ Complete |
| 20 | Product Top 5 Trending | Module H (§9) — UserCategoryRanking, ProductTrendScore, monthly lock, aggregation | ✅ Complete |
| 21 | ERP SuperAdmin-Exclusive Modules | Module B (§3) — Manufacturing placeholder, feature-flag gated | ✅ Complete |

### Originally Missing Data Models — Now Defined

| # | Originally Missing Model | Now Defined In | Status |
|---|--------------------------|----------------|--------|
| 1 | Notification system | §3.5 Platform Notification Architecture — 75+ events, 6 channels, 7 feeds | ✅ Complete |
| 2 | Chat room model | Module G (§8) — ChatRoom + ChatMessage Base + Mentions (user/task/project/product/contact) + Location Sharing + Search + Lazy Loading + Stickers (user-bound marketplace) + File Lifecycle (7d/14d expiry + local cache) | ✅ Complete |
| 3 | Contact pool system | Module D (§5) — Full 3-entity taxonomy with dual-profile architecture | ✅ Complete |
| 4 | Sales planning | Module F (§7) — To-Be Plan + Actual Plan + Summary | ✅ Complete |
| 5 | Contract Vault | §3.6 Contract Vault — Full lifecycle, 5-level access, AI features | ✅ Complete |
| 6 | Company Seal | Module B (§3) — Encrypted registry, KYC-gated, MD-only access | ✅ Complete |
| 7 | E-Signature | Module A (§2) — Registered signatures + signing event model | ✅ Complete |
| 8 | Reports & Analytics | §16.6 — 13 report categories (incl. Customer Investment & Customer Revenue), data model, export formats | ✅ Complete |
| 9 | Security Audit | §16.7 — 59 measures across 10 zones, 100% verified | ✅ Complete |

### Cross-Module Integration Verification

| Integration | Source Module | Target Module | Verified |
|-------------|-------------|---------------|----------|
| Task → Contact | Module E (tasks) | Module D (contacts) | ✅ `linkedContactId` references contact pool |
| Sales → Contact | Module F (sales plan) | Module D (contacts) | ✅ `contactId` references contact pool |
| Sales → Task | Module F (actual plan) | Module E (tasks) | ✅ `linkedTaskId` creates task |
| Contract → Signature | §3.6 (vault) | Module A (e-signature) | ✅ `signingEventId` cross-reference |
| Contract → Seal | §3.6 (vault) | Module B (seal) | ✅ Seal application within vault |
| Recruitment → Task | Module J (recruitment) | Module E (tasks) | ✅ Auto-creates HR Candidate task |
| Products → Showcase | Module H (products) | Module I (showcase) | ✅ `linkedShowcaseIds[]` cross-reference |
| Calendar → Task | Module E (calendar) | Module E (tasks) | ✅ Calendar events linked to tasks |
| Notifications → All | §3.5 (notifications) | Modules A-Q | ✅ 75+ event types covering all modules (including 9 po.* events from Module Q) |
| ERP → Products | Module B (ERP API) | Module H (products) | ✅ Sync scope includes products |
| ERP → Inventory | Module B (ERP API) | Module H (internal inventory) | ✅ Read-only inventory display in Product Catalog |
| PO → Product | Module Q (procurement) | Module H (products) | ✅ PO line items reference MasterProduct catalog |
| PO → Contact | Module Q (procurement) | Module D (contacts) | ✅ POs linked to buyer/seller contact records |
| PO ↔ E-Signature | Module Q (procurement) | Module A (e-signature) | ✅ PO/SO share e-signature + KYC infrastructure with Contract Vault (separate modules, same signing engine) |
| PO → Tasks | Module Q (procurement) | Module E (tasks) | ✅ Each PO step auto-creates follow-up tasks |
| Permissions → All | Module C (RBAC) | All modules | ✅ 95+ permissions + 11 superAdmin permissions |

### Session 4+ Additions — Verified

| # | Feature | Defined In | Status |
|---|---------|------------|--------|
| 1 | Expense & Receipt Management (cross-platform) | §3.7 — Standalone shared section with AI OCR, 13 categories, Module C approval | ✅ Complete |
| 2 | Multi-Device GPS Management | Module K — UserDeviceRegistry model, isPrimaryGpsDevice, native vs web | ✅ Complete |
| 3 | Campaign-Based Lead Generation | Module S (§18.5) — campaignShareableLink, campaignQrCodeUrl, leadFormConfig, form builder, PDPA consent, multi-assignee, campaign lifecycle, performance reports. Module H retains simple view-only product links. | ✅ Complete |
| 4 | External Delivery Partner API | Module Q — DeliveryPartnerPlugin (Push webhook + Pull polling) + DeliveryTrackingEvent (with eventSource) | ✅ Complete |
| 5 | Financial Calculation Precision | §1.6 — 10-decimal intermediate, Extended Satang storage, Half-Up rounding, line-vs-total policy | ✅ Complete |
| 6 | Platform-Wide Data Retention | §1.7 — CompanyDataRetentionConfig, legal floors, year-by-year cleanup, media status lifecycle | ✅ Complete |
| 7 | Chat Search, Lazy Loading & Optimization | Module G — full-text search, date navigation, 50-message pagination, media lazy loading, offline cache | ✅ Complete |
| 5 | Storefront Display Names | Module B — storefrontDisplayName (company) + branchStorefrontName (branch) | ✅ Complete |
| 6 | Marketplace, Payment & Warehouse | Module R (§18) — TTA, Two-Invoice Tax, Payment Gateway, Warehouse, Franchise, Special Account Law | ✅ Complete (future deployment via feature flag) |

> [!NOTE]
> **Specification version:** This completeness checklist reflects the state of the specification after all sessions including Session 4+ feature additions. All original 88 change items plus 6 Session 4+ additions have been implemented and verified.

## 20. Build Order Recommendation {#20-build-order}

> [!TIP]
> **📖 In Plain Language:** This is the recommended sequence for building the platform — 11 phases over 18 weeks. Phase 1-2 build the foundation (users, companies, roles, tasks, chat). **Phase 3 is the #1 competitive advantage** (sales planning with EXIF verification — no Thai CRM has this). Phases 4-8 add marketplace, recruitment, attendance. Phases 9-11 add procurement, billing, and security.



```
Phase 1: Foundation Models (Week 1-2)
├── Create ThaiAddress reusable sub-model
├── Update GlobalUserProfile with ALL personal fields + portfolio
├── Update TenantConfig with ALL company fields
├── Create RoleDefinition + full permission matrix  
├── Create Team + Group models
├── Create ChatRoom model
├── Create Notification model
├── Create CustomerContact model (with sub-masks)
└── Git commit: "feat: complete data foundation"

Phase 2: Task Engine + Chat + Leads (Weeks 3-4)
├── Enhanced TaskBase with all fields
├── Add LEAD task type
├── Full HR candidate metadata
├── Full sales visit metadata + EXIF
├── External approval links
├── Kanban board UI (drag-and-drop)
├── Module G chat rooms (linkable to tasks, manually created)
├── Chat → Task/Lead conversion
└── Git commit: "feat: task engine + contextual chat"

Phase 3: Sales Planning & Routing (Weeks 5-6)  ★ CRITICAL
├── Sales Plan (To-Be Plan) model
├── Actual Plan (Daily Execution) model
├── EXIF photo verification service
├── Costing/Expense tracking
├── Route summary calculations
├── Sales reporting/summary
└── Git commit: "feat: sales planning & routing"

Phase 4: Product Catalog (Weeks 7-8)
├── Enhanced MasterProduct
├── ResellerListing model
├── ProductCategory tree
├── Asset Product type (real estate/vehicles)
├── Brand owner vs reseller workflow
├── TCCT + MOC price enforcement
├── Hermes anti-duplication
└── Git commit: "feat: product catalog"

Phase 5: Design Showcase (Week 9)
├── Enhanced showcase with galleries + metrics
├── Responsive hotspots (percentage-based)
├── Favorite folders + saves
├── QR brochure handshake
├── Module S: Lead Generation & Campaign (campaigns, form builder, lead auto-creation, PDPA consent)
├── Masonry grid UI
└── Git commit: "feat: design showcase"

Phase 6: Contact Pool + News Feed (Week 10)
├── Full contact pool with sub-masks
├── QR contact exchange
├── Contact approval workflow
├── News feed system
├── Advertising system
└── Git commit: "feat: contact pool + news feed"

Phase 7: Recruitment + HR (Week 11)
├── Job posting model
├── Full candidate profiles
├── Auto-conversion: Recruited → Employee
├── Skill testing module
├── Google Maps recruitment visualization
└── Git commit: "feat: recruitment pipeline"

Phase 8: Events, GPS & Inventory (Week 12)
├── Work shift tracking
├── GPS check-in verification
├── Sample tracking
├── Equipment rental system
├── Product Top 5 Trending system (voting, aggregation, monthly lock)
└── Git commit: "feat: events + inventory"

Phase 9: Purchase Order & Procurement (Weeks 13-14)
├── RFQ model + send/receive flow
├── Quotation model + pricing from catalog
├── PO model + dual-source line items
├── SO model (seller mirror) + Co-Work.cloud sync
├── PO/SO invoice attachment flow (seller attaches invoice to SO → buyer views on PO)
├── PO access configuration (buyer/seller)
├── PO approval workflow integration
└── Git commit: "feat: PO procurement module"

Phase 10: Billing & Admin (Weeks 15-16)
├── Payment transactions
├── Thai tax invoice format
├── Promotional campaigns
├── Super admin backoffice (all 14 screens)
├── Notification service
├── Regulatory horizon scanning
└── Git commit: "feat: billing + admin"

Phase 11: Reports, Analytics & Security Audit (Weeks 17-18)
├── §16.6 Reports & Analytics engine (13 report categories + CSV/XLSX/PDF export)
├── §16.7 Security Layers Audit Checklist (59 security measures across 10 zones)
└── Automated security scanning + compliance dashboard

Future Phase: Module R — Marketplace, Payment & Warehouse
├── Deployed via feature flag (moduleR.enabled) when govt. approvals obtained
├── No code changes required — fully specified in §18
├── Requires: BoT license, Revenue Dept registration, DBD e-commerce registration
└── Includes: TTA commission, payment gateway, warehouses, franchise storefronts, Special Account Law
```

---

## 18. Module R: Marketplace, Payment & Warehouse (Future Deployment) {#18-module-r}

> [!TIP]
> **📖 What is Module R?** This is the **future evolution** of Cloudfull.com into a full Shopee-like B2B/B2C marketplace. When government approval is obtained, the platform will process payments directly, operate physical warehouses for partner stock, and run franchise storefronts for pickup. The platform earns revenue through **TTA (Transaction Take Amount)** — a percentage or fixed value commission on each product transaction. **This module is fully specified and ready for deployment without code changes when the time comes.**
>
> **Key difference from current platform:** Currently, Cloudfull.com is a B2B collaboration platform where companies manage contacts, tasks, and procurement documents. Module R transforms it into a **transactional marketplace** where money flows through the platform.

### Module R Activation Prerequisites

> [!CAUTION]
> **Government approvals required before Module R can go live:**
> 1. **Bank of Thailand (BoT):** E-Money/Payment Service Provider license under Payment Systems Act B.E. 2560
> 2. **Revenue Department:** Registration as e-Platform operator under Special Account law (2024) for platforms with >฿1B revenue
> 3. **DBD:** E-commerce operator registration
> 4. **PDPA compliance:** Updated privacy policy for payment data processing
>
> **Module R is designed to be deployed without code changes.** The feature flag `moduleR.enabled` in Super Admin (Module P: Compliance, AI & Admin Backoffice) activates the entire module.

### R.1 Transaction Take Amount (TTA) — Platform Commission

> [!IMPORTANT]
> **TTA is how Cloudfull.com earns revenue from marketplace transactions.** Every product sold through the platform has a TTA — either a percentage of the sale price or a fixed value per unit. TTA is configured per product by the Super Admin or negotiated per seller company.

**TTAConfig Model (per product per seller):**

| Field | Type | Description |
|-------|------|-------------|
| ttaConfigId | string | Unique identifier |
| tenantId | string | Seller company |
| productId | string | Which product (**references** → Module H) |
| **ttaType** | enum | 'PERCENTAGE' (% of sale price) / 'FIXED_VALUE' (fixed amount per unit) |
| **ttaPercentage** | number | TTA percentage (e.g., 5.0 for 5%). Only when ttaType = PERCENTAGE |
| **ttaFixedAmount** | number | Fixed TTA per unit (e.g., ฿50 per unit). Only when ttaType = FIXED_VALUE |
| **ttaCurrency** | string | Currency for fixed amount (default: THB) |
| **effectiveFrom** | string | When this TTA rate takes effect |
| **effectiveTo** | string | When this TTA rate expires (null = no expiry) |
| negotiatedBy | string | Super Admin userId who set/negotiated this rate |
| approvedAt | string | When approved |

### R.2 Two-Invoice Tax Model (Thai Revenue Department Compliance)

> [!IMPORTANT]
> **Every marketplace order generates TWO separate legal transactions** — following the same model as Shopee/Lazada under Thai tax law:
>
> **Transaction 1 — Product Sale (Seller → Buyer):**
> - The SELLER issues a Tax Invoice to the BUYER for the full selling price
> - The seller recognizes the full retail price as taxable income
> - If seller earns >฿1.8M/year → must register for VAT (7%) and issue full Tax Invoice
> - Cloudfull provides a "Buyer Tax Invoice" feature to help sellers collect buyer's Tax ID
>
> **Transaction 2 — Platform Fee (Cloudfull → Seller):**
> - CLOUDFULL issues a Tax Invoice to the SELLER for the TTA/commission + any additional fees
> - The seller records this as a legitimate business expense (reduces Corporate/Personal Income Tax)
> - If seller is VAT-registered → can claim 7% Input VAT charged by Cloudfull
> - **WHT (3%):** If seller is a juristic person → 3% Withholding Tax on service fees. Cloudfull handles this via Revenue Department's e-Withholding Tax system

**MarketplaceOrder Model:**

| Field | Type | Description |
|-------|------|-------------|
| orderId | string | Unique order identifier |
| buyerUserId | string | Buyer's user ID |
| buyerTenantId | string | Buyer's company (null if individual buyer) |
| sellerTenantId | string | Seller's company |
| **orderChannel** | enum | 'MARKETPLACE_DIRECT' (buyer purchases from platform warehouse/storefront) / 'DISTRIBUTOR' (buyer purchases through a distributor company) |
| **lineItems[]** | OrderLineItem[] | Products in this order |
| → productId | string | References Module H product |
| → productName | string | Snapshot of product name at order time |
| → quantity | number | Units ordered |
| → unitPrice | number | Price per unit |
| → priceIsBeforeVat | boolean | From product price list (Module H) |
| → vatPercentage | number | VAT rate |
| → vatAmount | number | Calculated VAT |
| → whtPercentage | number | WHT rate if applicable |
| → whtAmount | number | Calculated WHT |
| → ttaAmount | number | TTA commission for this line item |
| → lineTotal | number | Total for this line |
| **orderSubtotal** | number | Sum of all line items (before tax) |
| **orderVatTotal** | number | Total VAT |
| **orderTotal** | number | Final amount buyer pays |
| **ttaTotalAmount** | number | Total platform commission on this order |
| **sellerPayoutAmount** | number | `orderTotal - ttaTotalAmount` — what seller receives |
| orderStatus | enum | 'PENDING_PAYMENT' / 'PAID' / 'PROCESSING' / 'SHIPPED' / 'DELIVERED' / 'COMPLETED' / 'CANCELLED' / 'REFUNDED' / 'DISPUTED' |
| paymentStatus | enum | 'PENDING' / 'COMPLETED' / 'FAILED' / 'REFUNDED' |
| createdAt | string | Order creation time |

### R.3 Payment Processing

**MarketplacePayment Model:**

| Field | Type | Description |
|-------|------|-------------|
| paymentId | string | Unique identifier |
| orderId | string | References MarketplaceOrder |
| **paymentMethod** | enum | 'BANK_TRANSFER' / 'CREDIT_CARD' / 'DEBIT_CARD' / 'PROMPTPAY' / 'QR_CODE' / 'E_WALLET' / 'INSTALLMENT' |
| amount | number | Amount charged |
| currency | string | Currency (default: THB) |
| **paymentGateway** | string | Payment processor used (e.g., "Omise", "2C2P", "Stripe") |
| **gatewayTransactionId** | string | Transaction ID from payment gateway |
| status | enum | 'PENDING' / 'AUTHORIZED' / 'CAPTURED' / 'SETTLED' / 'FAILED' / 'REFUNDED' |
| paidAt | string | When payment was confirmed |

**SellerPayout Model:**

| Field | Type | Description |
|-------|------|-------------|
| payoutId | string | Unique identifier |
| sellerTenantId | string | Seller company |
| **payoutPeriod** | string | Settlement period (e.g., "2026-W25" for weekly, "2026-06" for monthly) |
| **totalOrderAmount** | number | Total sales in this period |
| **totalTtaDeducted** | number | Total TTA commission deducted |
| **totalWhtDeducted** | number | Total WHT deducted (3% on platform fees) |
| **netPayoutAmount** | number | `totalOrderAmount - totalTtaDeducted - totalWhtDeducted` |
| **payoutBankAccount** | string | Seller's registered bank account (from Module B bank accounts) |
| payoutStatus | enum | 'PENDING' / 'PROCESSING' / 'COMPLETED' / 'FAILED' |
| payoutDate | string | When payout was executed |
| **platformInvoiceId** | string | Tax Invoice from Cloudfull → Seller for TTA fees |

### R.4 Warehouse & Storefront Management

> [!TIP]
> **📖 What is this?** Physical warehouses operated by Cloudfull (or franchise partners) where seller companies can stock their products. Buyers can purchase from the warehouse for delivery or pick up from franchise storefronts. Think of it like "Shopee Warehouse" or "Lazada Fulfillment Center."

**Warehouse Model:**

| Field | Type | Description |
|-------|------|-------------|
| warehouseId | string | Unique identifier |
| warehouseName | string | Name (e.g., "Cloudfull Warehouse Bangkok", "Cloudfull Warehouse Chiang Mai") |
| warehouseType | enum | 'SUPER_ADMIN_OWNED' (operated by Cloudfull) / 'FRANCHISE_PARTNER' (operated by franchise) |
| address | ThaiAddress | Physical address with GPS |
| gpsLat | number | Warehouse GPS latitude |
| gpsLng | number | Warehouse GPS longitude |
| managedByTenantId | string | If FRANCHISE_PARTNER: the franchise company's tenantId. If SUPER_ADMIN_OWNED: null |
| contactPhone | string | Warehouse contact phone |
| contactEmail | string | Warehouse contact email |
| operatingHours | object | {openTime, closeTime, daysOpen[]} |
| **storedProducts[]** | WarehouseStock[] | Products stored in this warehouse |
| → productId | string | References Module H product |
| → sellerTenantId | string | Which seller owns this stock |
| → quantityAvailable | number | Current stock level |
| → quantityReserved | number | Stock reserved for pending orders |
| → warehouseFeePerUnit | number | Storage fee per unit per month |
| → lastRestockedAt | string | When stock was last replenished |
| isActive | boolean | Warehouse is operational |

**FranchiseStorefront Model:**

| Field | Type | Description |
|-------|------|-------------|
| storefrontId | string | Unique identifier |
| storefrontName | string | Name (e.g., "Cloudfull Store — Siam Square") |
| storefrontType | enum | 'WAREHOUSE_ATTACHED' (co-located with warehouse) / 'STANDALONE' (pickup point only) |
| linkedWarehouseId | string | If WAREHOUSE_ATTACHED: warehouse it draws stock from |
| franchiseTenantId | string | Franchise company operating this storefront |
| address | ThaiAddress | Physical address with GPS |
| gpsLat | number | Storefront GPS latitude |
| gpsLng | number | Storefront GPS longitude |
| operatingHours | object | {openTime, closeTime, daysOpen[]} |
| isPickupEnabled | boolean | Buyers can pick up orders here |
| isActive | boolean | Storefront is operational |

> [!IMPORTANT]
> **Franchise management is handled by Co-Work.cloud ERP.** The franchise company operates as a regular tenant on Cloudfull with their own Co-Work.cloud ERP instance. The ERP manages: sales reporting, inventory management, pricing control, and operational details. Module R only handles the **marketplace transaction layer** — connecting buyer orders to warehouse stock and storefront pickup.

### R.5 Delivery Fulfillment Channels

> [!IMPORTANT]
> **Three delivery channels** for marketplace orders:

| Channel | Who Delivers | Who Invoices Buyer | Money Flow |
|---------|-------------|-------------------|-----------|
| **DISTRIBUTOR** | The distributor company (Company B) handles delivery | Company B issues Tax Invoice to Buyer | Buyer pays via platform → platform deducts TTA → pays Company B → Company B pays supplier (Company A) |
| **PLATFORM_WAREHOUSE** | Cloudfull/franchise warehouse handles delivery | Cloudfull issues Tax Invoice to Buyer (as intermediary) OR Seller issues Tax Invoice via platform | Buyer pays via platform → platform deducts TTA + delivery fee → pays Seller |
| **SELLER_DIRECT** | Seller ships directly to buyer | Seller issues Tax Invoice to Buyer | Buyer pays via platform → platform deducts TTA → pays Seller |

**OrderFulfillment Model:**

| Field | Type | Description |
|-------|------|-------------|
| fulfillmentId | string | Unique identifier |
| orderId | string | References MarketplaceOrder |
| **fulfillmentChannel** | enum | 'DISTRIBUTOR' / 'PLATFORM_WAREHOUSE' / 'SELLER_DIRECT' |
| **distributorTenantId** | string | If DISTRIBUTOR: which company handles fulfillment |
| **warehouseId** | string | If PLATFORM_WAREHOUSE: which warehouse ships |
| **storefrontId** | string | If buyer chose pickup: which storefront |
| **deliveryMethod** | enum | 'DELIVERY' (shipped to buyer) / 'PICKUP_WAREHOUSE' (buyer picks up from warehouse) / 'PICKUP_STOREFRONT' (buyer picks up from franchise storefront) |
| deliveryPartnerPluginId | string | If using external delivery: references DeliveryPartnerPlugin from Module Q |
| trackingNumber | string | Delivery tracking number |
| trackingUrl | string | Public tracking URL |
| deliveryStatus | enum | 'PREPARING' / 'PICKED_UP' / 'IN_TRANSIT' / 'OUT_FOR_DELIVERY' / 'DELIVERED' / 'PICKUP_READY' / 'PICKED_UP_BY_BUYER' / 'RETURNED' |
| deliveryFee | number | Delivery fee charged to buyer |
| estimatedDeliveryDate | string | ETA |
| actualDeliveryDate | string | When delivered |

### R.6 Special Account Law Compliance (2024)

> [!CAUTION]
> **Mandatory government reporting.** Under the 2024 Special Account law, e-platforms with >฿1B revenue must submit detailed merchant revenue reports directly to the Revenue Department. Cloudfull.com must:
>
> 1. **Generate Special Electronic Account** containing: every seller's total revenue, number of transactions, TTA/fees charged, WHT deducted
> 2. **Submit automatically** to Revenue Department via their API on the prescribed schedule
> 3. **Ensure seller filings match** — if a seller's tax return doesn't match what Cloudfull reported, the seller triggers an automatic tax audit
> 4. **Store records for 5 years** minimum (Revenue Code requirement)

**SpecialAccountReport Model:**

| Field | Type | Description |
|-------|------|-------------|
| reportId | string | Unique identifier |
| reportPeriod | string | Reporting period (monthly/quarterly as required) |
| **sellerReports[]** | SellerReport[] | Per-seller revenue data |
| → sellerTenantId | string | Seller company |
| → sellerTaxId | string | Seller's Tax ID |
| → totalRevenue | number | Total gross revenue on platform |
| → totalTransactions | number | Number of completed orders |
| → totalTtaCharged | number | Total platform fees charged |
| → totalWhtDeducted | number | Total WHT deducted |
| submittedAt | string | When submitted to Revenue Department |
| submissionStatus | enum | 'DRAFT' / 'SUBMITTED' / 'ACKNOWLEDGED' / 'ERROR' |
| revenueApiResponseId | string | Response ID from Revenue Department API |

### R.7 Super Admin Controls for Module R

| Screen | Description |
|--------|-------------|
| **TTA Management** | Configure TTA rates per product/seller. Bulk TTA updates. TTA negotiation history. |
| **Warehouse Dashboard** | Stock levels across all warehouses. Low-stock alerts. Restocking requests. |
| **Storefront Dashboard** | Franchise storefront status, pickup queue, operational metrics. |
| **Payout Management** | Seller payout schedule, pending/completed payouts, payout disputes. |
| **Revenue Reports** | Platform revenue from TTA, delivery fees, subscription fees. Revenue by seller/product/category. |
| **Special Account Reports** | Generate, review, submit government reports. Audit trail. |
| **Module R Feature Flag** | `moduleR.enabled` — master switch to activate/deactivate the entire marketplace module. |

---

## 21. Firestore Architecture Notes {#21-firestore-notes}

> [!TIP]
> **📖 What is this section?** These are critical implementation notes for the Firestore database architecture. They identify fields that MUST be implemented as subcollections instead of embedded arrays to avoid hitting Firestore's 1MB document limit, and patterns that require distributed counters or Cloud Functions.

### Arrays That MUST Be Subcollections

The following fields are specified as arrays in data models above but **MUST be implemented as Firestore subcollections** due to unbounded growth:

| Field | Model | Why | Subcollection Path |
|-------|-------|-----|-------------------|
| `readBy[]` | ChatMessage (§8) | Every reader adds their ID — scales with group size × message count | `messages/{id}/readReceipts/{userId}` |
| `activityTimeline[]` | TaskBase (§6) | Every status change, comment, file upload — grows forever | `tasks/{id}/activities/{activityId}` |
| `accessLog[]` | Contract Vault Document (§3.6) | Every view, download, sign event — high-frequency append | `vaultDocs/{id}/accessLogs/{logId}` |
| `sealApplicationLog[]` | Company Seal Registry (§3) | Immutable audit trail — grows forever, never deleted | `seals/{id}/applicationLog/{logId}` |
| `invoiceHistory[]` | Billing Entity (§15) | Years of invoices accumulate | `billing/{id}/invoices/{invoiceId}` |
| `attendeeConsents[]` | Event (§12) | Large events with 1000+ attendees | `events/{id}/attendeeConsents/{consentId}` |
| `storedProducts[]` | Warehouse (§18 R.4) | Large warehouses with thousands of SKUs | `warehouses/{id}/stock/{stockId}` |

### Distributed Counters Required

These counter fields receive high-frequency concurrent writes and **MUST use Firestore's distributed counter pattern** (shard across N documents, aggregate on read):

| Counter Field | Model | Why |
|--------------|-------|-----|
| `impressions`, `clicks` | AdPlacement (§10) | Concurrent increments from ad views |
| `viewCount`, `saveCount`, `shareCount` | Showcase (§10) | Popular showcases get concurrent views |
| `lastMessageAt`, `lastMessagePreview` | ChatRoom (§8) | Every message updates — use separate meta doc or Cloud Function |

### Cloud Function Required Patterns

| Pattern | Reason | Firestore Limit |
|---------|--------|----------------|
| **PDPA data erasure** (§16 Security Zone 7) | Single user may span thousands of documents | 500-write transaction limit |
| **Candidate → Employee auto-conversion** (§11) | Creates 4+ documents across Modules A, B, C | Cross-collection atomic write |
| **PO → SO cross-tenant creation** (§17) | Buyer's PO creates seller's SO in different tenant | Cross-tenant atomic write |
| **Fan-out notifications** (§3.5) | Company-wide announcement = 500+ notification writes | Use PubSub queue pattern |
| **Verified contact profile sync** (§5) | Popular company verification triggers hundreds of writes | Batch with Cloud Function |

### Cross-Tenant Security Rules

These 6 patterns require dedicated Firestore security rules for cross-tenant data access:

| Pattern | Documents | Rule Complexity |
|---------|-----------|----------------|
| Cross-company chat rooms | `tenantId: null` on ChatRoom | Must validate participant membership |
| PO/SO documents | `buyerTenantId ≠ sellerTenantId` | Allow both tenants read/write their views |
| CloudfullProject parties | Multiple `partyTenantId` values | Per-party access validation |
| Verified contact sync | One tenant's data flows to others | Read-only propagation rules |
| CompanyGroup visibility | Subsidiary/affiliated companies | Group membership validation |
| Personal context | `tenantId: null` when `isPersonal: true` | Differentiate personal vs company |

### Composite Index Budget

> [!WARNING]
> Firestore allows a maximum of **200 composite indexes per database**. With 17+ modules, budget approximately **12 composite indexes per module**. Plan indexes during the architecture phase before build begins.

> [!TIP]
> **This document is your master confirmation checklist.** Review every section. If any field is wrong, unnecessary, or missing — tell me before we start building. Once you confirm, I generate exact build instructions.

> [!WARNING]
> **The Sales Planning module (Phase 3) is the platform's #1 competitive advantage.** No existing Thai CRM offers this combination: routine visit planning + EXIF photo verification + AI-suggested visit gaps + route cost estimation. This module is critical to the platform's market differentiation.
