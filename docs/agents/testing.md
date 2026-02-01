# Testing Requirements

---

## Testing Stack

| Tool            | Purpose           |
| --------------- | ----------------- |
| Vitest          | Test runner       |
| Testing Library | Component testing |
| jsdom           | DOM environment   |

---

## What Requires Tests

### Mandatory Tests

- Utility functions in `src/lib/`
- Custom hooks in `src/hooks/`
- Data transformations
- Business logic
- Form validation schemas

### Optional Tests (Based on Complexity)

- Complex components with significant logic
- Multi-step user flows
- Critical paths (if any)

---

## What NOT to Test

- Third-party library behavior
- Simple getters/setters
- Trivial functions
- Pure UI styling

---

## File Naming & Location

### Convention

```
{filename}.test.ts   # For TypeScript files
{filename}.test.tsx  # For React components
```

### Location

Co-locate tests with source files:

```
src/lib/
├── amount-utils.ts
└── amount-utils.test.ts

src/hooks/queries/
├── useTransactions.ts
└── useTransactions.test.ts
```

---

## Running Tests

```bash
# Run all tests
npm run test

# Watch mode (re-runs on file changes)
npm run test:watch

# With coverage report
npm run test:coverage
```

---

## Unit Test Example

```typescript
// src/lib/amount-utils.test.ts
import { describe, it, expect } from "vitest";
import { normalizeAmount, parseAmount, isValidAmount } from "./amount-utils";

describe("normalizeAmount", () => {
  it("replaces comma with period", () => {
    expect(normalizeAmount("1234,56")).toBe("1234.56");
  });

  it("keeps period unchanged", () => {
    expect(normalizeAmount("1234.56")).toBe("1234.56");
  });

  it("handles empty string", () => {
    expect(normalizeAmount("")).toBe("");
  });

  it("handles multiple commas", () => {
    expect(normalizeAmount("1,234,56")).toBe("1.234.56");
  });
});

describe("parseAmount", () => {
  it("parses valid decimal", () => {
    expect(parseAmount("123.45")).toBe(123.45);
  });

  it("parses integer", () => {
    expect(parseAmount("100")).toBe(100);
  });

  it("returns null for invalid input", () => {
    expect(parseAmount("abc")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseAmount("")).toBeNull();
  });
});

describe("isValidAmount", () => {
  it("returns true for positive number", () => {
    expect(isValidAmount(100)).toBe(true);
  });

  it("returns false for zero", () => {
    expect(isValidAmount(0)).toBe(false);
  });

  it("returns false for negative", () => {
    expect(isValidAmount(-50)).toBe(false);
  });

  it("returns false for NaN", () => {
    expect(isValidAmount(NaN)).toBe(false);
  });
});
```

---

## Hook Test Example

```typescript
// src/hooks/queries/useTransactions.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTransactions } from './useTransactions';
import { transactionsService } from '@/services/api';

// Mock the service
vi.mock('@/services/api', () => ({
  transactionsService: {
    getAll: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns transactions data on success', async () => {
    const mockTransactions = [
      { id: '1', title: 'Test', amount: 100 },
    ];

    vi.mocked(transactionsService.getAll).mockResolvedValue(mockTransactions);

    const { result } = renderHook(() => useTransactions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockTransactions);
  });

  it('returns error on failure', async () => {
    vi.mocked(transactionsService.getAll).mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => useTransactions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});
```

---

## Component Test Example

```typescript
// src/components/ui/amount-input.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AmountInput } from './amount-input';

describe('AmountInput', () => {
  it('renders with placeholder', () => {
    render(<AmountInput value="" onChange={() => {}} />);

    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
  });

  it('calls onChange with valid input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<AmountInput value="" onChange={onChange} />);

    await user.type(screen.getByRole('textbox'), '123.45');

    expect(onChange).toHaveBeenCalled();
  });

  it('accepts comma as decimal separator', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<AmountInput value="" onChange={onChange} />);

    await user.type(screen.getByRole('textbox'), '123,45');

    expect(onChange).toHaveBeenCalled();
  });

  it('disables input when disabled prop is true', () => {
    render(<AmountInput value="100" onChange={() => {}} disabled />);

    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
```

---

## Testing Patterns

### Arrange-Act-Assert

```typescript
it('should create transaction', async () => {
  // Arrange
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<TransactionForm onSubmit={onSubmit} />);

  // Act
  await user.type(screen.getByLabelText('Title'), 'Groceries');
  await user.type(screen.getByLabelText('Amount'), '50');
  await user.click(screen.getByRole('button', { name: 'Save' }));

  // Assert
  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({
      title: 'Groceries',
      amount: 50,
    })
  );
});
```

### Testing Async Operations

```typescript
import { waitFor } from '@testing-library/react';

it('shows loading then data', async () => {
  render(<TransactionsList />);

  // Initially shows loading
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Wait for data
  await waitFor(() => {
    expect(screen.getByText('Transaction 1')).toBeInTheDocument();
  });
});
```

### Mocking

```typescript
// Mock module
vi.mock("@/services/api", () => ({
  transactionsService: {
    getAll: vi.fn(),
  },
}));

// Mock function
const mockFn = vi.fn().mockResolvedValue({ data: [] });

// Reset between tests
beforeEach(() => {
  vi.clearAllMocks();
});
```

---

## Test Utilities

Location: `src/test/test-utils.tsx`

```typescript
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}
```

Usage:

```typescript
import { renderWithProviders } from '@/test/test-utils';

it('renders component', () => {
  renderWithProviders(<MyComponent />);
  // ...
});
```
