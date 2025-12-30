# Expensio Frontend - AI Agent Guide

**Last Updated:** December 29, 2025
**Application Version:** 0.0.0
**Tech Stack:** React 18, TypeScript, Vite, TanStack Query, Tailwind CSS, Radix UI

---

## Table of Contents

1. [Application Overview](#1-application-overview)
2. [Architecture & Structure](#2-architecture--structure)
3. [Adding New Features](#3-adding-new-features)
4. [Coding Conventions](#4-coding-conventions)
5. [What to Avoid](#5-what-to-avoid)
6. [Business Knowledge](#6-business-knowledge)
7. [State Management Guidelines](#7-state-management-guidelines)
8. [Form Handling Standards](#8-form-handling-standards)
9. [Testing Requirements](#9-testing-requirements)
10. [Performance Considerations](#10-performance-considerations)
11. [Deployment & CI/CD](#11-deployment--cicd)
12. [Known Issues & Technical Debt](#12-known-issues--technical-debt)

---

## 1. Application Overview

### What is Expensio?

Expensio is a modern, mobile-first Progressive Web App (PWA) for personal expense tracking and financial management. It helps users track income and expenses, categorize transactions, visualize spending patterns, and manage recurring transactions.

### Key Features

- **Quick Expense Tracking** - Floating action button with predefined categories (Food, Health, Household)
- **Dashboard** - Real-time financial overview with balance, income, expenses, and savings
- **Transaction Management** - Full CRUD with filtering, sorting, and pagination
- **Recurring Transactions** - Automated scheduling for subscriptions and regular payments
- **Reports & Analytics** - Visual charts showing spending trends and category breakdowns
- **Category Management** - Custom categories with color coding
- **Currency Support** - USD/EUR with formatted amounts
- **Dark Mode** - Full dark mode support
- **PWA** - Installable, offline-capable progressive web app

### Tech Stack

**Core:**
- React 18 (Functional components with hooks)
- TypeScript (Type safety and better DX)
- Vite (Fast build tool and dev server)

**UI & Styling:**
- Tailwind CSS (Utility-first CSS framework)
- Radix UI (Accessible component primitives)
- shadcn/ui (Re-usable component patterns)
- Lucide React / Iconify (Icons)
- Highcharts (Charts and visualizations)

**Data & State:**
- TanStack Query (Server state management) - **Currently installed but underutilized**
- React Context API (Global UI state: Auth, Currency, Sidebar)
- React Hook Form + Zod (Forms and validation)
- Axios (HTTP client with interceptors)

**Testing:**
- Vitest (Unit testing)
- Testing Library (Component testing)

---

## 2. Architecture & Structure

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── layouts/         # Layout components (DashboardLayout, AuthLayout)
│   ├── ui/              # shadcn/ui components (40+ components)
│   ├── transactions/    # Transaction-specific components
│   ├── recurring/       # Recurring transaction components
│   └── ProtectedRoute.tsx
├── contexts/            # React Context providers
│   ├── AuthContext.tsx          # User authentication
│   ├── CurrencyContext.tsx      # Currency selection
│   ├── DataRefreshContext.tsx   # Global refresh trigger (TO BE REMOVED)
│   └── SidebarContext.tsx       # Sidebar state
├── hooks/               # Custom React hooks
│   ├── use-mobile.tsx   # Responsive breakpoint detection
│   └── use-toast.ts     # Toast notifications
├── lib/                 # Utility functions
│   ├── utils.ts         # cn() for class merging
│   └── amount-utils.ts  # Amount parsing and validation
├── pages/               # Page components (routes)
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   ├── Reports.tsx
│   ├── Categories.tsx
│   ├── RecurringTransactions.tsx
│   ├── Profile.tsx      # Coming soon - placeholder
│   ├── More.tsx         # Menu for Categories and Recurring Transactions
│   ├── Index.tsx        # Landing page for unauthenticated users
│   ├── Login.tsx
│   ├── Register.tsx
│   └── NotFound.tsx
├── services/            # API integration layer
│   └── api.ts           # Centralized API service with Axios
├── types/               # TypeScript type definitions
│   └── index.ts         # Domain types (User, Transaction, Category, etc.)
├── test/                # Testing setup
│   ├── setup.ts         # Test configuration
│   └── test-utils.tsx   # Testing utilities
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

### Key Architectural Patterns

1. **Feature-based Organization** - Components grouped by feature when specific
2. **Centralized API Layer** - All API calls go through the api service `src/services/api.ts`. Currently all api services are in one file but any new api service should be added to its own file under services/network (e.g., `src/services/network/transactions.ts`)
3. **Context for Global State** - Auth, Currency, Sidebar state via Context API
4. **Server State with TanStack Query** - Should be used for all API data (currently underutilized)
5. **Form Validation with Zod** - All forms use React Hook Form + Zod schemas
6. **Protected Routes** - Authentication wrapper for private pages
7. **Mobile-First Design** - Bottom tab bar for mobile, sidebar for desktop

---

## 3. Adding New Features

### Step-by-Step Feature Addition Workflow

When adding a new feature, follow this workflow:

#### 1. **Understand the Requirement**
   - Read the feature request carefully
   - Ask clarifying questions if anything is ambiguous
   - Understand the business context and user needs
   - Check if similar features exist in the codebase

#### 2. **Create a Plan (for non-trivial features)**
   - Write a detailed plan in `plan.md` before changing any code
   - Break the plan into small, verifiable steps
   - Remove ambiguities and assumptions by asking as many questions as needed from the user
   - Share the plan and wait for user feedback before implementation
   - Use the **frontend-developer** subagent for frontend development tasks

#### 3. **Review Existing Code**
   - **For Dashboard changes:** Review `src/pages/Dashboard.tsx` first
   - **For Transactions page:** Review `src/pages/Transactions.tsx` first
   - **For Reports page:** Review `src/pages/Reports.tsx` first
   - **For Categories page:** Review `src/pages/Categories.tsx` first
   - **For More page:** Review `src/pages/More.tsx` first
   - **For Recurring Transactions:** Review `src/pages/RecurringTransactions.tsx` first
   - Understand existing patterns and conventions
   - Identify reusable components

#### 4. **Design the Implementation**
   - Decide where files should go (pages, components, hooks, etc.)
   - Plan the component structure
   - Plan the API integration
   - Plan the state management approach
   - Identify required types and interfaces

#### 5. **Implement the Feature**

   **a. Create Types (if needed)**
   - Add types to `src/types/index.ts`
   - Use descriptive names following existing patterns
   - Export all types for reuse

   **b. Create API Service Methods (if needed)**
   - Add methods to the correct file under the  `src/services/network/` directory
   - Export the service methods so they can be used by TanStack Query hooks
   - Follow existing service pattern
   - Use proper TypeScript types
   - Include error handling

   **c. Create Components**
   - **Reusable UI components** → `src/components/ui/`
   - **Feature-specific components** → `src/components/{feature}/`
   - **Page components** → `src/pages/`
   - Follow shadcn/ui patterns for UI components
   - Use React Hook Form + Zod for forms

   **d. Add State Management**
   - Use **TanStack Query** for server state (API data)
   - Use **Context API** for global UI state (theme, auth, etc.)
   - Use **useState** for component-specific state

   **e. Add Routing (if new page)**
   - Add route in `src/App.tsx`
   - Wrap protected routes with `<ProtectedRoute>`
   - Update navigation components if needed

#### 6. **Test the Feature**
   - Write unit tests for utilities and hooks
   - Write component tests for critical components

#### 7. **Ensure Code Quality**
   - Run `npm run typecheck` to check TypeScript errors
   - Run `npm run test` to run tests
   - Ensure no console errors or warnings
   - Check for accessibility issues
   - Verify responsive design

#### 8. **Document (if needed)**
   - Add JSDoc comments for complex functions
   - Update relevant documentation
   - Add comments explaining "why" not "what"
   - Update this AGENT.md if new conventions are introduced or changed

### Example: Adding a "Duplicate Transaction" Feature

```typescript
// 1. Add types (if needed - Transaction type already exists in src/types/index.ts)
// In this case, we'll use the existing Transaction type

// 2. Add API service method (src/services/network/transactions.ts)
export const transactionsService = {
  // ... existing methods (getAll, create, update, delete)

  duplicate: async (id: string): Promise<Transaction> => {
    const response = await apiClient.post(`/transactions/${id}/duplicate`);
    return response.data;
  },
};

// 3. Create custom mutation hook (src/hooks/mutations/useDuplicateTransaction.ts)
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "@/services/network/transactions";
import { toast } from "sonner";

export function useDuplicateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: string) =>
      transactionsService.duplicate(transactionId),
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Transaction duplicated successfully");
    },
    onError: (error) => {
      toast.error("Failed to duplicate transaction");
      console.error("Duplicate transaction error:", error);
    },
  });
}

// 4. Use in component (src/pages/Transactions.tsx or component)
import { useDuplicateTransaction } from "@/hooks/mutations/useDuplicateTransaction";

export default function TransactionsList() {
  const duplicateTransaction = useDuplicateTransaction();

  const handleDuplicate = (transactionId: string) => {
    duplicateTransaction.mutate(transactionId);
  };

  return (
    <div>
      {transactions.map((transaction) => (
        <div key={transaction.id}>
          {transaction.title}
          <Button
            onClick={() => handleDuplicate(transaction.id)}
            disabled={duplicateTransaction.isPending}
          >
            Duplicate
          </Button>
        </div>
      ))}
    </div>
  );
}

// Note: No new route needed since this is a feature within existing Transactions page
```

---

## 4. Coding Conventions

### File Naming

- **Components:** PascalCase (e.g., `Dashboard.tsx`, `TransactionForm.tsx`)
- **Utilities:** kebab-case (e.g., `amount-utils.ts`, `form-helpers.ts`)
- **Hooks:** PascalCase with `use` prefix (e.g., `useMobile.tsx`)
- **Pages:** PascalCase (e.g., `Dashboard.tsx`)

### TypeScript Conventions

- **Interfaces:** PascalCase, no suffix for component props
  ```typescript
  interface TransactionFormProps {
    transaction?: Transaction;
    onSubmit: (data: Transaction) => void;
  }
  ```
- **Context Types:** Use `ContextValue` suffix for context types
  ```typescript
  interface AuthContextValue {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
  }
  ```
- **Types:** Use `Type` for union types, enums, or type aliases
  ```typescript
  type TransactionType = "INCOME" | "EXPENSE";
  ```
- **Constants:** UPPER_SNAKE_CASE
  ```typescript
  const MAX_AMOUNT = 999999999;
  const API_TIMEOUT = 10000;
  ```
- **Variables & Functions:** camelCase
  ```typescript
  const handleSubmit = async (data: FormData) => { ... };
  ```
- **Booleans:** Use `is*`, `has*`, `should*` prefixes
  ```typescript
  const isLoading = true;
  const hasError = false;
  const shouldRefresh = true;
  ```

### TypeScript Strictness

**IMPORTANT:** New code should aim for strict typing:
- Enable strict null checks
- Avoid `any` types - use `unknown` if type is truly unknown
- Add explicit return types for public functions
- Use proper type guards for type narrowing
- Don't use `@ts-ignore` - fix the type error instead

**Note:** The current TypeScript config has strict mode partially disabled, but this is planned to be fixed. New code should prepare for strict mode.

### Component Conventions

- **Use functional components** - No class components
- **Use hooks** for all logic
- **Destructure props** at the top of the component
- **Early returns** for loading and error states
- **Export default** for page components
- **Named exports** for reusable components

```typescript
// Good - Functional component with proper structure
export default function TransactionForm({ transaction, onSubmit }: TransactionFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Early return for loading state
  if (isLoading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit}>
      {/* Form content */}
    </form>
  );
}
```

### Event Handler Naming

- **Props:** Use `on*` prefix (e.g., `onClick`, `onSubmit`, `onChange`)
- **Internal handlers:** Use `handle*` prefix (e.g., `handleClick`, `handleSubmit`)

```typescript
interface ButtonProps {
  onClick: () => void;  // Prop
}

function Button({ onClick }: ButtonProps) {
  const handleClick = () => {  // Internal handler
    // Do something
    onClick();  // Call prop
  };

  return <button onClick={handleClick}>Click</button>;
}
```

### Import Organization

Order imports as follows:
1. React and React-related libraries
2. Third-party libraries
3. Internal modules (using `@/` alias)
4. Types (if importing separately)

```typescript
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { transactionsService } from "@/services/api";
import type { Transaction } from "@/types";
```

### CSS & Styling

- **Use Tailwind utility classes** - Primary styling method
- **Mobile-first approach** - Base styles for mobile, then responsive breakpoints
- **Dark mode support** - Use `dark:` variant for all new components
- **Use CSS variables** - Defined in Tailwind config for theming
- **Avoid inline styles** - Use Tailwind classes instead

```typescript
// Good - Tailwind classes with dark mode
<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Title</h2>
</div>
```

### Responsive Design

- **Breakpoints:** Use standard Tailwind breakpoints
  - `sm:` - 640px (tablet)
  - `md:` - 768px (tablet)
  - `lg:` - 1024px (desktop)
  - `xl:` - 1280px (large desktop)
- **Bottom Tab Bar** - Mobile navigation (< md)
- **Sidebar** - Desktop navigation (≥ md)
- **ResponsiveDialog** - Use for modals that adapt to screen size

### Comments & Documentation

- **Use comments for "why" not "what"** - Code should be self-documenting
- **JSDoc for public APIs** - All exported functions should have JSDoc
- **TODO comments** - `// TODO(#123): Description`
- **No commented-out code** - Delete it, Git has history

```typescript
// Bad - Obvious comment
// Set loading to true
setLoading(true);

// Good - Explains why
// Disable form while mutation is in progress to prevent double-submission
setIsSubmitting(true);

/**
 * Normalizes amount input by replacing comma with period.
 * Supports both European (1.234,56) and US (1,234.56) formats.
 */
export function normalizeAmount(value: string): string {
  return value.replace(",", ".");
}
```

---

## 5. What to Avoid

### Anti-Patterns & Common Mistakes

#### 1. **DO NOT Use Direct localStorage Access**

**❌ Wrong:**
```typescript
const token = localStorage.getItem("authToken");
localStorage.setItem("authToken", token);
```

**✅ Correct:**
```typescript
// Use the storage abstraction (to be created) with error handling
import { storage, STORAGE_KEYS } from "@/lib/storage";
const token = storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
```

#### 2. **DO NOT Use Manual Data Refresh (DataRefreshContext)**

**❌ Wrong:**
```typescript
const { triggerRefresh } = useDataRefresh();
// After mutation
triggerRefresh();  // Refreshes ALL queries globally
```

**✅ Correct:**
```typescript
// Use TanStack Query's invalidateQueries
const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: ["transactions"] });
```

**Note:** DataRefreshContext is marked for removal. See Issue 1.4 in FRONTEND_CODE_REVIEW.md.

#### 3. **DO NOT Hard-code User IDs**

**❌ Wrong:**
```typescript
const transactionData = {
  userId: "1",  // NEVER DO THIS
  title: data.title,
  amount: data.amount,
};
```

**✅ Correct:**
```typescript
// Backend should derive userId from JWT token
// Frontend should NOT send userId
const transactionData = {
  title: data.title,
  amount: data.amount,
  // userId is set by backend from authenticated user
};
```

#### 4. **DO NOT Create Inline React Query Configurations**

**❌ Wrong:**
```typescript
const queryClient = new QueryClient();  // No configuration
```

**✅ Correct:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes
      cacheTime: 10 * 60 * 1000,  // 10 minutes
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});
```

#### 5. **DO NOT Perform Business Logic on Client Side**

**❌ Wrong:**
```typescript
// Fetching ALL transactions and filtering client-side
const allTransactions = await transactionsService.getAll();
const filtered = allTransactions.filter(t => t.categoryId === categoryId);
```

**✅ Correct:**
```typescript
// Use server-side filtering
const transactions = await transactionsService.getAll({ categoryId });
```

#### 6. **DO NOT Duplicate Form Validation Logic**

**❌ Wrong:**
```typescript
// Inline validation in each form
const schema = z.object({
  amount: z.number().positive(),
  // ... duplicated across forms
});
```

**✅ Correct:**
```typescript
// Create reusable schemas in src/schemas/
import { transactionSchema } from "@/schemas/transaction-schema";

const { register } = useForm({
  resolver: zodResolver(transactionSchema)
});
```

#### 7. **DO NOT Import All Pages Synchronously**

**❌ Wrong:**
```typescript
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
```

**✅ Correct:**
```typescript
// Use code splitting (to be implemented)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Transactions = lazy(() => import("./pages/Transactions"));
```

#### 8. **DO NOT Use Magic Numbers/Strings**

**❌ Wrong:**
```typescript
const recent = transactions.slice(0, 5);  // Why 5?
setTimeout(refetch, 10000);  // Why 10 seconds?
```

**✅ Correct:**
```typescript
import { DASHBOARD_RECENT_LIMIT } from "@/constants/ui-constants";
import { API_TIMEOUT } from "@/constants/api-constants";

const recent = transactions.slice(0, DASHBOARD_RECENT_LIMIT);
setTimeout(refetch, API_TIMEOUT);
```

#### 9. **DO NOT Skip Error Boundaries**

**❌ Wrong:**
```typescript
// No error boundary - app crashes with white screen
<Routes>
  <Route path="/dashboard" element={<Dashboard />} />
</Routes>
```

**✅ Correct:**
```typescript
// Wrap routes with error boundary
<ErrorBoundary fallback={<ErrorFallback />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</ErrorBoundary>
```

#### 10. **DO NOT Create Components Without Dark Mode Support**

**❌ Wrong:**
```typescript
<div className="bg-white text-black">
  {/* No dark mode support */}
</div>
```

**✅ Correct:**
```typescript
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
  {/* Supports dark mode */}
</div>
```

#### 11. **DO NOT Over-Engineer Simple Solutions**

- Don't add features beyond what was requested
- Don't refactor unrelated code unless explicitly asked
- Don't add unnecessary abstractions
- Keep solutions simple and focused on the requirement

#### 12. **DO NOT Add Backwards-Compatibility Hacks**

- If code is unused, delete it completely
- Don't rename unused variables with `_` prefix
- Don't add `// removed` comments
- Don't re-export types for backwards compatibility

---

## 6. Business Knowledge

### Core Business Entities

#### Transaction
- Represents a single financial transaction (income or expense)
- Can be one-time or recurring
- Must have a category
- Amount stored as positive number (type determines if income or expense)
- **Important:** Backend derives `userId` from JWT - never send it from frontend

#### Category
- Organizes transactions into groups (Food, Health, Transport, etc.)
- Has a type: INCOME or EXPENSE
- Has a color for visual identification
- Users can create custom categories

#### Recurring Transaction
- Automated transactions that repeat on a schedule
- Frequencies: DAILY, WEEKLY, MONTHLY, YEARLY
- Can be activated/deactivated
- Tracks next occurrence date
- **Important:** Recurring transactions create actual transactions automatically

#### Budget (Not Implemented - To Be Removed)
- **Status:** Backend types exist but UI not implemented
- **Decision:** Feature will not be implemented
- **Action:** Remove budget-related code from codebase

### Quick Expense Modal

**Location:** `src/components/ui/quick-expense-modal.tsx`

**Purpose:** Provides a quick way to track common expenses without navigating to the full transaction form.

**Behavior:**
- Three predefined categories: **Food**, **Health**, **Household**
- Each category has a specific icon and color
- When user selects a category that doesn't exist:
  1. Modal creates the category first
  2. Then creates the transaction with that category
- Auto-generates transaction title based on category name
- Amount input accepts both comma and period as decimal separators

**Important:** These predefined categories should match the backend's expectations. If backend has different default categories, they must be aligned.

### Dashboard Calculations

**Location:** `src/pages/Dashboard.tsx` and `src/services/api.ts`

**Current Balance:**
```
Current Balance = Total Income - Total Expenses
```

**Monthly Savings:**
```
Monthly Savings = Monthly Income - Monthly Expenses
```

**Category Expenses:**
- Shows top 5 categories by spending
- Remaining categories grouped as "Others"
- Calculated as percentage of total expenses
- **Note:** Currently calculated client-side (to be moved to backend)

### Currency Formatting

**Location:** `src/contexts/CurrencyContext.tsx`

**Supported Currencies:**
- USD (United States Dollar) - Symbol: $
- EUR (Euro) - Symbol: €

**Format Function:**
```typescript
formatAmount(amount: number) => string
// USD: "$1,234.56"
// EUR: "€1.234,56"
```

### Authentication Flow

1. User logs in with email/password
2. Backend returns JWT token
3. Frontend stores token in localStorage (to be improved with httpOnly cookies)
4. Token added to all API requests via Axios interceptor
5. On 401 response, token cleared and user redirected to login
6. On logout, token removed from localStorage

### Protected Routes

All authenticated pages are wrapped with `<ProtectedRoute>`:
- `/dashboard`
- `/transactions`
- `/categories`
- `/recurring-transactions`
- `/reports`
- `/profile` (Coming Soon)
- `/more`

Public routes:
- `/` (Index/Landing page)
- `/login`
- `/register`

### Mobile Navigation

**Mobile (< md breakpoint):**
- Bottom tab bar with 4 tabs: Dashboard, Transactions, Reports, More
- No sidebar
- Floating action button for quick expense entry

**Desktop (≥ md breakpoint):**
- Collapsible sidebar navigation
- No bottom tab bar
- Sidebar state persisted to localStorage

---

## 7. State Management Guidelines

### Decision Tree: When to Use What

```
Is this data from the API?
├─ YES → Use TanStack Query (React Query)
│   ├─ Example: Transactions, Categories, Dashboard stats
│   └─ Pattern: useQuery, useMutation
│
└─ NO → Is it global UI state?
    ├─ YES → Is it truly global (needed in many places)?
    │   ├─ YES → Use Context API
    │   │   ├─ Example: Auth, Theme, Currency
    │   │   └─ Pattern: Create context provider
    │   │
    │   └─ NO → Lift state up to common parent
    │       └─ Pattern: useState in parent, pass as props
    │
    └─ NO → Use local component state
        ├─ Example: Form inputs, modal open/close, UI toggles
        └─ Pattern: useState, useReducer
```

### TanStack Query (React Query) - For Server State

**When to Use:**
- Fetching data from API
- Creating, updating, or deleting server resources
- Caching API responses
- Background refetching
- Optimistic updates

**Pattern:**
```typescript
// Query (GET)
const { data, isLoading, error } = useQuery({
  queryKey: ["transactions"],
  queryFn: () => transactionsService.getAll(),
});

// Mutation (POST/PUT/DELETE)
const mutation = useMutation({
  mutationFn: (data) => transactionsService.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    toast.success("Transaction created");
  },
  onError: (error) => {
    toast.error("Failed to create transaction");
  },
});
```

**Important:**
- Use query keys consistently (create a query key factory)
- Configure staleTime and cacheTime appropriately
- Invalidate related queries after mutations
- Handle loading and error states

### Context API - For Global UI State

**When to Use:**
- Authentication state (user, login, logout)
- Theme/dark mode
- Currency selection
- UI preferences (sidebar collapsed)
- Language/locale (future)

**Pattern:**
```typescript
// Create context
interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo(() => ({
    user,
    login,
    logout,
    isLoading,
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for consuming
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

**Important:**
- Memoize context value to prevent unnecessary re-renders
- Split large contexts into smaller, focused ones
- Provide custom hook for consuming context
- Don't overuse - most state should be local

### Local Component State - For UI State

**When to Use:**
- Form inputs (before submission)
- Modal/dialog open/close
- Tabs, accordions, dropdowns
- Local UI toggles
- Temporary UI state

**Pattern:**
```typescript
function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Dialog content */}
    </Dialog>
  );
}
```

### Cache Invalidation Strategy

**After Creating a Transaction:**
```typescript
queryClient.invalidateQueries({ queryKey: ["transactions"] });
queryClient.invalidateQueries({ queryKey: ["dashboard"] });
```

**After Updating a Category:**
```typescript
queryClient.invalidateQueries({ queryKey: ["categories"] });
queryClient.invalidateQueries({ queryKey: ["transactions"] });  // Transactions include category
```

**After Deleting a Recurring Transaction:**
```typescript
queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] });
```

---

## 8. Form Handling Standards

### Form Stack: React Hook Form + Zod

**ALL forms MUST use:**
- React Hook Form for form state
- Zod for validation schemas
- zodResolver to connect them

**NO exceptions** - even simple forms should use this pattern for consistency.

### Form Schema Naming Convention

```
{Feature}FormSchema
```

Examples:
- `TransactionFormSchema`
- `CategoryFormSchema`
- `LoginFormSchema`
- `RecurringTransactionFormSchema`

### Standard Form Pattern

```typescript
// 1. Define Zod schema
const transactionFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "Category is required"),
  date: z.date(),
});

// 2. Infer TypeScript type
type TransactionFormData = z.infer<typeof transactionFormSchema>;

// 3. Use in component
function TransactionForm({ onSubmit }: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: "EXPENSE",
      date: new Date(),
    },
  });

  const onSubmitForm = async (data: TransactionFormData) => {
    try {
      await onSubmit(data);
      toast.success("Transaction created successfully");
    } catch (error) {
      toast.error("Failed to create transaction");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      {/* Form fields */}
    </form>
  );
}
```

### Amount Input Handling

Amount inputs require special handling to support both comma and period as decimal separators:

```typescript
import { createAmountChangeHandler, normalizeAmount } from "@/lib/amount-utils";

