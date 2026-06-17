# Cloudfull.com — Human-Readable Specification Guide

> **Purpose:** This guide explains the ENTIRE Cloudfull.com specification in plain language. You don't need to jump back and forth through 5,253 lines — everything is here, organized logically so you can read top-to-bottom and understand what every part means.
>
> **How to read:** Main Topic → Sub-Topic → Details. Each section tells you: **What it is**, **Why it exists**, **How a real person uses it**, and **What it connects to**.

---

## 🏗️ THE BIG PICTURE

### What Are We Building?

**Two connected platforms:**

| Platform | Think of it as... | Who uses it | When built |
|----------|-------------------|-------------|------------|
| **Cloudfull.com** | A B2B CRM + Marketplace + Collaboration Hub | Everyone — from a solo freelancer to a 500-person company | **Built FIRST** (this spec) |
| **Co-Work.cloud** | A full ERP (accounting, inventory, logistics, procurement) | Verified companies only | **Built LATER** |

**In simple terms:** Cloudfull.com is where companies find each other, chat, manage sales, track work, and trade. Co-Work.cloud is where they do the back-office accounting.

### Scale Target
- **Year 1:** 10,000+ active users
- **Long-term:** 100,000+ users
- One person can work for **multiple companies** simultaneously
- Connects to external ERPs (Odoo, SAP, Oracle)

### Country Strategy
- **Launch country:** Thailand 🇹🇭 (all Thai laws, tax, KYC are built-in)
- **Expansion ready:** Singapore, Malaysia, Indonesia, Philippines, Vietnam, then US/UK/EU/UAE
- **How expansion works:** A "Country Rule Engine" holds all country-specific rules (tax rates, ID formats, legal requirements). Adding a new country = adding a new configuration entry, NOT rebuilding the system.

---

## 📋 MODULE-BY-MODULE GUIDE

---

## 1. USER IDENTITY & PROFILE (Module A)

### What is this?
This is the **individual person** — the human being who creates an account. Before they join any company, they are just a person with a profile.

### 1.1 Basic Personal Information

**What it is:** Name, phone, date of birth, gender, nationality — the basics.

**Key design decisions:**
- **Two sets of names:** English name (always required) + Local-language name (shown only when nationality requires it). If you're Thai, you see "ชื่อ" and "นามสกุล" fields. If you're Japanese, you see "名" and "姓" fields. The system adapts the labels automatically based on nationality.
- **Thai nickname (ชื่อเล่น):** Only shown for Thai nationals because nicknames are critical in Thai business culture.
- **Phone validation:** Different countries have different phone number formats. Thai mobile = 10 digits, Thai landline = 9 digits. The system validates based on country code + phone type.

**Real-world example:** Somchai registers on Cloudfull. He enters his Thai name + English name, his Thai ID number (which also serves as his personal tax ID), and his mobile number. A Japanese user Tanaka registers with English + Japanese names, passport details, and a +81 number.

### 1.2 Multiple Login Methods

**What it is:** One person can log in using MULTIPLE emails/phones — their personal email, their work emails from different companies, or their phone number.

**How it works:**
- You always keep your **personal email** login (permanent, never removed)
- When Company A gives you a work email (somchai@companya.com), that email ALSO becomes a login
- When you leave Company A, that work email login is revoked — but your personal login is untouched
- **Phone login:** You can register with just a phone number (OTP verification), no email needed

**Why this matters:** A consultant who works for 3 companies can log in with any of their company emails AND their personal email — all leading to the same account.

### 1.3 Professional Portfolio (Digital CV)

**What it is:** A detailed resume/CV built into the platform — skills, education, work history, certifications, language test scores, work samples, salary expectations, and desired benefits.

**Key features:**
- **AI skill normalization:** If you type "photoshop", AI suggests "Adobe Photoshop" for consistency
- **Visibility controls:** You choose who sees your portfolio — nobody, everyone, only companies you apply to, or everyone EXCEPT specific companies (like your current employer)
- **Desired benefits:** You list what welfare benefits matter to you (health insurance = MUST_HAVE, gym membership = NICE_TO_HAVE)

**Connects to:** Module J (Recruitment) uses this for job matching

### 1.4 Address System

**What it is:** Country-specific address forms. Thailand gets soi/moo/sub-district/district/province. Japan gets prefecture/chome/banchi. USA gets street/city/state/zip.

**Key feature:** Google Maps pin picker auto-fills GPS coordinates for every address.

### 1.5 Notification Preferences

**What it is:** Personal control over how and when you receive alerts.

**You can set:**
- Active hours (e.g., 08:30-18:00)
- Workdays only (no weekend alerts)
- Quiet hours behavior: silence alerts, deliver anyway, or queue until morning
- VIP list: specific people who can ALWAYS reach you regardless of settings
- Vacation mode: delegate all notifications to someone else, with auto-reply message

### 1.6 KYC (Know Your Customer) — Identity Verification

**What it is:** Proving you are who you say you are.

