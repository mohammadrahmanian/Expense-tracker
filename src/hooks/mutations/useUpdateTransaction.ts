import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";
import type { Transaction } from "@/types";
import { createMutationErrorHandler } from "@/lib/mutation-error-handler";

/**
 * Hook for updating an existing transaction
 *
 * Automatically invalidates transactions and dashboard queries on success.
 *
 * @returns Mutation function and status
 *
 * @example
 * ```tsx
 * const updateTransaction = useUpdateTransaction();
 *
 * const handleUpdate = (id: string, updates: Partial<Transaction>) => {
 *   updateTransaction.mutate({ id, updates });
 * };
 * ```
 */
export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Transaction>;
    }) => transactionsService.update(id, updates),
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all });
      toast.success("Transaction updated successfully");
    },
    onError: createMutationErrorHandler({
      action: "update transaction",
      feature: "TRANSACTIONS",
    }),
  });
}
