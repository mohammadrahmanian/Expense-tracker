import { type FC } from "react";
import { cn } from "@/lib/utils";
import { SummaryCard } from "./SummaryCard";

type TransactionsSummaryCardsProps = {
  totalIncome: number;
  totalExpenses: number;
  net: number;
  totalTransactions: number;
  hasError: boolean;
  isLoading: boolean;
  formatAmount: (amount: number) => string;
};

export const TransactionsSummaryCards: FC<TransactionsSummaryCardsProps> = ({
  totalIncome,
  totalExpenses,
  net,
  totalTransactions,
  hasError,
  isLoading,
  formatAmount,
}) => (
  <div
    className={cn(
      "grid grid-cols-2 gap-4 md:grid-cols-4",
      hasError && "opacity-50 pointer-events-none",
    )}
  >
    <SummaryCard
      title="Total Income"
      value={`+${formatAmount(totalIncome)}`}
      valueClassName="text-success-500"
      isLoading={isLoading}
      hasError={hasError}
    />
    <SummaryCard
      title="Total Expenses"
      value={`-${formatAmount(totalExpenses)}`}
      valueClassName="text-danger-500"
      isLoading={isLoading}
      hasError={hasError}
    />
    <SummaryCard
      title="Net Balance"
      value={`${net >= 0 ? "+" : "-"}${formatAmount(Math.abs(net))}`}
      valueClassName="text-primary"
      isLoading={isLoading}
      hasError={hasError}
    />
    <SummaryCard
      title="Transactions"
      value={String(totalTransactions)}
      valueClassName="text-foreground"
      isLoading={isLoading}
      hasError={hasError}
    />
  </div>
);
