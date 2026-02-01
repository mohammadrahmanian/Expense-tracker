# Error Handling Guide

**Last Updated:** February 1, 2026
**Version:** 1.0.0

---

## Overview

This application uses a centralized error handling system that provides:

- **Consistent error categorization** - Network, validation, auth, server errors
- **User-friendly messages** - Centralized error messages optimized for end users
- **Sentry integration** - Automatic error tracking and structured logging
- **Type safety** - Full TypeScript support for error handling
- **No duplication** - Single source of truth for error handling logic

---

## Architecture

### Error Handling Flow

```
API Call → Error Occurs → handleApiError() → {
  1. Categorize error (NETWORK, AUTH, SERVER, etc.)
  2. Determine user message (from constants or backend)
  3. Log to Sentry with context
  4. Show toast notification (optional)
  5. Return categorized error object
}
```

### Key Components

1. **Error Types** (`src/types/errors.ts`)
   - Type definitions for errors and context
   - Error categorization enum

2. **Error Messages** (`src/constants/error-messages.ts`)
   - Centralized user-facing messages
   - Organized by feature area

3. **Error Categorization** (`src/lib/error-categorization.ts`)
   - Logic to categorize errors by type
   - Extract status codes and messages

4. **Sentry Integration** (`src/lib/sentry.ts`)
   - Initialization and configuration
   - Error reporting with context
   - Performance tracking spans

5. **Central Handler** (`src/lib/error-handling.ts`)
   - Main `handleApiError` function
   - Coordinates all error handling logic

6. **Mutation Helper** (`src/lib/mutation-error-handler.ts`)
   - Simplified error handler for React Query mutations

---

## Usage Patterns

### 1. API Service Layer

Use in all API service methods to handle errors consistently.

```typescript
import { handleApiError } from "@/lib/error-handling";

export const transactionsService = {
  getAll: async () => {
    try {
      const response = await apiClient.get("/transactions");
      return response.data;
    } catch (error) {
      handleApiError(error, {
        action: "fetch transactions",
        feature: "TRANSACTIONS",
      });
      throw error; // Re-throw for React Query to handle
    }
  },
};
```

**Important:** Always re-throw the error after handling so React Query can manage retry logic and error states.

### 2. React Query Mutations

Use `createMutationErrorHandler` for consistent mutation error handling.

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "@/services/api";
import { createMutationErrorHandler } from "@/lib/mutation-error-handler";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => transactionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction created successfully");
    },
    onError: createMutationErrorHandler({
      action: "create transaction",
      feature: "TRANSACTIONS",
    }),
  });
}
```

### 3. Context Error Handling

Use in React contexts for authentication and other global state.

```typescript
import { handleApiError } from "@/lib/error-handling";

const login = async (email: string, password: string) => {
  try {
    const response = await authService.login(email, password);
    setUser(response.user);
  } catch (error) {
    handleApiError(error, {
      action: "login",
      feature: "AUTH",
    });
    throw error; // Re-throw for component to handle
  }
};
```

### 4. Custom Error Handling Options

You can customize error handling behavior with options:

```typescript
handleApiError(
  error,
  {
    action: "logout",
    feature: "AUTH",
  },
  {
    showToast: false, // Don't show toast notification
    logError: true, // Still log to console/Sentry
    reportToSentry: true, // Still report to Sentry
    customMessage: "Custom error message", // Override default message
  },
);
```

---

## Error Categorization

### Error Types

The system categorizes errors into these types:

| Error Type       | HTTP Status               | Example                                    |
| ---------------- | ------------------------- | ------------------------------------------ |
| `NETWORK`        | No response               | Internet connection lost                   |
| `AUTHENTICATION` | 401                       | Invalid credentials, session expired       |
| `AUTHORIZATION`  | 403                       | Insufficient permissions                   |
| `VALIDATION`     | 400-499 (except 401, 403) | Invalid input, missing fields              |
| `SERVER`         | 500-599                   | Internal server error, service unavailable |
| `CLIENT`         | N/A                       | TypeError, ReferenceError in browser       |
| `UNKNOWN`        | N/A                       | Unrecognized error type                    |

### How Categorization Works

```typescript
// Network error (no response)
if (error instanceof AxiosError && !error.response && error.request) {
  return ErrorType.NETWORK;
}

