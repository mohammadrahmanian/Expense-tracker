import { ICON_BY_NAME } from "@/components/categories/CategoryFormDialog/CategoryFormDialog.constants";
import {
  formatNextRunRelative,
  parseRecurringDate,
} from "@/lib/recurring-transactions.utils";
import { cn } from "@/lib/utils";
import type { Category, RecurringStatus, RecurringTransaction } from "@/types";
import { format } from "date-fns";
import { type FC } from "react";

type MobileRecurringCardTopRowProps = {
  transaction: RecurringTransaction;
  category: Category | undefined;
  status: RecurringStatus;
  formatAmount: (n: number) => string;
};

export const MobileRecurringCardTopRow: FC<MobileRecurringCardTopRowProps> = ({
  transaction,
  category,
  status,
  formatAmount,
}) => {
  const color = category?.color ?? "#9C958E";
  const Icon =
    ICON_BY_NAME[category?.icon ?? "utensils"] ?? ICON_BY_NAME["utensils"];
  const isActive = status === "active";
  const amountColor = isActive
    ? transaction.type === "INCOME"
      ? "text-success-500"
      : "text-danger-500"
    : "text-muted-foreground";
  const sign = transaction.type === "INCOME" ? "+" : "-";
  const nextOccurrence = parseRecurringDate(transaction.nextOccurrence);

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}1F` }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className="text-[15px] font-semibold text-foreground truncate">
          {transaction.title}
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          {category?.name ?? "Uncategorized"}
        </span>
      </div>
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <span className={cn("text-[15px] font-bold", amountColor)}>
          {sign}
          {formatAmount(transaction.amount)}
        </span>
        {isActive ? (
          <span className="text-[11px] font-medium text-muted-foreground">
            {format(nextOccurrence, "MMM d")} ·{" "}
            {formatNextRunRelative(nextOccurrence)}
          </span>
        ) : (
          <span className="text-[11px] font-medium text-muted-foreground">
            {status === "paused" ? "Paused" : "Ended"}
          </span>
        )}
      </div>
    </div>
  );
};
