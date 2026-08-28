import { ICON_BY_NAME } from "@/components/categories/CategoryFormDialog/CategoryFormDialog.constants";
import { RecurringActionsMenu } from "@/components/recurring/RecurringActionsMenu";
import { RecurringFrequencyPill } from "@/components/recurring/RecurringFrequencyPill";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  formatNextRunRelative,
  STATUS_BADGE,
} from "@/lib/recurring-transactions.utils";
import { cn } from "@/lib/utils";
import type { Category, RecurringStatus, RecurringTransaction } from "@/types";
import { format } from "date-fns";
import { type FC } from "react";

type MobileRecurringCardProps = {
  transaction: RecurringTransaction;
  category: Category | undefined;
  status: RecurringStatus;
  formatAmount: (n: number) => string;
  onEdit: (rt: RecurringTransaction) => void;
  onTogglePause: (rt: RecurringTransaction) => void;
  onDelete: (rt: RecurringTransaction) => void;
  isToggling: boolean;
  isDeleting: boolean;
};

export const MobileRecurringCard: FC<MobileRecurringCardProps> = ({
  transaction,
  category,
  status,
  formatAmount,
  onEdit,
  onTogglePause,
  onDelete,
  isToggling,
  isDeleting,
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
  const badge = STATUS_BADGE[status];

  return (
    <Card className="p-3.5 flex flex-col gap-2.5">
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
              {format(new Date(transaction.nextOccurrence), "MMM d")} ·{" "}
              {formatNextRunRelative(transaction.nextOccurrence)}
            </span>
          ) : (
            <span className="text-[11px] font-medium text-muted-foreground">
              {status === "paused" ? "Paused" : "Ended"}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <RecurringFrequencyPill rt={transaction} />
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
        <RecurringActionsMenu
          status={status}
          onEdit={() => onEdit(transaction)}
          onTogglePause={() => onTogglePause(transaction)}
          onDelete={() => onDelete(transaction)}
          isToggling={isToggling}
          isDeleting={isDeleting}
        />
      </div>
    </Card>
  );
};
