import { type FC } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { RecurringTransactionsStats } from "@/types";

type MobileRecurringSummaryCardsProps = {
  stats: RecurringTransactionsStats | undefined;
  isLoading: boolean;
  hasError: boolean;
  formatAmount: (n: number) => string;
};

export const MobileRecurringSummaryCards: FC<
  MobileRecurringSummaryCardsProps
> = ({ stats, isLoading, hasError, formatAmount }) => (
  <div className="grid grid-cols-2 gap-2 px-5 py-1.5">
    <Card className="p-3.5 flex flex-col gap-1">
      <span className="text-overline uppercase text-muted-foreground tracking-wider">
        MONTHLY OUT
      </span>
      {isLoading ? (
        <Skeleton className="h-6 w-24" />
      ) : hasError ? (
        <span className="text-xl font-bold text-danger-500">—</span>
      ) : (
        <span className="text-xl font-bold text-danger-500">
          -{formatAmount(stats?.monthlyExpenses.total ?? 0)}
        </span>
      )}
    </Card>
    <Card className="p-3.5 flex flex-col gap-1">
      <span className="text-overline uppercase text-muted-foreground tracking-wider">
        MONTHLY IN
      </span>
      {isLoading ? (
        <Skeleton className="h-6 w-24" />
      ) : hasError ? (
        <span className="text-xl font-bold text-success-500">—</span>
      ) : (
        <span className="text-xl font-bold text-success-500">
          +{formatAmount(stats?.monthlyIncome.total ?? 0)}
        </span>
      )}
    </Card>
  </div>
);
