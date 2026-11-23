# MobileTransactionRow — Agent Context

Token-efficient summary. Read this before editing anything in `src/components/transactions/mobile/MobileTransactionRow/`. Only open source files when you need details beyond what's here.

## Purpose

One transaction row in the mobile transactions list. The user swipes the row from right to left to show two action buttons: **Edit** and **Delete**. A tap on the row does **not** open the edit dialog.

## Entry point

- `MobileTransactionRow.tsx` — smart component. Props:
  `{ transaction: Transaction; category: Category; formatAmount: (amount: number) => string; isOpen: boolean; onOpenChange: (open: boolean) => void; onEdit: (transaction: Transaction) => void; onDelete: (id: string) => void }`.
- Exported via `src/components/transactions/mobile/MobileTransactionRow/index.ts`.
- Rendered by `MobileTransactionGroup` (one per transaction in a date group).

## Folder layout

```text
MobileTransactionRow/
├── index.ts                           # barrel: export { MobileTransactionRow }
├── MobileTransactionRow.tsx           # smart: uses useSwipeReveal, renders actions layer + draggable content
├── MobileTransactionRow.utils.ts      # SWIPE_ACTIONS_WIDTH (160px) + getCategoryIcon (category name -> lucide icon)
├── MobileTransactionRow.test.tsx      # Edit/Delete call handlers; content tap does not edit; tap closes open row; focus opens row
├── useSwipeReveal.ts                  # framer-motion drag + snap logic, tap-vs-drag guard, close()
├── MobileTransactionRowContent/
│   └── MobileTransactionRowContent.tsx # UI: icon, title, category, signed amount (a div, not a button)
└── MobileTransactionRowActions/
    └── MobileTransactionRowActions.tsx # UI: Edit (Pencil) + Delete (Trash2) buttons, absolute right, two w-20 buttons
```

## State & data flow

- **Open state is controlled.** The row does not own `isOpen`. `MobileTransactionList` (in `MobileTransactionsView/MobileTransactionList/`) holds `openRowId: string | null` and `handleRowOpenChange(id, open)`. `MobileTransactionGroup` gets `openRowId` + `onRowOpenChange` and passes `isOpen={openRowId === tx.id}` and `onOpenChange={(open) => onRowOpenChange(tx.id, open)}` to each row. Result: only one row is open at a time. Opening row B closes row A.
- **Delete chain:** `Transactions.tsx` (`onDelete={handleDelete}`) → `MobileTransactionsView` → `MobileTransactionList` → `MobileTransactionGroup` → `MobileTransactionRow`. `handleDelete` opens the existing `DeleteTransactionDialog`.
- **Edit chain:** same path with `onEdit`; `handleEdit` opens the existing `TransactionForm` dialog.

## Swipe (`useSwipeReveal`)

- Params: `{ isOpen, onOpenChange }`. Returns `{ motionProps, close }`. `motionProps` is spread on a `motion.div`.
- Motion value `x`; `drag="x"`, `dragConstraints={ left: -SWIPE_ACTIONS_WIDTH, right: 0 }`, `dragElastic: 0.1`, `dragDirectionLock`, `dragMomentum: false`.
- **Snap on drag end:** open if velocity `< -400 px/s`; else open if velocity `<= 400` and `x < -SWIPE_ACTIONS_WIDTH / 2`; else closed. Calls `onOpenChange` only when the result differs from `isOpen`.
- An effect animates `x` (spring) when `isOpen` changes from outside (another row opened, focus, `close()`).
- **Tap vs drag:** `onPointerDown` resets a `wasDraggedRef`; `onDragStart` sets it. `onClick` returns early after a drag. A tap on an open row calls `close()`; a tap on a closed row does nothing.
- `close()` animates to `0` and calls `onOpenChange(false)`.
- The content has `touch-pan-y` (CSS `touch-action: pan-y`) so vertical page scroll still works.

## Actions

- Edit: `close()`, then `onEdit(transaction)`.
- Delete: `close()`, then `onDelete(transaction.id)`.
- Buttons have `aria-label` "Edit transaction" / "Delete transaction" and stay keyboard-focusable. `onFocus` calls `onOpenChange(true)` so a focused button is visible.

## UI notes

- Wrapper: `relative overflow-hidden border-b border-border`. Actions sit behind the content; content has `bg-background` so it hides them when closed.
- Colors use design tokens only: income `success-*`, expense `danger-*`, Edit `neutral-*`, Delete `danger-*`, each with `dark:` variants.
- `SWIPE_ACTIONS_WIDTH` (160) must equal the total width of the action buttons (2 × `w-20`).

## Common edit recipes

- **Add a third action** → add a button in `MobileTransactionRowActions.tsx`, add its handler in `MobileTransactionRow.tsx` (call `close()` first), and increase `SWIPE_ACTIONS_WIDTH` to match the new total width.
- **Change swipe feel** → edit `SNAP_VELOCITY`, `SNAP_TRANSITION`, or `dragElastic` in `useSwipeReveal.ts`.
- **New category icon** → add an entry to `CATEGORY_ICON_MAP` in `MobileTransactionRow.utils.ts`.
- **Don't** put `isOpen` state in the row; keep it controlled so only one row is open at a time. Don't make the content a `button` again (tap must not edit).
