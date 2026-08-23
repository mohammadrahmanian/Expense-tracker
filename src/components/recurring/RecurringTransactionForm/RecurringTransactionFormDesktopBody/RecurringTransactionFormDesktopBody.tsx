import { type FC } from "react";
import { Card } from "@/components/ui/card";
import { TransactionDetailsFields } from "../TransactionDetailsFields";
import { NotesField } from "../NotesField";
import { RecurrenceSettingsFields } from "../RecurrenceSettingsFields";
import { RecurringPreviewCard } from "../RecurringPreviewCard";
import { RecurringFormTipCard } from "../RecurringFormTipCard";
import { RecurringTransactionFormFooter } from "../RecurringTransactionFormFooter";
import type { RecurringFormBodyProps } from "../RecurringTransactionForm.types";

export const RecurringTransactionFormDesktopBody: FC<RecurringFormBodyProps> = ({
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
  <div className="hidden md:flex md:gap-6">
    <Card className="flex flex-1 flex-col gap-5 p-6">
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
      <RecurringTransactionFormFooter
        layout="desktop"
        mode={mode}
        isPending={isPending}
        isCategoriesLoading={isCategoriesLoading}
        onCancel={onCancel}
        firstOccurrenceNote={firstOccurrenceNote}
      />
    </Card>
    <div className="flex w-[360px] shrink-0 flex-col gap-4">
      <RecurringPreviewCard form={form} categories={categories} />
      <RecurringFormTipCard />
    </div>
  </div>
);
