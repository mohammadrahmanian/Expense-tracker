import { type FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

type TransactionsSummaryCardsProps = {
  totalIncome: number;
  totalExpenses: number;
  net: number;
  hasError: boolean;
  isLoading: boolean;
  formatAmount: (amount: number) => string;
};

export const TransactionsSummaryCards: FC<TransactionsSummaryCardsProps> = ({
  totalIncome,
  totalExpenses,
  net,
  hasError,
  isLoading,
  formatAmount,
}) => (
  <div
    className={cn(
      "grid gap-4 md:grid-cols-3",
      hasError && "opacity-50 pointer-events-none",
    )}
  >
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2">
          <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Income
            </p>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {hasError ? "\u2014" : `+${formatAmount(totalIncome)}`}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2">
          <ArrowDownLeft className="h-5 w-5 text-red-600 dark:text-red-400" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </p>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {hasError ? "\u2014" : `-${formatAmount(totalExpenses)}`}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2">
          <div
            className={cn(
              "h-5 w-5 rounded-full",
              hasError
                ? "bg-gray-400"
                : net >= 0
                  ? "bg-green-600 dark:bg-green-400"
                  : "bg-red-600 dark:bg-red-400",
            )}
          />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Net Amount
            </p>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p
                className={cn(
                  "text-2xl font-bold",
                  hasError
                    ? "text-gray-900 dark:text-white"
                    : net >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400",
                )}
              >
                {hasError
                  ? "\u2014"
                  : `${net >= 0 ? "+" : "-"}${formatAmount(Math.abs(net))}`}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