function AmountField() {
  const [amount, setAmount] = useState("");

  // Use the utility to create a validated change handler
  const handleAmountChange = createAmountChangeHandler(setAmount);

  const onSubmit = (data) => {
    // Normalize before sending to API
    const normalizedAmount = parseFloat(normalizeAmount(amount));
    // Submit...
  };

  return (
    <Input
      type="text"
      value={amount}
      onChange={handleAmountChange}
      placeholder="0.00"
    />
  );
}
```

### Form Field Components

For consistency, use shadcn/ui form components:

```typescript
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

<FormField
  control={form.control}
  name="title"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Title</FormLabel>
      <FormControl>
        <Input placeholder="Grocery shopping" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Loading States in Forms

```typescript
function MyForm() {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Disable all inputs while submitting */}
      <Input disabled={isSubmitting} />

      {/* Show loading on button */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
```

### Error Handling in Forms

- **Validation errors** - Shown inline below fields (via FormMessage)
- **API errors** - Shown via toast notification
- **Network errors** - Shown via toast notification

```typescript
const onSubmit = async (data: FormData) => {
  try {
    await transactionsService.create(data);
    toast.success("Transaction created successfully");
    onClose();  // Close modal/dialog
  } catch (error) {
    // API or network error
    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to create transaction. Please try again."
    );
  }
};
```

