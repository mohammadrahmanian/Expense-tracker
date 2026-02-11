/**
 * Error Types and Interfaces for Standardized Error Handling
 *
 * This module defines the types used throughout the error handling system.
 */

/**
 * Error type categories for classification
 */
export enum ErrorType {
  NETWORK = "NETWORK", // Network connectivity issues
  VALIDATION = "VALIDATION", // User input validation errors
  AUTHENTICATION = "AUTHENTICATION", // Auth failures (401)
  AUTHORIZATION = "AUTHORIZATION", // Permission errors (403)
  SERVER = "SERVER", // Server errors (5xx)
  CLIENT = "CLIENT", // Client-side errors (TypeError, etc.)
  UNKNOWN = "UNKNOWN", // Uncategorized errors
}

/**
 * Context information for error tracking
 *
 * Provides additional information about what the user was doing when the error occurred.
 */
export interface ErrorContext {
  /** Action the user was attempting (e.g., "create transaction", "login") */
  action: string;

  /** Feature area where error occurred (e.g., "TRANSACTIONS", "AUTH") */
  feature?: string;

  /** Additional metadata for debugging */
  metadata?: Record<string, unknown>;
}

/**
 * Categorized error with full context
 *
 * This is the return type of the error handling function.
 */
export interface CategorizedError {
  /** Categorized error type */
  type: ErrorType;

  /** User-friendly error message */
  message: string;

  /** Original error object for debugging */
  originalError?: unknown;

  /** HTTP status code if applicable */
  statusCode?: number;

  /** Context of when/where error occurred */
  context?: ErrorContext;
}
