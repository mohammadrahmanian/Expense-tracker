import { type FC } from "react";
import { DateSelect } from "@/components/shared/DateSelect";
import { UseFormReturn } from "react-hook-form";
import { RecurringTransactionCreateFormData } from "../../RecurringTransactionForm.types";

type CreateStartDateFieldProps = {
  form: UseFormReturn<RecurringTransactionCreateFormData>;
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
      onChange={(date) => setValue("startDate", date ?? new Date())}
      label="Start Date"
      placeholder="Select start date"
      error={errors.startDate?.message}
      required
    />
  );
};
