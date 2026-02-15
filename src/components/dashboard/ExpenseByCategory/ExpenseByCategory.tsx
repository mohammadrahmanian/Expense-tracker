import { type FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";
import { AlertCircle } from "lucide-react";
import { type CategorySpending } from "@/types";

type ExpenseByCategoryProps = {
  categoryExpenses: CategorySpending[] | undefined;
  categoryExpensesError: boolean;
  categoryExpensesErrorMessage?: string;
  monthlyExpenses: string;
  statsError: boolean;
  isLoading: boolean;
  formatAmount: (amount: number) => string;
};

export const ExpenseByCategory: FC<ExpenseByCategoryProps> = ({
  categoryExpenses,
  categoryExpensesError,
  categoryExpensesErrorMessage,
  monthlyExpenses,
  statsError,
  isLoading,
  formatAmount,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Expense by Category</CardTitle>
      <p className="text-sm text-muted-foreground">
        Current month: {statsError ? "\u2014" : monthlyExpenses}
      </p>
    </CardHeader>
    <CardContent>
      {categoryExpensesError ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p className="text-sm font-medium">
            Unable to load expense breakdown
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {categoryExpensesErrorMessage || "An error occurred"}
          </p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-sm text-muted-foreground">Loading chart...</div>
        </div>
      ) : categoryExpenses && categoryExpenses.length > 0 ? (
        <CategoryPieChart
          data={categoryExpenses}
          seriesName="Expenses"
          formatAmount={formatAmount}
          maxLegendItems={5}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">{"\ud83d\udcca"}</div>
          <p className="text-sm font-medium">
            No expense data for this month
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Start adding transactions to see your spending breakdown
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);
