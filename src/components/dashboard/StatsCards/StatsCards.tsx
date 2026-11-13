import { type FC } from "react";
import { cn } from "@/lib/utils";
import { PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { type DashboardStats } from "@/types";
import { StatCard } from "./StatCard";
import { formatMonthOverMonthPercentChange } from "./StatsCards.utils";

type StatsCardsProps = {
  stats: DashboardStats | undefined;
  hasError: boolean;
  statsError: boolean;
  formatAmount: (amount: number) => string;
  savingsRate: number;
};

export const StatsCards: FC<StatsCardsProps> = ({
  stats,
  hasError,
  statsError,
  formatAmount,
  savingsRate,
}) => {
  const incomeChangeText =
    !statsError && stats
      ? formatMonthOverMonthPercentChange(
          stats.monthlyIncome,
          stats.previousMonthIncome,
        )
      : undefined;

  const expensesChangeText =
    !statsError && stats
      ? formatMonthOverMonthPercentChange(
          stats.monthlyExpenses,
          stats.previousMonthExpenses,
        )
      : undefined;

  const savingsChangeText =
    !statsError && stats
      ? formatMonthOverMonthPercentChange(
          stats.monthlySaving,
          stats.previousMonthSaving,
        )
      : undefined;

  return (
    <div
      className={cn(
        "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
        hasError && "opacity-50 pointer-events-none",
      )}
    >
      <StatCard
        title="Current Balance"
        value={statsError ? "\u2014" : formatAmount(stats?.currentBalance || 0)}
        subtitle="total balance"
        icon={<Wallet className="h-[18px] w-[18px] text-gold-500" />}
      />
      <StatCard
        title="Monthly Income"
        value={
          statsError ? "\u2014" : `+${formatAmount(stats?.monthlyIncome || 0)}`
        }
        subtitle="vs last month"
        changeText={incomeChangeText}
        changeType="positive"
        icon={<TrendingUp className="h-[18px] w-[18px] text-success-500" />}
      />
      <StatCard
        title="Monthly Expenses"
        value={
          statsError
            ? "\u2014"
            : `-${formatAmount(stats?.monthlyExpenses || 0)}`
        }
        subtitle="vs last month"
        changeText={expensesChangeText}
        changeType="negative"
        icon={<TrendingDown className="h-[18px] w-[18px] text-danger-500" />}
      />
      <StatCard
        title="Monthly Savings"
        value={statsError ? "\u2014" : formatAmount(stats?.monthlySaving || 0)}
        subtitle={
          statsError
            ? "Data unavailable"
            : `${savingsRate.toFixed(1)}% savings rate`
        }
        changeText={savingsChangeText}
        changeType="positive"
        icon={<PiggyBank className="h-[18px] w-[18px] text-success-500" />}
      />
    </div>
  );
};
