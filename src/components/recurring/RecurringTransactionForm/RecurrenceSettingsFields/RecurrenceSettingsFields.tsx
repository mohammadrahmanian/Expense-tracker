import { type FC, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RecurringTransaction } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { Info } from "lucide-react";
import {
  RecurringTransactionCreateFormData,
  RecurringTransactionEditFormData,
} from "../RecurringTransactionForm.types";
import { CreateFrequencyField } from "./CreateFrequencyField";
import { CreateStartDateField } from "./CreateStartDateField";
import { EndDateField } from "./EndDateField";
import { ReadOnlyField } from "./ReadOnlyField";

type RecurrenceSettingsFieldsProps =
  | {
      mode: "create";
      form: UseFormReturn<RecurringTransactionCreateFormData>;
      transaction?: never;
    }
  | {
      mode: "edit";
      form: UseFormReturn<RecurringTransactionEditFormData>;
      transaction: RecurringTransaction;
    };

export const RecurrenceSettingsFields: FC<RecurrenceSettingsFieldsProps> = (
  props,
) => {
  const { mode, form } = props;
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);

  // Cast to UseFormReturn<any> for shared endDate field access across both form types
  const sharedForm = form as UseFormReturn<any>;
  const watchEndDate = sharedForm.watch("endDate") as Date | null | undefined;
  const errors = sharedForm.formState.errors;

  const minEndDate =
    mode === "edit"
      ? new Date(props.transaction.startDate)
      : (sharedForm.watch("startDate") as Date);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        Recurrence Settings
      </h3>
      {mode === "create" ? (
        <CreateFrequencyField form={props.form} />
      ) : (
        <ReadOnlyField
          label="Frequency"
          value={props.transaction.recurrenceFrequency.toLowerCase()}
          hint="Frequency cannot be changed after creation"
          capitalize
        />
      )}
      {mode === "create" ? (
        <CreateStartDateField
          form={props.form}
          isOpen={startCalendarOpen}
          onOpenChange={setStartCalendarOpen}
        />
      ) : (
        <ReadOnlyField
          label="Start Date"
          value={format(new Date(props.transaction.startDate), "PPP")}
          hint="Start date cannot be changed after creation"
        />
      )}
      <EndDateField
        watchEndDate={watchEndDate}
        minDate={minEndDate}
        error={errors.endDate?.message as string}
        isOpen={endCalendarOpen}
        onOpenChange={setEndCalendarOpen}
        onSelect={(date) => sharedForm.setValue("endDate", date || null)}
        onClear={() => sharedForm.setValue("endDate", null)}
      />
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          {mode === "create" ? (
            "This will create a recurring schedule that automatically generates transactions based on the frequency you selected."
          ) : (
            <>
              Next occurrence:{" "}
              {format(new Date(props.transaction.nextOccurrence), "PPP")}
              <br />
              Changes will affect future occurrences only.
            </>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};
