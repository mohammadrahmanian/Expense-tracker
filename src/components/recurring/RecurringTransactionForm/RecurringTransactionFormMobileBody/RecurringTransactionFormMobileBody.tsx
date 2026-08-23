import { type FC } from "react";
import { TransactionDetailsFields } from "../TransactionDetailsFields";
import { NotesField } from "../NotesField";
import { RecurrenceSettingsFields } from "../RecurrenceSettingsFields";
import { RecurringPreviewCard } from "../RecurringPreviewCard";
import { RecurringFormTipCard } from "../RecurringFormTipCard";
import { RecurringTransactionFormFooter } from "../RecurringTransactionFormFooter";
import type { RecurringFormBodyProps } from "../RecurringTransactionForm.types";

export const RecurringTransactionFormMobileBody: FC<RecurringFormBodyProps> = ({
  form,
  mode,
  transaction,
  currencySymbol,
  filteredCategories,
  categories,
  isPending,
  isCategoriesLoading,
  firstOccurrenceNote,
  onCancel,
}) => (
  <div className="md:hidden space-y-5">
    <TransactionDetailsFields
      form={form}
      currencySymbol={currencySymbol}
      filteredCategories={filteredCategories}
    />
    <div className="border-t border-border" />
    {mode === "edit" ? (
      <RecurrenceSettingsFields mode="edit" form={form} transaction={transaction} />
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
      layout="mobile"
      mode={mode}
      isPending={isPending}
      isCategoriesLoading={isCategoriesLoading}
      onCancel={onCancel}
      firstOccurrenceNote={firstOccurrenceNote}
    />
  </div>
);
