import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recurringTransactionsService } from '@/services/api';
import { queryKeys } from '@/lib/query-keys';
import { toast } from 'sonner';

/**
 * Hook for toggling a recurring transaction's active status
 *
 * Automatically invalidates recurring transactions queries on success.
 *
 * @returns Mutation function and status
 *
 * @example
 * ```tsx
 * const toggleRecurring = useToggleRecurringTransaction();
 *
 * const handleToggle = (id: string, active: boolean) => {
 *   toggleRecurring.mutate({ id, active });
 * };
 * ```
 */
export function useToggleRecurringTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      recurringTransactionsService.toggleStatus(id, active),
    onSuccess: (_, variables) => {
      // Invalidate recurring transactions queries
      queryClient.invalidateQueries({ queryKey: queryKeys.recurringTransactions.all });
      toast.success(
        variables.active
          ? 'Recurring transaction activated'
          : 'Recurring transaction deactivated'
      );
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to toggle recurring transaction'
      );
      console.error('Toggle recurring transaction error:', error);
    },
  });
}
