import { type FC } from "react";
import { AmountField } from "@/components/shared/AmountField";
import { DateSelect } from "@/components/shared/DateSelect";
import { FormInput } from "@/components/shared/FormInput";
import { Category } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { QuickCategorySelect } from "../QuickCategorySelect";
import { type QuickExpenseFormData } from "../QuickExpenseModal.types";

type QuickExpenseFieldsProps = {
  form: UseFormReturn<QuickExpenseFormData>;
  currencySymbol: string;
  categories: Category[];
};

export const QuickExpenseFields: FC<QuickExpenseFieldsProps> = ({
  form,
  currencySymbol,
  categories,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const categoryName = watch("categoryName");

  return (
    <>
      <QuickCategorySelect
        selectedCategory={categoryName}
        onSelect={(name) =>
          setValue("categoryName", name, { shouldValidate: true })
        }
        categories={categories}
        error={errors.categoryName?.message}
      />
      <FormInput
        label="Transaction Name (optional)"
        id="transactionName"
        placeholder={
          categoryName ? `${categoryName} expense` : "Enter transaction name..."
        }
        {...register("transactionName")}
        error={errors.transactionName?.message}
      />
      <AmountField
        currencySymbol={currencySymbol}
        {...register("amount")}
        error={errors.amount?.message}
        required
      />
      <DateSelect
        value={watch("date")}
        onChange={(date) => setValue("date", date ?? new Date())}
        error={errors.date?.message}
      />
    </>
  );
};
