import { useMutation, useQueryClient } from "@tanstack/react-query";
import { recurringTransactionsService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";
import { createMutationErrorHandler } from "@/lib/mutation-error-handler";

/**
 * Hook for creating a new recurring transaction
 *
 * Automatically invalidates recurring transactions queries on success.
 *
 * @returns Mutation function and status
 *
 * @example
 * ```tsx
 * const createRecurring = useCreateRecurringTransaction();
 *
 * const handleSubmit = (data) => {
 *   createRecurring.mutate({
 *     title: 'Netflix Subscription',
 *     amount: 15.99,
 *     type: 'EXPENSE',
 *     categoryId: 'cat-123',
 *     startDate: '2024-01-01',
 *     recurrenceFrequency: 'MONTHLY',
 *   });
 * };
 * ```
 */
export function useCreateRecurringTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title: string;
      amount: number;
      type: "INCOME" | "EXPENSE";
      categoryId: string;
      startDate: string;
      endDate?: string;
      description?: string;
      recurrenceFrequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
    }) => recurringTransactionsService.createRecurring(data),
    onSuccess: () => {
      // Invalidate recurring transactions queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.recurringTransactions.all,
      });
      toast.success("Recurring transaction created successfully");
    },
    onError: createMutationErrorHandler({
      action: "create recurring transaction",
      feature: "RECURRING",
    }),
  });
}
