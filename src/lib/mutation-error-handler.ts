/**
 * Mutation Error Handler Utilities
 *
 * Provides standardized error handling for React Query mutations.
 */

import { handleApiError } from "@/lib/error-handling";
import { ErrorContext } from "@/types/errors";

/**
 * Creates a standard error handler for React Query mutations
 *
 * Use in the onError callback of useMutation to get consistent error handling:
 * - Logs error with context
 * - Shows user-friendly toast notification
 * - Reports to Sentry
 *
 * @param context - Error context (action, feature, metadata)
 * @returns Error handler function for useMutation
 *
 * @example
 * ```typescript
 * export function useCreateTransaction() {
 *   return useMutation({
 *     mutationFn: (data) => transactionsService.create(data),
 *     onError: createMutationErrorHandler({
 *       action: 'create transaction',
 *       feature: 'TRANSACTIONS',
 *     }),
 *     onSuccess: () => {
 *       toast.success('Transaction created');
 *     },
 *   });
 * }
 * ```
 */
export function createMutationErrorHandler(context: ErrorContext) {
  return (error: unknown) => {
    // handleApiError logs, shows toast, and reports to Sentry
    handleApiError(error, context);
    // No need for additional console.error or toast
  };
}
