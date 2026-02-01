---
name: frontend-engineer
description: Writing high quality Frontend React code with following best practices and conventions. Use this skill when user asks for creating new components, refactoring old components, bug fixing components. The mentioned conventions and best practices should be followed with respect to the project structure and purpose.
---

# React Frontend Development SKILL

## Stack Overview

This project uses:

- **React 18** with **TypeScript**
- **React Router 6** for routing
- **Vite** for bundling
- **Vitest** for testing
- **TailwindCSS 3** for styling
- **Radix UI** for accessible primitives
- **shadcn/ui** component patterns

## Project Structure

```
app/
├── components/
│   ├── ui/              # Core UI library (Button, Input, Dialog, etc.)
│   ├── features/        # Feature-specific components
│   ├── layouts/         # Layout components (Header, Sidebar, MobileNav)
│   └── shared/          # Shared business components
├── pages/               # Page components (one per route)
├── hooks/               # Custom React hooks
├── lib/                 # Utilities (cn, formatters, validators)
├── types/               # Shared TypeScript types
├── services/            # API calls and external services
├── constants/           # App-wide constants
├── app.css              # Global styles and CSS variables
└── root.tsx             # Root layout and error boundary
```

## Component Architecture

### Component File Patterns

**Single Component:**

```
ComponentName.tsx
```

**Complex Component with Tests:**

```
ComponentName/
├── index.ts                    # Barrel export
├── ComponentName.tsx           # Main component
├── ComponentName.spec.tsx      # Vitest tests
└── types.ts                    # Component-specific types (if needed)
```

### Component Design Principles

#### 1. Single Responsibility

Each component should have one clear purpose. Keep components under 200 lines.

**Bad:**

```typescript
function UserDashboard() {
  // Handles auth, fetching, profile, stats, activities, settings...
  return (/* 500+ lines */);
}
```

**Good:**

```typescript
// UserDashboard only orchestrates layout - each child handles its own concerns
function UserDashboard() {
  return (
    <div className="space-y-6">
      <UserProfile />
      <UserStats />
      <RecentActivity />
    </div>
  );
}

// Each component is responsible for its own data fetching and logic
function UserProfile() {
  const { data: user, isLoading } = useUser();

  if (isLoading) return <Skeleton className="h-32" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function UserStats() {
  const { data: stats } = useUserStats();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <StatsChart data={stats} />
      </CardContent>
    </Card>
  );
}

function RecentActivity() {
  const { data: activities } = useActivities();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ActivityList items={activities} />
      </CardContent>
    </Card>
  );
}

// StatsChart and ActivityList are sub-components
function StatsChart({ data }: { data: Stats }) {
  return <div>{/* Chart visualization */}</div>;
}

function ActivityList({ items }: { items: Activity[] }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.description}</li>
      ))}
    </ul>
  );
}
```

#### 2. Props-First Design

Always define clear TypeScript interfaces:

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  /** Size variant */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** Show loading state */
  isLoading?: boolean;
}

