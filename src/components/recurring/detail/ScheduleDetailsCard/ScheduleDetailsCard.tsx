import { type FC, type ReactNode } from "react";
import { format } from "date-fns";
import { Infinity as InfinityIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  countOccurrencesUntil,
  formatSchedulePhrase,
} from "@/lib/recurring-transactions.utils";
import type { RecurringTransaction } from "@/types";

type ScheduleDetailsCardProps = {
  transaction: RecurringTransaction;
  formatAmount: (n: number) => string;
};

export const ScheduleDetailsCard: FC<ScheduleDetailsCardProps> = ({
  transaction,
  formatAmount,
}) => {
  const startDate = new Date(transaction.startDate);
  const endDate = transaction.endDate ? new Date(transaction.endDate) : null;
  const totalRuns = countOccurrencesUntil({
    startDate,
    frequency: transaction.recurrenceFrequency,
    endDate,
    until: new Date(),
  });
  const sign = transaction.type === "INCOME" ? "+" : "-";

  const rows: { label: string; value: ReactNode }[] = [
    {
      label: "Frequency",
      value: formatSchedulePhrase({
        recurrenceFrequency: transaction.recurrenceFrequency,
        startDate,
      }),
    },
    { label: "Start date", value: format(startDate, "MMM d, yyyy") },
    {
      label: "End date",
      value: endDate ? (
        format(endDate, "MMM d, yyyy")
      ) : (
        <span className="flex items-center gap-1.5">
          <InfinityIcon className="h-4 w-4" />
          No end date
        </span>
      ),
    },
    { label: "Total runs so far", value: `${totalRuns} occurrences` },
    {
      label: "Lifetime total",
      value: (
        <span
          className={
            transaction.type === "INCOME"
              ? "text-success-500"
              : "text-danger-500"
          }
        >
          {sign}
          {formatAmount(totalRuns * transaction.amount)}
        </span>
      ),
    },
  ];

  return (
    <Card className="flex flex-col gap-1 p-5">
      <h2 className="mb-2 text-[11px] font-semibold tracking-wider text-neutral-500 dark:text-neutral-400">
        SCHEDULE DETAILS
      </h2>
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-3 text-sm"
          >
            <span className="text-muted-foreground">{row.label}</span>
            <span className="text-right font-medium text-foreground">
              {row.value}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 border-t border-border pt-3">
        <span className="text-[10px] font-semibold tracking-wider text-neutral-500 dark:text-neutral-400">
          NOTES
        </span>
        <p className="mt-1 text-sm text-foreground">
          {transaction.description || (
            <span className="text-muted-foreground">No notes</span>
          )}
        </p>
      </div>
    </Card>
  );
};
