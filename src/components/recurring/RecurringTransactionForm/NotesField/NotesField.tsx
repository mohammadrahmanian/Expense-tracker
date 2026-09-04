import { type FC } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister } from "react-hook-form";
import { RecurringTransactionFormValues } from "../RecurringTransactionForm.types";

type NotesFieldProps = {
  register: UseFormRegister<RecurringTransactionFormValues>;
  error?: string;
};

export const NotesField: FC<NotesFieldProps> = ({ register, error }) => (
  <div className="space-y-2">
    <Label htmlFor="description">Notes (optional)</Label>
    <Textarea
      id="description"
      placeholder="Add a note about this recurring transaction..."
      {...register("description")}
      aria-invalid={!!error}
      maxLength={256}
      className="min-h-[80px]"
    />
    {error && <p className="text-sm text-danger-500">{error}</p>}
  </div>
);
