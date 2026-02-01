import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '@/services/api';
import { queryKeys } from '@/lib/query-keys';
import { toast } from 'sonner';
import type { Category } from '@/types';
import { createMutationErrorHandler } from '@/lib/mutation-error-handler';

/**
 * Hook for creating a new category
 *
 * Automatically invalidates categories queries on success.
 *
 * @returns Mutation function and status
 *
 * @example
 * ```tsx
 * const createCategory = useCreateCategory();
 *
 * const handleSubmit = (data) => {
 *   createCategory.mutate({
 *     name: data.name,
 *     type: 'EXPENSE',
 *     color: '#FF6B6B',
 *   });
 * };
 * ```
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) =>
      categoriesService.create(data),
    onSuccess: () => {
      // Invalidate categories queries
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast.success('Category created successfully');
    },
    onError: createMutationErrorHandler({
      action: 'create category',
      feature: 'CATEGORIES',
    }),
  });
}
