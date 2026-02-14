## Workflow

When a prompt asks to add a feature, fix a bug, or add tests:

1. Review the relevant files and ensure full understanding
2. For non-trivial tasks, write a plan in `plan.md` before changing code
3. Break the plan into small, verifiable steps
4. Ask clarifying questions to remove ambiguities
5. Share the plan and wait for user approval before implementation
6. Use git convention naming for branches (e.g., `feat/add-export`, `fix/login-error`)
7. Never commit `plan.md` to the repository
8. Once done with a task implementation, run the typecheck command to ensure no type errors: `npm run typecheck:all`
9. Make sure to clean up the unused imports, variables, and code and leave no tech debts behind when the task is done.

**Tech Stack:** React 18, TypeScript, Vite, TanStack Query, Tailwind CSS, shadcn/ui

---

## Quick Reference

- **Add API endpoint**: `src/services/api.ts` ([architecture](docs/agents/architecture.md))
- **Add query hook**: `src/hooks/queries/useXxx.ts` ([state-management](docs/agents/state-management.md))
- **Add mutation hook**: `src/hooks/mutations/useXxx.ts` ([state-management](docs/agents/state-management.md))
- **Add query keys**: `src/lib/query-keys.ts` ([architecture](docs/agents/architecture.md))
- **Add type**: `src/types/index.ts` ([coding-conventions](docs/agents/coding-conventions.md))
- **Add page**: `src/pages/Xxx.tsx` + `src/App.tsx` ([adding-features](docs/agents/adding-features.md))
- **Add form**: Use React Hook Form + Zod ([form-handling](docs/agents/form-handling.md))
- **Write tests**: `{file}.test.ts(x)` ([testing](docs/agents/testing.md))

---

## Essential Rules

### Server State (API Data)

**Always use TanStack Query.** Never use `useState` + `useEffect` for API data.

```typescript
// ✅ Correct
const { data, isLoading } = useTransactions();

// ❌ Wrong
const [data, setData] = useState([]);
useEffect(() => {
  fetch().then(setData);
}, []);
```

### Forms

**Always use React Hook Form + Zod.** No exceptions.

```typescript
const form = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

### Styling

**Always include dark mode.** Use Tailwind utility classes.

```typescript
// ✅ Correct
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">

// ❌ Wrong
<div className="bg-white text-black">
```

### API Calls

**Always use service layer.** Never call axios directly in components.

```typescript
// ✅ Correct - in src/services/api.ts
export const transactionsService = {
  getAll: () => apiClient.get("/transactions"),
};

// ❌ Wrong - in component
axios.get("/api/transactions");
```

### Component Size & Structure

**Max 100 lines per component `.tsx` file.** Applies to new components and existing ones when modified. If a component exceeds 100 lines, decompose it.

**Decomposition pattern:** Split into a **smart component** (business logic, hooks, state) and **UI component(s)** (presentation only).

**Folder structure:** Each component lives in a folder named after itself, with an `index.ts` barrel file using **named exports**.

**React imports:** Always import `FC` type explicitly when using it. Never use `React.FC` without importing React.

```typescript
// ✅ Correct
import { type FC } from "react";
export const MyComponent: FC<MyComponentProps> = ({ ... }) => { ... };

// ❌ Wrong
export const MyComponent: React.FC<MyComponentProps> = ({ ... }) => { ... };
```

```
TransactionForm/
├── index.ts                        # barrel file: export { TransactionForm } from './TransactionForm'
├── TransactionForm.tsx             # smart component (logic + composition)
├── TransactionForm.types.ts        # types/interfaces
├── TransactionForm.utils.ts        # helper functions
├── TransactionForm.styles.tsx      # styled sub-components or style helpers
├── TransactionForm.test.tsx        # tests
└── AmountField/                    # sub-component in its own nested folder
    ├── index.ts
    ├── AmountField.tsx
    └── AmountField.types.ts
```

**Rules:**

- The 100-line limit applies to `.tsx` component files only (types, utils, styles can be longer)
- Sub-components follow the same folder structure recursively
- Use named exports everywhere (no default exports)
- Companion files (`*.types.ts`, `*.utils.ts`, `*.styles.tsx`, `*.test.tsx`) are optional — create only when needed
- **Props types live in the component file**, not in a shared `*.types.ts`. Use `type` (not `interface`) for props. Shared types (schemas, data types used across files) stay in `*.types.ts`.

```typescript
// ✅ Correct
TransactionForm / TransactionForm.tsx; // 85 lines — smart component
TransactionFormUI.tsx; // 90 lines — presentational
index.ts; // named exports

// ❌ Wrong
TransactionForm.tsx; // 250 lines — everything in one file
```

---

## Documentation Index

- **App overview & tech stack**: [overview.md](docs/agents/overview.md) - Understanding the project
- **Project structure**: [architecture.md](docs/agents/architecture.md) - Finding where code belongs
- **Error / Exception Tracking**: [error-exception-tracking.md](docs/agents/error-exception-tracking.md) - Handling errors and exceptions
- **Adding features workflow**: [adding-features.md](docs/agents/adding-features.md) - Implementing new features
- **Code style & naming**: [coding-conventions.md](docs/agents/coding-conventions.md) - Writing consistent code
- **What NOT to do**: [anti-patterns.md](docs/agents/anti-patterns.md) - Avoiding common mistakes
- **Domain entities**: [business-knowledge.md](docs/agents/business-knowledge.md) - Understanding business logic
- **State management**: [state-management.md](docs/agents/state-management.md) - Managing data and UI state
- **Form handling**: [form-handling.md](docs/agents/form-handling.md) - Building forms
- **Testing**: [testing.md](docs/agents/testing.md) - Writing tests
- **Performance**: [performance.md](docs/agents/performance.md) - Optimizing code
- **Deployment**: [deployment.md](docs/agents/deployment.md) - Building and deploying

---

## Page Starting Points

- **Dashboard**: `src/pages/Dashboard.tsx`
- **Transactions**: `src/pages/Transactions.tsx`
- **Categories**: `src/pages/Categories.tsx`
- **Recurring transactions**: `src/pages/RecurringTransactions.tsx`
- **Reports**: `src/pages/Reports.tsx`
- **Navigation menu**: `src/pages/More.tsx`

---

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run typecheck  # Check TypeScript
npm run test       # Run tests
npm run format.fix # Format code
```

---

## Pre-Commit Checklist

- [ ] `npm run typecheck` - no errors
- [ ] `npm run test` - all pass
