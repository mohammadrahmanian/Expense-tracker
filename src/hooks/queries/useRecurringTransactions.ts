import { useQuery } from "@tanstack/react-query";
import { recurringTransactionsService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";

/**
 * Hook for fetching all recurring transactions
 *
 * @returns Query result with recurring transactions data
 *
 * @example
 * ```tsx
 * const { data: recurringTransactions, isLoading } = useRecurringTransactions();
 *
 * if (recurringTransactions) {
 *   recurringTransactions.forEach(rt => {
 *     console.log(`${rt.title}: ${rt.recurrenceFrequency}`);
 *   });
 * }
 * ```
 */
export function useRecurringTransactions() {
  return useQuery({
    queryKey: queryKeys.recurringTransactions.lists(),
    queryFn: () => recurringTransactionsService.getAll(),
  });
}
