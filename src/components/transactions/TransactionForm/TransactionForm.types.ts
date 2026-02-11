import { z } from "zod";

export const transactionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(
      /^\d+([,.]\d+)?$/,
      "Please enter a valid amount (e.g., 10.50 or 10,50)",
    )
    .refine(
      (val) => {
        const num = parseFloat(val.replace(",", "."));
        return num > 0;
      },
      { message: "Amount must be greater than 0" },
    ),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "Category is required"),
  date: z.date(),
  isRecurring: z.boolean().default(false),
  recurrenceFrequency: z
    .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
    .optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
