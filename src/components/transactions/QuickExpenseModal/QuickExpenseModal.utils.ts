import { normalizeAmount } from "@/lib/amount-utils";
import { Category, Transaction } from "@/types";
import {
  QuickExpenseFormData,
  quickCategories,
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
  createCategoryAsync: (data: CreateCategoryInput) => Promise<Category>;
  createTransaction: (
    data: CreateTransactionInput,
    options: { onSuccess: () => void },
  ) => void;
  onSuccess: () => void;
}

export function createQuickExpenseSubmitHandler(deps: QuickExpenseSubmitDeps) {
  return async (data: QuickExpenseFormData) => {
    const numericAmount = parseFloat(normalizeAmount(data.amount.trim()));

    let category = deps.categories.find(
      (c) => c.name.toLowerCase() === data.categoryName.toLowerCase(),
    );

    if (!category) {
      try {
        category = await deps.createCategoryAsync({
          name: data.categoryName,
          type: "EXPENSE",
          color:
            quickCategories.find((c) => c.name === data.categoryName)?.color ||
            "#6366f1",
        });
      } catch {
        return;
      }
    }

    const title =
      data.transactionName?.trim() || `${data.categoryName} expense`;

    deps.createTransaction(
      {
        title,
        amount: numericAmount,
        type: "EXPENSE",
        categoryId: category.id,
        date: data.date,
        isRecurring: false,
      },
      { onSuccess: deps.onSuccess },
    );
  };
}
