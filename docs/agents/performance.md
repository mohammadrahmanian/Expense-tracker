# Performance Considerations

---

## General Guidelines

1. **Don't optimize prematurely** - Write clear code first
2. **Profile before optimizing** - Use React DevTools Profiler
3. **Measure impact** - Benchmark before and after changes
4. **Focus on user-perceived performance** - Initial load, interactions

---

## React.memo

Use for components that:
- Render frequently
- Have expensive render logic
- Receive props that rarely change

```typescript
// Before: Re-renders on every parent render
function TransactionCard({ transaction }: Props) {
  return <div>{/* expensive rendering */}</div>;
}

// After: Only re-renders when transaction prop changes
export const TransactionCard = React.memo(function TransactionCard({
  transaction,
}: Props) {
  return <div>{/* expensive rendering */}</div>;
});
```

**Don't use when:**
- Component is simple/cheap to render
- Props change on every render anyway
- Component renders infrequently

---

## useMemo

Use for expensive calculations that don't need to run on every render:

```typescript
function TransactionsList({ transactions }: Props) {
  // Memoize expensive sort/filter
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions]);

  // Memoize expensive aggregation
  const totalsByCategory = useMemo(() => {
    return transactions.reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [transactions]);

  return (/* ... */);
}
```

**Don't use when:**
- Calculation is trivial
- Dependencies change on every render

---

## useCallback

Use when passing callbacks to memoized children:

```typescript
function Parent() {
  const [items, setItems] = useState<Item[]>([]);

  // Without useCallback, this creates a new function every render
  // causing MemoizedChild to re-render
  const handleDelete = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []); // No dependencies - uses functional update

  return (
    <MemoizedList items={items} onDelete={handleDelete} />
  );
}

const MemoizedList = React.memo(function MemoizedList({
  items,
  onDelete,
}: Props) {
  return (/* ... */);
});
```

**Don't use when:**
- Child component isn't memoized
- Callback has many dependencies that change often

---

## Code Splitting

Use `React.lazy` for route-level splitting:

```typescript
// In App.tsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Reports = lazy(() => import('./pages/Reports'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Suspense>
  );
}
```

**Note:** Code splitting is not yet implemented in this codebase. Apply when adding new pages.

---

## TanStack Query Optimization

### Stale Time
Data is fresh for a period, avoiding unnecessary refetches:

```typescript
useQuery({
  queryKey: ['transactions'],
  queryFn: fetchTransactions,
  staleTime: 5 * 60 * 1000, // Fresh for 5 minutes
});
```

### Selective Refetching
Only refetch when necessary:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on tab focus
      refetchOnReconnect: false,   // Don't refetch on network reconnect
    },
  },
});
```

### Optimistic Updates
Update UI immediately, roll back on error:

```typescript
useMutation({
  mutationFn: updateTransaction,
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['transactions'] });

    // Snapshot current data
    const previous = queryClient.getQueryData(['transactions']);

    // Optimistically update
    queryClient.setQueryData(['transactions'], (old) => ({
      ...old,
      ...newData,
    }));

    return { previous };
  },
  onError: (err, newData, context) => {
    // Roll back on error
    queryClient.setQueryData(['transactions'], context?.previous);
  },
  onSettled: () => {
    // Refetch to ensure consistency
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  },
});
```

---

## Avoid Inline Object/Array Creation

Objects and arrays created inline are new references every render:

```typescript
// ❌ Bad - new object/array every render
<Component style={{ marginTop: 10 }} />
<Component items={[1, 2, 3]} />
<Component config={{ enabled: true }} />

// ✅ Good - stable references
const style = useMemo(() => ({ marginTop: 10 }), []);
const items = useMemo(() => [1, 2, 3], []);
const config = useMemo(() => ({ enabled: true }), []);

// Or define outside component if static
const STATIC_STYLE = { marginTop: 10 };
const STATIC_ITEMS = [1, 2, 3];
```

---

## Image Optimization

- Use WebP format when possible
- Lazy load images below the fold
- Use appropriate sizes (don't serve 2000px images for 200px thumbnails)
- Consider using `loading="lazy"` attribute

```typescript
<img
  src="/image.webp"
  loading="lazy"
  width={200}
  height={200}
  alt="Description"
/>
```

---

## Bundle Size

### Check bundle size
```bash
npm run build
# Look at output for chunk sizes
```

### Reduce bundle size
- Remove unused dependencies
- Use tree-shaking friendly imports
- Lazy load heavy libraries (charts, date libraries)

```typescript
// ❌ Bad - imports entire library
import _ from 'lodash';
_.map(items, fn);

// ✅ Good - imports only what's needed
import map from 'lodash/map';
map(items, fn);
```

---

## Quick Checklist

Before committing performance-related code:

- [ ] Did you profile to confirm there's a problem?
- [ ] Did you measure before and after?
- [ ] Is the optimization actually necessary?
- [ ] Does the code remain readable?
- [ ] Did you test that it still works correctly?