// HTTP status-based categorization
if (error.response) {
  const status = error.response.status;

  if (status === 401) return ErrorType.AUTHENTICATION;
  if (status === 403) return ErrorType.AUTHORIZATION;
  if (status >= 400 && status < 500) return ErrorType.VALIDATION;
  if (status >= 500) return ErrorType.SERVER;
}
```

---

## Adding New Error Messages

Error messages are centralized in `src/constants/error-messages.ts`.

### Structure

```typescript
export const ERROR_MESSAGES = {
  FEATURE_NAME: {
    ACTION_FAILED: "User-friendly message",
  },
};
```

### Example: Adding Messages for a New Feature

```typescript
// In src/constants/error-messages.ts

export const ERROR_MESSAGES = {
  // ... existing features

  // New feature
  BUDGETS: {
    CREATE_FAILED: "Failed to create budget. Please try again.",
    UPDATE_FAILED: "Failed to update budget. Please try again.",
    DELETE_FAILED: "Failed to delete budget. Please try again.",
    LOAD_FAILED: "Failed to load budgets. Please try again.",
    EXCEEDED: "You have exceeded your budget limit.",
  },
} as const;
```

### Best Practices

- **Be specific** - Messages should be clear and actionable
- **Be concise** - Keep messages short (under 100 characters)
- **Be helpful** - Suggest what the user should do next
- **Avoid jargon** - Don't expose technical details to users
- **Stay positive** - Use "Failed to..." instead of "Error:"

---

## Sentry Integration

### Initialization

Sentry is initialized in `src/main.tsx` before the React app renders:

```typescript
import { initializeSentry } from "@/lib/sentry";

initializeSentry();
// ... ReactDOM.createRoot()
```

### Configuration

Set the Sentry DSN in your environment variables:

```bash
# .env
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### What Gets Logged

**Automatically logged:**

- All errors categorized as SERVER, CLIENT, or UNKNOWN
- Network errors (as warnings)
- Error context (action, feature, metadata)
- User information (if authenticated)
- Stack traces and error grouping

**Filtered out:**

- 401 errors (expected auth redirects)
- Validation errors (user input issues - logged as 'info' level)

### Sentry Logger

Replace `console.error` with Sentry's structured logger:

```typescript
import { logger } from "@/lib/sentry";

// ❌ Don't use
console.error("Error occurred:", error);

// ✅ Use Sentry logger
logger.error(logger.fmt`[${feature}:${action}] ${message}`, {
  errorType,
  statusCode,
  context,
  originalError: error,
});
```

### Performance Tracking

Use Sentry spans to track API performance:

```typescript
import { createSentrySpan } from "@/lib/sentry";

const data = await createSentrySpan(
  "http.client",
  "POST /api/transactions",
  async () => {
    return await apiClient.post("/transactions", transactionData);
  },
);
```

---

## Testing Error Scenarios

### Manual Testing Checklist

**1. Network Errors**

- [ ] Disconnect internet and try to create a transaction
- [ ] Verify user sees "Unable to connect to server" message
- [ ] Check Sentry dashboard for network error with context

**2. Server Errors (500)**

- [ ] Mock 500 response or trigger on backend
- [ ] Verify user sees "Server error. Please try again later"
- [ ] Check error is logged to Sentry with 'error' level

**3. Validation Errors (400)**

- [ ] Submit invalid data (e.g., negative amount)
- [ ] Verify user sees specific backend validation message
- [ ] Check error is logged as 'info' level (not critical)

**4. Authentication Errors (401)**

- [ ] Invalidate auth token/cookie
- [ ] Try to fetch protected data
- [ ] Verify user redirected to login
- [ ] Verify "Session expired" message shown
- [ ] Check 401 NOT sent to Sentry (filtered out)

**5. Authorization Errors (403)**

- [ ] Access resource without permission (if applicable)
- [ ] Verify "Not authorized" message shown

**6. Success Path**

- [ ] Verify all CRUD operations still work correctly
- [ ] Verify success toasts still shown
- [ ] No console errors

### Automated Testing

Test error utilities:

```typescript
// src/lib/error-categorization.test.ts
import { describe, it, expect } from "vitest";
import { categorizeError } from "./error-categorization";
import { AxiosError } from "axios";

describe("categorizeError", () => {
  it("should categorize 401 as AUTHENTICATION", () => {
    const error = new AxiosError();
    error.response = { status: 401 } as any;

    expect(categorizeError(error)).toBe(ErrorType.AUTHENTICATION);
  });

  it("should categorize network errors", () => {
    const error = new AxiosError();
    error.request = {}; // Request made
    error.response = undefined; // No response

    expect(categorizeError(error)).toBe(ErrorType.NETWORK);
  });
});
```

---

