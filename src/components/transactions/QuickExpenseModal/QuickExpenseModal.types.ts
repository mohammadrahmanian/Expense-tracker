import { BanknoteArrowDown, Coins, Ellipsis, HandCoins } from "lucide-react";
import { z } from "zod";

/** Fixed income quick-pick cards (API categories not in this set appear under Other). */
export const incomeCategories = [
  { name: "Salary", icon: BanknoteArrowDown, color: "#2D8C45" },
  { name: "Bonus", icon: HandCoins, color: "#B8860B" },
  { name: "Refund", icon: Coins, color: "#2B6CB0" },
  { name: "Other", icon: Ellipsis, color: "#9C958E" },
] as const;

export const quickExpenseSchema = z.object({
  transactionName: z.string().optional(),
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
  categoryName: z.string().min(1, "Category is required"),
  date: z.date(),
  notes: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurrenceFrequency: z
    .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
    .optional(),
});

export type QuickExpenseFormData = z.infer<typeof quickExpenseSchema>;
