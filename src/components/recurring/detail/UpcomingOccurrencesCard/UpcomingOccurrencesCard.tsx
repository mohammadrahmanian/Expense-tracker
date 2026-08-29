import { type FC, type ReactNode, useState } from "react";
import { Card } from "@/components/ui/card";
import { getNextOccurrences } from "@/lib/recurring-transactions.utils";
import { UpcomingOccurrenceRow } from "./UpcomingOccurrenceRow";
import type { RecurringStatus, RecurringTransaction } from "@/types";

type UpcomingOccurrencesCardProps = {
  transaction: RecurringTransaction;
  status: RecurringStatus;
  formatAmount: (n: number) => string;
  title?: ReactNode;
};

const DEFAULT_VISIBLE = 4;

export const UpcomingOccurrencesCard: FC<UpcomingOccurrencesCardProps> = ({
  transaction,
  status,
  formatAmount,
  title = "Upcoming occurrences",
}) => {
  const [expanded, setExpanded] = useState(false);

  const occurrences =
    status === "ended"
      ? []
      : getNextOccurrences({
          startDate: new Date(transaction.startDate),
          frequency: transaction.recurrenceFrequency,
          endDate: transaction.endDate
            ? new Date(transaction.endDate)
            : undefined,
          count: 6,
        });

  const visible = expanded
    ? occurrences
    : occurrences.slice(0, DEFAULT_VISIBLE);
  const showFooter = occurrences.length >= 5;
  const remaining = occurrences.length - DEFAULT_VISIBLE;

  const sign = transaction.type === "INCOME" ? "+" : "-";
  const amountText = `${sign}${formatAmount(transaction.amount)}`;

  return (
    <Card className="flex flex-col overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-border p-5">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
          Next {visible.length}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-5">
        {visible.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming dates</p>
        ) : (
          visible.map((occurrence, i) => (
            <UpcomingOccurrenceRow
              key={occurrence.date.toISOString()}
              occurrence={occurrence}
              isFirst={i === 0}
              type={transaction.type}
              amount={amountText}
            />
          ))
        )}
      </div>
      {showFooter && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="border-t border-border p-4 text-center text-sm font-semibold text-gold-500 hover:underline"
        >
          Show {remaining} more upcoming
        </button>
      )}
    </Card>
  );
};
