import { type FC } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNextRunRelative } from "@/lib/recurring-transactions.utils";
import type { RecurringTransactionsStats } from "@/types";

type NextUpSummaryCardProps = {
  nextUp: RecurringTransactionsStats["nextUp"];
  formatAmount: (n: number) => string;
  isLoading: boolean;
  hasError: boolean;
};

const sign = (type: "INCOME" | "EXPENSE") => (type === "INCOME" ? "+" : "-");

export const NextUpSummaryCard: FC<NextUpSummaryCardProps> = ({
  nextUp,
  formatAmount,
  isLoading,
  hasError,
}) => (
  <Card className="p-5 flex flex-col gap-1.5">
    <span className="text-overline uppercase text-muted-foreground tracking-wider">
      NEXT UP
    </span>
    {isLoading ? (
      <>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-28" />
      </>
    ) : hasError || !nextUp ? (
      <>
        <span className="text-base font-semibold text-foreground">
          No upcoming
        </span>
        <span className="text-caption text-muted-foreground">—</span>
      </>
    ) : (
      <>
        <span className="text-base font-semibold text-foreground">
          {nextUp.title} — {sign(nextUp.type)}
          {formatAmount(nextUp.amount)}
        </span>
        <span className="text-caption font-medium text-primary">
          {formatNextRunRelative(nextUp.occurrence)} ·{" "}
          {format(new Date(nextUp.occurrence), "MMM d, yyyy")}
        </span>
      </>
    )}
  </Card>
);
