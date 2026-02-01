# Adding New Features

---

## Pre-Implementation Checklist

Before writing code, complete these steps:

1. **Understand the requirement** - Ask clarifying questions if anything is unclear
2. **Check existing code** - Look for similar patterns or reusable components
3. **Create a plan** - For non-trivial features, write to `plan.md` and get user approval
4. **Identify impacted files** - List all files that need changes

---

## Page-Specific Starting Points

| Feature Area           | Read First                            |
| ---------------------- | ------------------------------------- |
| Dashboard changes      | `src/pages/Dashboard.tsx`             |
| Transaction management | `src/pages/Transactions.tsx`          |
| Reporting/analytics    | `src/pages/Reports.tsx`               |
| Category management    | `src/pages/Categories.tsx`            |
| Recurring transactions | `src/pages/RecurringTransactions.tsx` |
| Navigation/menu        | `src/pages/More.tsx`                  |

---

## Implementation Steps

### Step 1: Add Types (if needed)

Location: `src/types/index.ts`

```typescript
// Add new interface or type
export interface NewFeature {
  id: string;
  name: string;
  // ...
}
```

### Step 2: Add API Service Methods (if needed)

Location: `src/services/api.ts`

```typescript
export const newFeatureService = {
  getAll: async (): Promise<NewFeature[]> => {
    const response = await apiClient.get("/new-features");
    return response.data;
  },
  create: async (data: CreateNewFeatureDto): Promise<NewFeature> => {
    const response = await apiClient.post("/new-features", data);
    return response.data;
  },
  update: async (
    id: string,
    data: UpdateNewFeatureDto,
  ): Promise<NewFeature> => {
    const response = await apiClient.put(`/new-features/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/new-features/${id}`);
  },
};
```

### Step 3: Add Query Keys

Location: `src/lib/query-keys.ts`

```typescript
export const queryKeys = {
  // ... existing keys
  newFeatures: {
    all: ["newFeatures"] as const,
    lists: () => [...queryKeys.newFeatures.all, "list"] as const,
    list: (filters: NewFeatureFilters) =>
      [...queryKeys.newFeatures.lists(), filters] as const,
    details: () => [...queryKeys.newFeatures.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.newFeatures.details(), id] as const,
  },
};
```

### Step 4: Create Query Hook (for GET operations)

Location: `src/hooks/queries/useNewFeatures.ts`

```typescript
import { useQuery } from "@tanstack/react-query";
import { newFeatureService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";

export function useNewFeatures() {
  return useQuery({
    queryKey: queryKeys.newFeatures.all,
    queryFn: () => newFeatureService.getAll(),
  });
}

export function useNewFeature(id: string) {
  return useQuery({
    queryKey: queryKeys.newFeatures.detail(id),
    queryFn: () => newFeatureService.getById(id),
    enabled: !!id, // Only fetch when id is provided
  });
}
```

### Step 5: Create Mutation Hooks (for Create/Update/Delete)

Location: `src/hooks/mutations/useCreateNewFeature.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newFeatureService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

export function useCreateNewFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNewFeatureDto) => newFeatureService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.newFeatures.all });
      toast.success("Created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create");
      console.error("Create error:", error);
    },
  });
}
```

### Step 6: Create Components

**Shared UI components** → `src/components/ui/`
**Feature-specific components** → `src/components/{feature}/`
**Page components** → `src/pages/`

```typescript
// src/pages/NewFeature.tsx
import { useNewFeatures } from '@/hooks/queries/useNewFeatures';
import { useCreateNewFeature } from '@/hooks/mutations/useCreateNewFeature';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';

export default function NewFeaturePage() {
  const { data, isLoading, error } = useNewFeatures();
  const createMutation = useCreateNewFeature();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <DashboardLayout>
      {/* Page content */}
    </DashboardLayout>
  );
}
```

### Step 7: Add Route (if new page)

Location: `src/App.tsx`

```typescript
import NewFeaturePage from './pages/NewFeature';

// In Routes
<Route
  path="/new-feature"
  element={
    <ProtectedRoute>
      <NewFeaturePage />
    </ProtectedRoute>
  }
/>
```

### Step 8: Update Navigation (if needed)

- Mobile: Update `src/components/layouts/DashboardLayout.tsx` (bottom tab bar)
- Desktop: Update sidebar in `DashboardLayout.tsx`

---

## Complete Example: "Duplicate Transaction" Feature

### 1. API Service Method

```typescript
// src/services/api.ts - add to transactionsService
duplicate: async (id: string): Promise<Transaction> => {
  const response = await apiClient.post(`/transactions/${id}/duplicate`);
  return response.data;
},
```

### 2. Mutation Hook

```typescript
// src/hooks/mutations/useDuplicateTransaction.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

export function useDuplicateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionsService.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success("Transaction duplicated");
    },
    onError: () => {
      toast.error("Failed to duplicate transaction");
    },
  });
}
```

### 3. Usage in Component

```typescript
// In Transactions.tsx or TransactionCard.tsx
import { useDuplicateTransaction } from '@/hooks/mutations/useDuplicateTransaction';

function TransactionCard({ transaction }) {
  const duplicateMutation = useDuplicateTransaction();

  return (
    <Button
      onClick={() => duplicateMutation.mutate(transaction.id)}
      disabled={duplicateMutation.isPending}
    >
      {duplicateMutation.isPending ? 'Duplicating...' : 'Duplicate'}
    </Button>
  );
}
```

---

## Post-Implementation Checklist

- [ ] Run `npm run typecheck` - no TypeScript errors
- [ ] Run `npm run test` - all tests pass
- [ ] Test on mobile viewport (< 768px)
- [ ] Test on desktop viewport (≥ 768px)
- [ ] Test dark mode
- [ ] No console errors/warnings
- [ ] Write unit tests for new utilities/hooks
