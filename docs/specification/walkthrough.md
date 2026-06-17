# Walkthrough: Top 5 Trending + ERP Manufacturing + QA Fixes

**Date:** 2026-06-17
**Spec:** 6,955 → 7,094 lines (+139 lines across 2 sessions)

---

## Session 1: Feature Implementation (+125 lines)

### Feature 1: Product & Service Top 5 Trending System
Community-driven product endorsement. Users rank Top 5 per leaf-level category. Points aggregated platform-wide.

| # | Section | Change |
|---|---------|--------|
| 1 | Module H (~L4384) | **[NEW]** Full trending section — UserCategoryRanking + ProductTrendScore models, 9 business rules, anti-gaming |
| 2 | Executive Summary (L40) | Added trending mention |
| 3 | Unique Features (L161) | Added item #11 |
| 4 | Integration Chains (L137) | Added trending cycle |
| 5 | §16.6 Reports (L5384) | Added trending metrics |
| 6 | Permissions (L2675) | Added `product.trending_vote` |
| 7 | Notifications (L1946) | Added `TRENDING_RANK_CHANGED` |
| 8 | Completeness Checklist | Added item #20 |
| 9 | Build Order | Added trending to Phase 8 |

### Feature 2: Co-Work.cloud SuperAdmin-Exclusive Modules
Manufacturing as a feature-flag gated module. No separate domain.

| # | Section | Change |
|---|---------|--------|
| 1 | Module B ERP API (L1566) | Added `erpConnectionTarget` (CO_WORK_CLOUD / EXTERNAL) |
| 2 | Module B (~L1742) | **[NEW]** SuperAdmin-exclusive modules section with manufacturing placeholder |
| 3 | Platform Overview (L299) | Added exclusive modules note |
| 4 | Scale and Build Plan (L211) | Updated |
| 5 | Executive Summary (L60) | Added exclusive mention |
| 6 | Completeness Checklist | Added item #21 |

---

## Session 2: QA Audit Fixes (+14 lines)

### Full Audit Results
- **Module placement:** ✅ No shifts needed. Current Cloudfull ↔ Co-Work.cloud boundary is correct.
- **F2 (Invoice model):** Already existed at L6019-6039. Not a real gap.

### Fixes Applied

| # | Fix | What Changed |
|---|-----|-------------|
| **F1** | Expense → ERP sync | Added `'expense.approved'` + `'expense.updated'` to webhook events (L1702, L1712). Added Expense ERP Sync note to §3.7 (L2540) with full webhook payload spec. |
| **F3** | Event count: "84+" → "83+" | Fixed in §3.5 header (L1870) and description (L1875) |
| **F4** | Permission count: "100+" → "95+" | Fixed in architecture diagram (L84), Module C tip (L2546), permission matrix header (L2594), completeness checklist (L6649) |
| **F5** | Trending in feed category | Added `TRENDING_RANK_CHANGED` to "💬 Sales & Commerce" feed (L2013) |
| **F6** | Attendance → ERP payroll | Added future sync note to Module K (L4999) documenting `'attendance.shift_completed'` and `'attendance.leave_approved'` webhook events for future payroll module |

---

## Verification Summary

| Check | Result |
|-------|--------|
| `expense.approved` mentions | 4 ✅ |
| `83+ event` claims | 2 ✅ (no "84+" remaining) |
| `95+ perm` claims | 3 ✅ (no "100+" remaining) |
| `TRENDING_RANK_CHANGED` | 2 ✅ (event + feed) |
| `attendance.shift_completed` | 2 ✅ (webhook + note) |
| Total lines | 7,094 ✅ |
