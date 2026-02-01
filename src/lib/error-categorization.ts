/**
 * Error Categorization Utilities
 *
 * Utilities for categorizing errors based on their properties and extracting
 * relevant information from error objects.
 */

import { AxiosError } from 'axios';
import { ErrorType } from '@/types/errors';

/**
 * Categorizes an error based on its properties
 *
 * @param error - The error to categorize
 * @returns The categorized error type
 *
 * @example
 * ```typescript
 * const errorType = categorizeError(error);
 * if (errorType === ErrorType.NETWORK) {
 *   // Handle network error
 * }
 * ```
 */
export function categorizeError(error: unknown): ErrorType {
  // Axios errors (HTTP requests)
  if (error instanceof AxiosError) {
    // Network errors (no response from server)
    if (!error.response && error.request) {
      return ErrorType.NETWORK;
    }

    // HTTP status code based categorization
    if (error.response) {
      const status = error.response.status;

      if (status === 401) return ErrorType.AUTHENTICATION;
      if (status === 403) return ErrorType.AUTHORIZATION;
      if (status >= 400 && status < 500) return ErrorType.VALIDATION;
      if (status >= 500) return ErrorType.SERVER;
    }
  }

  // Client-side JavaScript errors
  if (error instanceof TypeError || error instanceof ReferenceError) {
    return ErrorType.CLIENT;
  }

  // Unknown error type
  return ErrorType.UNKNOWN;
}

/**
 * Extracts HTTP status code from error
 *
 * @param error - The error object
 * @returns HTTP status code or undefined
 */
export function getStatusCode(error: unknown): number | undefined {
  if (error instanceof AxiosError) {
    return error.response?.status;
  }
  return undefined;
}

/**
 * Extracts backend error message from error response
 *
 * @param error - The error object
 * @returns Backend error message or undefined
 */
export function extractBackendMessage(error: unknown): string | undefined {
  if (error instanceof AxiosError) {
    // Try to get message from response data
    const message = error.response?.data?.message;
    if (typeof message === 'string') {
      return message;
    }
  }
  return undefined;
}

/**
 * Extracts error message from any error type
 *
 * @param error - The error object
 * @returns Error message string
 */
export function extractErrorMessage(error: unknown): string {
  // Try Axios error first
  const backendMessage = extractBackendMessage(error);
  if (backendMessage) {
    return backendMessage;
  }

  // Try Error instance
  if (error instanceof Error) {
    return error.message;
  }

  // Try string error
  if (typeof error === 'string') {
    return error;
  }

  // Unknown error
  return 'An unexpected error occurred';
}
