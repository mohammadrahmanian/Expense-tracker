import { format, isValid as isValidDate } from "date-fns";
import { parseAmount } from "@/lib/amount-utils";
import {
  formatSchedulePhrase,
  getNextOccurrences,
  type OccurrencePreview,
} from "@/lib/recurring-transactions.utils";
import { Category } from "@/types";
import { RecurringTransactionFormValues } from "../RecurringTransactionForm.types";

export type PreviewData = {
  title: string;
  type: "INCOME" | "EXPENSE";
  amount: string;
  category: Category | undefined;
  schedulePhrase: string;
  endDatePhrase: string;
  isValid: boolean;
  occurrences: OccurrencePreview[];
};

export function buildPreviewData({
  values,
  categories,
  isValid,
  formatAmount,
}: {
  values: RecurringTransactionFormValues;
  categories: Category[];
  isValid: boolean;
  formatAmount: (amount: number) => string;
}): PreviewData {
  const category = categories.find((c) => c.id === values.categoryId);
  const numericAmount = parseAmount(values.amount) ?? 0;
  const sign = values.type === "INCOME" ? "+" : "-";

  // `startDate`/`recurrenceFrequency` are typed as always-present, but that's a
  // convention enforced by defaultValues, not the compiler: `useWatch` without a
  // `name` is really `DeepPartial`, and `startDate` ultimately traces back to
  // `transaction.startDate`, an unvalidated string from the API. Guard so a
  // missing or unparseable date degrades the preview instead of crashing it.
  const hasValidSchedule =
    isValidDate(values.startDate) && !!values.recurrenceFrequency;

  const schedulePhrase = hasValidSchedule
    ? formatSchedulePhrase({
        recurrenceFrequency: values.recurrenceFrequency,
        startDate: values.startDate,
      })
    : "";

  const endDatePhrase =
    values.hasEndDate && values.endDate
      ? `Ends ${format(values.endDate, "MMM d, yyyy")}`
      : "Runs indefinitely — no end date set";

  const occurrences = hasValidSchedule
    ? getNextOccurrences({
        startDate: values.startDate,
        frequency: values.recurrenceFrequency,
        endDate: values.hasEndDate ? values.endDate : undefined,
      })
    : [];

  return {
    title: values.title || "Untitled",
    type: values.type,
    amount: `${sign}${formatAmount(numericAmount)}`,
    category,
    schedulePhrase,
    endDatePhrase,
    isValid,
    occurrences,
  };
}