export function Button({
  variant = 'default',
  size = 'default',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        buttonVariants({ variant, size }),
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
```

#### 3. Composition Over Configuration

Favor compound components over complex prop APIs:

**Bad - Configuration with many props:**

```typescript
// Too many props makes the component inflexible and hard to maintain
<Dialog
  isOpen={isOpen}
  onClose={onClose}
  title="Delete User"
  description="Are you sure you want to delete this user?"
  showCloseButton={true}
  closeButtonPosition="top-right"
  confirmText="Delete"
  confirmVariant="destructive"
  cancelText="Cancel"
  cancelVariant="outline"
  onConfirm={handleDelete}
  onCancel={onClose}
  footerAlign="right"
  showDivider={true}
  icon={<AlertCircle />}
  iconColor="red"
/>

// What if you need custom footer layout? More props!
// What if you need multiple buttons? More props!
// What if you need custom content? More props!
// This approach doesn't scale well.
```

**Good - Composition with flexible structure:**

```typescript
// Flexible, composable, and easy to customize
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete User</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this user? This action cannot be undone.
      </DialogDescription>
    </DialogHeader>

    {/* You can add any custom content here */}
    <div className="py-4">
      <p className="text-sm text-muted-foreground">
        User: <strong>{user.name}</strong>
      </p>
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Need a different layout? Just compose differently:
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-destructive" />
        <DialogTitle>Warning</DialogTitle>
      </div>
    </DialogHeader>

    {/* Completely custom body */}
    <form onSubmit={handleSubmit}>
      <Input name="confirmation" placeholder="Type DELETE to confirm" />
    </form>

    {/* Custom footer with three buttons */}
    <DialogFooter className="sm:justify-between">
      <Button variant="ghost" onClick={handleSkip}>
        Skip
      </Button>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" type="submit">
          Confirm
        </Button>
      </div>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Routing Patterns

### Route Component Structure

Place all page components in `app/pages/`:

```typescript
// app/pages/UserDetail.tsx
import { useParams } from 'react-router-dom';
import { UserProfile } from '@/components/features/UserProfile';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto py-6">
      <UserProfile userId={id!} />
    </div>
  );
}
```

### Route Registration

Add routes in `app/App.tsx`:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from '@/pages/Index';
import UserList from '@/pages/UserList';
import UserDetail from '@/pages/UserDetail';
import NotFound from '@/pages/NotFound';

<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/users" element={<UserList />} />
  <Route path="/users/:id" element={<UserDetail />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Navigation Components

- **Desktop**: Side menu navigation
- **Mobile**: Bottom sheet navigation

Both should use `<Link>` from `react-router-dom`:

## Styling System

### TailwindCSS Usage

Use Tailwind utility classes as the primary styling method:

```typescript
<div className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4 shadow-sm">
  <h2 className="text-lg font-semibold">Title</h2>
  <Button size="sm">Action</Button>
</div>
```

### The `cn` Utility

Always use `cn` from `@/lib/utils` to combine class names:

```typescript
import { cn } from '@/lib/utils';

function Card({ className, children, variant = 'default' }: CardProps) {
  return (
    <div
      className={cn(
        // Base styles
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        // Conditional styles
        {
          "border-primary": variant === 'primary',
          "border-destructive": variant === 'destructive',
        },
        // User overrides (always last)
        className
      )}
    >
      {children}
    </div>
  );
}
```

### Design System Tokens

Modify `tailwind.config.ts` to customize the design system:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Add custom colors here
      },
      spacing: {
        // Add custom spacing
      },
    },
  },
};
```

### Dark Mode Support

Use CSS variables for theme colors in `app.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
  }
}
```

Access in components:

```typescript
<div className="bg-background text-foreground">
  <h1 className="text-primary">Heading</h1>
</div>
```

## Component Patterns

### Container/Presenter Pattern

Separate data fetching from presentation:

```typescript
// features/UserProfile/UserProfileContainer.tsx
export function UserProfileContainer({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useUser(userId);

  if (isLoading) return <UserProfileSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <NotFound />;

  return <UserProfile user={user} />;
}

// features/UserProfile/UserProfile.tsx
interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{user.bio}</p>
      </CardContent>
    </Card>
  );
}
```

### Custom Hooks

Extract reusable logic into custom hooks in `app/hooks/`:

```typescript
// hooks/useDebounce.ts
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage in component
function SearchBar() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <Input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### Form Handling