---

## 9. Testing Requirements

### Testing Strategy

**For All New Features:**
- **Unit tests** are **MANDATORY** for:
  - Utility functions
  - Custom hooks
  - Business logic
  - Data transformations

- **Integration tests** are **OPTIONAL** based on complexity:
  - Complex user flows
  - Multi-step processes
  - Critical paths (checkout, payment, etc.)

### Test Coverage Goals

- **No specific coverage percentage target**
- **Critical paths must be well tested**
- Focus on high-value tests over coverage metrics

### What to Test

**✅ DO Test:**
- Public APIs and utilities
- Custom hooks
- Form validation logic
- Data transformations
- Error handling
- Edge cases

**❌ DON'T Test:**
- Third-party libraries
- Simple getters/setters
- Trivial functions
- UI styling (unless it affects functionality)

### Testing Tools

- **Vitest** - Test runner
- **Testing Library** - Component testing
- **jsdom** - DOM environment

### Test File Naming

```
{filename}.test.ts    // For TypeScript files
{filename}.test.tsx   // For React components
```

### Test Location

- **Co-located with source files** (preferred for utilities)
  ```
  src/lib/amount-utils.ts
  src/lib/amount-utils.test.ts
  ```

### Example Unit Test

```typescript
// src/lib/amount-utils.test.ts
import { describe, it, expect } from "vitest";
import { normalizeAmount, parseAmount } from "./amount-utils";

describe("normalizeAmount", () => {
  it("should replace comma with period", () => {
    expect(normalizeAmount("1234,56")).toBe("1234.56");
  });

  it("should keep period unchanged", () => {
    expect(normalizeAmount("1234.56")).toBe("1234.56");
  });

  it("should handle empty string", () => {
    expect(normalizeAmount("")).toBe("");
  });
});

describe("parseAmount", () => {
  it("should parse valid amount", () => {
    expect(parseAmount("123.45")).toBe(123.45);
  });

  it("should return null for invalid input", () => {
    expect(parseAmount("abc")).toBeNull();
  });
});
```

