import { type FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HighchartsContainer } from "@/components/ui/highcharts-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { escapeHtml } from "@/lib/utils";
import { buildCategorySeriesData } from "@/lib/reports.utils";
import { type CategorySpending, type MonthlyData } from "@/types";

type CategoryBreakdownChartProps = {
  monthlyData: MonthlyData[];
  categorySpending: CategorySpending[];
  incomeByCategory: CategorySpending[];
  categoryBreakdownType: "expenses" | "income";
  onCategoryBreakdownTypeChange: (value: "expenses" | "income") => void;
  isLoading: boolean;
  formatAmount: (amount: number) => string;
};

export const CategoryBreakdownChart: FC<CategoryBreakdownChartProps> = ({
  monthlyData,
  categorySpending,
  incomeByCategory,
  categoryBreakdownType,
  onCategoryBreakdownTypeChange,
  isLoading,
  formatAmount,
}) => {
  const hasData =
    monthlyData.length > 0 &&
    ((categoryBreakdownType === "expenses" && categorySpending.length > 0) ||
      (categoryBreakdownType === "income" && incomeByCategory.length > 0));

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            {categoryBreakdownType === "expenses"
              ? "Expense Categories"
              : "Income Sources"}
          </CardTitle>
          <Select
            value={categoryBreakdownType}
            onValueChange={onCategoryBreakdownTypeChange}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expenses">Expenses</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-3">
            <div className="flex items-end gap-2 h-48">
              <Skeleton className="h-2/3 w-1/6 rounded" />
              <Skeleton className="h-full w-1/6 rounded" />
              <Skeleton className="h-4/5 w-1/6 rounded" />
              <Skeleton className="h-3/4 w-1/6 rounded" />
              <Skeleton className="h-5/6 w-1/6 rounded" />
              <Skeleton className="h-2/3 w-1/6 rounded" />
            </div>
            <div className="flex justify-center gap-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ) : hasData ? (
          <HighchartsContainer
            className="w-full"
            options={{
              chart: { type: "column" },
              title: { text: undefined },
              xAxis: {
                categories: monthlyData.map(
                  (d) => d.monthLabel || d.month,
                ),
                labels: { style: { fontSize: "10px" } },
              },
              yAxis: {
                title: { text: undefined },
                labels: { style: { fontSize: "10px" } },
              },
              plotOptions: {
                column: { stacking: "normal", borderWidth: 0 },
              },
              series: buildCategorySeriesData(
                monthlyData,
                categoryBreakdownType === "expenses"
                  ? categorySpending
                  : incomeByCategory,
                categoryBreakdownType,
              ),
              tooltip: {
                formatter: function () {
                  return `<b>${escapeHtml(this.series.name)}</b><br/>${formatAmount(this.y || 0)}`;
                },
              },
              legend: {
                enabled: true,
                itemStyle: { fontSize: "10px" },
              },
            }}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {categoryBreakdownType === "expenses"
                ? "No expense data available."
                : "No income data available."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
