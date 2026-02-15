import { type FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";
import { type DashboardStats } from "@/types";

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
  <Card>
    <CardHeader>
      <CardTitle>Savings Progress</CardTitle>
    </CardHeader>
    <CardContent>
      {statsError ? (
        <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p className="text-sm">Unable to load savings data</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Monthly Savings</span>
            <span>
              {formatAmount(stats?.monthlySaving || 0)} of{" "}
              {formatAmount(stats?.monthlyIncome || 0)}
            </span>
          </div>
          <Progress
            value={Math.max(0, Math.min(100, savingsRate))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            {savingsRate >= 20
              ? "Great job! You're saving well."
              : "Consider increasing your savings rate to 20% or more."}
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);
