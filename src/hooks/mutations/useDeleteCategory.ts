import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '@/services/api';
import { queryKeys } from '@/lib/query-keys';
import { toast } from 'sonner';
import { createMutationErrorHandler } from '@/lib/mutation-error-handler';

/**
 * Hook for deleting a category
 *
 * Automatically invalidates categories and transactions queries on success
 * (transactions include category data).
 *
 * @returns Mutation function and status
 *
 * @example
 * ```tsx
 * const deleteCategory = useDeleteCategory();
 *
 * const handleDelete = (id: string) => {
 *   if (confirm('Delete this category?')) {
 *     deleteCategory.mutate(id);
 *   }
 * };
 * ```
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      // Invalidate categories and transactions (since transactions include category data)
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      toast.success('Category deleted successfully');
    },
    onError: createMutationErrorHandler({
      action: 'delete category',
      feature: 'CATEGORIES',
    }),
  });
}
