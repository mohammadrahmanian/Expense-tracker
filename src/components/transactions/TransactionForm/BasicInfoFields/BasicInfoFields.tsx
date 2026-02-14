import { type FC } from "react";
import { AmountField } from "@/components/shared/AmountField";
import { CategorySelect } from "@/components/shared/CategorySelect";
import { DateSelect } from "@/components/shared/DateSelect";
import { FormInput } from "@/components/shared/FormInput";
import { TypeSelect } from "@/components/shared/TypeSelect";
import { UseFormReturn } from "react-hook-form";
import { Category } from "@/types";
import { TransactionFormData } from "../TransactionForm.types";

type BasicInfoFieldsProps = {
  form: UseFormReturn<TransactionFormData>;
  currencySymbol: string;
  filteredCategories: Category[];
};

export const BasicInfoFields: FC<BasicInfoFieldsProps> = ({
  form,
  currencySymbol,
  filteredCategories,
}) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <FormInput
          label="Title"
          id="title"
          placeholder="e.g., Groceries, Salary"
          {...register("title")}
          error={errors.title?.message}
        />
        <AmountField
          currencySymbol={currencySymbol}
          {...register("amount")}
          error={errors.amount?.message}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <TypeSelect
          value={watch("type")}
          onChange={(value) => {
            setValue("type", value);
            setValue("categoryId", "");
          }}
          error={errors.type?.message}
        />
        <CategorySelect
          value={watch("categoryId")}
          onChange={(value) => setValue("categoryId", value)}
          categories={filteredCategories}
          error={errors.categoryId?.message}
        />
      </div>
      <DateSelect
        value={watch("date")}
        onChange={(date) => setValue("date", date ?? new Date())}
        error={errors.date?.message}
      />
    </>
  );
};
