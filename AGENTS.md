# Expensio Frontend - Agent Guide

**Tech Stack:** React 18, TypeScript, Vite, TanStack Query, Tailwind CSS, shadcn/ui

---

## Quick Reference

| Task | Primary File(s) | Documentation |
|------|-----------------|---------------|
| Add API endpoint | `src/services/api.ts` | [architecture](docs/agents/architecture.md) |
| Add query hook | `src/hooks/queries/useXxx.ts` | [state-management](docs/agents/state-management.md) |
| Add mutation hook | `src/hooks/mutations/useXxx.ts` | [state-management](docs/agents/state-management.md) |
| Add query keys | `src/lib/query-keys.ts` | [architecture](docs/agents/architecture.md) |
| Add type | `src/types/index.ts` | [coding-conventions](docs/agents/coding-conventions.md) |
| Add page | `src/pages/Xxx.tsx` + `src/App.tsx` | [adding-features](docs/agents/adding-features.md) |
| Add form | Use React Hook Form + Zod | [form-handling](docs/agents/form-handling.md) |
| Write tests | `{file}.test.ts(x)` | [testing](docs/agents/testing.md) |

---

## Essential Rules

### Server State (API Data)
**Always use TanStack Query.** Never use `useState` + `useEffect` for API data.

```typescript
// ✅ Correct
const { data, isLoading } = useTransactions();

// ❌ Wrong
const [data, setData] = useState([]);
useEffect(() => { fetch().then(setData); }, []);
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
  getAll: () => apiClient.get('/transactions'),
};

// ❌ Wrong - in component
axios.get('/api/transactions');
```

---

## Documentation Index

| Topic | File | When to Read |
|-------|------|--------------|
| App overview & tech stack | [overview.md](docs/agents/overview.md) | Understanding the project |
| Project structure | [architecture.md](docs/agents/architecture.md) | Finding where code belongs |
| Adding features workflow | [adding-features.md](docs/agents/adding-features.md) | Implementing new features |
| Code style & naming | [coding-conventions.md](docs/agents/coding-conventions.md) | Writing consistent code |
| What NOT to do | [anti-patterns.md](docs/agents/anti-patterns.md) | Avoiding common mistakes |
| Domain entities | [business-knowledge.md](docs/agents/business-knowledge.md) | Understanding business logic |
| State management | [state-management.md](docs/agents/state-management.md) | Managing data and UI state |
| Form handling | [form-handling.md](docs/agents/form-handling.md) | Building forms |
| Testing | [testing.md](docs/agents/testing.md) | Writing tests |
| Performance | [performance.md](docs/agents/performance.md) | Optimizing code |
| Deployment | [deployment.md](docs/agents/deployment.md) | Building and deploying |

---

## Page Starting Points

| Feature | Read First |
|---------|------------|
| Dashboard | `src/pages/Dashboard.tsx` |
| Transactions | `src/pages/Transactions.tsx` |
| Categories | `src/pages/Categories.tsx` |
| Recurring transactions | `src/pages/RecurringTransactions.tsx` |
| Reports | `src/pages/Reports.tsx` |
| Navigation menu | `src/pages/More.tsx` |

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
- [ ] Tested on mobile (< 768px)
- [ ] Tested dark mode
- [ ] No console errors
