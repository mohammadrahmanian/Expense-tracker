import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";
import { useMemo } from "react";

/**
 * Hook for fetching all categories with optional type filtering
 *
 * @param type - Optional filter for INCOME or EXPENSE categories
 * @returns Query result with categories data
 *
 * @example
 * ```tsx
 * // Get all categories
 * const { data: allCategories } = useCategories();
 *
 * // Get only expense categories
 * const { data: expenseCategories } = useCategories('EXPENSE');
 * ```
 */
export function useCategories(type?: "INCOME" | "EXPENSE") {
  const query = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoriesService.getAll(),
  });

  // Filter categories by type if specified
  const filteredData = useMemo(() => {
    if (!type || !query.data) return query.data;
    return query.data.filter((category) => category.type === type);
  }, [query.data, type]);

  return {
    ...query,
    data: filteredData,
  };
}
