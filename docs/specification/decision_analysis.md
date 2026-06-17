# 🔀 3 Architectural Decisions — Detailed Analysis

> **Purpose:** You need to decide these 3 items before I can fix the 57 QA issues.
> Each decision has cascading effects on multiple modules.

---

## Decision 1: Lead Pipeline — Remove Project or Build It?

### The Problem

Your Lead task pipeline (Module E) currently looks like this:

```
NEW → CONTACTED → QUALIFIED → PROPOSAL → NEGOTIATION → WON / LOST / CONVERTED_TO_PROJECT
```

- `CONVERTED_TO_PROJECT` points to a `convertedProjectId` field, but **no Project model exists anywhere** in the 4,991-line spec.
- `WON` is a terminal status — a deal is won, but **nothing happens automatically**. No PO is created, no task spawns, no notification fires.

### What This Means for Your Business

When a salesperson wins a deal in the field, the current spec says... nothing. They'd have to **manually** go to Module Q and create a PO from scratch. The lead data (contact, deal value, products discussed) doesn't carry over.

---

### Option A: Remove Project — Convert Lead → PO Draft (Recommended)

**How it works:**
- Remove `CONVERTED_TO_PROJECT` status entirely
- Rename `WON` behavior: when a lead reaches `WON`, the system **auto-creates an RFQ or PO draft** in Module Q
- The new PO draft auto-fills: `buyerTenantId` from lead's contact, `poItems[]` from lead's product discussions, `estimatedValue` from `leadValue`
- The salesperson just reviews and sends — no re-typing

**Business Analyst view:**
| Pros | Cons |
|------|------|
| ✅ Closes the sales loop: Lead → Win → Purchase | ❌ Loses "project" concept if you ever need it |
| ✅ No new module to build — uses existing Module Q | ❌ Not all leads result in POs (some are partnerships, sponsorships) |
| ✅ Salesperson productivity — data carries over automatically | |
| ✅ CRM → ERP handoff is clean and trackable | |

**Lead Engineer view:**
| Pros | Cons |
|------|------|
| ✅ Zero new models needed — just add `sourceLeadId` to RFQ/PO | ❌ Need to handle edge case: lead with no products attached |
| ✅ Build time: ~2 days (auto-creation logic + notification) | |
| ✅ Uses existing PO notification infrastructure | |

**Senior Lawyer view:**
| Pros | Cons |
|------|------|
| ✅ Clear audit trail: Lead → PO creates documented chain of custody | ❌ None |
| ✅ Tax compliance: early PO draft helps with revenue recognition timing | |

**What changes in the spec:**
- Module E: `CONVERTED_TO_PROJECT` → `CONVERTED_TO_PO`, `convertedProjectId` → `convertedDocumentId`
- Module E: `WON` → add auto-action: "Creates PO draft in Module Q"
- Module Q: Add `sourceLeadId` field on RFQ/PO
- §3.5: Add `LEAD_WON` and `LEAD_CONVERTED_TO_PO` notification events

---

### Option B: Add a Lightweight Project Model

**How it works:**
- Create a new `Project` model in Module E as a **container for multiple related tasks**
- A project has: `projectId`, `projectName`, `clientContactId`, `projectStatus`, `budget`, `startDate`, `endDate`, `taskIds[]`
- Lead → Project → multiple POs, tasks, milestones
- Think: "Company A orders a custom interior design — that's a project with 5 POs, 12 tasks, and 3 milestones"

**Business Analyst view:**
| Pros | Cons |
|------|------|
| ✅ Supports complex multi-PO deals | ❌ **Significant scope expansion** — new model, new UI, new permissions |
| ✅ Project dashboard for tracking large engagements | ❌ Overlaps with Co-Work.cloud ERP project management |
| ✅ Common CRM feature (Salesforce, HubSpot all have it) | ❌ Adds 3-4 weeks to development timeline |

**Lead Engineer view:**
| Pros | Cons |
|------|------|
| ✅ Clean architecture for complex workflows | ❌ Need: Project model, Project permissions, Project→Task links, Project→PO links, Project dashboard, Project reports |
| | ❌ Build time: ~3-4 weeks (full CRUD + dashboard + reports) |
| | ❌ Adds 8+ new permissions to Module C |

**Senior Lawyer view:**
| Pros | Cons |
|------|------|
| ✅ Better contract management for large deals | ❌ More data to protect under PDPA |

> [!IMPORTANT]
> **My recommendation: Option A (Remove Project, convert to PO).**
> Your platform is a B2B CRM + marketplace, not a project management tool. Co-Work.cloud ERP should handle project management. Option A closes the sales loop with minimal effort. If you need projects later, you can add them in Phase 2 after validating demand.

---

## Decision 2: i18n Field Naming — Fix Now or Defer?

### The Problem

Your spec has **two conflicting naming patterns** for multilingual fields:

**Pattern 1 — Dynamic `*Local` (Module A, Module C):**
```
firstNameLocal    → label changes per nationality (e.g., "ชื่อ" for Thai, "名前" for Japanese)
lastNameLocal     → same dynamic label
roleNameLocal     → adapts to company's country
```

