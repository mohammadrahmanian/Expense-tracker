import { type FC } from "react";
import { CategorySelect } from "@/components/shared/CategorySelect";
import { FormInput } from "@/components/shared/FormInput";
import { Category } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { RecurringTransactionFormValues } from "../RecurringTransactionForm.types";
import { TypeSegmentField } from "./TypeSegmentField";
import { ControlledAmountField } from "./ControlledAmountField";

type TransactionDetailsFieldsProps = {
  form: UseFormReturn<RecurringTransactionFormValues>;
  currencySymbol: string;
  filteredCategories: Category[];
};

export const TransactionDetailsFields: FC<TransactionDetailsFieldsProps> = ({
  form,
  currencySymbol,
  filteredCategories,
}) => {
  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
  } = form;

  return (
    <div className="space-y-4">
      <TypeSegmentField
        value={watch("type")}
        onChange={(value) => {
          setValue("type", value, { shouldValidate: true });
          setValue("categoryId", "", { shouldValidate: true });
        }}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ControlledAmountField
          control={control}
          currencySymbol={currencySymbol}
          error={errors.amount?.message}
        />
        <FormInput
          label="Description"
          id="title"
          placeholder="e.g., Monthly Rent, Weekly Groceries"
          {...register("title")}
          error={errors.title?.message}
          maxLength={40}
          required
        />
      </div>
      <CategorySelect
        value={watch("categoryId")}
        onChange={(value) => setValue("categoryId", value, { shouldValidate: true })}
        categories={filteredCategories}
        error={errors.categoryId?.message}
        required
      />
    </div>
  );
};
