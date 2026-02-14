import { RecurringTransaction } from "@/types";
import { z } from "zod";

const baseFields = {
  title: z
    .string()
    .min(1, "Title is required")
    .max(40, "Title must be 40 characters or less"),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "Category is required"),
  endDate: z.date().optional().nullable(),
  description: z
    .string()
    .max(256, "Description must be 256 characters or less")
    .optional(),
};

export const recurringTransactionEditSchema = z.object(baseFields);

export const recurringTransactionCreateSchema = z
  .object({
    ...baseFields,
    recurrenceFrequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
    startDate: z.date(),
  })
  .refine(
    (data) => {
      if (data.endDate && data.startDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

export type RecurringTransactionEditFormData = z.infer<
  typeof recurringTransactionEditSchema
>;

export type RecurringTransactionCreateFormData = z.infer<
  typeof recurringTransactionCreateSchema
>;

export type RecurringTransactionFormProps =
  | {
      mode: "create";
      onSuccess: () => void;
      onCancel: () => void;
    }
  | {
      mode: "edit";
      transaction: RecurringTransaction;
      onSuccess: () => void;
      onCancel: () => void;
    };
