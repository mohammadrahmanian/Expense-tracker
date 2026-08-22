import { type FC } from "react";
import {
  ResponsiveDialogHeader as DialogHeader,
  ResponsiveDialogTitle as DialogTitle,
} from "@/components/ui/responsive-dialog";
import { currencySymbols, useCurrency } from "@/contexts/CurrencyContext";
import { TransactionDetailsFields } from "./TransactionDetailsFields";
import { NotesField } from "./NotesField";
import { RecurrenceSettingsFields } from "./RecurrenceSettingsFields";
import { RecurringPreviewCard } from "./RecurringPreviewCard";
import { RecurringFormTipCard } from "./RecurringFormTipCard";
import { RecurringTransactionFormFooter } from "./RecurringTransactionFormFooter";
import { FirstOccurrenceNote } from "./RecurringTransactionFormFooter/FirstOccurrenceNote";
import { useRecurringTransactionForm } from "./useRecurringTransactionForm";
import type { RecurringTransactionFormProps } from "./RecurringTransactionForm.types";

type Props = RecurringTransactionFormProps & { chrome: "dialog" | "page" };

export const RecurringTransactionForm: FC<Props> = (props) => {
  const { chrome, mode } = props;
  const isEditing = mode === "edit";
  const { currency } = useCurrency();
  const {
    form,
    onSubmit,
    categories,
    filteredCategories,
    isCategoriesLoading,
    isPending,
  } = useRecurringTransactionForm(props);

  return (
    <>
      {chrome === "dialog" && (
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit Recurring Transaction"
              : "Add Recurring Transaction"}
          </DialogTitle>
        </DialogHeader>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <TransactionDetailsFields
          form={form}
          currencySymbol={currencySymbols[currency]}
          filteredCategories={filteredCategories}
        />
        <div className="border-t border-border" />
        {isEditing ? (
          <RecurrenceSettingsFields
            mode="edit"
            form={form}
            transaction={props.transaction}
          />
        ) : (
          <RecurrenceSettingsFields mode="create" form={form} />
        )}
        <NotesField
          register={form.register}
          error={form.formState.errors.description?.message}
        />
        <RecurringPreviewCard form={form} categories={categories} />
        <RecurringFormTipCard />
        <RecurringTransactionFormFooter
          chrome={chrome}
          mode={mode}
          isPending={isPending}
          isCategoriesLoading={isCategoriesLoading}
          onCancel={props.onCancel}
          firstOccurrenceNote={
            isEditing ? (
              <FirstOccurrenceNote
                mode="edit"
                nextOccurrenceISO={props.transaction.nextOccurrence}
              />
            ) : (
              <FirstOccurrenceNote
                mode="create"
                startDate={form.watch("startDate")}
              />
            )
          }
        />
      </form>
    </>
  );
};