**For Thai nationals:**
1. Photograph Thai ID card (front ONLY — back is never collected for privacy)
2. Draw your e-signature on screen
3. Take a live selfie
4. AWS Face Liveness checks you're a real person (not a photo or video)
5. AI compares your selfie to your ID photo

**For non-Thai nationals:** Passport details (number, name, nationality, expiry) instead of Thai ID.

**Status flow:** NOT_VERIFIED → PENDING → VERIFIED ✅ / FAILED ❌ / SUSPENDED ⚠️

### 1.7 E-Signature Registry

**What it is:** Your registered digital signatures that the system uses to verify your identity when you sign documents.

**How it works:**
1. During KYC, you draw your first signature — this becomes your trusted "baseline"
2. You can add more signatures (initials, stamps) later
3. When you sign a contract/PO, the system compares your new signature against your registered ones
4. Verification badges: AI_VERIFIED_PASS (machine checked), HUMAN_VERIFIED (a person checked), FACE_LIVENESS_VERIFIED (you proved you're present)

**Important clarification:** Signatures are for **matching/verification**, not just for "signing." Liveness verification is the primary identity confirmation.

### 1.8 Face Liveness — 7 Critical Checkpoints

**What it is:** At 7 specific moments, the system verifies you're a live person using your phone camera (AWS Rekognition). This prevents someone from using a stolen ID.

| # | When | Why |
|---|------|-----|
| 1 | User KYC registration | Prove you're real when first registering |
| 2 | Company MD verification (standard) | Prove the MD is really registering the company |
| 3 | Company MD verification (delegated remote selfie) | MD verifies remotely if someone else registered |
| 4 | Contract Vault signing | Prove identity when signing legal contracts (configurable) |
| 5 | Company seal application | Prove the MD is really stamping the company seal |
| 6 | Contract termination approval | Prove identity before killing a contract |
| 7 | Bank account export link generation | Prove identity before sharing sensitive bank details |

### 1.9 Terms & Agreement Consent Audit Log

**What it is:** Every time anyone accepts any terms/agreement, the system records court-admissible evidence: WHO accepted WHAT (exact version with hash), WHEN (timestamp), FROM WHERE (IP, device, GPS), HOW they were authenticated, and WHAT they did before clicking accept (scrolled to bottom, viewed section 3, etc.).

**Why this matters legally:** Thai courts require proof that the user actually read and voluntarily agreed. This log provides that evidence.

---

## 2. COMPANY MANAGEMENT (Module B)

### What is this?
This is the **company entity** — the organization that people join. A company is called a "tenant" in technical terms because multiple companies share the same platform.

### 2.1 Company Profile

**What it is:** Full company details — legal entity type, business purpose, industry codes, addresses, phones, emails, social media, bank accounts.

**Key features:**
- **Industry codes (TSIC):** Automatically pulled from Thailand's DBD (Department of Business Development) when you enter your Tax ID
- **Product categories with license gating:** If your company wants to sell alcohol, you must upload your Excise Department license first. No license = can't create alcohol products.
- **Bank accounts:** Heavily protected — last 4 digits only for internal contacts, time-limited export links (1hr/6hr/24hr/72hr) that require Face Liveness verification to generate

**Real-world example:** A beverage company enters their Tax ID → system auto-pulls their TSIC code (distilling spirits) → they upload their Excise license → now they can create alcohol products in the catalog.

### 2.2 Company Group (Multi-Company Management)

**What it is:** An owner running multiple companies (e.g., a holding company with 3 subsidiaries) can link them together for easy switching.

**Key rules:**
- Company Switcher in the nav bar — jump between companies without logging out
- Each company remains 100% isolated — being admin in Company A gives you ZERO rights in Company B
- Only the MD of the main company can create the group
- Adding a company requires being MD of both companies

### 2.3 Company Seal (ตราประทับ)

**What it is:** The official company seal/stamp that Thai Limited Companies use on legal documents.

**Why it's so detailed:** Using someone's company seal without authorization is a criminal offense under Thai law (Criminal Code Sec 264). The system requires:
- Only the DBD-registered MD can apply the seal
- Every seal application requires MFA + Face Liveness
- Complete audit trail: who, when, which document, from what IP address

### 2.4 Company KYC — Three Verification Levels

| Level | Name | What happens | What it unlocks |
|-------|------|-------------|-----------------|
| **Level 1** | ACTIVE_COMPANY | Enter 13-digit Tax ID → AI checks DBD to confirm company exists and is active | Basic platform access |
| **Level 2** | VERIFIED_ACTIVE_COMPANY | Upload Business Registration Certificate → AI extracts MD name → matches against verified user | Full platform features |
| **Level 3** | FULLY_LICENSED | Upload industry-specific licenses (Excise, FDA, etc.) → AI + Super Admin verify | Can sell regulated products (alcohol, pharma, etc.) |

**Two paths to Level 2:**
- **Standard:** The MD themselves registers and verifies
- **Delegated:** A team member registers, then sends the MD a remote verification link. The MD does a selfie + ID check from their phone.

### 2.5 Company Branches

**What it is:** Companies can add branch locations as sub-records. Each branch has its own address, phones, emails, and branch manager.

**Key detail:** Thai tax system uses specific branch codes ("00000" = headquarters). Companies can also add their own internal branch codes for ERP mapping.

### 2.6 ERP API Integration

**What it is:** Companies connect their external ERP systems (Odoo, SAP, Oracle) to sync data bidirectionally.

**Three data depth tiers:**
- CONTACT_ONLY (just names/contacts)
- SHALLOW (contacts + basic financials)
- DEEP (everything)

**6 security layers:** IP allowlisting, emergency key revocation, full audit log, auto-freeze on anomaly detection, key expiry + rotation every 90 days, read/write key separation with HMAC signing.

### 2.7 Employment Contracts (Role T&A)

**What it is:** When a user is assigned a company role, they may need to sign an employment contract. If the role requires GPS tracking, a separate PDPA consent clause is presented.

---

## 3. NOTIFICATIONS (§3.5)

### What is this?
The platform-wide alert system. When ANYTHING happens on the platform → the right people get notified through the right channels.

### 3.1 Six Delivery Channels

| Channel | Think of it as... |
|---------|-------------------|
| **In-App Feed** | A notification bell in the webapp (always on) |
| **Phone Push** | iPhone/Android push notification |
| **Browser Push** | Desktop browser notification |
| **Ecosystem Chat** | Delivered as a chat message (Module G) |
| **Email** | Standard email |
| **SMS** | Text message (costs money, for critical alerts only) |

### 3.2 Notification Routing

**What it is:** Companies create named "presets" that define: when THIS event happens → notify THESE people through THESE channels.

**Example:** A preset called "Sales Team Alerts" sends push + email to all salespeople when a new lead comes in. Another preset "HR Pipeline" sends in-app + email to the HR team when a job application arrives.

### 3.3 What Gets Notified? (72+ Event Types)

Every module generates events — task assigned, task overdue, KYC approved, PO received, contract expiring, sample overdue, attendance anomaly, etc. Companies choose which events trigger which channels.

### 3.4 Seven Feed Categories (In-App)

| Category | What's in it |
|----------|-------------|
| 📋 Tasks & Approvals | Task assigned, expense approval, escalation |
| 👥 HR & People | Role changes, job applications, test results |
| 🏢 Company & Contacts | Verification changes, license expiry, contact approvals |
| 💬 Sales & Commerce | Visit reports, product moderation |
| 📅 Calendar & Events | Event reminders, attendance, overtime |
| 💰 Billing & Compliance | Invoices, subscription, abuse reports |
| 📰 Feed & Social | News posts, showcase moderation |

### 3.5 Hardcoded Notifications (Can't Be Disabled)

Some notifications are mandatory and companies CANNOT turn them off: direct messages, @mentions, account suspension, KYC rejection, password changes, new device logins, API key frozen, license expired, government takedown orders, payment failures.

---

## 4. CONTRACT VAULT (§3.6)

### What is this?
A shared vault for legal contracts and agreements between 2-20 parties. Think of it as a secure document locker that multiple companies share, with built-in signing and versioning.

### 4.1 What Goes In the Vault?

12 types of documents: Service Agreements, NDAs, Employment Contracts, MOUs, Franchise Agreements, Leases, Rental Agreements, Licensing Agreements, Joint Ventures, Trading Terms, General Contracts, Other.

**Important:** PO/SO documents are NOT in the vault — they're in Module Q. Even though they use the same e-signature infrastructure, they're presented separately so users don't confuse procurement orders with legal contracts.

### 4.2 Five Access Levels (Per Party)

Each party independently controls who on their side can access the vault:

| Level | Can View | Can Sign | Can Upload | Can Manage Access |
|-------|----------|----------|-----------|-------------------|
| **VAULT_OWNER** | ✅ | ✅ | ✅ | ✅ |
| **VAULT_CO_OWNER** | ✅ | ✅ | ✅ | ❌ |
| **AUTHORIZED_SIGNATORY** | ✅ | ✅ | ❌ | ❌ |
| **DOCUMENT_VIEWER** | ✅ | ❌ | ❌ | ❌ |
| **VAULT_OBSERVER** | Titles only | ❌ | ❌ | ❌ |

**Important:** Party A cannot see or modify Party B's internal access list. Each side manages their own.

### 4.3 Document Lifecycle

```
DRAFT → PENDING_SIGNATURES → EXECUTED (🔒 locked forever)
                                ↓
                     AMENDMENT_REQUESTED → new DRAFT v2.0
                     TERMINATED (requires ALL parties to agree + Face Liveness)
                     EXPIRED (auto when contract term ends)
```

**Key rule:** Once a document reaches EXECUTED, it can NEVER be modified or deleted. Amendments create a new version.

### 4.4 AI Features (Manual Only)

- **OCR:** Detects company seals on photographed physical documents
- **Contract Analysis:** Extracts clauses, scores risk (0-100%), checks Thai law compliance
- **NEVER auto-triggered** — the vault owner must manually click "Analyze"

---

## 5. ROLES & PERMISSIONS (Module C)

### What is this?
Controls WHO can do WHAT in a company. Think of it as the security gate — every action in the platform checks your permissions first.

### 5.1 Default Roles (10 per company)

Every new company gets these 10 roles pre-built:

| Role | In simple terms... |
|------|-------------------|
| **OWNER** | Can do absolutely everything. Can't have permissions removed. |
| **ADMIN** | Company settings + user management + all modules |
| **MANAGER** | Team oversight, approvals, reporting |
| **SALESPERSON** | Sales visits, contacts, tasks |
| **ACCOUNTANT** | Billing, invoices, financials |
| **PURCHASER** | PO creation, vendor management |
| **SALES_ADMIN** | Sales support, order processing |
| **HR** | Recruitment, onboarding, tests |
| **MEMBER** | Standard access — tasks, chat, contacts, calendar |
| **VIEWER** | Read-only access |

Companies can rename any role, modify permissions, and create unlimited custom roles.

### 5.2 Permission System (73+ Permissions)

**Default-deny policy:** If you don't have the permission explicitly, you CAN'T do it. OWNER is the only exception (always has everything).

Permissions span 18 areas: Company Management, Users & Roles, Contact Pool, Tasks, Sales, Chat, Products, Showcase, Recruitment, Events, News Feed, Inventory, Procurement, Skill Testing, Billing, Reports, Company Seal, Contract Vault, and more.

### 5.3 Teams & Groups

- **Teams:** Hierarchical (parent-child structure). Each team has a manager.
- **Groups:** Flat lists for @mentions, sharing, calendar sync, notification routing.

### 5.4 Approval Chain (Escalation)

**How it works:** Every user has a `reportToUserId` (direct manager). When something needs approval:
1. Goes to direct manager (Level 1)
2. No response in 24 hours → escalates to manager's manager (Level 2)
3. Still no response → escalates again (Level 3)
4. After max levels → flagged as "REQUIRES_MD_ATTENTION" with urgent alert

---

## 6. CONTACT POOL (Module D)

### What is this?
The master address book. Every business contact your company interacts with lives here — customers, suppliers, freelancers, government agencies.

### 6.1 Three Types of Contacts

| Type | What it means | Example |
|------|---------------|---------|
| **Type 1: Company HQ** | The company as a whole entity | "Grand Hotel Bangkok" — HQ address, main phone |
| **Type 2: Company + People** | Specific people within a company | "Grand Hotel Bangkok" + Khun Nat (Purchasing) + Khun Ploy (Accounting) |
| **Type 3: Individual** | A standalone person (no company) | A freelance photographer |

### 6.2 Dual-Profile System

**What it is:** When you manually add a company, it's an "Internal Profile" (your data). If that company later registers and verifies on Cloudfull, a "Verified Profile" overlay appears.

**What happens:** Mismatches are flagged with ⚠️ warnings (e.g., "Your phone number differs from their verified number"). You can sync individual fields or keep your own data.

### 6.3 Personal vs Company Contact Pools

| Pool | Default Limit | Tiers |
|------|---------------|-------|
| **Personal** | 5,000 contacts | Free / Plus (15K) / Premium (50K) / Custom |
| **Company** | 10,000 contacts | Starter / Business (50K) / Enterprise (200K) / Custom |

**Transfer rules:** Personal → Company requires approval. Company → Personal only if the company allows export.

### 6.4 Fraud Reporting

**What it is:** Anyone (registered or anonymous with ID proof) can report identity fraud. AI pre-screens the report, may auto-suspend the target, and Super Admin investigates.

**Anti-abuse:** Escalating cooldown bans for people who submit false fraud reports.

---

## 7. UNIFIED WORK HUB — TASKS (Module E)

### What is this?
The **nerve center** where ALL work happens. Think of it as Asana/Monday.com but deeply connected to every module. Every piece of work is a "task."

### 7.1 Nine Task Types (Each with Its Own Pipeline)

| Type | What it's for | Status Flow |
|------|---------------|-------------|
| **STANDARD** | Regular to-do items | NEW → IN_PROGRESS → IN_REVIEW → COMPLETED |
| **LEAD** | Sales pipeline tracking | NEW → CONTACTED → QUALIFIED → PROPOSAL → NEGOTIATION → WON/LOST |
| **HR_CANDIDATE** | Hiring pipeline | NEW → SCREENING → INTERVIEW → EVALUATION → OFFER_SENT → RECRUITED |
| **SALES_VISIT** | Field visit tracking | PLANNED → EN_ROUTE → ARRIVED → CHECK_IN → MEETING_DONE → REPORT |
| **SPONSOR_REQUEST** | Sponsorship tracking | DRAFT → SUBMITTED → REVIEW → BUDGET_APPROVED → EXECUTION → CLOSED |
| **FREELANCE_GIG** | Freelancer booking | PENDING_PROPOSAL → COUNTER_PROPOSAL → CONFIRMED/REJECTED |
| **ROUTINE_PLAN** | Recurring scheduled work | PLANNED → IN_PROGRESS → COMPLETED/RESCHEDULED |
| **APPROVAL** | Things needing sign-off | PENDING → APPROVED/REJECTED/ESCALATED |
| **EXPENSE** | Expense claims | DRAFT → SUBMITTED → REVIEW → APPROVED → REIMBURSED |

### 7.2 Task Collaboration

**Multi-person tasks:** Tasks with 2+ assignees auto-create a chat room. Team members can pin items (approval requests, file shares, milestones, deadlines, decisions).

**Per-participant completion:** Each person can mark "My Part Done" without blocking the overall task. The task shows individual progress: "✅ Alice: Done · 🔄 Bob: Active · 🔄 Carol: Active"

### 7.3 Google Calendar Sync

Two-way sync between platform events and Google Calendar. Supports company email calendar and personal calendar. Google Meet links detected with one-click join.

### 7.4 Cloudfull Project (Multi-Party Workspace)

**What it is:** A project workspace where a project owner invites multiple parties (suppliers, subcontractors, consultants) to collaborate — with **strict data isolation between parties**.

**The key rule:** Party A can ONLY see documents linked to them. Party A CANNOT see Party B's documents, pricing, or identity. The project owner sees everything.

**ERP Integration:**
- Owner uses Co-Work.cloud ERP → POs auto-sent to each party
- Owner does NOT use ERP → manually uploads POs via Module Q
- Seller uses Co-Work.cloud ERP → SOs auto-sent
- Seller does NOT use ERP → manually uploads quotations

**Co-Work.cloud ERP does NOT have a project module.** Projects exist only in Cloudfull.com.

**Real-world example:** A construction company wins a hotel renovation. They create a Cloudfull Project and invite:
- Steel supplier (sees only their POs/quotations)
- Glass supplier (sees only their POs/quotations — cannot see steel pricing)
- Design consultant (sees only their documents)

The construction company sees all documents across all parties.

---

## 8. SALES PLANNING & ROUTING (Module F)

### What is this?
Purpose-built for **field sales teams** who regularly visit B2B customers. Keeps reps disciplined, optimizes routes, tracks costs, and gives managers full visibility.

### 8.1 To-Be Plan (Who to Visit, How Often)

**What it is:** A master list of all contacts a salesperson should track. Each contact has a visit frequency (weekly/monthly/quarterly) and expected order value.

**AI features:**
- AI analyzes ERP order history to recommend visit frequency
- AI predicts order values ("This customer orders ~50 cases every 2 weeks, avg ฿45,000")
- Overdue contacts highlighted in red

### 8.2 Actual Plan (Today's Schedule)

**What it is:** Takes contacts from the To-Be Plan and schedules them into concrete time slots for today.

**Key feature:** EXIF photo verification — when a salesperson photographs their visit, the system checks:
1. Photo's GPS matches the customer's location ✅
2. Photo's timestamp matches the visit time ✅
3. Photo's device matches the expected device ✅

If anything doesn't match → anomaly flag for manager review.

**Closed-loop:** Completed visit → next visit date auto-advances. Missed visit → counter increments.

### 8.3 Costing & Expenses (Platform-Wide)

**What it is:** AI-powered expense tracking. Photograph a receipt → AI extracts the amount and categorizes it (fuel, meal, transport, etc.) → submit for manager approval.

Available to ALL roles, not just salespeople.

### 8.4 Visibility Rules

Sales Rep sees only their data. Team Manager sees their team. Department Head sees their department. MD/Owner sees everything.

---

## 9. CHAT SYSTEM (Module G)

### What is this?
Real-time messaging — like Slack or LINE for business, but deeply integrated with tasks, projects, products, and sales.

### 9.1 Chat Room Types

| Type | When it's created |
|------|-------------------|
| **TASK** | Auto-created when a multi-person task is created |
| **PROJECT** | Auto-created for Cloudfull Projects |
| **PRODUCT** | Buyer inquires about a product |
| **SHOWCASE** | Discussion about a showcase entry |
| **RECRUITMENT** | HR discusses a candidate |
| **DIRECT** | 1-on-1 conversation |
| **GROUP** | Team/group discussion |
| **SUPPORT** | Customer support |

### 9.2 Key Features

- **Chat → Task/Lead conversion:** Select any message → create a task or sales lead from it. Message content auto-fills the description.
- **Message reactions:** Emoji reactions on messages
- **Reply threading:** Reply to specific messages
- **Read receipts:** See who read your message
- **@mentions:** Tag specific people or groups

### 9.3 No Delete Policy

**Messages can NEVER be permanently deleted by anyone** — including platform admins.
- Users can "hide" messages from their own view
- Hidden messages remain visible to others
- Platform admins CANNOT read chat messages (privacy guarantee)

**Legal basis:** Thai Computer Crime Act requires 90-day metadata retention. Content anonymized for PDPA erasure requests.

### 9.4 Company Sticker Packs

Companies can create branded stickers (free or paid per user). Platform provides default packs.

---

## 10. PRODUCT CATALOG & MARKETPLACE (Module H)

### What is this?
The product backbone — managing everything a company sells publicly AND uses internally.

### 10.1 Products (Two Kinds)

| Kind | What it is | On marketplace? |
|------|-----------|-----------------|
| **Marketplace Product** | Products sold to other businesses | ✅ Yes |
| **Internal Product** | Samples, equipment, office supplies | ❌ No — never on marketplace |

### 10.2 Product Features

- **Multiple price lists:** Different prices for different customer segments (Retail, Wholesale, VIP, Distributor) with minimum order quantities
- **Stock visibility:** Choose who sees your stock levels (Public, Internal, Contact Pool, Selected Contacts)
- **Reseller authorization:** Authorize specific companies as official resellers/distributors with territory + expiry
- **Regulated products:** Alcohol, tobacco, pharmaceutical, medical device, cosmetic, food supplement, cannabis/hemp, hazardous — each requires appropriate license

### 10.3 Asset Products (Real Estate & Vehicles)

**What it is:** Specialized listing for physical assets — homes, land, condos, offices, vehicles — with GPS location, nearby amenities, and map view.

### 10.4 Sample Tracking (Revenue Department Audit-Proof)

**What it is:** When employees take product samples to give/lend to customers, the system tracks EVERYTHING for Revenue Department audits.

**Two distribution types:**
- **GIVE_AWAY:** Permanent transfer (e.g., promotional signs). Needs: requisition form, acknowledgement of receipt with signature, "สินค้าตัวอย่าง ห้ามจำหน่าย" marking photo
- **RENT_LOAN:** Temporary with return tracking (e.g., display coolers). Auto-creates a follow-up task that escalates priority as return date approaches.

**Full paperwork chain:** Requisition Form → Manager Approval → Acknowledgement of Receipt → Stock Card → Photos → Return Tracking

### 10.5 Equipment Rental (Internal)

Tracks when employees check out company equipment (laptops, projectors, vehicles) with approval, condition tracking, and return flow.

### 10.6 ERP Inventory Sync (Read-Only)

Displays live stock levels from external ERP systems. Read-only — no write-back. Shows: available quantity, reserved, total, reorder level with ⚠️ alerts.

### 10.7 Advertising System

Rotational ad placements within product categories: banners, product highlights, map pins, contact pool top placements. Companies pay per day.

---

## 11. DESIGN SHOWCASE (Module I)

### What is this?
A **Pinterest-style visual showroom** where companies display their products beautifully.

### Key Features:
- Upload styled images → AI extracts dominant colors and auto-tags ("modern," "living room," "sofa")
- **Hotspots:** Clickable points on images that link to specific products — tap the faucet in a kitchen photo → go to the faucet product page
- **Favorite folders:** Users create Pinterest-style boards to organize saved items
- Engagement metrics: views, saves, shares
- Links to Module G chat for inquiries

---

## 12. RECRUITMENT PIPELINE (Module J)

### What is this?
A hiring module — post jobs, receive applications, track candidates through a pipeline.

### 12.1 Job Posting

Create job listings with title, department, employment type (full-time/part-time/contract/freelance/internship), salary range, benefits, work arrangement (on-site/remote/hybrid), and deadline.

**Key feature:** Jobs can be shared via public URL — people WITHOUT accounts can apply through a guest form.

### 12.2 Candidate Pipeline

```
NEW → SCREENING → INTERVIEW_SCHEDULED → INTERVIEW → EVALUATION → OFFER_SENT → RECRUITED ✅ / NOT_PASS ❌
```

### 12.3 Auto-Conversion

When a candidate reaches RECRUITED status on the set date → system auto-creates their user account + company membership. No manual account creation needed.

---

## 13. EVENTS, GPS & ATTENDANCE (Module K)

### What is this?
Employee attendance tracking with GPS verification and photo anti-fraud.

> **⚠️ Important disclaimer:** Cloudfull.com **collects data only** (clock-in/out times, GPS, photos). All statutory calculations (overtime pay, severance, leave entitlements) happen in Co-Work.cloud ERP or the employer's external HR system.

### 13.1 Shift Tracking

Clock in/out with GPS + selfie. System auto-calculates work hours and overtime. Statuses: ON_TIME, LATE, ABSENT, LEAVE, HOLIDAY.

### 13.2 EXIF Photo Verification (Anti-Fraud)

Same technology used in Module F sales visits — cross-checks photo GPS, timestamp, and device against expected values. Flags anomalies.

### 13.3 Event Attendee PDPA Consent

When hosting events, attendees opt in to each data field separately (phone, company, dietary preferences). PDPA-compliant. Data export only includes consented fields.

---

## 14. QR, BROCHURES & NEWS FEED (Module L)

### What is this?
The networking and content distribution layer — your **trade show toolkit**.

### 14.1 Six QR Interactions

| QR Type | What happens when scanned |
|---------|--------------------------|
| **Profile Exchange** | Your contact card auto-populates in their contact pool |
| **User Role Exchange** | Your company role card is exchanged |
| **Mutual Exchange** | Both sides exchange contacts simultaneously |
| **Product Save** | Product saved to their favorites |
| **E-Brochure Collect** | Live brochure pointer saved (always shows latest version!) |
| **Event Check-in** | Check into an event |

**"Zero-Waste Updates":** Any change by the manufacturer auto-propagates to everyone who collected the brochure. Update prices → all collectors see the new prices.

### 14.2 E-Brochure System

Companies create digital catalogs with auto-generated QR codes. Users "collect" brochures as live pointers (not file copies). Organize in custom folders with private notes.

### 14.3 News Feed

Company news posts visible to followers. Visibility controls: PUBLIC, FOLLOWERS, INTERNAL, SPECIFIC_CONTACTS.

---

## 15. SKILL TESTING (Module N)

### What is this?
Companies create knowledge tests for employees — monthly quizzes and quarterly exams.

**Types:** Small Monthly, Big Quarterly, Custom
**Tiers:** Free = manual questions only. Paid = AI generates questions from company training materials.
**Output:** Per-employee scores with AI-generated improvement recommendations.

---

## 16. BILLING & SUBSCRIPTION (Module O)

### What is this?
**PLATFORM billing only** — charges from Cloudfull.com to its users/companies. NOT for B2B commercial invoices between companies.

### 16.1 What's Covered

- Payment transactions (bank transfer, credit card, PromptPay, QR code)
- Thai tax invoices (with VAT, withholding tax)
- Billing entity management (billing details may differ from company name)
- Invoice history with downloadable PDFs
- Promotional campaigns (platform discounts)

---

## 17. COMPLIANCE, AI & ADMIN BACKOFFICE (Module P)

### What is this?
The **platform's command center** — AI regulatory monitoring, security incidents, and Super Admin dashboard.

### 17.1 AI Regulatory Scanning

Hermes AI periodically scans Thai legislation for changes affecting the platform. Produces structured recommendations with risk levels.

### 17.2 Security Incident Engine

Tracks incidents with threat levels (CRITICAL, DATA_LEAK, UNAUTHORIZED_ACCESS, PERFORMANCE). Monitors hardware metrics.

### 17.3 Super Admin Backoffice (14 Screens)

Dashboard, Tenant Management, Verification Queue, User Management, Content Moderation, Takedown Management, Product Oversight, Subscriptions, Ads, Analytics, System Config, Audit Logs, Emergency Controls, Regulatory Scanner.

**Key constraints:** All actions logged. Bulk data exports require two-person approval. MFA + Face Liveness required.

---

## 18. PURCHASE ORDER & PROCUREMENT (Module Q)

### What is this?
Full B2B procurement document management — the formal buying/selling process between companies.

### 18.1 Document Flow

```
RFQ (Request for Quotation) → Quotation → Purchase Order (PO) → Sales Order (SO)
```

### 18.2 RFQ (Request for Quotation)

**What it is:** Buyer asks seller "How much would this cost?"

**Real-world example:** A restaurant chain sends RFQ to 3 meat suppliers: "200 kg premium pork belly by July 1 — best price?"

### 18.3 Quotation

**What it is:** Seller responds with prices, payment terms, delivery terms, validity period.

**Features:** Supports revisions (up to 10 by default), "Final Offer" flag (no more revisions), upload own PDF instead of filling form.

### 18.4 Purchase Order (PO)

**What it is:** The formal order document from buyer to seller.

**Features:**
- Internal approval workflow (if amount exceeds threshold)
- System-generated or uploaded document
- E-signature + Face Liveness verification (configurable)
- Auto-creates a task in Module E for tracking
- Dispute resolution workflow (DISPUTED → AMENDED/CANCELLED/WITHDRAWN)

### 18.5 Sales Order (SO)

**What it is:** When a seller acknowledges a PO, a mirror SO is auto-created in the seller's account. Same line items, different perspective.

### 18.6 Invoice & Delivery (Read-Only from ERP)

Cloudfull.com does NOT create invoices. Invoice and delivery data comes from Co-Work.cloud or external ERP as read-only display.

**Two sync modes:**
- Co-Work.cloud ERP = fully automatic
- External ERP = manual status updates OR API sync

### 18.7 Unified View

Both buyer and seller see the same document with dual perspective. Seller can attach invoice PDFs that the buyer sees on their PO view.

---

## 19. SECURITY & COMPLIANCE

### 19.1 Security Audit (59 Measures, 10 Zones)

| Zone | Focus | # Measures |
|------|-------|-----------|
| 1 | Multi-Tenant Data Isolation | 4 |
| 2 | Identity & Access Management | 6 |
| 3 | Data Encryption | 5 |
| 4 | API Gateway Hardening | 8 |
| 5 | Audit Logging | 6 |
| 6 | PDPA Compliance | 9 |
| 7 | Content & Substance Safety | 6 |
| 8 | Infrastructure Security | 5 |
| 9 | Application Security | 7 |
| 10 | Business Continuity & Disaster Recovery | 3 |

### 19.2 PDPA Data Subject Rights (§16.8)

**Right to Erasure (deleteMyData):** Users can request deletion. System checks retention obligations per data type:
- Profile → Erase after 30-day grace period
- KYC docs → Keep 5 years (AMLA + Revenue Code)
- Chat messages → Anonymize after 90 days
- Financial records → Keep 5 years
- E-signatures → Keep 10 years

**Right to Data Portability (exportMyData):** Users can export all their data as JSON/CSV.

**DPO (Data Protection Officer):** Mandatory for Cloudfull.com. Manages data subject requests, complaints, breach notifications (72-hour requirement).

### 19.3 Thai Laws Covered

| Law | What it covers |
|-----|---------------|
| PDPA B.E. 2562 | Personal data protection (Thailand's GDPR) |
| Computer Crime Act B.E. 2550 | 90-day metadata retention, lawful interception |
| Electronic Transactions Act B.E. 2544 | E-signatures, electronic evidence |
| Revenue Code | Tax invoices, withholding tax, 5-year retention |
| AMLA B.E. 2542 | Anti-money laundering, KYC requirements |
| Consumer Protection Act B.E. 2522 | AI disclaimer requirements |
| Trade Competition Act B.E. 2560 | Resale price protection |
| Thai Criminal Code Sec 264 | Company seal fraud |
| Social Security Act B.E. 2533 | Employee welfare |
| Foreign Business Act B.E. 2542 | Foreign company operations |

---

## 20. BUILD ORDER (11 Phases, 18 Weeks)

| Phase | Weeks | What Gets Built |
|-------|-------|----------------|
| **1** | 1-2 | Foundation: User profiles, company setup, roles, chat, notifications, contacts |
| **2** | 3-4 | Task engine + chat integration + lead pipeline |
| **3** ⭐ | 5-6 | **Sales Planning & Routing** (THE competitive advantage — no Thai CRM has this) |
| **4** | 7-8 | Product catalog + marketplace + regulated products |
| **5** | 9 | Design showcase (Pinterest-style) |
| **6** | 10 | Contact pool + news feed + QR networking |
| **7** | 11 | Recruitment + HR pipeline + skill testing |
| **8** | 12 | GPS attendance + sample tracking + equipment |
| **9** | 13-14 | Purchase orders & procurement (RFQ → Quote → PO → SO) |
| **10** | 15-16 | Billing + Super Admin backoffice (14 screens) |
| **11** | 17-18 | Reports (10 categories) + security audit (59 measures) |

> ⭐ **Phase 3 (Sales Planning)** is the #1 competitive advantage — no existing Thai CRM offers routine visit planning + EXIF photo verification + AI-suggested visit gaps + route cost estimation.

---

## 🔗 HOW EVERYTHING CONNECTS

```
USER (Module A)
  ├─ joins → COMPANY (Module B)
  │            ├─ has → ROLES & PERMISSIONS (Module C) → gates everything
  │            ├─ has → CONTACT POOL (Module D) → feeds into everything below
  │            ├─ has → TASKS (Module E) ← all work flows through here
  │            │          ├─ LEAD tasks → Cloudfull Projects
  │            │          ├─ HR tasks ← Module J recruitment
  │            │          ├─ SALES_VISIT tasks ← Module F plans
  │            │          └─ EXPENSE tasks → approval chain (Module C)
  │            ├─ has → SALES PLANS (Module F) → visits contacts from Module D
  │            ├─ has → CHAT (Module G) ← auto-created for tasks/projects/products
  │            ├─ has → PRODUCTS (Module H) → shown in marketplace + Module I
  │            │          └─ SAMPLE TRACKING → auto-creates tasks in Module E
  │            ├─ has → SHOWCASE (Module I) → links to products in Module H
  │            ├─ has → RECRUITMENT (Module J) → auto-creates HR tasks in Module E
  │            ├─ has → ATTENDANCE (Module K) → reports to ERP
  │            ├─ has → QR/BROCHURES/FEED (Module L) → networking
  │            ├─ has → SKILL TESTS (Module N) → employee assessments
  │            └─ has → PROCUREMENT (Module Q) → RFQ/Quote/PO/SO
  │
  ├─ signs documents in → CONTRACT VAULT (§3.6) → uses e-signature from Module A
  ├─ receives → NOTIFICATIONS (§3.5) → from all modules
  └─ pays → BILLING (Module O) → platform subscription
  
SUPER ADMIN (Module P) → oversees everything
SECURITY (§16.7) → protects everything
PDPA (§16.8) → governs data handling
```

---

> [!IMPORTANT]
> **This guide covers the ENTIRE specification.** If anything is unclear or doesn't match your understanding, please tell me which section number and I'll clarify or revise the spec.