## Common Patterns & Examples

### Pattern 1: API Service with Metadata

Include additional context for debugging:

```typescript
export const transactionsService = {
  delete: async (id: string) => {
    try {
      const response = await apiClient.delete(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, {
        action: "delete transaction",
        feature: "TRANSACTIONS",
        metadata: { transactionId: id }, // Additional context
      });
      throw error;
    }
  },
};
```

### Pattern 2: Silent Error Logging

Log errors without showing toast notifications:

```typescript
try {
  await analyticsService.track("page_view");
} catch (error) {
  handleApiError(
    error,
    { action: "track analytics", feature: "ANALYTICS" },
    { showToast: false }, // Don't bother user with analytics failures
  );
}
```

### Pattern 3: Custom Error Messages

Override default messages for specific scenarios:

```typescript
try {
  await transactionsService.create(largeTransaction);
} catch (error) {
  handleApiError(
    error,
    { action: "create large transaction", feature: "TRANSACTIONS" },
    {
      customMessage:
        "Transaction amount exceeds limit. Please contact support.",
    },
  );
  throw error;
}
```

### Pattern 4: Client-Side Validation

Keep client-side validation toasts separate from API errors:

```typescript
const handleSubmit = async (data) => {
  // Client-side validation - use toast directly
  if (!data.amount || data.amount <= 0) {
    toast.error("Please enter a valid amount");
    return;
  }

  // API errors - handled by mutation hook
  createTransaction.mutate(data);
};
```

---

## Migration Guide

### Migrating Existing Code

**Old Pattern:**

```typescript
try {
  const response = await apiClient.get("/data");
  return response.data;
} catch (error) {
  console.error("Fetch failed:", error);
  toast.error("Failed to load data");
  return null;
}
```

**New Pattern:**

```typescript
try {
  const response = await apiClient.get("/data");
  return response.data;
} catch (error) {
  handleApiError(error, {
    action: "fetch data",
    feature: "FEATURE_NAME",
  });
  throw error; // Let React Query handle
}
```

### Key Changes

1. ✅ Import `handleApiError`
2. ✅ Remove `console.error` (handled by Sentry logger)
3. ✅ Remove `toast.error` (handled by handleApiError)
4. ✅ Add error context (action, feature)
5. ✅ Re-throw error for React Query
6. ✅ Remove `return null` or empty arrays on error

---

## Troubleshooting

### Error not showing toast notification

**Check:**

- Is `showToast: false` set in options?
- Is the error being caught before reaching handleApiError?
- Is toast provider properly configured in app?

### Error not logged to Sentry

**Check:**

- Is `VITE_SENTRY_DSN` environment variable set?
- Is Sentry enabled for current environment?
- Is error type filtered out (401, validation)?
- Check Sentry dashboard for rate limiting

### Duplicate error messages

**Check:**

- Are you calling `toast.error` manually AND using handleApiError?
- Are both API service and mutation hook handling errors?
- Remove manual error handling - let the system handle it

### TypeScript errors with error types

**Fix:**

```typescript
// ✅ Correct
import { ErrorContext } from '@/types/errors';

const context: ErrorContext = {
  action: 'my action',
  feature: 'MY_FEATURE',
};

// ❌ Wrong - feature should be a string, not typed enum
feature: 'MY_FEATURE' as const,
```

---

## Best Practices Summary

1. **Always use handleApiError** for all API errors
2. **Always re-throw** errors after handling (for React Query)
3. **Never use console.error** for API errors (use Sentry logger)
4. **Never duplicate toasts** (handleApiError shows them)
5. **Include context** (action, feature) with every error
6. **Add metadata** for additional debugging context when helpful
7. **Keep client validation separate** from API error handling
8. **Test error scenarios** manually and with automated tests
9. **Update error messages** in centralized constants
10. **Monitor Sentry** dashboard regularly for production issues

---

## Reference

### File Locations

- **Error types:** `src/types/errors.ts`
- **Error messages:** `src/constants/error-messages.ts`
- **Error categorization:** `src/lib/error-categorization.ts`
- **Sentry integration:** `src/lib/sentry.ts`
- **Main handler:** `src/lib/error-handling.ts`
- **Mutation helper:** `src/lib/mutation-error-handler.ts`

### Related Documentation

- [Sentry Integration Guide](./error-exception-tracking.md)
- [Agent Guidelines](../../AGENTS.md)
- [Code Review](../../FRONTEND_CODE_REVIEW.md)

---

**For questions or improvements, update this documentation and create a pull request.**
