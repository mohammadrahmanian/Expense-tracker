import { type FC } from "react";
import { currencySymbols, useCurrency } from "@/contexts/CurrencyContext";
import { RecurringTransactionFormMobileBody } from "./RecurringTransactionFormMobileBody";
import { RecurringTransactionFormDesktopBody } from "./RecurringTransactionFormDesktopBody";
import { FirstOccurrenceNote } from "./RecurringTransactionFormFooter/FirstOccurrenceNote";
import { useRecurringTransactionForm } from "./useRecurringTransactionForm";
import type {
  RecurringFormBodyProps,
  RecurringTransactionFormProps,
} from "./RecurringTransactionForm.types";

type Props = RecurringTransactionFormProps & { formId?: string };

export const RecurringTransactionForm: FC<Props> = (props) => {
  const { mode, formId = "recurring-transaction-form" } = props;
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

  const firstOccurrenceNote = isEditing ? (
    <FirstOccurrenceNote
      mode="edit"
      nextOccurrenceISO={props.transaction.nextOccurrence}
    />
  ) : (
    <FirstOccurrenceNote mode="create" startDate={form.watch("startDate")} />
  );

  const bodyProps = {
    form,
    mode,
    transaction: isEditing ? props.transaction : undefined,
    currencySymbol: currencySymbols[currency],
    filteredCategories,
    categories,
    isPending,
    isCategoriesLoading,
    firstOccurrenceNote,
    onCancel: props.onCancel,
  } as RecurringFormBodyProps;

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
      <RecurringTransactionFormMobileBody {...bodyProps} />
      <RecurringTransactionFormDesktopBody {...bodyProps} />
    </form>
  );
};
