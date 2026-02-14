import { type FC, useState } from "react";
import {
  ResponsiveDialogHeader as DialogHeader,
  ResponsiveDialogTitle as DialogTitle,
} from "@/components/ui/responsive-dialog";
import { createAmountChangeHandler } from "@/lib/amount-utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCategories } from "@/hooks/queries/useCategories";
import { useCreateRecurringTransaction } from "@/hooks/mutations/useCreateRecurringTransaction";
import { useUpdateRecurringTransaction } from "@/hooks/mutations/useUpdateRecurringTransaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TransactionDetailsFields } from "./TransactionDetailsFields";
import { RecurrenceSettingsFields } from "./RecurrenceSettingsFields";
import { RecurringTransactionFormFooter } from "./RecurringTransactionFormFooter";
import {
  recurringTransactionCreateSchema,
  recurringTransactionEditSchema,
  type RecurringTransactionFormProps,
} from "./RecurringTransactionForm.types";
import {
  getCreateDefaultValues,
  getEditDefaultValues,
  createCreateSubmitHandler,
  createEditSubmitHandler,
} from "./RecurringTransactionForm.utils";

export const RecurringTransactionForm: FC<RecurringTransactionFormProps> = (
  props,
) => {
  const isEditing = props.mode === "edit";
  const { currency } = useCurrency();

  const [amount, setAmount] = useState<string>(
    isEditing ? props.transaction.amount.toString() : "",
  );

  const { data: categories = [], isLoading } = useCategories();
  const createMutation = useCreateRecurringTransaction();
  const updateMutation = useUpdateRecurringTransaction();

  const form = useForm<any>({
    resolver: zodResolver(
      isEditing
        ? recurringTransactionEditSchema
        : recurringTransactionCreateSchema,
    ),
    defaultValues: isEditing
      ? getEditDefaultValues(props.transaction)
      : getCreateDefaultValues(),
  });

  const onSubmit = isEditing
    ? createEditSubmitHandler({
        amount,
        transaction: props.transaction,
        updateMutate: updateMutation.mutate,
        onSuccess: props.onSuccess,
      })
    : createCreateSubmitHandler({
        amount,
        createMutate: createMutation.mutate,
        onSuccess: props.onSuccess,
      });

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditing
            ? "Edit Recurring Transaction"
            : "Add Recurring Transaction"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TransactionDetailsFields
          form={form}
          amount={amount}
          onAmountChange={createAmountChangeHandler(setAmount)}
          currencySymbol={currency === "USD" ? "$" : "\u20AC"}
          filteredCategories={categories.filter(
            (c) => c.type === form.watch("type"),
          )}
        />
        {isEditing ? (
          <RecurrenceSettingsFields
            mode="edit"
            form={form}
            transaction={props.transaction}
          />
        ) : (
          <RecurrenceSettingsFields mode="create" form={form} />
        )}
        <RecurringTransactionFormFooter
          mode={props.mode}
          isPending={createMutation.isPending || updateMutation.isPending}
          isCategoriesLoading={isLoading}
          onCancel={props.onCancel}
        />
      </form>
    </>
  );
};
