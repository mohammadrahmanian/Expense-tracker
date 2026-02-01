# Architecture & Project Structure

---

## Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── layouts/         # DashboardLayout, AuthLayout
│   ├── ui/              # shadcn/ui components (40+ components)
│   ├── transactions/    # Transaction-specific components
│   ├── recurring/       # Recurring transaction components
│   └── ProtectedRoute.tsx
│
├── contexts/            # React Context providers
│   ├── AuthContext.tsx          # User authentication state
│   ├── CurrencyContext.tsx      # Currency selection (USD/EUR)
│   └── SidebarContext.tsx       # Sidebar collapsed state
│
├── hooks/               # Custom React hooks
│   ├── queries/         # TanStack Query hooks for GET operations
│   ├── mutations/       # TanStack Mutation hooks for CUD operations
│   ├── use-mobile.tsx   # Responsive breakpoint detection
│   └── use-toast.ts     # Toast notifications
│
├── lib/                 # Utility functions
│   ├── query-keys.ts    # Centralized query key factories
│   ├── utils.ts         # cn() for Tailwind class merging
│   └── amount-utils.ts  # Amount parsing and validation
│
├── pages/               # Route page components
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   ├── Reports.tsx
│   ├── Categories.tsx
│   ├── RecurringTransactions.tsx
│   ├── Profile.tsx      # Placeholder - not implemented
│   ├── More.tsx         # Menu for Categories and Recurring
│   ├── Index.tsx        # Landing page (unauthenticated)
│   ├── Login.tsx
│   ├── Register.tsx
│   └── NotFound.tsx
│
├── services/            # API integration
│   └── api.ts           # Axios client and service objects
│
├── types/               # TypeScript definitions
│   └── index.ts         # Domain types (User, Transaction, Category, etc.)
│
├── test/                # Test utilities
│   ├── setup.ts         # Test configuration
│   └── test-utils.tsx   # Testing utilities
│
├── App.tsx              # Main app with routing
└── main.tsx             # Entry point
```

---

## Key Architectural Patterns

### 1. Centralized API Layer

All API calls go through `src/services/api.ts`. Each domain has a service object:

```typescript
// src/services/api.ts
export const transactionsService = {
  getAll: (params) => apiClient.get("/transactions", { params }),
  create: (data) => apiClient.post("/transactions", data),
  update: (id, data) => apiClient.put(`/transactions/${id}`, data),
  delete: (id) => apiClient.delete(`/transactions/${id}`),
};

export const categoriesService = {
  /* similar */
};
export const dashboardService = {
  /* similar */
};
```

### 2. Query/Mutation Hooks Pattern

Custom hooks wrap TanStack Query for type safety and consistency:

```
src/hooks/
├── queries/
│   ├── useTransactions.ts      # useQuery for transactions
│   ├── useCategories.ts        # useQuery for categories
│   └── useDashboard.ts         # useQuery for dashboard data
└── mutations/
    ├── useCreateTransaction.ts # useMutation for creating
    ├── useUpdateTransaction.ts # useMutation for updating
    └── useDeleteTransaction.ts # useMutation for deleting
```

### 3. Centralized Query Keys

All query keys defined in `src/lib/query-keys.ts`:

```typescript
export const queryKeys = {
  transactions: {
    all: ["transactions"] as const,
    lists: () => [...queryKeys.transactions.all, "list"] as const,
    list: (filters) => [...queryKeys.transactions.lists(), filters] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
  },
  // etc.
};
```

### 4. Context for Global UI State

Three contexts manage app-wide state:

| Context         | Location                           | Purpose                 |
| --------------- | ---------------------------------- | ----------------------- |
| AuthContext     | `src/contexts/AuthContext.tsx`     | User auth, login/logout |
| CurrencyContext | `src/contexts/CurrencyContext.tsx` | Currency formatting     |
| SidebarContext  | `src/contexts/SidebarContext.tsx`  | Sidebar collapsed state |

### 5. Protected Routes

Authentication wrapper for private pages:

```typescript
// In App.tsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

**Protected routes:** `/dashboard`, `/transactions`, `/categories`, `/recurring-transactions`, `/reports`, `/profile`, `/more`

**Public routes:** `/`, `/login`, `/register`

---

## Data Flow

```
User Action
    ↓
Component (calls mutation hook)
    ↓
Mutation Hook (src/hooks/mutations/)
    ↓
API Service (src/services/api.ts)
    ↓
Backend API
    ↓
Success → invalidateQueries → UI updates automatically
```

---

## File Locations by Task

| Task                  | Primary File(s)                              |
| --------------------- | -------------------------------------------- |
| Add API endpoint      | `src/services/api.ts`                        |
| Add query hook        | `src/hooks/queries/useXxx.ts`                |
| Add mutation hook     | `src/hooks/mutations/useXxx.ts`              |
| Add query keys        | `src/lib/query-keys.ts`                      |
| Add type              | `src/types/index.ts`                         |
| Add page              | `src/pages/Xxx.tsx` + route in `src/App.tsx` |
| Add shared component  | `src/components/ui/xxx.tsx`                  |
| Add feature component | `src/components/{feature}/xxx.tsx`           |
