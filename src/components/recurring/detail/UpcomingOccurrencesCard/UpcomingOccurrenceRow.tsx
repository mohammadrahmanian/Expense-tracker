import { type FC } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { OccurrencePreview } from "@/lib/recurring-transactions.utils";

type UpcomingOccurrenceRowProps = {
  occurrence: OccurrencePreview;
  isFirst: boolean;
  type: "INCOME" | "EXPENSE";
  amount: string;
};

export const UpcomingOccurrenceRow: FC<UpcomingOccurrenceRowProps> = ({
  occurrence,
  isFirst,
  type,
  amount,
}) => (
  <div
    className={cn(
      "flex items-center gap-3 rounded-md p-3",
      isFirst && "bg-gold-50 dark:bg-gold-700/25",
    )}
  >
    <div
      className={cn(
        "flex h-[52px] w-11 shrink-0 flex-col items-center justify-center rounded-sm text-[10px] font-semibold uppercase",
        isFirst
          ? "bg-gold-500 text-white"
          : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
      )}
    >
      <span>{occurrence.monthShort}</span>
      <span className="text-base">{occurrence.dayOfMonth}</span>
    </div>
    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      {isFirst ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {occurrence.relativeLabel} ·{" "}
              {format(occurrence.date, "EEE, MMM d")}
            </span>
            <span className="inline-flex items-center rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-semibold text-white">
              Next up
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Scheduled</span>
        </>
      ) : (
        <>
          <span className="text-sm font-medium text-foreground">
            {occurrence.weekday}
          </span>
          <span className="text-xs text-muted-foreground">
            {occurrence.relativeLabel}
          </span>
        </>
      )}
    </div>
    <span
      className={cn(
        "shrink-0 text-sm font-semibold",
        type === "INCOME" ? "text-success-500" : "text-danger-500",
      )}
    >
      {amount}
    </span>
  </div>
);
