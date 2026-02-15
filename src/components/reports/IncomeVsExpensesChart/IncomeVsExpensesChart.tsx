import { type FC } from "react";
import { ComponentErrorBoundary } from "@/components/ErrorBoundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HighchartsContainer } from "@/components/ui/highcharts-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { escapeHtml } from "@/lib/utils";
import { type MonthlyData } from "@/types";

type IncomeVsExpensesChartProps = {
  monthlyData: MonthlyData[];
  isLoading: boolean;
  formatAmount: (amount: number) => string;
};

export const IncomeVsExpensesChart: FC<IncomeVsExpensesChartProps> = ({
  monthlyData,
  isLoading,
  formatAmount,
}) => (
  <ComponentErrorBoundary name="IncomeVsExpensesChart">
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-base font-semibold">
          Income vs Expenses
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-3">
            <div className="flex items-end gap-2 h-48">
              <Skeleton className="h-full w-1/6 rounded" />
              <Skeleton className="h-3/4 w-1/6 rounded" />
              <Skeleton className="h-5/6 w-1/6 rounded" />
              <Skeleton className="h-2/3 w-1/6 rounded" />
              <Skeleton className="h-4/5 w-1/6 rounded" />
              <Skeleton className="h-full w-1/6 rounded" />
            </div>
            <div className="flex justify-center gap-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ) : monthlyData.length > 0 ? (
          <HighchartsContainer
            className="w-full"
            options={{
              chart: { type: "spline" },
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
              series: [
                {
                  name: "Income",
                  type: "spline",
                  data: monthlyData.map((d) => d.income.total),
                  color: "#00B894",
                  lineWidth: 3,
                },
                {
                  name: "Expenses",
                  type: "spline",
                  data: monthlyData.map((d) => d.expenses.total),
                  color: "#FF6B6B",
                  lineWidth: 3,
                },
                {
                  name: "Savings",
                  type: "spline",
                  data: monthlyData.map((d) => d.savings),
                  color: "#6C5CE7",
                  lineWidth: 3,
                },
              ],
              tooltip: {
                formatter: function () {
                  return `<b>${escapeHtml(this.series.name)}</b><br/>${formatAmount(this.y || 0)}`;
                },
              },
              legend: {
                enabled: true,
                itemStyle: { fontSize: "10px" },
              },
              plotOptions: {
                spline: {
                  lineWidth: 3,
                  marker: {
                    enabled: true,
                    radius: 4,
                    lineWidth: 2,
                    lineColor: "#FFFFFF",
                  },
                  states: { hover: { lineWidth: 4 } },
                },
              },
            }}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No data available for the selected time range.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  </ComponentErrorBoundary>
);
