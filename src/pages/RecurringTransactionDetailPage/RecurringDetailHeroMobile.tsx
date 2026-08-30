import { type FC } from "react";
import { format } from "date-fns";
import { CalendarClock, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecurringFrequencyPill } from "@/components/recurring/RecurringFrequencyPill";
import { ICON_BY_NAME } from "@/components/categories/CategoryFormDialog/CategoryFormDialog.constants";
import {
  formatPerOccurrenceSubline,
  parseRecurringDate,
  STATUS_BADGE,
} from "@/lib/recurring-transactions.utils";
import { cn } from "@/lib/utils";
import type { Category, RecurringStatus, RecurringTransaction } from "@/types";

type RecurringDetailHeroMobileProps = {
  transaction: RecurringTransaction;
  category: Category | undefined;
  status: RecurringStatus;
  formatAmount: (n: number) => string;
};

export const RecurringDetailHeroMobile: FC<RecurringDetailHeroMobileProps> = ({
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
    <Card className="flex flex-col items-center gap-3.5 px-5 py-6 lg:hidden">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-gold-50 dark:bg-gold-700/25">
        <Icon className="h-6 w-6 text-gold-500 dark:text-gold-300" />
      </span>
      <span className="text-center text-xl font-bold text-foreground">
        {transaction.title}
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge variant={badge.variant}>{badge.label}</Badge>
        <RecurringFrequencyPill rt={transaction} />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span
          className={cn(
            "text-[28px] font-bold leading-none",
            isIncome ? "text-success-500" : "text-danger-500",
          )}
        >
          {isIncome ? "+" : "-"}
          {formatAmount(transaction.amount)}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatPerOccurrenceSubline(transaction)}
        </span>
      </div>
      <div className="h-px w-full bg-border" />
      <div className="flex w-full flex-col gap-2.5 text-[13px] text-muted-foreground">
        <span className="flex items-center gap-2">
          <Tag className="h-3.5 w-3.5 shrink-0" />
          {category?.name ?? "Uncategorized"}
        </span>
        <span className="flex items-center gap-2">
          <CalendarClock className="h-3.5 w-3.5 shrink-0" />
          Since {format(parseRecurringDate(transaction.startDate), "MMM d, yyyy")}
        </span>
      </div>
    </Card>
  );
};
