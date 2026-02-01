/**
 * Sentry Integration Module
 *
 * Handles error tracking, performance monitoring, and structured logging using Sentry.
 * Based on project documentation in docs/agents/error-exception-tracking.md
 */

import * as Sentry from '@sentry/react';
import { ErrorType, ErrorContext } from '@/types/errors';

/**
 * Initialize Sentry for error tracking and performance monitoring
 *
 * Call this in main.tsx before rendering the app.
 *
 * @example
 * ```typescript
 * import { initializeSentry } from '@/lib/sentry';
 *
 * initializeSentry();
 * // ... rest of main.tsx
 * ```
 */
export function initializeSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  // Only initialize if DSN is provided
  if (!dsn) {
    console.warn('Sentry DSN not found. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    // Only enable in production by default
    enabled: import.meta.env.MODE === 'production',

    // Enable structured logging
    enableLogs: true,

    // Performance monitoring - sample 10% of transactions in production
    tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,

    // Integrations
    integrations: [
      // Capture console logs as breadcrumbs
      Sentry.consoleLoggingIntegration({
        levels: ['log', 'warn', 'error'],
      }),
      // Browser tracing for performance monitoring
      Sentry.browserTracingIntegration(),
      // Session replay for debugging (optional - can enable later)
      // Sentry.replayIntegration(),
    ],

    // Filter out expected errors before sending to Sentry
    beforeSend(event, hint) {
      const error = hint.originalException;

      // Don't send 401 errors (auth redirects are expected and handled)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          return null;
        }
      }

      return event;
    },
  });
}

/**
 * Sentry structured logger instance
 *
 * Use this instead of console.log/error for consistent logging.
 *
 * @example
 * ```typescript
 * logger.error('Failed to process payment', { orderId: '123', amount: 99.99 });
 * logger.warn('Rate limit reached', { endpoint: '/api/transactions' });
 * logger.info('User logged in', { userId: '123' });
 * ```
 */
export const logger = Sentry.logger;

/**
 * Report error to Sentry with full context
 *
 * @param error - The error to report
 * @param context - Error context (action, feature, metadata)
 * @param errorType - Categorized error type
 * @param statusCode - HTTP status code if applicable
 *
 * @example
 * ```typescript
 * reportErrorToSentry(error, {
 *   action: 'create transaction',
 *   feature: 'TRANSACTIONS',
 * }, ErrorType.SERVER, 500);
 * ```
 */
export function reportErrorToSentry(
  error: unknown,
  context: ErrorContext,
  errorType: ErrorType,
  statusCode?: number
) {
  // Set context for this error
  Sentry.setContext('error_context', {
    action: context.action,
    feature: context.feature,
    errorType,
    statusCode,
    metadata: context.metadata,
  });

  // Capture the exception with appropriate severity
  Sentry.captureException(error, {
    level: getSentryLevel(errorType, statusCode),
    tags: {
      feature: context.feature || 'unknown',
      errorType,
    },
  });
}

/**
 * Determine Sentry severity level based on error type and status code
 *
 * @param errorType - The categorized error type
 * @param statusCode - HTTP status code if applicable
 * @returns Sentry severity level
 */
function getSentryLevel(
  errorType: ErrorType,
  statusCode?: number
): Sentry.SeverityLevel {
  // Server errors (5xx) are critical
  if (errorType === ErrorType.SERVER && statusCode && statusCode >= 500) {
    return 'error';
  }

  // Network errors are warnings (could be user's connection)
  if (errorType === ErrorType.NETWORK) {
    return 'warning';
  }

  // Client-side JavaScript errors are errors
  if (errorType === ErrorType.CLIENT) {
    return 'error';
  }

  // Validation errors are info level (user input issues, not bugs)
  if (errorType === ErrorType.VALIDATION) {
    return 'info';
  }

  // Authentication/authorization are warnings (expected in some cases)
  if (
    errorType === ErrorType.AUTHENTICATION ||
    errorType === ErrorType.AUTHORIZATION
  ) {
    return 'warning';
  }

  // Default to warning for unknown errors
  return 'warning';
}

/**
 * Create a Sentry span for performance tracking
 *
 * Use for tracking API calls, user interactions, and other operations.
 *
 * @param operation - Operation type (e.g., 'http.client', 'ui.click')
 * @param description - Human-readable description
 * @param fn - Async function to track
 * @returns Result of the function
 *
 * @example
 * ```typescript
 * // Track API call performance
 * const data = await createSentrySpan(
 *   'http.client',
 *   'GET /api/transactions',
 *   async () => {
 *     return await apiClient.get('/transactions');
 *   }
 * );
 * ```
 */
export function createSentrySpan<T>(
  operation: string,
  description: string,
  fn: () => Promise<T>
): Promise<T> {
  return Sentry.startSpan(
    {
      op: operation,
      name: description,
    },
    async (span) => {
      try {
        const result = await fn();
        span?.setStatus({ code: 1, message: 'ok' });
        return result;
      } catch (error) {
        span?.setStatus({ code: 2, message: 'error' });
        throw error;
      }
    }
  );
}

/**
 * Set user context in Sentry
 *
 * Call this after user logs in to associate errors with specific users.
 *
 * @param user - User information
 *
 * @example
 * ```typescript
 * setSentryUser({
 *   id: user.id,
 *   email: user.email,
 * });
 * ```
 */
export function setSentryUser(user: { id: string; email?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
  });
}

/**
 * Clear user context in Sentry
 *
 * Call this when user logs out.
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}
