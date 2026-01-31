import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsService } from '@/services/api';
import { queryKeys } from '@/lib/query-keys';
import { toast } from 'sonner';

/**
 * Hook for deleting a transaction
 *
 * Automatically invalidates transactions and dashboard queries on success.
 *
 * @returns Mutation function and status
 *
 * @example
 * ```tsx
 * const deleteTransaction = useDeleteTransaction();
 *
 * const handleDelete = (id: string) => {
 *   if (confirm('Are you sure?')) {
 *     deleteTransaction.mutate(id);
 *   }
 * };
 * ```
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionsService.delete(id),
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all });
      toast.success('Transaction deleted successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete transaction');
      console.error('Delete transaction error:', error);
    },
  });
}
