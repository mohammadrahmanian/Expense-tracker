import { type FC } from "react";
import { type UseFormRegister } from "react-hook-form";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { type QuickExpenseFormData } from "../QuickExpenseModal.types";

type QuickExpenseDescriptionFieldProps = {
  register: UseFormRegister<QuickExpenseFormData>;
};

export const QuickExpenseDescriptionField: FC<
  QuickExpenseDescriptionFieldProps
> = ({ register }) => {
  return (
    <div className="relative">
      <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 dark:text-neutral-300" />
      <Input
        variant="filled"
        {...register("transactionName")}
        placeholder="Lunch at restaurant..."
        className="pl-9"
      />
    </div>
  );
};
