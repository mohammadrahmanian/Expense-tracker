import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { currencySymbols, useCurrency } from "@/contexts/CurrencyContext";
import { useCreateCategory } from "@/hooks/mutations/useCreateCategory";
import { useCreateTransaction } from "@/hooks/mutations/useCreateTransaction";
import { useCategories } from "@/hooks/queries/useCategories";
import {
  type QuickExpenseFormData,
  quickExpenseSchema,
} from "./QuickExpenseModal.types";
import { createQuickExpenseSubmitHandler } from "./QuickExpenseModal.utils";

export type TransactionKind = "expense" | "income";

type UseQuickExpenseModalArgs = {
  onClose: () => void;
};

export function useQuickExpenseModal({ onClose }: UseQuickExpenseModalArgs) {
  const { currency } = useCurrency();
  const [transactionKind, setTransactionKind] =
    useState<TransactionKind>("expense");

  const {
    data: apiExpenseCategories = [],
    isLoading: expenseCategoriesLoading,
  } = useCategories("EXPENSE");
  const {
    data: apiIncomeCategories = [],
    isLoading: incomeCategoriesLoading,
  } = useCategories("INCOME");

  const createCategory = useCreateCategory({ showErrorToast: false });
  const createTransaction = useCreateTransaction();

  const form = useForm<QuickExpenseFormData>({
    resolver: zodResolver(quickExpenseSchema),
    defaultValues: {
      transactionName: "",
      amount: "",
      categoryName: "",
      date: new Date(),
      isRecurring: false,
      recurrenceFrequency: undefined,
    },
  });

  const isPending = createCategory.isPending || createTransaction.isPending;

  const activeCategories =
    transactionKind === "income"
      ? apiIncomeCategories
      : apiExpenseCategories;
  const categoriesLoading =
    transactionKind === "income"
      ? incomeCategoriesLoading
      : expenseCategoriesLoading;

  const incomeCategoriesEmpty =
    transactionKind === "income" && apiIncomeCategories.length === 0;

  const handleClose = () => {
    form.reset();
    setTransactionKind("expense");
    onClose();
  };

  const onSubmit = createQuickExpenseSubmitHandler({
    categories: activeCategories,
    transactionType: transactionKind === "income" ? "INCOME" : "EXPENSE",
    createCategoryAsync: createCategory.mutateAsync,
    createTransaction: createTransaction.mutate,
    onSuccess: handleClose,
  });

  const handleTabChange = (value: string) => {
    if (value !== "expense" && value !== "income") return;
    setTransactionKind(value);
    form.setValue("categoryName", "", { shouldValidate: false });
    form.clearErrors("categoryName");
  };

  const title =
    transactionKind === "income" ? "Add Income" : "Add Expense";
  const description =
    transactionKind === "income"
      ? "Pick an income category to get started"
      : "Pick a category to get started";
  const submitLabel =
    transactionKind === "income" ? "Add Income" : "Add Expense";

  return {
    form,
    transactionKind,
    handleTabChange,
    title,
    description,
    submitLabel,
    handleClose,
    onSubmit,
    isPending,
    categoriesLoading,
    incomeCategoriesEmpty,
    currencySymbol: currencySymbols[currency],
    activeCategories,
  };
}
