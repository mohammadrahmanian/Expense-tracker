import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  type: z.enum(["INCOME", "EXPENSE"]),
  color: z.string().min(1, "Color is required"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
