# State Management Guidelines

---

## Decision Tree

```
Is this data from an API?
│
├─ YES → Use TanStack Query
│   Examples: Transactions, Categories, Dashboard stats
│   Location: src/hooks/queries/, src/hooks/mutations/
│
└─ NO → Is it needed across multiple unrelated components?
    │
    ├─ YES → Use React Context
    │   Examples: Auth state, Currency preference, Sidebar state
    │   Location: src/contexts/
    │
    └─ NO → Use local component state (useState)
        Examples: Form inputs, modal open/close, UI toggles
```

---

## TanStack Query (Server State)

**Use for:** All API data (fetching, caching, mutations)

### Query Hook Pattern
```typescript
// src/hooks/queries/useTransactions.ts
import { useQuery } from '@tanstack/react-query';
import { transactionsService } from '@/services/api';
import { queryKeys } from '@/lib/query-keys';

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: queryKeys.transactions.list(filters),
    queryFn: () => transactionsService.getAll(filters),
  });
}
```

### Mutation Hook Pattern
```typescript
// src/hooks/mutations/useCreateTransaction.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsService } from '@/services/api';
import { queryKeys } from '@/lib/query-keys';
import { toast } from 'sonner';

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionDto) =>
      transactionsService.create(data),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success('Transaction created');
    },
    onError: (error) => {
      toast.error('Failed to create transaction');
      console.error('Create transaction error:', error);
    },
  });
}
```

### Usage in Component
```typescript
function TransactionsPage() {
  // Query
  const { data: transactions, isLoading, error } = useTransactions();

  // Mutation
  const createTransaction = useCreateTransaction();

  const handleCreate = (data: CreateTransactionDto) => {
    createTransaction.mutate(data);
  };

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      {transactions?.map(t => <TransactionCard key={t.id} transaction={t} />)}
    </div>
  );
}
```

### Query Configuration
Default configuration in `src/main.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // Data fresh for 5 minutes
      gcTime: 10 * 60 * 1000,         // Cache kept for 10 minutes
      refetchOnWindowFocus: false,    // Don't refetch on tab focus
      retry: 2,                        // Retry failed requests twice
    },
  },
});
```

---

## React Context (Global UI State)

**Use for:** State needed across many unrelated components

### Existing Contexts

| Context | Location | Purpose |
|---------|----------|---------|
| AuthContext | `src/contexts/AuthContext.tsx` | User, login, logout |
| CurrencyContext | `src/contexts/CurrencyContext.tsx` | Currency code, formatAmount() |
| SidebarContext | `src/contexts/SidebarContext.tsx` | Sidebar collapsed state |

### Context Pattern
```typescript
// 1. Define types
interface ThemeContextValue {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

// 2. Create context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// 3. Create provider
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Memoize value to prevent unnecessary re-renders
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. Create hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### Context Best Practices
- **Memoize context value** to prevent re-renders
- **Split large contexts** into smaller focused ones
- **Always provide custom hook** for consuming
- **Don't overuse** - most state should be local or TanStack Query

---

## Local Component State

**Use for:** UI state specific to one component or a small component tree

### Examples
```typescript
function TransactionForm() {
  // Form UI state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'income' | 'expense'>('expense');

  // Note: Form data uses React Hook Form, not useState
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
  });

  return (/* ... */);
}
```

### When to Lift State Up
If two sibling components need the same state:
1. Move state to their common parent
2. Pass down as props

```typescript
function Parent() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <TransactionList
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <TransactionDetail
        transactionId={selectedId}
      />
    </>
  );
}
```

---

## Cache Invalidation

All invalidations use `src/lib/query-keys.ts`:

### After Transaction Changes
```typescript
queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
queryClient.invalidateQueries({ queryKey: queryKeys.reports.all });
```

### After Category Changes
```typescript
queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all }); // Transactions include category
```

### After Recurring Transaction Changes
```typescript
queryClient.invalidateQueries({ queryKey: queryKeys.recurringTransactions.all });
```

---

## Quick Reference

| Data Type | Solution | Example |
|-----------|----------|---------|
| API data | TanStack Query | Transactions, categories |
| Auth state | AuthContext | User, login/logout |
| Currency format | CurrencyContext | formatAmount() |
| Sidebar state | SidebarContext | collapsed state |
| Modal open/close | useState | `const [isOpen, setIsOpen] = useState(false)` |
| Form data | React Hook Form | `useForm()` |
| Selected item | useState or lift up | `const [selectedId, setSelectedId] = useState()` |
