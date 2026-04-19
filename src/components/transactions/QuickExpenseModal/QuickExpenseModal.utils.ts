import { normalizeAmount } from "@/lib/amount-utils";
import { Category, Transaction } from "@/types";
import { toast } from "sonner";
import {
  QuickExpenseFormData,
  expenseCategories,
} from "./QuickExpenseModal.types";

type CreateCategoryInput = Omit<
  Category,
  "id" | "createdAt" | "updatedAt" | "userId"
>;
type CreateTransactionInput = Omit<
  Transaction,
  "id" | "createdAt" | "updatedAt" | "userId"
>;

interface QuickExpenseSubmitDeps {
  categories: Category[];
  transactionType: "INCOME" | "EXPENSE";
  createCategoryAsync: (data: CreateCategoryInput) => Promise<Category>;
  createTransaction: (
    data: CreateTransactionInput,
    options: { onSuccess: () => void },
  ) => void;
  onSuccess: () => void;
}

const INCOME_NEW_CATEGORY_FALLBACK_COLOR = "#6366f1";

export function createQuickExpenseSubmitHandler(deps: QuickExpenseSubmitDeps) {
  return async (data: QuickExpenseFormData) => {
    const numericAmount = parseFloat(normalizeAmount(data.amount.trim()));

    let category = deps.categories.find(
      (c) => c.name.toLowerCase() === data.categoryName.toLowerCase(),
    );

    if (!category) {
      try {
        const color =
          deps.transactionType === "EXPENSE"
            ? expenseCategories.find((c) => c.name === data.categoryName)
                ?.color || INCOME_NEW_CATEGORY_FALLBACK_COLOR
            : INCOME_NEW_CATEGORY_FALLBACK_COLOR;
        category = await deps.createCategoryAsync({
          name: data.categoryName,
          type: deps.transactionType,
          color,
        });
      } catch {
        toast.error("Category creation failed. Try again!");
        return;
      }
    }

    const kindLabel =
      deps.transactionType === "INCOME" ? "income" : "expense";
    const title =
      data.transactionName?.trim() || `${data.categoryName} ${kindLabel}`;

    deps.createTransaction(
      {
        title,
        amount: numericAmount,
        type: deps.transactionType,
        categoryId: category.id,
        date: data.date,
        description: data.notes || undefined,
        isRecurring: data.isRecurring,
        recurrenceFrequency: data.isRecurring
          ? data.recurrenceFrequency
          : undefined,
      },
      { onSuccess: deps.onSuccess },
    );
  };
}
