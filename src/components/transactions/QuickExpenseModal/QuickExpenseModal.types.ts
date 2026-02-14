import { Heart, Home, UtensilsCrossed } from "lucide-react";
import { z } from "zod";

export const quickCategories = [
  { name: "Food", icon: UtensilsCrossed, color: "#FF6B6B" },
  { name: "Health", icon: Heart, color: "#4ECDC4" },
  { name: "Household", icon: Home, color: "#45B7D1" },
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
});

export type QuickExpenseFormData = z.infer<typeof quickExpenseSchema>;
