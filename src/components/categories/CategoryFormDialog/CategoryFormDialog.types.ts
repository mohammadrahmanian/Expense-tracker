import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  type: z.enum(["INCOME", "EXPENSE"]),
  color: z.string().min(1, "Color is required"),
  icon: z.string().min(1, "Icon is required"),
  parentId: z.string().nullable(),
  monthlyBudget: z.number().nonnegative("Must be ≥ 0").nullable(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
