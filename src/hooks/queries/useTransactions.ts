import { useQuery } from "@tanstack/react-query";
import { transactionsService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";

type TransactionParams = {
  limit?: number;
  offset?: number;
  sort?: "date" | "amount";
  order?: "asc" | "desc";
  type?: "INCOME" | "EXPENSE";
  fromDate?: string;
  toDate?: string;
  categoryId?: string;
  query?: string;
};

/**
 * Hook for fetching all transactions with optional filters
 *
 * @param params - Optional filters for transactions (pagination, sorting, filters)
 * @param enabled - Whether the query should run; defaults to `true`. Pass `false` to suspend fetching (e.g. on mobile where the infinite query is used instead)
 * @returns Query result with transactions data, loading state, and error
 *
 * @example
 * ```tsx
 * // Get all transactions
 * const { data, isLoading } = useTransactions();
 *
 * // Get transactions with filters
 * const { data } = useTransactions({
 *   type: 'EXPENSE',
 *   limit: 50,
 *   sort: 'date',
 *   order: 'desc'
 * });
 *
 * const transactions = data?.items || [];
 * const total = data?.total || 0;
 * ```
 */
export function useTransactions(params?: TransactionParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.transactions.list(params),
    queryFn: () => transactionsService.getAll(params),
    enabled,
  });
}
