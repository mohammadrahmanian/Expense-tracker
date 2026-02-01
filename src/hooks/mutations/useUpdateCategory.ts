import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '@/services/api';
import { queryKeys } from '@/lib/query-keys';
import { toast } from 'sonner';
import type { Category } from '@/types';
import { createMutationErrorHandler } from '@/lib/mutation-error-handler';

/**
 * Hook for updating an existing category
 *
 * Automatically invalidates categories and transactions queries on success
 * (transactions include category data).
 *
 * @returns Mutation function and status
 *
 * @example
 * ```tsx
 * const updateCategory = useUpdateCategory();
 *
 * const handleUpdate = (id: string, updates: Partial<Category>) => {
 *   updateCategory.mutate({ id, updates });
 * };
 * ```
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Category> }) =>
      categoriesService.update(id, updates),
    onSuccess: () => {
      // Invalidate categories and transactions (since transactions include category data)
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      toast.success('Category updated successfully');
    },
    onError: createMutationErrorHandler({
      action: 'update category',
      feature: 'CATEGORIES',
    }),
  });
}
