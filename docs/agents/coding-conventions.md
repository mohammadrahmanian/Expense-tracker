# Coding Conventions

---

## File Naming

| Type       | Convention                  | Example                   |
| ---------- | --------------------------- | ------------------------- |
| Components | PascalCase                  | `TransactionForm.tsx`     |
| Pages      | PascalCase                  | `Dashboard.tsx`           |
| Hooks      | camelCase with `use` prefix | `useTransactions.ts`      |
| Utilities  | kebab-case                  | `amount-utils.ts`         |
| Types      | PascalCase in `index.ts`    | `Transaction`, `Category` |

---

## TypeScript Conventions

### Naming

| Type                | Convention                      | Example                        |
| ------------------- | ------------------------------- | ------------------------------ |
| Interfaces          | PascalCase, no prefix           | `TransactionFormProps`         |
| Context types       | `*ContextValue` suffix          | `AuthContextValue`             |
| Union types         | `*Type` suffix                  | `TransactionType`              |
| Constants           | UPPER_SNAKE_CASE                | `MAX_AMOUNT`, `API_TIMEOUT`    |
| Variables/functions | camelCase                       | `handleSubmit`, `formatAmount` |
| Booleans            | `is*`, `has*`, `should*` prefix | `isLoading`, `hasError`        |

### Strict Typing Rules

```typescript
// ✅ DO: Explicit types for function parameters and returns
function calculateTotal(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}

// ❌ DON'T: Use 'any'
function processData(data: any) {
  /* bad */
}

// ✅ DO: Use 'unknown' when type is truly unknown
function processData(data: unknown) {
  if (isTransaction(data)) {
    // Now TypeScript knows data is Transaction
  }
}

// ❌ DON'T: Use @ts-ignore
// @ts-ignore
someFunction(invalidArg);

// ✅ DO: Fix the type error
someFunction(validArg as ExpectedType);
```

---

## Component Conventions

### Structure

```typescript
// 1. Imports (React first, then third-party, then internal)
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import type { Transaction } from '@/types';

// 2. Types/Interfaces
interface TransactionListProps {
  categoryId?: string;
  onSelect: (transaction: Transaction) => void;
}

// 3. Component
export default function TransactionList({ categoryId, onSelect }: TransactionListProps) {
  // 3a. Hooks first
  const { data, isLoading, error } = useTransactions();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 3b. Early returns for loading/error states
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  // 3c. Event handlers
  const handleClick = (transaction: Transaction) => {
    setSelectedId(transaction.id);
    onSelect(transaction);
  };

  // 3d. Render
  return (
    <div className="space-y-2">
      {data?.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onClick={() => handleClick(transaction)}
        />
      ))}
    </div>
  );
}
```

### Export Rules

- **Pages:** `export default`
- **Reusable components:** Named export
- **Hooks:** Named export

---

## Event Handler Naming

| Location          | Prefix    | Example                           |
| ----------------- | --------- | --------------------------------- |
| Props             | `on*`     | `onClick`, `onSubmit`, `onChange` |
| Internal handlers | `handle*` | `handleClick`, `handleSubmit`     |

```typescript
interface ButtonProps {
  onClick: () => void;  // Prop uses 'on'
}

function Button({ onClick }: ButtonProps) {
  const handleClick = () => {  // Internal uses 'handle'
    // Do something
    onClick();
  };
  return <button onClick={handleClick}>Click</button>;
}
```

---

## Import Organization

Order imports in this sequence:

```typescript
// 1. React
import React, { useState, useEffect } from "react";

// 2. Third-party libraries
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// 3. Internal modules (using @/ alias)
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { transactionsService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";

// 4. Types (if importing separately)
import type { Transaction, Category } from "@/types";
```

---

## Styling with Tailwind CSS

### Mobile-First Approach

```typescript
// Base styles for mobile, then responsive overrides
<div className="p-2 md:p-4 lg:p-6">
  <h1 className="text-lg md:text-xl lg:text-2xl">Title</h1>
</div>
```

### Dark Mode Support (Required)

```typescript
// ✅ Always include dark mode variants
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content
</div>

// ❌ Never hardcode light-only colors
<div className="bg-white text-black">
  Content
</div>
```

### Breakpoints Reference

| Breakpoint | Min Width | Usage                            |
| ---------- | --------- | -------------------------------- |
| `sm:`      | 640px     | Small tablets                    |
| `md:`      | 768px     | Tablets, switches to desktop nav |
| `lg:`      | 1024px    | Desktop                          |
| `xl:`      | 1280px    | Large desktop                    |

### Class Merging

Use `cn()` utility from `src/lib/utils.ts` for conditional classes:

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  'p-4 rounded-lg',
  isActive && 'bg-primary text-white',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}>
  Content
</div>
```

---

## Comments

### When to Comment

- Explain **why**, not **what**
- Document non-obvious business logic
- Add JSDoc for exported functions

### Examples

```typescript
// ❌ Bad - explains what (obvious from code)
// Set loading to true
setLoading(true);

// ✅ Good - explains why
// Disable form during mutation to prevent double-submission
setIsSubmitting(true);

// ✅ Good - JSDoc for public API
/**
 * Normalizes amount input by replacing comma with period.
 * Supports European (1.234,56) and US (1,234.56) formats.
 */
export function normalizeAmount(value: string): string {
  return value.replace(",", ".");
}
```

### What NOT to Comment

- Don't use TODO comments without issue numbers
- Don't leave commented-out code (use git history)
- Don't add obvious comments