**Pattern 2 — Hardcoded `*TH` (Modules B, D, H, J, K, L, Q):**
```
companyNameTH        → only works for Thai
contactNameTH        → only works for Thai
productNameTH        → only works for Thai
jobTitleTH           → only works for Thai
branchNameTH         → only works for Thai
holidayNameTH        → only works for Thai
```

And for currency:
```
totalAmountTHB       → hardcoded Thai Baht
costPerDayTHB        → hardcoded Thai Baht
rentalPricePerMonthTHB → hardcoded Thai Baht
negotiatedPriceTHB   → hardcoded Thai Baht
listingPriceTHB      → hardcoded Thai Baht
```

Meanwhile, your `CountryRuleEngine` (§1.5) supports 5 currencies: THB, USD, EUR, GBP, AED — and 17+ countries.

---

### Option A: Fix Now at Spec Level (Recommended)

**How it works:**
- Rename all `*TH` fields to `*Local` in the spec (e.g., `companyNameTH` → `companyNameLocal`)
- Rename all `*THB` currency fields to generic names with a separate `currency` field:
  - `totalAmountTHB` → `totalAmount` + `currency: string`
  - `costPerDayTHB` → `costPerDay` + `currency: string`
- This is a **spec-only change** — no code exists yet, so zero refactoring cost

**Business Analyst view:**
| Pros | Cons |
|------|------|
| ✅ **Free to do now** — no code exists, pure text change | ❌ Spec editing takes ~1 day |
| ✅ When Japan/Korea/UAE clients onboard, no schema migration needed | ❌ Slightly more complex: need `currency` field on cost models |
| ✅ Your §1.5 CountryRuleEngine already supports this | |
| ✅ Professional — shows investors/partners you're built for scale | |

**Lead Engineer view:**
| Pros | Cons |
|------|------|
| ✅ Database schema is clean from Day 1 | ❌ ~30 field renames across the spec |
| ✅ No expensive database migrations later | ❌ Need to add `currency` field to ~10 models |
| ✅ API naming is consistent | |
| ✅ If NOT fixed now, migration later costs 2-3 weeks + data migration risk | |

**Senior Lawyer view:**
| Pros | Cons |
|------|------|
| ✅ Multi-currency compliance ready for international expansion | ❌ None |
| ✅ Supports Foreign Business Act requirements for non-Thai companies | |

---

### Option B: Defer to Phase 2

**How it works:**
- Keep `*TH` and `*THB` naming for now
- Thailand-first launch — all users are Thai companies
- Rename fields when international expansion starts

**Business Analyst view:**
| Pros | Cons |
|------|------|
| ✅ Zero spec work now | ❌ **Technical debt from Day 1** |
| ✅ Simpler mental model for Thai developers | ❌ Schema migration needed later (database + API + frontend) |
| | ❌ API breaking change for all existing integrations |
| | ❌ Cost: 2-3 weeks of engineering + testing when expansion starts |

**Lead Engineer view:**
| Pros | Cons |
|------|------|
| ✅ Faster to read for Thai-speaking team | ❌ Every model with `*TH` needs migration later |
| | ❌ Database migration risk with live data |
| | ❌ All frontend labels hardcoded to Thai need refactoring |

> [!IMPORTANT]
> **My recommendation: Option A (Fix now).**
> There is literally **zero cost** to renaming fields in a spec document before any code is written. If you defer, the same change costs 2-3 weeks of engineering with live data migration risk. This is the #1 rule of software architecture: **naming decisions are cheapest on Day 0 and most expensive on Day 365.**

---

## Decision 3: Labor Protection Act Compliance Depth

### The Problem

Your platform tracks:
- **Employment contracts** (Module B — Terms & Agreements)
- **Work shifts** (Module K — clock-in/out, overtime detection)
- **Leave types** (Module K — SICK, PERSONAL, VACATION, MATERNITY, etc.)
- **Attendance** (Module K — late detection, shift alerts)

Thai Labor Protection Act (LPA) B.E. 2541 mandates specific rules for ALL of these. Currently, your spec references LPA once (L1490) for employment contracts but **doesn't enforce any statutory limits**.

### What Could Go Wrong Without LPA Compliance

Real scenario: A company uses your platform to track shifts. An employee works 12 hours/day for 30 straight days. Your system records it without warning. The employee files a complaint with the Labor Court. Your platform has **documented evidence** of the violation (shift records) — which makes the company AND potentially the platform liable as the record-keeper.

---

### Option A: Alerts & Validation Only (Recommended)

