import { type FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type ReportsResponse } from "@/types";

type ReportsSummaryStatsProps = {
  summary: ReportsResponse["summary"] | null;
  isLoading: boolean;
  formatAmount: (amount: number) => string;
};

export const ReportsSummaryStats: FC<ReportsSummaryStatsProps> = ({
  summary,
  isLoading,
  formatAmount,
}) => (
  <div className="grid gap-3 md:grid-cols-3">
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            Total Income
          </p>
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatAmount(summary?.totalIncome || 0)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            Total Expenses
          </p>
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatAmount(summary?.totalExpenses || 0)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            Net Savings
          </p>
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <p
              className={`text-2xl font-bold ${(summary?.netSavings || 0) >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {formatAmount(summary?.netSavings || 0)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);
