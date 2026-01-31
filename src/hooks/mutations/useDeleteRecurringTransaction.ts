import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recurringTransactionsService } from '@/services/api';
import { queryKeys } from '@/lib/query-keys';
import { toast } from 'sonner';

/**
 * Hook for deleting a recurring transaction
 *
 * Automatically invalidates recurring transactions queries on success.
 *
 * @returns Mutation function and status
 *
 * @example
 * ```tsx
 * const deleteRecurring = useDeleteRecurringTransaction();
 *
 * const handleDelete = (id: string) => {
 *   if (confirm('Delete this recurring transaction?')) {
 *     deleteRecurring.mutate(id);
 *   }
 * };
 * ```
 */
export function useDeleteRecurringTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recurringTransactionsService.delete(id),
    onSuccess: () => {
      // Invalidate recurring transactions queries
      queryClient.invalidateQueries({ queryKey: queryKeys.recurringTransactions.all });
      toast.success('Recurring transaction deleted successfully');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to delete recurring transaction'
      );
      console.error('Delete recurring transaction error:', error);
    },
  });
}
