import {
  ResponsiveDialogHeader as DialogHeader,
  ResponsiveDialogTitle as DialogTitle,
} from "@/components/ui/responsive-dialog";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCreateTransaction } from "@/hooks/mutations/useCreateTransaction";
import { useUpdateTransaction } from "@/hooks/mutations/useUpdateTransaction";
import { useCategories } from "@/hooks/queries/useCategories";
import { Transaction } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { BasicInfoFields } from "./BasicInfoFields";
import { CategoriesErrorFallback } from "./CategoriesErrorFallback";
import { ScheduleFields } from "./ScheduleFields";
import {
  TransactionFormData,
  transactionSchema,
} from "./TransactionForm.types";
import { createSubmitHandler, getDefaultValues } from "./TransactionForm.utils";
import { TransactionFormFooter } from "./TransactionFormFooter";

type TransactionFormProps = {
  transaction?: Transaction;
  onSuccess: () => void;
  onCancel: () => void;
};

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSuccess,
  onCancel,
}) => {
  const { currency } = useCurrency();
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: getDefaultValues(transaction),
  });

  const isEditing = !!transaction;
  const isPending = createTransaction.isPending || updateTransaction.isPending;
  const filteredCategories = categories.filter(
    (c) => c.type === form.watch("type"),
  );

  if (categoriesError) {
    return (
      <CategoriesErrorFallback isEditing={isEditing} onCancel={onCancel} />
    );
  }

  const onSubmit = createSubmitHandler({
    transaction,
    createMutate: createTransaction.mutate,
    updateMutate: updateTransaction.mutate,
    onMutationSuccess: () => {
      form.reset();
      onSuccess();
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Transaction" : "Add New Transaction"}
        </DialogTitle>
      </DialogHeader>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <div className="space-y-6">
          <BasicInfoFields
            form={form}
            currencySymbol={currency === "USD" ? "$" : "\u20AC"}
            filteredCategories={filteredCategories}
          />
          <ScheduleFields form={form} />
        </div>
        <TransactionFormFooter
          isEditing={isEditing}
          isPending={isPending}
          isCategoriesLoading={categoriesLoading}
          onCancel={onCancel}
        />
      </form>
    </>
  );
};
