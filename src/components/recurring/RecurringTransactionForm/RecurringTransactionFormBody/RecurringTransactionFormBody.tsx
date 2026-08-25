import { type FC } from "react";
import { TransactionDetailsFields } from "../TransactionDetailsFields";
import { NotesField } from "../NotesField";
import { RecurrenceSettingsFields } from "../RecurrenceSettingsFields";
import { RecurringPreviewCard } from "../RecurringPreviewCard";
import { RecurringFormTipCard } from "../RecurringFormTipCard";
import { RecurringTransactionFormFooter } from "../RecurringTransactionFormFooter";
import type { RecurringFormBodyProps } from "../RecurringTransactionForm.types";

/**
 * Field components (title/amount/category/schedule/notes) must mount exactly
 * once: React Hook Form's uncontrolled `register(name)` overwrites its
 * tracked DOM ref on every mount, so two live inputs sharing a name silently
 * orphan whichever one mounted first. Only the non-field chrome (preview,
 * tip, footer) is safe to duplicate per breakpoint via CSS.
 */
export const RecurringTransactionFormBody: FC<RecurringFormBodyProps> = ({
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
}) => {
  const footerProps = {
    mode,
    isPending,
    isCategoriesLoading,
    onCancel,
    firstOccurrenceNote,
  };

  return (
    <div className="lg:flex lg:gap-6">
      <div className="flex flex-col lg:flex-1 lg:overflow-hidden lg:rounded-[8px] lg:border lg:border-neutral-200 lg:bg-surface lg:dark:border-neutral-800 lg:dark:bg-neutral-900">
        <div className="flex flex-col gap-5 lg:p-6">
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
        </div>
        <div className="hidden lg:block">
          <RecurringTransactionFormFooter layout="desktop" {...footerProps} />
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[360px] lg:shrink-0 lg:flex-col lg:gap-4">
        <RecurringPreviewCard form={form} categories={categories} />
        <RecurringFormTipCard />
      </div>

      <div className="mt-5 flex flex-col gap-5 lg:hidden">
        <RecurringPreviewCard form={form} categories={categories} />
        <RecurringFormTipCard />
        <RecurringTransactionFormFooter layout="mobile" {...footerProps} />
      </div>
    </div>
  );
};
