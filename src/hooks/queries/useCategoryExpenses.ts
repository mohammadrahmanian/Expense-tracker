import { useQuery } from "@tanstack/react-query";
import { transactionsService, categoriesService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";
import { CategorySpending } from "@/types";

/**
 * Hook for fetching category expenses for the current month
 *
 * Returns top 5 categories by spending plus an "Others" category for the rest.
 * Each category includes amount, percentage, and color.
 *
 * @returns Query result with category expenses data
 *
 * @example
 * ```tsx
 * const { data: categoryExpenses, isLoading } = useCategoryExpenses();
 *
 * if (categoryExpenses) {
 *   categoryExpenses.forEach(expense => {
 *     console.log(`${expense.categoryName}: ${expense.amount} (${expense.percentage}%)`);
 *   });
 * }
 * ```
 */
export function useCategoryExpenses() {
  return useQuery({
    queryKey: queryKeys.dashboard.categoryExpenses(),
    queryFn: async (): Promise<CategorySpending[]> => {
      const [transactionsResponse, categories] = await Promise.all([
        transactionsService.getAll(),
        categoriesService.getAll(),
      ]);

      const transactions = transactionsResponse.items;

      const now = new Date();
      const currentMonth = now.getUTCMonth();
      const currentYear = now.getUTCFullYear();

      // Filter transactions for current month and expenses only
      const currentMonthExpenses = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transaction.type === "EXPENSE" &&
          transactionDate.getUTCMonth() === currentMonth &&
          transactionDate.getUTCFullYear() === currentYear
        );
      });

      // Group expenses by category
      const categoryTotals = new Map<string, number>();
      currentMonthExpenses.forEach((transaction) => {
        const current = categoryTotals.get(transaction.categoryId) || 0;
        categoryTotals.set(transaction.categoryId, current + transaction.amount);
      });

      // Create CategorySpending array
      const categorySpending: CategorySpending[] = [];
      let totalExpenses = 0;

      categoryTotals.forEach((amount, categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        if (category && amount > 0) {
          categorySpending.push({
            categoryId: category.id,
            categoryName: category.name,
            amount,
            color: category.color,
            percentage: 0, // Will be calculated after we have the total
          });
          totalExpenses += amount;
        }
      });

      // Calculate percentages and sort by amount (descending)
      categorySpending.forEach((spending) => {
        spending.percentage =
          totalExpenses > 0 ? (spending.amount / totalExpenses) * 100 : 0;
      });

      categorySpending.sort((a, b) => b.amount - a.amount);

      // Take top 5 categories and group the rest into "Others"
      const top5Categories = categorySpending.slice(0, 5);
      const remainingCategories = categorySpending.slice(5);

      const result: CategorySpending[] = [...top5Categories];

      if (remainingCategories.length > 0) {
        const othersAmount = remainingCategories.reduce(
          (sum, cat) => sum + cat.amount,
          0,
        );
        const othersPercentage =
          totalExpenses > 0 ? (othersAmount / totalExpenses) * 100 : 0;

        result.push({
          categoryId: "others",
          categoryName: "Others",
          amount: othersAmount,
          color: "#6B7280", // Neutral gray color
          percentage: othersPercentage,
        });
      }

      return result;
    },
  });
}
