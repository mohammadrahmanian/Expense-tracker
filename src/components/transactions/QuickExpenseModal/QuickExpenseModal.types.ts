import { Car, Ellipsis, FileText, ShoppingBag, Tv, Utensils } from "lucide-react";
import { z } from "zod";

export const quickCategories = [
  { name: "Food", icon: Utensils, color: "#B8860B" },
  { name: "Transport", icon: Car, color: "#6B6560" },
  { name: "Shopping", icon: ShoppingBag, color: "#2B6CB0" },
  { name: "Bills", icon: FileText, color: "#8B7A2B" },
  { name: "Fun", icon: Tv, color: "#2D8C45" },
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
