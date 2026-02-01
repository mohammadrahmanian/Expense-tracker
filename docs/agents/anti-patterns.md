# Anti-Patterns & Common Mistakes

This file documents patterns that should NOT be used in this codebase.

---

## 1. Direct localStorage Access

**Problem:** No error handling, no type safety, scattered access points.

```typescript
// ❌ WRONG
const token = localStorage.getItem("authToken");
localStorage.setItem("authToken", token);

// ✅ CORRECT - Use AuthContext
import { useAuth } from "@/contexts/AuthContext";
const { user, login, logout } = useAuth();
```

---

## 2. useState + useEffect for API Data

**Problem:** No caching, no background refetching, manual loading/error handling, stale data.

```typescript
// ❌ WRONG - Never do this for API data
const [transactions, setTransactions] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    const result = await transactionsService.getAll();
    setTransactions(result);
    setIsLoading(false);
  };
  fetchData();
}, []);

// ✅ CORRECT - Use TanStack Query
import { useTransactions } from "@/hooks/queries/useTransactions";

const { data: transactions, isLoading, error } = useTransactions();
```

---

## 3. Hardcoded User IDs

**Problem:** Security vulnerability, breaks multi-user support.

```typescript
// ❌ WRONG - Never hardcode user IDs
const transactionData = {
  userId: "1", // SECURITY ISSUE
  title: data.title,
  amount: data.amount,
};

// ✅ CORRECT - Backend derives userId from JWT
const transactionData = {
  title: data.title,
  amount: data.amount,
  // userId is set by backend from authenticated token
};
```

---

## 4. Client-Side Business Logic

**Problem:** Inefficient, inconsistent with backend, potential data discrepancies.

```typescript
// ❌ WRONG - Fetching all data and filtering client-side
const allTransactions = await transactionsService.getAll();
const filtered = allTransactions.filter((t) => t.categoryId === categoryId);

// ✅ CORRECT - Use server-side filtering
const transactions = await transactionsService.getAll({ categoryId });
```

---

## 5. Inline Query Keys

**Problem:** Typos, inconsistent invalidation, hard to refactor.

```typescript
// ❌ WRONG - Inline query keys
useQuery({
  queryKey: ["transactions"],
  queryFn: () => transactionsService.getAll(),
});

queryClient.invalidateQueries({ queryKey: ["transactions"] });

// ✅ CORRECT - Use centralized query keys
import { queryKeys } from "@/lib/query-keys";

useQuery({
  queryKey: queryKeys.transactions.all,
  queryFn: () => transactionsService.getAll(),
});

queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
```

---

## 6. Duplicated Validation Schemas

**Problem:** Inconsistent validation, maintenance burden.

```typescript
// ❌ WRONG - Inline schema in each component
const schema = z.object({
  amount: z.number().positive(),
  title: z.string().min(1),
});

// ✅ CORRECT - Reusable schema (or colocate with form component)
// Define once, import where needed
export const transactionFormSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  title: z.string().min(1, "Title is required"),
});
```

---

## 7. Magic Numbers/Strings

**Problem:** Unclear intent, hard to maintain, scattered values.

```typescript
// ❌ WRONG
const recent = transactions.slice(0, 5); // Why 5?
setTimeout(refetch, 10000); // Why 10 seconds?

// ✅ CORRECT - Use named constants
const DASHBOARD_RECENT_LIMIT = 5;
const REFETCH_INTERVAL_MS = 10000;

const recent = transactions.slice(0, DASHBOARD_RECENT_LIMIT);
setTimeout(refetch, REFETCH_INTERVAL_MS);
```

---

## 8. Missing Dark Mode Support

**Problem:** Broken UI in dark mode, poor user experience.

```typescript
// ❌ WRONG - No dark mode
<div className="bg-white text-black">
  Content
</div>

// ✅ CORRECT - Include dark mode variants
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content
</div>
```

---

## 9. Over-Engineering

**Problem:** Unnecessary complexity, harder to maintain, slower development.

```typescript
// ❌ WRONG - Adding unrequested features
// User asked for a delete button, but you added:
// - Undo functionality
// - Confirmation with custom animation
// - Audit logging
// - Batch delete
// - Keyboard shortcuts

// ✅ CORRECT - Just the delete button
<Button onClick={() => deleteMutation.mutate(id)}>
  Delete
</Button>
```

**Rules:**

- Don't add features beyond what was requested
- Don't refactor unrelated code
- Don't add "improvements" not asked for
- Don't add comments to code you didn't change

---

## 10. Backwards-Compatibility Hacks

**Problem:** Code bloat, confusion, maintenance burden.

```typescript
// ❌ WRONG - Keeping unused code "just in case"
const _oldVariable = null; // renamed to keep "backwards compatible"
// removed: const deprecatedFunction = () => {};
export { oldType as LegacyType }; // re-export for backwards compat

// ✅ CORRECT - Delete unused code completely
// Git has history. If something is unused, remove it.
```

---

## 11. API Calls Outside Service Layer

**Problem:** Scattered API logic, no single source of truth, hard to maintain.

```typescript
// ❌ WRONG - Direct axios call in component
import axios from "axios";

function MyComponent() {
  const fetchData = async () => {
    const response = await axios.get("/api/transactions");
    // ...
  };
}

// ✅ CORRECT - Use service layer
import { transactionsService } from "@/services/api";

function MyComponent() {
  const { data } = useQuery({
    queryKey: queryKeys.transactions.all,
    queryFn: () => transactionsService.getAll(),
  });
}
```

---

## 12. Synchronous Page Imports

**Problem:** Large initial bundle, slow first load.

```typescript
// ❌ WRONG - All pages loaded upfront
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";

// ✅ CORRECT - Lazy load pages (when implemented)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Reports = lazy(() => import("./pages/Reports"));
```

**Note:** Code splitting is not yet implemented but should be used when adding new pages.

---

## Quick Reference: Do vs Don't

| Do                              | Don't                                 |
| ------------------------------- | ------------------------------------- |
| Use TanStack Query for API data | Use useState + useEffect for API data |
| Use centralized query keys      | Inline query key strings              |
| Use service layer for API calls | Call axios directly in components     |
| Include dark mode variants      | Hardcode light-only colors            |
| Delete unused code              | Keep "just in case" code              |
| Use named constants             | Magic numbers/strings                 |
| Keep changes focused            | Over-engineer solutions               |
| Use AuthContext for auth        | Access localStorage directly          |
