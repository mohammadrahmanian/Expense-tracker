import { type FC } from "react";
import { format } from "date-fns";
import { CalendarClock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatNextRunRelative } from "@/lib/recurring-transactions.utils";
import type { RecurringTransactionsStats } from "@/types";

type MobileRecurringNextUpCardProps = {
  nextUp: RecurringTransactionsStats["nextUp"];
  isLoading: boolean;
  hasError: boolean;
  formatAmount: (n: number) => string;
};

export const MobileRecurringNextUpCard: FC<MobileRecurringNextUpCardProps> = ({
  nextUp,
  isLoading,
  hasError,
  formatAmount,
}) => {
  if (!isLoading && (hasError || !nextUp)) return null;
  const sign = nextUp?.type === "INCOME" ? "+" : "-";

  return (
    <div className="px-5 pb-2">
      <Card className="p-3.5 bg-info-100 border-info-300 dark:bg-info-700/20 dark:border-info-700">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-info-500 text-white shrink-0">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div className="flex-1 flex flex-col gap-0.5 min-w-0">
            <span className="text-[10px] font-bold tracking-wider text-info-700 dark:text-info-300">
              NEXT UP
            </span>
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </>
            ) : nextUp ? (
              <>
                <span className="text-[15px] font-bold text-foreground truncate">
                  {nextUp.title}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {formatNextRunRelative(nextUp.occurrence)} ·{" "}
                  {format(new Date(nextUp.occurrence), "MMM d")}
                </span>
              </>
            ) : null}
          </div>
          {nextUp && !isLoading && (
            <div className="flex flex-col items-end shrink-0">
              <span
                className={cn(
                  "text-base font-bold",
                  nextUp.type === "INCOME"
                    ? "text-success-500"
                    : "text-danger-500",
                )}
              >
                {sign}
                {formatAmount(nextUp.amount)}
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
