import { type FC, useMemo } from "react";
import { useFormState, useWatch, UseFormReturn } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Category } from "@/types";
import { RecurringTransactionFormValues } from "../RecurringTransactionForm.types";
import { buildPreviewData } from "./RecurringPreviewCard.utils";
import { PreviewStatusPill } from "./PreviewStatusPill";
import { PreviewSummaryRow } from "./PreviewSummaryRow";
import { PreviewScheduleRows } from "./PreviewScheduleRows";
import { PreviewOccurrencesList } from "./PreviewOccurrencesList";

type RecurringPreviewCardProps = {
  form: UseFormReturn<RecurringTransactionFormValues>;
  categories: Category[];
};

export const RecurringPreviewCard: FC<RecurringPreviewCardProps> = ({
  form,
  categories,
}) => {
  const values = useWatch({ control: form.control });
  const { isValid } = useFormState({ control: form.control });
  const { formatAmount } = useCurrency();

  const preview = useMemo(
    () =>
      buildPreviewData({
        values: values as RecurringTransactionFormValues,
        categories,
        isValid,
        formatAmount,
      }),
    [values, categories, isValid, formatAmount],
  );

  return (
    <Card className="flex flex-col gap-3.5 bg-surface p-4 dark:bg-neutral-900">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider text-neutral-500 dark:text-neutral-400">
          PREVIEW
        </span>
        <PreviewStatusPill isValid={preview.isValid} />
      </div>
      <PreviewSummaryRow
        title={preview.title}
        type={preview.type}
        amount={preview.amount}
        category={preview.category}
      />
      <div className="border-t border-border dark:border-neutral-800" />
      <PreviewScheduleRows
        schedulePhrase={preview.schedulePhrase}
        endDatePhrase={preview.endDatePhrase}
      />
      <div className="border-t border-border dark:border-neutral-800" />
      <span className="text-[11px] font-semibold tracking-wider text-neutral-500 dark:text-neutral-400">
        NEXT 3 OCCURRENCES
      </span>
      <PreviewOccurrencesList
        occurrences={preview.occurrences}
        type={preview.type}
        amount={preview.amount}
      />
    </Card>
  );
};
