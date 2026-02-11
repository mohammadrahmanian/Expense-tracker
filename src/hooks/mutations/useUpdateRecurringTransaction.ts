import { useMutation, useQueryClient } from "@tanstack/react-query";
import { recurringTransactionsService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";
import type { RecurringTransaction } from "@/types";
import { createMutationErrorHandler } from "@/lib/mutation-error-handler";

/**
 * Hook for updating an existing recurring transaction
 *
 * Automatically invalidates recurring transactions queries on success.
 *
 * @returns Mutation function and status
 *
 * @example
 * ```tsx
 * const updateRecurring = useUpdateRecurringTransaction();
 *
 * const handleUpdate = (id: string, updates: Partial<RecurringTransaction>) => {
 *   updateRecurring.mutate({ id, updates });
 * };
 * ```
 */
export function useUpdateRecurringTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<RecurringTransaction>;
    }) => recurringTransactionsService.update(id, updates),
    onSuccess: () => {
      // Invalidate recurring transactions queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.recurringTransactions.all,
      });
      toast.success("Recurring transaction updated successfully");
    },
    onError: createMutationErrorHandler({
      action: "update recurring transaction",
      feature: "RECURRING",
    }),
  });
}
