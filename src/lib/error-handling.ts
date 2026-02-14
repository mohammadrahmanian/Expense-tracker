/**
 * Centralized Error Handling
 *
 * Main error handling function that provides consistent error handling
 * across the application.
 */

import { toast } from "sonner";
import { ErrorType, ErrorContext, CategorizedError } from "@/types/errors";
import { ERROR_MESSAGES } from "@/constants/error-messages";
import {
  categorizeError,
  extractBackendMessage,
  getStatusCode,
} from "./error-categorization";
import { logger, reportErrorToSentry } from "./sentry";

/**
 * Options for error handling behavior
 */
export interface ErrorHandlingOptions {
  /** Whether to show toast notification (default: true) */
  showToast?: boolean;

  /** Whether to log error (default: true) */
  logError?: boolean;

  /** Custom error message to override default */
  customMessage?: string;

  /** Whether to report to Sentry (default: true if shouldReportError) */
  reportToSentry?: boolean;
}

/**
 * Main error handling function
 *
 * Handles errors consistently across the application:
 * 1. Categorizes the error type
 * 2. Determines user-friendly message
 * 3. Logs error with context (using Sentry logger)
 * 4. Shows toast notification
 * 5. Reports to Sentry error tracking
 *
 * @param error - The error that occurred
 * @param context - Context about what user was doing
 * @param options - Optional behavior customization
 * @returns Categorized error with full context
 *
 * @example
 * ```typescript
 * try {
 *   await apiClient.post('/transactions', data);
 * } catch (error) {
 *   handleApiError(error, {
 *     action: 'create transaction',
 *     feature: 'TRANSACTIONS',
 *   });
 *   throw error; // Re-throw for React Query
 * }
 * ```
 */
export function handleApiError(
  error: unknown,
  context: ErrorContext,
  options?: ErrorHandlingOptions,
): CategorizedError {
  const {
    showToast = true,
    logError = true,
    customMessage,
    reportToSentry = true,
  } = options || {};

  // Categorize the error
  const errorType = categorizeError(error);
  const statusCode = getStatusCode(error);
  const backendMessage = extractBackendMessage(error);

  // Determine user-friendly message
  const userMessage =
    customMessage ||
    backendMessage ||
    getDefaultMessage(errorType, context) ||
    ERROR_MESSAGES.GENERIC.UNKNOWN;

  // Log error using Sentry structured logging
  if (logError) {
    logger.error(
      logger.fmt`[${context.feature || "App"}:${context.action}] ${userMessage}`,
      {
        errorType,
        statusCode,
        context,
        originalError: error,
      },
    );
  }

  // Show user notification
  if (showToast) {
    toast.error(userMessage);
  }

  // Report to Sentry if appropriate
  if (reportToSentry && shouldReportError(errorType, statusCode)) {
    reportErrorToSentry(error, context, errorType, statusCode);
  }

  return {
    type: errorType,
    message: userMessage,
    originalError: error,
    statusCode,
    context,
  };
}

/**
 * Gets default error message based on error type and context
 *
 * @param errorType - The categorized error type
 * @param context - Error context
 * @returns Default error message or undefined
 */
function getDefaultMessage(
  errorType: ErrorType,
  context: ErrorContext,
): string | undefined {
  // Network errors
  if (errorType === ErrorType.NETWORK) {
    return ERROR_MESSAGES.NETWORK.NO_RESPONSE;
  }

  // Authentication errors
  if (errorType === ErrorType.AUTHENTICATION) {
    return ERROR_MESSAGES.AUTH.SESSION_EXPIRED;
  }

  // Authorization errors
  if (errorType === ErrorType.AUTHORIZATION) {
    return ERROR_MESSAGES.AUTH.UNAUTHORIZED;
  }

  // Feature-specific errors based on context
  if (context.feature) {
    const featureMessages =
      ERROR_MESSAGES[context.feature as keyof typeof ERROR_MESSAGES];
    if (featureMessages && typeof featureMessages === "object") {
      // Convert action to uppercase with underscores (e.g., "fetch transactions" -> "FETCH_TRANSACTIONS")
      const actionKey = context.action.toUpperCase().replace(/ /g, "_");
      const message =
        featureMessages[actionKey as keyof typeof featureMessages];
      if (typeof message === "string") {
        return message;
      }
    }
  }

  // Server errors
  if (errorType === ErrorType.SERVER) {
    return ERROR_MESSAGES.GENERIC.SERVER_ERROR;
  }

  return undefined;
}

/**
 * Determines if error should be reported to Sentry
 *
 * @param errorType - The categorized error type
 * @param statusCode - HTTP status code if applicable
 * @returns Whether error should be reported
 */
function shouldReportError(errorType: ErrorType, statusCode?: number): boolean {
  // Don't report validation errors (user input errors, not bugs)
  if (errorType === ErrorType.VALIDATION) {
    return false;
  }

  // Don't report 401 (handled by auth flow and filtered in Sentry beforeSend)
  if (statusCode === 401) {
    return false;
  }

  // Report all other errors
  return true;
}
