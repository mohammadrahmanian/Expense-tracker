import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/api';
import { queryKeys } from '@/lib/query-keys';

export interface UseReportsParams {
  startDate: string;
  endDate: string;
  enabled?: boolean; // Allow conditional fetching based on date validation
}

/**
 * Hook for fetching reports data for a specific date range
 *
 * @param params - Date range parameters and options
 * @returns Query result with reports data (summary, monthlyData, categoryBreakdown)
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { data, isLoading, error } = useReports({
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31',
 * });
 *
 * // Conditional fetching (only when dates are valid)
 * const { data, isLoading } = useReports({
 *   startDate: dateRange.startDate,
 *   endDate: dateRange.endDate,
 *   enabled: datesAreValid,
 * });
 * ```
 */
export function useReports({ startDate, endDate, enabled = true }: UseReportsParams) {
  return useQuery({
    queryKey: queryKeys.reports.list({ startDate, endDate }),
    queryFn: () => dashboardService.getReports(startDate, endDate),
    enabled: enabled && !!startDate && !!endDate, // Only fetch when dates are provided
  });
}
