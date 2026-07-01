import { type FC } from "react";
import { RecurringSummaryCard } from "./RecurringSummaryCard";
import { NextUpSummaryCard } from "./NextUpSummaryCard";
import type { RecurringTransactionsStats } from "@/types";

type RecurringSummaryCardsProps = {
  stats: RecurringTransactionsStats | undefined;
  isLoading: boolean;
  hasError: boolean;
  formatAmount: (n: number) => string;
};

export const RecurringSummaryCards: FC<RecurringSummaryCardsProps> = ({
  stats,
  isLoading,
  hasError,
  formatAmount,
}) => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
    <RecurringSummaryCard
      overline="ACTIVE SCHEDULES"
      value={String(stats?.active ?? "")}
      caption={`${stats?.paused ?? 0} paused · ${stats?.ended ?? 0} ended`}
      isLoading={isLoading}
      hasError={hasError}
    />
    <RecurringSummaryCard
      overline="MONTHLY EXPENSES"
      value={`-${formatAmount(stats?.monthlyExpenses.total ?? 0)}`}
      valueClassName="text-danger-500"
      caption={`across ${stats?.monthlyExpenses.count ?? 0} recurring expenses`}
      isLoading={isLoading}
      hasError={hasError}
    />
    <RecurringSummaryCard
      overline="MONTHLY INCOME"
      value={`+${formatAmount(stats?.monthlyIncome.total ?? 0)}`}
      valueClassName="text-success-500"
      caption={`across ${stats?.monthlyIncome.count ?? 0} recurring sources`}
      isLoading={isLoading}
      hasError={hasError}
    />
    <NextUpSummaryCard
      nextUp={stats?.nextUp ?? null}
      formatAmount={formatAmount}
      isLoading={isLoading}
      hasError={hasError}
    />
  </div>
);
