import { useQuery } from "@tanstack/react-query";
import { recurringTransactionsService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";

export function useRecurringTransactionsStats() {
  return useQuery({
    queryKey: queryKeys.recurringTransactions.stats(),
    queryFn: () => recurringTransactionsService.getStats(),
    retry: 1,
  });
}
