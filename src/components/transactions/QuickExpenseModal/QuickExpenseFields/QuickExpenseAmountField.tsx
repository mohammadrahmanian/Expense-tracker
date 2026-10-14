import { type FC } from "react";
import { type FieldError, type UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { type QuickExpenseFormData } from "../QuickExpenseModal.types";

type QuickExpenseAmountFieldProps = {
  register: UseFormRegister<QuickExpenseFormData>;
  currencySymbol: string;
  error?: FieldError;
};

export const QuickExpenseAmountField: FC<QuickExpenseAmountFieldProps> = ({
  register,
  currencySymbol,
  error,
}) => {
  return (
    <>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[30px] font-semibold text-neutral-500 dark:text-neutral-300">
          {currencySymbol}
        </span>
        <Input
          variant="filled"
          {...register("amount")}
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          className="h-14 pl-14 text-[30px] font-semibold"
        />
      </div>
      {error && (
        <p className="-mt-2 text-caption text-danger-500 dark:text-danger-300">
          {error.message}
        </p>
      )}
    </>
  );
};
