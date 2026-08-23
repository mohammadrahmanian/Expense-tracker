import { format } from "date-fns";
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

  const schedulePhrase = formatSchedulePhrase({
    recurrenceFrequency: values.recurrenceFrequency,
    startDate: values.startDate,
  });

  const endDatePhrase =
    values.hasEndDate && values.endDate
      ? `Ends ${format(values.endDate, "MMM d, yyyy")}`
      : "Runs indefinitely — no end date set";

  const occurrences = getNextOccurrences({
    startDate: values.startDate,
    frequency: values.recurrenceFrequency,
    endDate: values.hasEndDate ? values.endDate : undefined,
  });

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
