import { type FC } from "react";
import { AlertCircle, Target } from "lucide-react";
import { type DashboardStats } from "@/types";
import { Card } from "@/components/ui/card";

type SavingsProgressProps = {
  stats: DashboardStats | undefined;
  statsError: boolean;
  formatAmount: (amount: number) => string;
  savingsRate: number;
};

export const SavingsProgress: FC<SavingsProgressProps> = ({
  stats,
  statsError,
  formatAmount,
  savingsRate,
}) => (
  <Card className="p-5 flex flex-col gap-3.5">
    {statsError ? (
      <div className="flex flex-col items-center justify-center h-40 text-neutral-500">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p className="text-body">Unable to load savings data</p>
      </div>
    ) : (
      <>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            Savings Goal
          </h2>
          <Target className="h-5 w-5 text-gold-500" />
        </div>
        <p className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
          Monthly Savings
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[22px] font-bold text-neutral-900 dark:text-white">
            {formatAmount(stats?.monthlySaving || 0)}
          </span>
          <span className="text-[13px] text-neutral-500">
            of {formatAmount(stats?.monthlyIncome || 0)}
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-gold-500 transition-all duration-500"
            style={{
              width: `${Math.max(0, Math.min(100, savingsRate))}%`,
            }}
          />
        </div>
        <span className="text-caption font-semibold text-gold-500">
          {savingsRate.toFixed(1)}% achieved
        </span>
      </>
    )}
  </Card>
);
