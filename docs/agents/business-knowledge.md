# Business Knowledge

This document describes the domain entities and business logic in Expensio.

---

## Core Entities

### Transaction

A single financial record (income or expense).

| Field | Type | Description |
| ------- | ------ | ------------- |
| id | string | Unique identifier |
| title | string | Description of the transaction |
| amount | number | Always positive (type determines income/expense) |
| type | 'INCOME' \| 'EXPENSE' | Transaction classification |
| categoryId | string | Reference to Category |
| date | Date | When the transaction occurred |
| createdAt | Date | Record creation timestamp |
| updatedAt | Date | Last modification timestamp |

**Key rules:**
- Amount is always stored as a positive number
- `type` field determines if it's income or expense
- `userId` is derived from JWT token by backend - never sent from frontend

### Category

Organizes transactions into groups.

| Field | Type | Description |
| ------- | ------ | ------------- |
| id | string | Unique identifier |
| name | string | Category display name |
| type | 'INCOME' \| 'EXPENSE' | What type of transactions it's for |
| color | string | Hex color for UI display |
| icon | string (optional) | Icon identifier |

**Key rules:**
- Categories are type-specific (Food is EXPENSE, Salary is INCOME)
- Users can create custom categories
- Deleting a category requires handling orphaned transactions

### Recurring Transaction

Automated transactions on a schedule.

| Field | Type | Description |
| ------- | ------ | ------------- |
| id | string | Unique identifier |
| title | string | Description |
| amount | number | Transaction amount |
| type | 'INCOME' \| 'EXPENSE' | Transaction type |
| categoryId | string | Reference to Category |
| frequency | 'DAILY' \| 'WEEKLY' \| 'MONTHLY' \| 'YEARLY' | How often it repeats |
| startDate | Date | When the schedule starts |
| endDate | Date (optional) | When the schedule ends |
| nextOccurrence | Date | Next scheduled execution |
| isActive | boolean | Whether it's currently active |

**Key rules:**
- Recurring transactions create actual Transaction records automatically
- `nextOccurrence` is calculated by the backend
- Inactive recurring transactions don't generate new transactions

---

## Quick Expense Modal

Location: `src/components/ui/quick-expense-modal.tsx`

Provides fast expense entry for common categories.

### Predefined Categories

| Category | Icon | Color | Behavior |
| ---------- | ------ | ------- | ---------- |
| Food | UtensilsCrossed | #f97316 (orange) | Creates EXPENSE category if missing |
| Health | HeartPulse | #ef4444 (red) | Creates EXPENSE category if missing |
| Household | Home | #3b82f6 (blue) | Creates EXPENSE category if missing |

### Behavior
1. User taps FAB (floating action button)
2. Modal opens with category selection
3. User selects category and enters amount
4. If category doesn't exist → modal creates it first
5. Transaction created with auto-generated title: "{Category} expense"
6. Amount input accepts both comma (1234,56) and period (1234.56) as decimal separator

---

## Dashboard Calculations

Location: `src/pages/Dashboard.tsx`

### Current Balance
```text
Current Balance = Total Income (all time) - Total Expenses (all time)
```

### Monthly Summary
```text
Monthly Income = Sum of INCOME transactions in current month
Monthly Expenses = Sum of EXPENSE transactions in current month
Monthly Savings = Monthly Income - Monthly Expenses
```

### Category Breakdown
- Top 5 categories by spending amount
- Remaining categories grouped as "Others"
- Displayed as percentage of total expenses

**Note:** Category breakdown is calculated client-side from transaction data.

---

## Authentication Flow

### Login Process
1. User submits email/password to `/auth/login`
2. Backend validates credentials, returns JWT token
3. Frontend stores token in localStorage via AuthContext
4. Token added to all API requests via Axios interceptor
5. User redirected to Dashboard

### Token Handling
- **Storage:** localStorage (via AuthContext)
- **Header:** `Authorization: Bearer {token}`
- **Expiry handling:** On 401 response, token cleared, redirect to login
- **Logout:** Token removed, user redirected to login

### Protected Routes
Routes that require authentication are wrapped with `<ProtectedRoute>`:
- `/dashboard`
- `/transactions`
- `/categories`
- `/recurring-transactions`
- `/reports`
- `/profile`
- `/more`

### Public Routes
- `/` (Landing page)
- `/login`
- `/register`

---

## Amount Handling

Location: `src/lib/amount-utils.ts`

### Input Normalization
The app supports both decimal formats:
- US format: 1,234.56 (comma as thousand separator, period as decimal)
- European format: 1.234,56 (period as thousand separator, comma as decimal)

```typescript
// Before sending to API
normalizeAmount("1234,56") → "1234.56"
normalizeAmount("1234.56") → "1234.56"
```

### Validation Rules
- Amount must be positive
- Maximum: 999,999,999.99
- Minimum: 0.01

---

## Entity Relationships

```text
User (from JWT)
  │
  ├── has many → Categories
  │                 │
  │                 └── has many → Transactions
  │
  └── has many → Recurring Transactions
                    │
                    └── generates → Transactions
```

---

## Cache Invalidation Rules

When data changes, related caches must be invalidated:

| After | Invalidate |
| ------- | ------------ |
| Create/Update/Delete Transaction | `transactions.all`, `dashboard.all`, `reports.all` |
| Create/Update/Delete Category | `categories.all`, `transactions.all` |
| Create/Update/Delete Recurring Transaction | `recurringTransactions.all` |

Implemented in mutation hooks via `queryClient.invalidateQueries()`.