### Example Component Test

```typescript
// src/components/ui/quick-expense-modal.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuickExpenseModal } from "./quick-expense-modal";

describe("QuickExpenseModal", () => {
  it("should create transaction with selected category", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<QuickExpenseModal isOpen onClose={onClose} />);

    // Select Food category
    await user.click(screen.getByText("Food"));

    // Enter amount
    await user.type(screen.getByLabelText(/amount/i), "50.00");

    // Submit
    await user.click(screen.getByText("Add Expense"));

    // Verify modal closed
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## 10. Performance Considerations

### General Performance Guidelines

- **Avoid over-optimization** - Don't optimize prematurely
- **Profile first** - Use React DevTools Profiler before optimizing
- **Measure impact** - Benchmark before and after changes

### Specific Performance Practices

#### 1. **Code Splitting (To Be Implemented)**

Future requirement: All pages should be lazy loaded.

```typescript
// Future pattern
const Dashboard = lazy(() => import("./pages/Dashboard"));
```

#### 2. **React.memo for Expensive Components**

Use `React.memo` for components that:
- Are expensive to render
- Are rendered frequently
- Have props that rarely change

```typescript
export const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  // Expensive rendering logic
  return <div>{/* ... */}</div>;
});
```

#### 3. **useMemo for Expensive Calculations**

```typescript
const sortedTransactions = useMemo(() => {
  return transactions.sort((a, b) => b.date - a.date);
}, [transactions]);
```

#### 4. **useCallback for Event Handlers**

When passing callbacks to memoized children:

```typescript
const handleDelete = useCallback((id: string) => {
  deleteTransaction(id);
}, [deleteTransaction]);
```

#### 5. **Optimize Images**

- Use appropriate image formats (WebP when supported)
- Lazy load images below the fold
- Use responsive images with srcset

#### 6. **Minimize Bundle Size**

- No unused dependencies
- Tree-shake properly
- Code split by route
- Lazy load heavy libraries (charts, 3D graphics)

#### 7. **Avoid Unnecessary Re-renders**

- Memoize context values
- Split large contexts
- Use proper React Query configuration to prevent refetches
- Don't create objects/arrays inline in render

---

## 11. Deployment & CI/CD

### Environment Variables

Required at build time:
```bash
VITE_API_BASE_URL=https://api.expensio.com/api
```

Test credentials (for UI testing):
```bash
UI_TEST_EMAIL=test@example.com
UI_TEST_PASSWORD=testpassword
```

### CI/CD Status

**Current:**
- GitHub Actions workflow configured (`.github/workflows/fly-deploy.yml`)
- No automated checks yet (planned)

**Planned:**
- Linting before deployment
- Type checking before deployment
- Test execution before deployment
- Bundle size monitoring

### Deployment Commands

```bash
# Local build
npm run build

