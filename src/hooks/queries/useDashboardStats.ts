import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";

/**
 * Hook for fetching dashboard statistics
 *
 * @returns Query result with dashboard stats (balance, income, expenses, savings)
 *
 * @example
 * ```tsx
 * const { data: stats, isLoading } = useDashboardStats();
 *
 * if (stats) {
 *   console.log(stats.currentBalance); // Total balance
 *   console.log(stats.monthlyIncome); // This month's income
 * }
 * ```
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: () => dashboardService.getStats(),
  });
}
