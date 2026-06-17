# Cost → ERP Sync Audit: Does Every Cloudfull Cost Flow to Co-Work.cloud?

> **Date:** 2026-06-17

---

## All Cost Types in Cloudfull.com

I found **7 distinct cost types** generated inside Cloudfull. Here's the honest status of each:

| # | Cost Type | Where in Spec | Has ERP Sync? | Verdict |
|---|-----------|--------------|---------------|---------|
| 1 | **§3.7 Expense Receipts** | L2477+ | ✅ YES | `expense.approved` webhook added in last session |
| 2 | **Sample Giveaway Cost** | L4488-4505 | ❌ NO | Cost tracked in Cloudfull but never syncs to ERP |
| 3 | **Equipment Rental Cost** | L4548-4549 | ❌ NO | Cost tracked in Cloudfull but never syncs to ERP |
| 4 | **Sales Fuel Cost** | L3833 | ❌ NO | FuelInput tracked in Cloudfull but never syncs to ERP |
| 5 | **Advertising Cost** | L4390 (costPerDay) | ⚪ N/A | This is PLATFORM revenue (Cloudfull charges companies for ads). Handled by Module O billing — not company cost. |
| 6 | **PO/SO Order Value** | L5900+ | ✅ YES | PO/SO sync already specified in ERP API |
| 7 | **Campaign Cost** | Module S | ⚪ N/A | Campaigns have no direct cost field — they reference products/services. Any campaign spending would be entered via §3.7 Expense. |

---

## The 3 Missing Syncs

### 🔴 Missing 1: Sample Giveaway Cost → ERP

**What happens:** Company gives ฿50,000 worth of product samples to customers this month. Cloudfull tracks:
- `costPerUnit × quantity = totalCost` per sample transaction
- Per-user sample inventory with cost values
- Per-customer sample cost summaries

**The problem:** The ERP never knows about this ฿50,000 expense. In accounting, sample giveaways are either:
- **Marketing expense** (debit: Marketing Expense, credit: Inventory)
- **Cost of Sales** (if classified as promotional cost)

The Thai Revenue Department requires this to be recorded in the accounting books (we even built the Revenue Department paperwork — Requisition Form, Stock Card — but the actual cost journal entry doesn't flow to ERP).

**Recommendation:** Add webhook event `'sample.distributed'` with payload: productId, quantity, costPerUnit, totalCost, contactId, distributionType (GIVE_AWAY/RENT_LOAN), date.

---

### 🔴 Missing 2: Equipment Rental Cost → ERP

**What happens:** Company rents out equipment to employees. There's a cost tracked per rental (costPerUnit × quantity).

**The problem:** Same as samples — the ERP doesn't know about equipment cost allocation.

**Recommendation:** Add webhook event `'equipment.rented'` with payload: productId, quantity, costPerUnit, totalCost, rentedToUserId, startDate, expectedReturnDate.

---

### 🟡 Missing 3: Sales Fuel Cost → ERP

**What happens:** Salespeople log daily fuel costs in Module F (FuelInput model). This is tracked in Cloudfull for sales reporting.

**The problem:** Fuel cost is actually a **subset of §3.7 Expense** — if a salesperson logs fuel as an expense receipt, it syncs via `expense.approved`. But the FuelInput model is a SEPARATE entry (quick daily fuel logging without a receipt photo).

**Recommendation:** Two options:
- **(a)** Add a note that FuelInput is informational only — for accurate ERP accounting, fuel should be entered as an §3.7 expense with a receipt photo (already syncs via `expense.approved`)
- **(b)** Add webhook event `'sales.fuel_logged'` to sync FuelInput data

I recommend **(a)** — FuelInput is a quick estimate for sales reports. Actual accounting should use the receipt-based expense system.

---

## Summary

| Cost Type | Current Sync | Fix Needed? |
|-----------|-------------|-------------|
| Expense receipts | ✅ `expense.approved` webhook | No |
| PO/SO values | ✅ ERP API sync | No |
| Advertising | ⚪ Module O billing (not company cost) | No |
| Campaign | ⚪ Uses §3.7 Expense for cost tracking | No |
| **Sample cost** | ❌ Missing | **Yes — add `sample.distributed` webhook** |
| **Equipment cost** | ❌ Missing | **Yes — add `equipment.rented` webhook** |
| **Fuel cost** | ❌ Missing (but covered by Expense) | **Clarify only — add note that FuelInput is informational; use §3.7 Expense for ERP sync** |

---

> [!IMPORTANT]
> **Shall I implement these 3 fixes?**
> 1. Add `'sample.distributed'` and `'equipment.rented'` to ERP webhook events
> 2. Add sync payload definitions for sample and equipment costs
> 3. Add clarification note for FuelInput → Expense relationship
