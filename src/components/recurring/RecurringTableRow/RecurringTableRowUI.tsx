import { type FC } from "react";
import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RecurringActionsMenu } from "@/components/recurring/RecurringActionsMenu";
import { RecurringFrequencyPill } from "@/components/recurring/RecurringFrequencyPill";
import { RecurringTableNameCell } from "./RecurringTableNameCell";
import {
  formatNextRunRelative,
  parseRecurringDate,
  STATUS_BADGE,
} from "@/lib/recurring-transactions.utils";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { RecurringStatus, RecurringTransaction } from "@/types";

type RecurringTableRowUIProps = {
  transaction: RecurringTransaction;
  subtitle: string;
  status: RecurringStatus;
  color: string;
  Icon: LucideIcon;
  amountColor: string;
  sign: string;
  formatAmount: (n: number) => string;
  onEdit: () => void;
  onTogglePause: () => void;
  onDelete: () => void;
  isToggling: boolean;
  isDeleting: boolean;
};

export const RecurringTableRowUI: FC<RecurringTableRowUIProps> = ({
  transaction,
  subtitle,
  status,
  color,
  Icon,
  amountColor,
  sign,
  formatAmount,
  onEdit,
  onTogglePause,
  onDelete,
  isToggling,
  isDeleting,
}) => {
  const badge = STATUS_BADGE[status];
  const isActive = status === "active";
  const nextOccurrence = parseRecurringDate(transaction.nextOccurrence);
  return (
    <TableRow>
      <RecurringTableNameCell
        title={transaction.title}
        subtitle={subtitle}
        color={color}
        Icon={Icon}
        to={`/recurring-transactions/${transaction.id}`}
      />
      <TableCell
        className={cn("text-right text-sm font-semibold", amountColor)}
      >
        {sign}
        {formatAmount(transaction.amount)}
      </TableCell>
      <TableCell>
        <RecurringFrequencyPill rt={transaction} />
      </TableCell>
      <TableCell>
        {isActive ? (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">
              {format(nextOccurrence, "MMM d, yyyy")}
            </span>
            <span className="text-[11px] font-semibold text-primary">
              {formatNextRunRelative(nextOccurrence)}
            </span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">
            {status === "paused" ? "Paused" : "Ended"}
          </span>
        )}
      </TableCell>
      <TableCell>
        <Badge variant={badge.variant}>{badge.label}</Badge>
      </TableCell>
      <TableCell>
        <RecurringActionsMenu
          status={status}
          onEdit={onEdit}
          onTogglePause={onTogglePause}
          onDelete={onDelete}
          isToggling={isToggling}
          isDeleting={isDeleting}
        />
      </TableCell>
    </TableRow>
  );
};
