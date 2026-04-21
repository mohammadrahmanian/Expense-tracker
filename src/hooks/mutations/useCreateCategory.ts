import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";
import type { Category } from "@/types";
import { handleApiError } from "@/lib/error-handling";

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
export type UseCreateCategoryOptions = {
  /** When false, errors are still logged via handleApiError but no toast (caller shows its own). Default true. */
  showErrorToast?: boolean;
};

export function useCreateCategory(options?: UseCreateCategoryOptions) {
  const queryClient = useQueryClient();
  const showErrorToast = options?.showErrorToast ?? true;

  return useMutation({
    mutationFn: (
      data: Omit<Category, "id" | "createdAt" | "updatedAt" | "userId">,
    ) => categoriesService.create(data),
    onSuccess: () => {
      // Invalidate categories queries
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast.success("Category created successfully");
    },
    onError: (error) => {
      handleApiError(error, { action: "create category", feature: "CATEGORIES" }, {
        reportToSentry: false,
        showToast: showErrorToast,
      });
    },
  });
}
