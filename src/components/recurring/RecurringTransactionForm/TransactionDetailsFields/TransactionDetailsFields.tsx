import { type FC, type ChangeEvent } from "react";
import { CategorySelect } from "@/components/shared/CategorySelect";
import { FormInput } from "@/components/shared/FormInput";
import { TypeSelect } from "@/components/shared/TypeSelect";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { AmountField } from "@/components/shared/AmountField";

type TransactionDetailsFieldsProps = {
  form: UseFormReturn<any>;
  amount: string;
  onAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
  currencySymbol: string;
  filteredCategories: Category[];
};

export const TransactionDetailsFields: FC<TransactionDetailsFieldsProps> = ({
  form,
  amount,
  onAmountChange,
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
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        Transaction Details
      </h3>
      <FormInput
        label="Title"
        id="title"
        placeholder="e.g., Monthly Rent, Weekly Groceries"
        {...register("title")}
        error={errors.title?.message as string}
        maxLength={40}
        required
      />
      <div className="grid gap-4 md:grid-cols-2">
        <AmountField
          currencySymbol={currencySymbol}
          value={amount}
          onChange={onAmountChange}
          required
        />
        <TypeSelect
          value={watch("type")}
          onChange={(value) => {
            setValue("type", value);
            setValue("categoryId", "");
          }}
          error={errors.type?.message as string}
          required
        />
      </div>
      <CategorySelect
        value={watch("categoryId")}
        onChange={(value) => setValue("categoryId", value)}
        categories={filteredCategories}
        error={errors.categoryId?.message as string}
        required
      />
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          placeholder="Add a note about this recurring transaction..."
          {...register("description")}
          className={errors.description ? "border-red-500" : ""}
          maxLength={256}
          rows={2}
        />
        {errors.description && (
          <p className="text-sm text-red-500">
            {errors.description.message as string}
          </p>
        )}
      </div>
    </div>
  );
};
