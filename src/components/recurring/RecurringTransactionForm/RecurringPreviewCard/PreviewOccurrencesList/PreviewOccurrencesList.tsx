import { type FC } from "react";
import { cn } from "@/lib/utils";
import { OccurrencePreview } from "@/lib/recurring-transactions.utils";

type PreviewOccurrencesListProps = {
  occurrences: OccurrencePreview[];
  type: "INCOME" | "EXPENSE";
  amount: string;
};

export const PreviewOccurrencesList: FC<PreviewOccurrencesListProps> = ({
  occurrences,
  type,
  amount,
}) => {
  if (occurrences.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No upcoming dates</p>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {occurrences.map((occurrence, index) => (
        <div
          key={occurrence.date.toISOString()}
          className="flex items-center gap-3"
        >
          <span
            className={cn(
              "flex h-10 w-8 shrink-0 flex-col items-center justify-center rounded-sm text-[10px] font-semibold uppercase",
              index === 0
                ? "bg-gold-50 text-gold-500 dark:bg-gold-700/25 dark:text-gold-300"
                : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
            )}
          >
            <span>{occurrence.monthShort}</span>
            <span className="text-sm">{occurrence.dayOfMonth}</span>
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-sm font-medium text-foreground">
              {occurrence.weekday}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {occurrence.relativeLabel}
            </span>
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
      ))}
    </div>
  );
};
