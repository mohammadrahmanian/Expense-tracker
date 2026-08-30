import { type FC } from "react";
import { CalendarClock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { parseRecurringDate } from "@/lib/recurring-transactions.utils";
import { RecurringTransaction } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { RecurringTransactionFormValues } from "../RecurringTransactionForm.types";
import { CreateFrequencyField } from "./CreateFrequencyField";
import { CreateStartDateField } from "./CreateStartDateField";
import { EndDateToggleField } from "./EndDateToggleField";
import { ReadOnlyField } from "./ReadOnlyField";

type RecurrenceSettingsFieldsProps =
  | {
      mode: "create";
      form: UseFormReturn<RecurringTransactionFormValues>;
      transaction?: never;
    }
  | {
      mode: "edit";
      form: UseFormReturn<RecurringTransactionFormValues>;
      transaction: RecurringTransaction;
    };

export const RecurrenceSettingsFields: FC<RecurrenceSettingsFieldsProps> = (
  props,
) => {
  const { mode, form } = props;
  const hasEndDate = form.watch("hasEndDate");
  const endDate = form.watch("endDate");
  const errors = form.formState.errors;

  const minEndDate =
    mode === "edit"
      ? parseRecurringDate(props.transaction.startDate)
      : form.watch("startDate");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CalendarClock className="h-4 w-4 text-gold-500 dark:text-gold-300" />
        <h3 className="text-sm font-semibold text-foreground">Schedule</h3>
      </div>
      {mode === "create" ? (
        <div className="space-y-1">
          <CreateFrequencyField form={form} />
          <p className="text-xs text-muted-foreground">
            Daily, Weekly, Monthly, or Yearly
          </p>
        </div>
      ) : (
        <ReadOnlyField
          label="Frequency"
          value={props.transaction.recurrenceFrequency.toLowerCase()}
          hint="Frequency cannot be changed after creation"
          capitalize
        />
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mode === "create" ? (
          <CreateStartDateField form={form} />
        ) : (
          <ReadOnlyField
            label="Start date"
            value={format(parseRecurringDate(props.transaction.startDate), "PPP")}
            hint="Start date cannot be changed after creation"
            icon={Calendar}
          />
        )}
        <EndDateToggleField
          hasEndDate={hasEndDate}
          endDate={endDate}
          minDate={minEndDate}
          error={errors.endDate?.message}
          onToggle={(checked) =>
            form.setValue("hasEndDate", checked, { shouldValidate: true })
          }
          onSelectDate={(date) =>
            form.setValue("endDate", date, { shouldValidate: true })
          }
        />
      </div>
    </div>
  );
};
