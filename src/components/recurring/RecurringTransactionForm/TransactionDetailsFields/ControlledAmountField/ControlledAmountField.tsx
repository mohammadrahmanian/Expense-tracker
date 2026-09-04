import { type FC } from "react";
import { Control, Controller } from "react-hook-form";
import { AmountField } from "@/components/shared/AmountField";
import { createAmountChangeHandler } from "@/lib/amount-utils";
import { RecurringTransactionFormValues } from "../../RecurringTransactionForm.types";

type ControlledAmountFieldProps = {
  control: Control<RecurringTransactionFormValues>;
  currencySymbol: string;
  error?: string;
};

export const ControlledAmountField: FC<ControlledAmountFieldProps> = ({
  control,
  currencySymbol,
  error,
}) => (
  <Controller
    control={control}
    name="amount"
    render={({ field }) => (
      <AmountField
        currencySymbol={currencySymbol}
        value={field.value}
        onChange={createAmountChangeHandler(field.onChange)}
        onBlur={field.onBlur}
        error={error}
        required
      />
    )}
  />
);
