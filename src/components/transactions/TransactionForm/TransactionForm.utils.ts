import { normalizeAmount } from "@/lib/amount-utils";
import { Transaction } from "@/types";
import { TransactionFormData } from "./TransactionForm.types";

export function getDefaultValues(
  transaction?: Transaction,
): TransactionFormData {
  return {
    title: transaction?.title || "",
    amount: transaction?.amount?.toString() || "",
    type: transaction?.type || "EXPENSE",
    categoryId: transaction?.categoryId || "",
    date: transaction ? new Date(transaction.date) : new Date(),
    isRecurring: transaction?.isRecurring || false,
    recurrenceFrequency: transaction?.recurrenceFrequency || "MONTHLY",
  };
}

interface SubmitHandlerDeps {
  transaction?: Transaction;
  createMutate: (
    data: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "userId">,
    options: { onSuccess: () => void },
  ) => void;
  updateMutate: (
    data: { id: string; updates: Partial<Transaction> },
    options: { onSuccess: () => void },
  ) => void;
  onMutationSuccess: () => void;
}

export function createSubmitHandler(deps: SubmitHandlerDeps) {
  return async (data: TransactionFormData) => {
    const { transaction, createMutate, updateMutate, onMutationSuccess } = deps;

    const normalizedAmount = normalizeAmount(data.amount.trim());
    const numericAmount = parseFloat(normalizedAmount);

    const utcDate = new Date(
      data.date.getTime() - data.date.getTimezoneOffset() * 60000,
    );

    const transactionData = {
      title: data.title,
      amount: numericAmount,
      type: data.type,
      date: utcDate,
      categoryId: data.categoryId,
      isRecurring: data.isRecurring,
      recurrenceFrequency: data.recurrenceFrequency,
    };

    if (transaction) {
      updateMutate(
        { id: transaction.id, updates: transactionData },
        { onSuccess: onMutationSuccess },
      );
    } else {
      createMutate(transactionData, { onSuccess: onMutationSuccess });
    }
  };
}
