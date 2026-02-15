import { type FC } from "react";
import { cn } from "@/lib/utils";
import { PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { type DashboardStats } from "@/types";
import { StatCard } from "./StatCard";

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
}) => (
  <div
    className={cn(
      "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
      hasError && "opacity-50 pointer-events-none",
    )}
  >
    <StatCard
      title="Current Balance"
      value={statsError ? "\u2014" : formatAmount(stats?.currentBalance || 0)}
      subtitle="Total income minus expenses"
      icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
    />
    <StatCard
      title="Monthly Income"
      value={
        statsError ? "\u2014" : `+${formatAmount(stats?.monthlyIncome || 0)}`
      }
      subtitle="This month's earnings"
      icon={<TrendingUp className="h-4 w-4 text-green-600" />}
      valueClassName="text-green-600"
    />
    <StatCard
      title="Monthly Expenses"
      value={
        statsError
          ? "\u2014"
          : `-${formatAmount(stats?.monthlyExpenses || 0)}`
      }
      subtitle="This month's spending"
      icon={<TrendingDown className="h-4 w-4 text-red-600" />}
      valueClassName="text-red-600"
    />
    <StatCard
      title="Monthly Savings"
      value={statsError ? "\u2014" : formatAmount(stats?.monthlySaving || 0)}
      subtitle={
        statsError
          ? "Data unavailable"
          : `${savingsRate.toFixed(1)}% savings rate`
      }
      icon={<PiggyBank className="h-4 w-4 text-blue-600" />}
      valueClassName="text-blue-600"
    />
  </div>
);
