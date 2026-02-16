import { type FC } from "react";
import { cn } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { SummaryCard } from "./SummaryCard";

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
    <SummaryCard
      icon={<ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />}
      title="Total Income"
      isLoading={isLoading}
      hasError={hasError}
      valueClass="text-2xl font-bold text-green-600 dark:text-green-400"
      formattedValue={`+${formatAmount(totalIncome)}`}
    />
    <SummaryCard
      icon={<ArrowDownLeft className="h-5 w-5 text-red-600 dark:text-red-400" />}
      title="Total Expenses"
      isLoading={isLoading}
      hasError={hasError}
      valueClass="text-2xl font-bold text-red-600 dark:text-red-400"
      formattedValue={`-${formatAmount(totalExpenses)}`}
    />
    <SummaryCard
      icon={
        <div
          className={cn(
            "h-5 w-5 rounded-full",
            hasError
              ? "bg-gray-400 dark:bg-gray-500"
              : net >= 0
                ? "bg-green-600 dark:bg-green-400"
                : "bg-red-600 dark:bg-red-400",
          )}
        />
      }
      title="Net Amount"
      isLoading={isLoading}
      hasError={hasError}
      valueClass={cn(
        "text-2xl font-bold",
        hasError
          ? "text-gray-900 dark:text-white"
          : net >= 0
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400",
      )}
      formattedValue={`${net >= 0 ? "+" : "-"}${formatAmount(Math.abs(net))}`}
    />
  </div>
);
