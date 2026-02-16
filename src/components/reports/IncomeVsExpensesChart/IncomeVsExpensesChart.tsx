import { useMemo, type FC } from "react";
import { useTheme } from "next-themes";
import { ComponentErrorBoundary } from "@/components/ErrorBoundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HighchartsContainer } from "@/components/ui/highcharts-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { type MonthlyData } from "@/types";
import { getIncomeVsExpensesOptions } from "./IncomeVsExpensesChart.utils";

type IncomeVsExpensesChartProps = {
  monthlyData: MonthlyData[];
  isLoading: boolean;
  formatAmount: (amount: number) => string;
};

export const IncomeVsExpensesChart: FC<IncomeVsExpensesChartProps> = ({
  monthlyData,
  isLoading,
  formatAmount,
}) => {
  const { resolvedTheme } = useTheme();

  const markerLineColor = useMemo(() => {
    if (typeof document === "undefined") return "#FFFFFF";

    const root = document.documentElement;
    const style = getComputedStyle(root);
    const cardColor = style.getPropertyValue("--card").trim();

    if (!cardColor) {
      return resolvedTheme === "dark" ? "#0c1322" : "#FFFFFF";
    }

    const [h, s, l] = cardColor.split(" ");
    return `hsl(${h}, ${s}, ${l})`;
  }, [resolvedTheme]);

  return (
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
              options={getIncomeVsExpensesOptions(monthlyData, formatAmount, markerLineColor)}
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
};
