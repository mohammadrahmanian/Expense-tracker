import { type FC } from "react";
import { format } from "date-fns";
import { CalendarClock, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecurringFrequencyPill } from "@/components/recurring/RecurringFrequencyPill";
import { ICON_BY_NAME } from "@/components/categories/CategoryFormDialog/CategoryFormDialog.constants";
import {
  ORDINAL_SUFFIX,
  STATUS_BADGE,
} from "@/lib/recurring-transactions.utils";
import { cn } from "@/lib/utils";
import type { Category, RecurringStatus, RecurringTransaction } from "@/types";

type RecurringDetailHeroProps = {
  transaction: RecurringTransaction;
  category: Category | undefined;
  status: RecurringStatus;
  formatAmount: (n: number) => string;
};

function formatPerOccurrenceSubline(rt: RecurringTransaction): string {
  const start = new Date(rt.startDate);
  switch (rt.recurrenceFrequency) {
    case "DAILY":
      return "per occurrence · every day";
    case "WEEKLY":
      return `per occurrence · on ${format(start, "EEEE")}`;
    case "MONTHLY":
      return `per occurrence · on the ${ORDINAL_SUFFIX(start.getDate())}`;
    case "YEARLY":
      return `per occurrence · on ${format(start, "MMM d")}`;
  }
}

export const RecurringDetailHero: FC<RecurringDetailHeroProps> = ({
  transaction,
  category,
  status,
  formatAmount,
}) => {
  const Icon =
    ICON_BY_NAME[category?.icon ?? "utensils"] ?? ICON_BY_NAME.utensils;
  const badge = STATUS_BADGE[status];
  const isIncome = transaction.type === "INCOME";

  return (
    <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-gold-50 dark:bg-gold-700/25">
          <Icon className="h-7 w-7 text-gold-500 dark:text-gold-300" />
        </span>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xl font-bold text-foreground">
              {transaction.title}
            </span>
            <Badge variant={badge.variant}>{badge.label}</Badge>
            <RecurringFrequencyPill rt={transaction} />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              {category?.name ?? "Uncategorized"}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarClock className="h-4 w-4" />
              Since {format(new Date(transaction.startDate), "MMM d, yyyy")}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:items-end">
        <span
          className={cn(
            "text-3xl font-bold",
            isIncome ? "text-success-500" : "text-danger-500",
          )}
        >
          {isIncome ? "+" : "-"}
          {formatAmount(transaction.amount)}
        </span>
        <span className="text-sm text-muted-foreground">
          {formatPerOccurrenceSubline(transaction)}
        </span>
      </div>
    </Card>
  );
};
