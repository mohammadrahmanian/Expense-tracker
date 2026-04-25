import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";
import type { Transaction } from "@/types";
import { createMutationErrorHandler } from "@/lib/mutation-error-handler";

/**
 * Hook for creating a new transaction
 *
 * On success, automatically invalidates React Query caches for transactions,
 * categories, dashboard, and reports so dependent views refetch fresh data.
 *
 * @returns Mutation function and status
 *
 * @example
 * ```tsx
 * const createTransaction = useCreateTransaction();
 *
 * const handleSubmit = async (data) => {
 *   createTransaction.mutate({
 *     title: data.title,
 *     amount: data.amount,
 *     type: 'EXPENSE',
 *     categoryId: data.categoryId,
 *     date: new Date(),
 *   });
 * };
 * ```
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "userId">,
    ) => transactionsService.create(data),
    onSuccess: () => {
      // Invalidate transactions, categories, dashboard, and reports
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all });
      toast.success("Transaction created successfully");
    },
    onError: createMutationErrorHandler({
      action: "create transaction",
      feature: "TRANSACTIONS",
    }),
  });
}