# Type check
npm run typecheck

# Format code
npm run format.fix
```

---

## Summary for AI Agents

When working with this codebase:

1. ✅ **Always read relevant files first** before making changes
2. ✅ **Create a plan** for non-trivial features and get user approval
3. ✅ **Follow existing patterns** - don't introduce new patterns unnecessarily
4. ✅ **Use TanStack Query** for all API data (server state)
5. ✅ **Use React Hook Form + Zod** for all forms (no exceptions)
6. ✅ **Write unit tests** for all utilities and business logic
7. ✅ **Support dark mode** in all new components
8. ✅ **Make it responsive** - mobile-first approach
9. ✅ **Handle errors properly** - show user-friendly messages
10. ✅ **Ask questions** when requirements are unclear

### Common Tasks Quick Reference

| Task | Location | Pattern |
|------|----------|---------|
| Add new page | `src/pages/` | Create component, add route in App.tsx |
| Add API method | `src/services/api.ts` | Follow existing service pattern |
| Add type | `src/types/index.ts` | Export interface/type |
| Create form | Use React Hook Form + Zod | See Section 8 |
| Add component | `src/components/ui/` (shared) or `src/components/{feature}/` | Follow shadcn/ui pattern |
| Add hook | `src/hooks/` | use* prefix, kebab-case filename |
| Add utility | `src/lib/` | Export function, add tests |

### Getting Help

- **Project Instructions:** See CLAUDE.md
- **README:** See README.md for setup and deployment

---