**How it works:**
- Platform **warns** but doesn't **block** — companies can override with acknowledgment
- Leave balance validation: warn if employee has < 6 days annual leave remaining
- Shift alerts: warn if daily hours > 8, weekly hours > 48, or weekly overtime > 36
- No payroll calculations (that's ERP scope)

**What gets added to Module K:**

| Rule | LPA Section | Implementation |
|------|-------------|---------------|
| Max 8 hrs/day standard work | Sec 23 | ⚠️ Alert when shift > 8hrs |
| Max 48 hrs/week | Sec 23 | ⚠️ Weekly aggregate alert |
| Max 36 hrs/week overtime | Sec 24 | ⚠️ Overtime threshold alert |
| Min 6 days annual leave | Sec 30 | ⚠️ Leave balance warning |
| Min 30 days sick leave | Sec 32 | ⚠️ Leave balance warning |
| 98 days maternity leave | Sec 41 | ⚠️ Leave balance warning |
| 1 day/week rest day minimum | Sec 28 | ⚠️ Alert if 7 consecutive work days |
| Holiday pay (≥13 holidays/year) | Sec 29 | ℹ️ Display LPA minimum alongside company holidays |

**Business Analyst view:**
| Pros | Cons |
|------|------|
| ✅ Platform shows it's LPA-aware — builds trust | ❌ Companies may ignore warnings |
| ✅ Low development cost (~3 days) | ❌ Not fully compliant — just advisory |
| ✅ No liability for calculations (just alerts) | |
| ✅ Companies can configure stricter rules if wanted | |

**Lead Engineer view:**
| Pros | Cons |
|------|------|
| ✅ Simple implementation: threshold checks + notifications | ❌ Need to add 8 config fields to Module K |
| ✅ Uses existing notification infrastructure | ❌ Need locale-aware rules (different countries have different limits) |
| ✅ Build time: ~3 days | |

**Senior Lawyer view:**
| Pros | Cons |
|------|------|
| ✅ Platform demonstrates good faith LPA awareness | ❌ Not a guarantee of compliance — disclaimer needed |
| ✅ Alerts create a paper trail that employer was warned | ❌ If employer ignores alert, platform still has the violation records |
| ✅ Reduces platform's potential liability as enabler | |

---

### Option B: Full Statutory Calculations

**How it works:**
- Platform **enforces** LPA rules — blocks non-compliant scheduling
- Calculates overtime pay rates (1.5x/3x based on LPA Sec 61)
- Calculates severance pay (Sec 118: 30 days per year of service, up to 400 days)
- Tracks probation periods (max 119 days for LPA Sec 118 exemption)
- Enforces termination notice periods (Sec 17: advance notice required)
- Auto-calculates Social Security contributions (5% employer, 5% employee)

**Business Analyst view:**
| Pros | Cons |
|------|------|
| ✅ Full HR compliance — major selling point | ❌ **Massive scope expansion** — essentially building payroll |
| ✅ Differentiator vs competitors | ❌ 4-6 weeks additional development |
| ✅ Companies trust the platform to keep them compliant | ❌ **Duplicates Co-Work.cloud ERP** payroll module |
| | ❌ Platform becomes liable for calculation accuracy |
| | ❌ LPA amendments require immediate platform updates |
| | ❌ Need certified accountant/lawyer to verify calculations |

**Lead Engineer view:**
| Pros | Cons |
|------|------|
| ✅ Comprehensive HR module | ❌ Build time: 4-6 weeks (complex calculations) |
| | ❌ Need extensive test cases for edge cases (partial months, mid-year hires, hourly vs salaried) |
| | ❌ Ongoing maintenance: LPA updates, minimum wage changes by province |
| | ❌ Need separate calculation engine — cannot be hardcoded |

**Senior Lawyer view:**
| Pros | Cons |
|------|------|
| ✅ Fully compliant — defensible in labor court | ❌ **Platform assumes liability** for calculation errors |
| ✅ Strong legal positioning | ❌ Need legal review of every calculation formula |
| | ❌ If Thai government changes LPA (they did in 2019, 2023), platform must update immediately or face liability |
| | ❌ Cross-border: different countries have completely different labor laws |

---

### Option C: Defer Entirely to ERP

**How it works:**
- Platform tracks raw shift data only (clock-in, clock-out, leave records)
- All compliance, calculations, and enforcement handled by Co-Work.cloud ERP or external HR system
- Add disclaimer: "This platform records attendance data only. Employers are responsible for ensuring LPA compliance."

**Business Analyst view:**
| Pros | Cons |
|------|------|
| ✅ Zero additional development | ❌ Platform appears unaware of Thai labor law |
| ✅ No compliance liability | ❌ Misses opportunity to add value |
| ✅ Clear separation of concerns | ❌ Companies without ERP get zero guidance |

> [!IMPORTANT]
> **My recommendation: Option A (Alerts & Validation Only).**
> This is the sweet spot — shows LPA awareness, protects the platform legally (via warnings + disclaimers), costs only ~3 days to build, and doesn't duplicate Co-Work.cloud ERP payroll. Full statutory calculations (Option B) are ERP scope and create liability. Option C is too passive for a platform that already tracks shifts and leave.

---

## Summary of Recommendations

| Decision | Recommended | Rationale |
|----------|-------------|-----------|
| **Q1: Lead → Project** | **Option A: Remove Project, convert to PO** | B2B CRM flow, zero new models, 2-day build |
| **Q2: i18n Naming** | **Option A: Fix now** | Zero cost at spec stage; expensive later |
| **Q3: LPA Depth** | **Option A: Alerts & validation only** | Shows awareness, ~3 days, no liability |

> Please review and let me know your choices for all 3 decisions. Once decided, I'll begin fixing all 57 issues systematically.
