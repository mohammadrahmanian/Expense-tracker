import { useState, type FC } from "react";
import { Category } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { type QuickExpenseFormData } from "../QuickExpenseModal.types";
import { QuickExpenseCategorySection } from "./QuickExpenseCategorySection";
import { QuickExpenseAmountField } from "./QuickExpenseAmountField";
import { QuickExpenseDescriptionField } from "./QuickExpenseDescriptionField";
import { QuickExpenseRecurrenceControls } from "./QuickExpenseRecurrenceControls";
import { QuickExpenseMoreOptions } from "./QuickExpenseMoreOptions";

type TransactionKind = "expense" | "income";

type QuickExpenseFieldsProps = {
  form: UseFormReturn<QuickExpenseFormData>;
  currencySymbol: string;
  categories: Category[];
  transactionKind: TransactionKind;
};

export const QuickExpenseFields: FC<QuickExpenseFieldsProps> = ({
  form,
  currencySymbol,
  categories,
  transactionKind,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const categoryName = watch("categoryName");
  const isRecurring = watch("isRecurring");
  const notes = watch("notes") ?? "";
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <QuickExpenseCategorySection
        transactionKind={transactionKind}
        categoryName={categoryName}
        categories={categories}
        onSelect={(name) =>
          setValue("categoryName", name, { shouldValidate: true })
        }
        error={errors.categoryName?.message}
      />

      <div className="space-y-4">
        <QuickExpenseAmountField
          register={register}
          currencySymbol={currencySymbol}
          error={errors.amount}
        />

        <QuickExpenseDescriptionField register={register} />

        <QuickExpenseRecurrenceControls
          date={watch("date")}
          onDateChange={(date) => setValue("date", date)}
          isRecurring={isRecurring}
          onRecurringChange={(pressed) => {
            setValue("isRecurring", pressed);
            setValue("recurrenceFrequency", pressed ? "MONTHLY" : undefined);
          }}
          recurrenceFrequency={watch("recurrenceFrequency")}
          onFrequencyChange={(value) => setValue("recurrenceFrequency", value)}
        />

        <QuickExpenseMoreOptions
          open={moreOpen}
          onOpenChange={setMoreOpen}
          notes={notes}
          onNotesChange={(v) => setValue("notes", v)}
        />
      </div>
    </>
  );
};
