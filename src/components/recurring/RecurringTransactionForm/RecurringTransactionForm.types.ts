import { type ReactNode } from "react";
import { type UseFormReturn } from "react-hook-form";
import { parseAmount } from "@/lib/amount-utils";
import { Category, RecurringTransaction } from "@/types";
import { z } from "zod";

const isValidAmount = (value: string): boolean => {
  const parsed = parseAmount(value);
  return parsed !== null && parsed > 0;
};

const baseFields = {
  title: z
    .string()
    .min(1, "Title is required")
    .max(40, "Title must be 40 characters or less"),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "Category is required"),
  amount: z.string().refine(isValidAmount, "Please enter a valid amount"),
  hasEndDate: z.boolean(),
  endDate: z.date().optional().nullable(),
  description: z
    .string()
    .max(256, "Description must be 256 characters or less")
    .optional(),
};

export const recurringTransactionCreateSchema = z
  .object({
    ...baseFields,
    recurrenceFrequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
    startDate: z.date(),
  })
  .superRefine((data, ctx) => {
    if (!data.hasEndDate) return;
    if (!data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date is required",
        path: ["endDate"],
      });
      return;
    }
    if (data.endDate <= data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
        path: ["endDate"],
      });
    }
  });

/**
 * Factory so the "end date must be after start date" comparison can be gated on the
 * (read-only, non-form) start date of the transaction being edited, via Zod instead
 * of a manual check in the submit handler.
 */
export function makeRecurringTransactionEditSchema(startDateISO: string) {
  const startDate = new Date(startDateISO);
  return z.object(baseFields).superRefine((data, ctx) => {
    if (!data.hasEndDate) return;
    if (!data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date is required",
        path: ["endDate"],
      });
      return;
    }
    if (data.endDate <= startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
        path: ["endDate"],
      });
    }
  });
}

export type RecurringTransactionCreateFormData = z.infer<
  typeof recurringTransactionCreateSchema
>;

export type RecurringTransactionEditFormData = z.infer<
  ReturnType<typeof makeRecurringTransactionEditSchema>
>;

/**
 * Superset of both schemas, used as the single `useForm` generic. `recurrenceFrequency`
 * and `startDate` are always populated (including in edit mode, from the transaction
 * being edited — see `getEditDefaultValues`) so shared components (preview card, footer
 * note) can read them via one typed `watch`/`setValue` regardless of mode, even though
 * the edit schema doesn't validate or submit them since they're read-only after creation.
 */
export type RecurringTransactionFormValues = {
  title: string;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  amount: string;
  hasEndDate: boolean;
  endDate?: Date | null;
  description?: string;
  recurrenceFrequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  startDate: Date;
};

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

/**
 * Shared across `RecurringTransactionFormMobileBody` and
 * `RecurringTransactionFormDesktopBody` — both render the same field set from
 * the same `useRecurringTransactionForm` instance, just laid out differently.
 */
export type RecurringFormBodyProps = {
  form: UseFormReturn<RecurringTransactionFormValues>;
  currencySymbol: string;
  filteredCategories: Category[];
  categories: Category[];
  isPending: boolean;
  isCategoriesLoading: boolean;
  firstOccurrenceNote: ReactNode;
  onCancel: () => void;
} & (
  | { mode: "create"; transaction?: never }
  | { mode: "edit"; transaction: RecurringTransaction }
);
