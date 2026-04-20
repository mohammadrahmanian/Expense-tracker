# QuickExpenseModal — Agent Context

Token-efficient summary. Read this before editing anything in `src/components/transactions/QuickExpenseModal/`. Only open source files when you need details beyond what's here.

## Purpose

Modal dialog that lets the user create **one** transaction (Expense **or** Income) with a category quick-pick, amount, optional description/date/recurrence/notes.

## Entry point

- `QuickExpenseModal.tsx` — smart component. Props: `{ isOpen: boolean; onClose: () => void }`.
- Exported via `src/components/transactions/QuickExpenseModal/index.ts`.

## Folder layout

```
QuickExpenseModal/
├── QuickExpenseModal.tsx             # smart container: dialog shell, tabs, form, submit
├── QuickExpenseModal.types.ts        # Zod schema + fixed category lists
├── QuickExpenseModal.utils.ts        # createQuickExpenseSubmitHandler (pure)
├── QuickCategorySelect/
│   ├── QuickCategorySelect.tsx       # expense grid + "Other" -> Select of remaining API categories
│   └── QuickIncomeCategorySelect.tsx # income grid + "Other" -> Select of remaining API categories
└── QuickExpenseFields/
    ├── QuickExpenseFields.tsx        # amount, description, date chip, recurrence, "More options"
    ├── QuickDateChip.tsx             # date picker chip
    └── MoreOptionsSection.tsx        # notes textarea (collapsible)
```

## State & data flow

- **Form**: `react-hook-form` + `zodResolver(quickExpenseSchema)`. All fields live in the form; no parallel `useState` for form values.
- **Tab state**: local `transactionKind: "expense" | "income"` in the smart component. Switching tabs:
  - clears `categoryName` (without firing validation) and clears its error;
  - remounts the category picker via `key={transactionKind}` so picker-local UI (e.g. "Other" expanded) resets.
- **Categories**: fetched via `useCategories("EXPENSE")` and `useCategories("INCOME")` (TanStack Query); results are named `apiExpenseCategories` / `apiIncomeCategories` in the modal to avoid clashing with the fixed quick-pick exports. The picker grid is driven by the **fixed** `expenseCategories` / `incomeCategories` lists in `QuickExpenseModal.types.ts` — API categories only appear in the "Other" dropdown.
- **Close**: `handleClose` resets form, resets tab to `"expense"`, then calls `onClose`.

## Zod schema (`quickExpenseSchema`)

| Field                 | Type                                        | Rules                                             |
| --------------------- | ------------------------------------------- | ------------------------------------------------- |
| `transactionName`     | `string?`                                   | optional; empty ⇒ auto-title on submit            |
| `amount`              | `string`                                    | required; matches `^\d+([,.]\d+)?$`; must be `> 0` |
| `categoryName`        | `string`                                    | required                                           |
| `date`                | `Date`                                      | required                                           |
| `notes`               | `string?`                                   | optional                                           |
| `isRecurring`         | `boolean`                                   | default `false`                                    |
| `recurrenceFrequency` | `"DAILY" \| "WEEKLY" \| "MONTHLY" \| "YEARLY"?` | set to `MONTHLY` when toggling recurring on      |

Type alias: `QuickExpenseFormData = z.infer<typeof quickExpenseSchema>`.

## Submit handler (`createQuickExpenseSubmitHandler`)

Pure factory in `QuickExpenseModal.utils.ts`. Deps: `{ categories, transactionType, createCategoryAsync, createTransaction, onSuccess }`.

Flow:
1. Parse `amount` via `normalizeAmount` (`,` → `.`) then `parseFloat`.
2. Find category by **case-insensitive** name match in `categories`.
3. If not found, create it via `createCategoryAsync` (`useCreateCategory`’s `mutateAsync`):
   - EXPENSE: use color from the matching `expenseCategories` entry (`expenseCategories.find((c) => c.name === data.categoryName)?.color` in `QuickExpenseModal.utils.ts`); if none, `INCOME_NEW_CATEGORY_FALLBACK_COLOR` (`"#6366f1"`).
   - INCOME: use color from the matching `incomeCategories` entry (`incomeCategories.find((c) => c.name === data.categoryName)?.color` in `QuickExpenseModal.utils.ts`); if none, `INCOME_NEW_CATEGORY_FALLBACK_COLOR` (`"#6366f1"`).
4. Title = `transactionName.trim()` or `"{categoryName} expense|income"`.
5. Call `createTransaction({ ... }, { onSuccess })` — only after a category exists (found or created).

### Category creation failure

Applies when the chosen name has **no** matching API category and **`createCategoryAsync`** rejects (network, validation, server error, etc.).

| What happens | Behavior |
| ------------ | -------- |
| **User-facing** | A single Sonner error toast: **“Category creation failed. Try again!”** (from `QuickExpenseModal.utils.ts`). |
| **Duplicate toasts** | `QuickExpenseModal` uses `useCreateCategory({ showErrorToast: false })`, so the mutation’s `handleApiError` path does **not** show its usual error toast; only the submit handler’s message appears. |
| **Logging** | The mutation’s `onError` still runs `handleApiError` with `showToast: false` — errors are **logged** (Sentry logger) with category context; `reportToSentry` remains `false` here (same as other category mutations). |
| **Transaction** | **Not** created — handler returns after the `catch`; `createTransaction` is never called. |
| **Modal & form** | Modal **stays open** (`onSuccess` / `handleClose` not run). Form values are **unchanged** so the user can fix input and retry. |
| **Success toast** | “Category created successfully” does **not** run on failure (mutation `onSuccess` is skipped). |

## UI notes

- Uses `ResponsiveDialog` (mobile bottom sheet, desktop centered modal).
- Header uses the `Segment` control (expense/income tabs).
- Submit button disables when: mutation pending, categories loading, **or** income tab with zero income categories.
- Currency symbol comes from `useCurrency()` + `currencySymbols`.
- "More options" section is a `Collapsible` revealing `MoreOptionsSection` (notes).

## Mutations used

- `useCreateCategory({ showErrorToast: false })` — only when the chosen category name doesn’t exist in the fetched list; see **Category creation failure** above.
- `useCreateTransaction()` — runs only after category resolution succeeds (existing or newly created).
- `isPending` is the OR of both mutations' `isPending`.

## Common edit recipes

- **New form field** → add to `quickExpenseSchema`, extend `defaultValues` in `QuickExpenseModal.tsx`, render in `QuickExpenseFields.tsx`, pass through to `createTransaction` payload in `QuickExpenseModal.utils.ts`.
- **New quick category** → add to `expenseCategories` / `incomeCategories` in `QuickExpenseModal.types.ts` (icon from `lucide-react`, color for expense only).
- **Change submit behavior** → edit `createQuickExpenseSubmitHandler` only; keep `QuickExpenseModal.tsx` declarative.
- **Don't** move form state out of RHF, don't add a second source of truth for `categoryName`, don't fetch categories inside child components.
