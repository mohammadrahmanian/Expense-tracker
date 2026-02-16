import { type FC } from "react";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type CategorySpending } from "@/types";

type ReportsPieChartsProps = {
  categorySpending: CategorySpending[];
  incomeByCategory: CategorySpending[];
  isLoading: boolean;
  formatAmount: (amount: number) => string;
};

const PieChartSkeleton = () => (
  <div className="flex flex-col items-center gap-4 py-4">
    <Skeleton className="h-40 w-40 rounded-full" />
    <div className="flex flex-wrap justify-center gap-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-24" />
    </div>
  </div>
);

export const ReportsPieCharts: FC<ReportsPieChartsProps> = ({
  categorySpending,
  incomeByCategory,
  isLoading,
  formatAmount,
}) => (
  <div className="grid gap-3 md:grid-cols-2">
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-base font-semibold">
          Expense Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <PieChartSkeleton />
        ) : categorySpending.length > 0 ? (
          <CategoryPieChart
            data={categorySpending}
            seriesName="Expenses"
            formatAmount={formatAmount}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No expense data available.
            </p>
          </div>
        )}
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-base font-semibold">
          Income Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <PieChartSkeleton />
        ) : incomeByCategory.length > 0 ? (
          <CategoryPieChart
            data={incomeByCategory}
            seriesName="Income"
            formatAmount={formatAmount}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No income data available.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);
