import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/api';
import { queryKeys } from '@/lib/query-keys';

/**
 * Hook for fetching category expenses for the current month
 *
 * Returns top 5 categories by spending plus an "Others" category for the rest.
 * Each category includes amount, percentage, and color.
 *
 * @returns Query result with category expenses data
 *
 * @example
 * ```tsx
 * const { data: categoryExpenses, isLoading } = useCategoryExpenses();
 *
 * if (categoryExpenses) {
 *   categoryExpenses.forEach(expense => {
 *     console.log(`${expense.categoryName}: ${expense.amount} (${expense.percentage}%)`);
 *   });
 * }
 * ```
 */
export function useCategoryExpenses() {
  return useQuery({
    queryKey: queryKeys.dashboard.categoryExpenses(),
    queryFn: () => dashboardService.getCategoryExpenses(),
  });
}
