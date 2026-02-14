import { type FC } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { RecurringTransactionCreateFormData } from "../../RecurringTransactionForm.types";

type CreateFrequencyFieldProps = {
  form: UseFormReturn<RecurringTransactionCreateFormData>;
};

export const CreateFrequencyField: FC<CreateFrequencyFieldProps> = ({
  form,
}) => {
  const {
    formState: { errors },
    watch,
    setValue,
  } = form;

  return (
    <div className="space-y-2">
      <Label>
        Frequency <span className="text-red-500">*</span>
      </Label>
      <Select
        value={watch("recurrenceFrequency")}
        onValueChange={(value: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY") =>
          setValue("recurrenceFrequency", value)
        }
      >
        <SelectTrigger
          className={errors.recurrenceFrequency ? "border-red-500" : ""}
        >
          <SelectValue placeholder="Select frequency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="DAILY">Daily</SelectItem>
          <SelectItem value="WEEKLY">Weekly</SelectItem>
          <SelectItem value="MONTHLY">Monthly</SelectItem>
          <SelectItem value="YEARLY">Yearly</SelectItem>
        </SelectContent>
      </Select>
      {errors.recurrenceFrequency && (
        <p className="text-sm text-red-500">
          {errors.recurrenceFrequency.message}
        </p>
      )}
    </div>
  );
};