Use controlled components with proper validation:

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      setErrors({ form: 'Invalid credentials' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(errors.email && "border-destructive")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={cn(errors.password && "border-destructive")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
      </div>

      {errors.form && (
        <p className="text-sm text-destructive">{errors.form}</p>
      )}

      <Button type="submit" isLoading={isLoading} className="w-full">
        Sign In
      </Button>
    </form>
  );
}
```

## State Management

### Local State First

Start with `useState` for component-specific state:

```typescript
function Accordion() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (/* ... */);
}
```

### Lift State Only When Needed

Lift state to the nearest common ancestor:

```typescript
function ProductPage() {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ProductImages variant={selectedVariant} />
      <div className="space-y-4">
        <ProductInfo />
        <VariantSelector
          value={selectedVariant}
          onChange={setSelectedVariant}
        />
        <QuantitySelector value={quantity} onChange={setQuantity} />
        <AddToCartButton
          variant={selectedVariant}
          quantity={quantity}
        />
      </div>
    </div>
  );
}
```

### Context for Global State

Use React Context sparingly for truly global state:

```typescript
// lib/contexts/ThemeContext.tsx
import { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

## Performance Optimization

### Memoization

Use `useMemo` for expensive computations:

```typescript
function DataTable({ data, filters }: Props) {
  const filteredData = useMemo(() => {
    return data.filter(item =>
      Object.entries(filters).every(([key, value]) =>
        item[key] === value
      )
    );
  }, [data, filters]);

  return <Table data={filteredData} />;
}
```

### Callback Memoization

Use `useCallback` for functions passed to children:

```typescript
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleToggle = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  }, []);

  return (
    <ul className="space-y-2">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />
      ))}
    </ul>
  );
}
```

### Avoid Inline Object/Array Creation

```typescript
// Bad - creates new object on every render
<Component style={{ padding: 16 }} />

// Good - use Tailwind
<Component className="p-4" />
```

### React.memo for Pure Components

```typescript
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
}

export const TodoItem = React.memo(({ todo, onToggle }: TodoItemProps) => {
  return (
    <li className="flex items-center gap-2">
      <Checkbox
        checked={todo.done}
        onCheckedChange={() => onToggle(todo.id)}
      />
      <span className={cn(todo.done && "line-through text-muted-foreground")}>
        {todo.text}
      </span>
    </li>
  );
});
```

## Error Handling

### Error Boundaries

Implement in `app/root.tsx`:

```typescript
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">{error.status}</h1>
          <p className="text-muted-foreground">{error.statusText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Oops!</h1>
        <p className="text-muted-foreground">Something went wrong</p>
      </div>
    </div>
  );
}
```

### Graceful Degradation

Always handle loading and error states:

```typescript
function UserProfile({ userId }: Props) {
  const { data, isLoading, error } = useUser(userId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load user profile. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return <div>{/* Success state */}</div>;
}
```

## Accessibility

### Semantic HTML

Use proper HTML elements:

```typescript
// Good
<button onClick={handleClick}>Click me</button>
<nav>...</nav>
<main>...</main>

// Bad
<div onClick={handleClick}>Click me</div>
<div className="nav">...</div>
```

### ARIA Attributes

Add ARIA labels when semantic HTML isn't enough:

```typescript
<Button
  variant="ghost"
  size="icon"
  onClick={onClose}
  aria-label="Close dialog"
>
  <X className="h-4 w-4" />
</Button>
```

### Keyboard Navigation

Ensure all interactive elements are keyboard accessible:

```typescript
function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      buttonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button ref={buttonRef} variant="outline">Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Focus Management

Use the `focus-visible` utility for better UX:

```typescript
<Button className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
  Click me
</Button>
```

## Testing with Vitest

### Component Tests

Place tests next to components with `.spec.tsx` suffix:

```typescript
// components/ui/Button.spec.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByText('Click')).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Utility Tests

Test utility functions in `lib/`:

```typescript
// lib/utils.spec.ts
import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });

  it("resolves Tailwind conflicts", () => {
    expect(cn("px-4 px-6")).toBe("px-6");
  });
});
```

### Test User Behavior

Focus on testing what users see and do:

```typescript
// Bad - testing implementation details
expect(component.state.isOpen).toBe(true);

// Good - testing user-visible behavior
expect(screen.getByRole("dialog")).toBeVisible();
expect(screen.getByText("Delete User")).toBeInTheDocument();
```

## TypeScript Best Practices

### Strict Type Safety

Avoid `any` extremely, use proper types:

```typescript
// Bad
function handleData(data: any) {}

// Good
interface ApiResponse {
  data: User[];
  total: number;
}

function handleData(response: ApiResponse) {}
```

### Utility Types

Use TypeScript utility types:

```typescript
type PartialUser = Partial<User>;
type UserKeys = keyof User;
type UserWithoutId = Omit<User, "id">;
type UserNameAndEmail = Pick<User, "name" | "email">;
type ReadonlyUser = Readonly<User>;
```

### Discriminated Unions

Use for complex state:

```typescript
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function UserProfile() {
  const [state, setState] = useState<AsyncState<User>>({ status: 'idle' });

  // TypeScript narrows the type based on status
  if (state.status === 'success') {
    return <div>{state.data.name}</div>; // data is available
  }

  if (state.status === 'error') {
    return <div>{state.error.message}</div>; // error is available
  }

  return <Skeleton />;
}
```

## Code Style

### Naming Conventions

- **Components**: PascalCase (`UserProfile`, `NavigationBar`)
- **Hooks**: camelCase with `use` prefix (`useAuth`, `useDebounce`)
- **Utilities**: camelCase (`formatDate`, `cn`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (`User`, `ButtonProps`)

### Import Organization

```typescript
// 1. React and routing
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// 2. UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// 3. Custom hooks and utilities
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

// 4. Types
import type { User } from "@/types";

// 5. Relative imports
import { UserProfile } from "./UserProfile";
```

### File Structure

Organize imports, types, component, and exports:

```typescript
// Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Types
interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

// Component
export function UserCard({ user, onEdit }: UserCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("transition-shadow", isHovered && "shadow-lg")}
    >
      <CardContent className="p-4">
        <h3 className="font-semibold">{user.name}</h3>
        <Button onClick={() => onEdit(user.id)}>Edit</Button>
      </CardContent>
    </Card>
  );
}

// Additional exports if needed
export type { UserCardProps };
```

## Common Anti-Patterns to Avoid

1. **Prop Drilling** - Use composition, context, or state management instead
2. **God Components** - Break large components into smaller, focused ones
3. **Side Effects in Render** - Use `useEffect` for side effects
4. **Mutating Props** - Props are immutable, create new objects
5. **Index as Key** - Use stable unique IDs for list keys
6. **Inline Functions in JSX** - Extract to `useCallback` or define outside
7. **Not Using `cn`** - Always use `cn` for className logic
8. **Hardcoded Styles** - Use Tailwind classes and CSS variables
9. **Missing Error States** - Always handle loading, error, and empty states
10. **Ignoring Accessibility** - Use semantic HTML and ARIA attributes

## Pre-Commit Checklist

Before committing, verify:

- [ ] Component has single, clear responsibility
- [ ] TypeScript types are defined (no `any`)
- [ ] Uses `cn` utility for className logic
- [ ] Uses Tailwind classes (not inline styles)
- [ ] Handles loading, error, and empty states
- [ ] Accessibility: semantic HTML, ARIA labels, keyboard nav
- [ ] Performance: memoization where needed
- [ ] Tests written (at least happy path)
- [ ] No console.logs or commented code
- [ ] Follows naming conventions
- [ ] Imports are organized
- [ ] Route added to `App.tsx` if applicable

## Quick Reference

### Common UI Patterns

**Loading State:**

```typescript
{isLoading && <Skeleton className="h-20 w-full" />}
```

**Error State:**

```typescript
{error && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{error.message}</AlertDescription>
  </Alert>
)}
```

**Empty State:**

```typescript
{data.length === 0 && (
  <div className="text-center text-muted-foreground">
    No items found
  </div>
)}
```

**Conditional Classes:**

```typescript
className={cn(
  "base-classes",
  isActive && "active-classes",
  isDisabled && "disabled-classes",
  className
)}
```

## Resources

- React Docs: https://react.dev
- React Router: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com
- Radix UI: https://radix-ui.com
- Vitest: https://vitest.dev
- shadcn/ui: https://ui.shadcn.com
