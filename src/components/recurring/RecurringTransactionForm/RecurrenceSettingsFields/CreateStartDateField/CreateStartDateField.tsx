import { type FC } from "react";
import { startOfToday } from "date-fns";
import { DateSelect } from "@/components/shared/DateSelect";
import { UseFormReturn } from "react-hook-form";
import { RecurringTransactionFormValues } from "../../RecurringTransactionForm.types";

type CreateStartDateFieldProps = {
  form: UseFormReturn<RecurringTransactionFormValues>;
};

export const CreateStartDateField: FC<CreateStartDateFieldProps> = ({
  form,
}) => {
  const {
    formState: { errors },
    watch,
    setValue,
  } = form;

  return (
    <DateSelect
      value={watch("startDate")}
      onChange={(date) =>
        setValue("startDate", date ?? new Date(), { shouldValidate: true })
      }
      label="Start date"
      placeholder="Select start date"
      error={errors.startDate?.message}
      disabledDates={(date) => date < startOfToday()}
      required
    />
  );
};
