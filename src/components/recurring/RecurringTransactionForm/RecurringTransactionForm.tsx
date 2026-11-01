import { type FC } from "react";
import { currencySymbols, useCurrency } from "@/contexts/CurrencyContext";
import { RecurringTransactionFormBody } from "./RecurringTransactionFormBody";
import { FirstOccurrenceNote } from "./RecurringTransactionFormFooter/FirstOccurrenceNote";
import { useRecurringTransactionForm } from "./useRecurringTransactionForm";
import type {
  RecurringFormBodyProps,
  RecurringTransactionFormProps,
} from "./RecurringTransactionForm.types";

type Props = RecurringTransactionFormProps & {
  formId?: string;
};

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
      control={form.control}
      nextOccurrenceISO={props.transaction.nextOccurrence}
    />
  ) : (
    <FirstOccurrenceNote mode="create" control={form.control} />
  );

  const sharedBodyProps = {
    form,
    currencySymbol: currencySymbols[currency],
    filteredCategories,
    categories,
    isPending,
    isCategoriesLoading,
    firstOccurrenceNote,
    onCancel: props.onCancel,
  };

  const bodyProps: RecurringFormBodyProps = isEditing
    ? { ...sharedBodyProps, mode: "edit", transaction: props.transaction }
    : { ...sharedBodyProps, mode: "create" };

  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
      <RecurringTransactionFormBody {...bodyProps} />
    </form>
  );
};
