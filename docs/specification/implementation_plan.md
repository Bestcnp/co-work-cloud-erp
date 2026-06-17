# Implementation Plan: Top 5 Trending + ERP Manufacturing (Revised)

> **Date:** 2026-06-16 (Revised after user answers)

---

## Summary of Decisions

### Requirement 1: Top 5 Trending
| Question | Answer |
|----------|--------|
| Categories | Per **leaf-level category** (e.g., "Beer" under Beverages > Alcoholic) |
| Who picks | Any logged-in user — from ALL platform products (voting/endorsement) |
| Scope | Per-user (personal picks) |
| Display | Platform-wide aggregated trending page |
| Self-voting | ✅ Yes (can vote for own products) |
| Change frequency | Once per month per category |
| Point persistence | Accumulate forever, change when user updates |
| Internal products | ❌ Excluded |

### Requirement 2: ERP
| Question | Answer |
|----------|--------|
| Separate domain | ❌ No — stick with Co-Work.cloud |
| Manufacturing | ✅ SuperAdmin-exclusive feature on Co-Work.cloud |
| ERP connection | One ERP per company |
| Manufacturing scope | Plastic factory — user will customize later |

---

## Proposed Changes

### Feature 1: Product Top 5 Trending System

#### [NEW] Module H — "Product & Service Top 5 Trending System" (insert after Advertising System, ~L4342)

New section with:
- **UserCategoryRanking** model — stores one user's Top 5 picks in one leaf-level category
- **ProductTrendScore** model — aggregated platform-wide score per product per category
- Business rules: monthly change lock, internal/private product exclusion, regulated product visibility rules
- Trending board display rules
- Anti-gaming note (one vote per user per category, monthly lock)

#### [MODIFY] Executive Summary — "How It Works" paragraph (~L46)
Add mention of community-driven trending

#### [MODIFY] "What Makes This Platform Unique" (~L140-160)
Add item #11: Community-driven product trending

#### [MODIFY] Integration Chains (~L129-136)
Add: **Trending cycle**

#### [MODIFY] §16.6 Reports (~L5388)
Add trending-related reports to Products & Showcase category

#### [MODIFY] Permissions (~L2719 area)
Add: `product.trending_vote` permission

#### [MODIFY] Notifications (~L1900 area)
Add: `TRENDING_RANK_CHANGED` event

#### [MODIFY] Completeness Checklist (~L6500 area)
Add trending item

#### [MODIFY] Build Order (~L6640 area)
Add trending to Module H phase

---

### Feature 2: Co-Work.cloud SuperAdmin-Exclusive Features

#### [MODIFY] Platform Overview (~L289-296)
Add note that Co-Work.cloud has SuperAdmin-exclusive modules (manufacturing)

#### [MODIFY] Module B ERP API (~L1559)
Add `erpConnectionTarget` field (enum: 'CO_WORK_CLOUD' / 'EXTERNAL') and `erpExclusiveModules[]` field (SuperAdmin-gated feature list)

#### [NEW] Module B — "Co-Work.cloud SuperAdmin-Exclusive Modules" (insert after ERP Sync section, ~L1712)
Brief section listing manufacturing as a future SuperAdmin-exclusive module, with placeholder model

#### [MODIFY] Executive Summary (~L60)
Mention SuperAdmin-exclusive ERP features

#### [MODIFY] Scale and Build Plan (~L205-211)
Update "Two platforms" note to mention exclusive features

---

## No Changes Needed

| Section | Why |
|---------|-----|
| Module Q (Procurement) | SO/PO flow is the same regardless |
| §3.7 (Expense) | Expense tracking is Cloudfull-only |
| Module S (Campaigns) | Independent of ERP and trending |
| §1.6 Financial Precision | Applies to all calculations already |
| Legal Compliance Framework | No new legal concerns (trending is voluntary) |
| Security Architecture | No new security zones needed |

---

> [!IMPORTANT]
> **Shall I proceed with implementing all changes above?**
