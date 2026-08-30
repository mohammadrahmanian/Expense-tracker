import { RecurringActionsMenu } from "@/components/recurring/RecurringActionsMenu";
import { RecurringFrequencyPill } from "@/components/recurring/RecurringFrequencyPill";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { STATUS_BADGE } from "@/lib/recurring-transactions.utils";
import type { Category, RecurringStatus, RecurringTransaction } from "@/types";
import { type FC } from "react";
import { Link } from "react-router-dom";
import { MobileRecurringCardTopRow } from "./MobileRecurringCardTopRow";

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
  const badge = STATUS_BADGE[status];

  return (
    <Card className="relative p-3.5 flex flex-col gap-2.5">
      <Link
        to={`/recurring-transactions/${transaction.id}`}
        aria-label={transaction.title}
        className="absolute inset-0 z-0 rounded-[inherit] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
      <MobileRecurringCardTopRow
        transaction={transaction}
        category={category}
        status={status}
        formatAmount={formatAmount}
      />
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <RecurringFrequencyPill rt={transaction} />
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
        <div className="relative z-10">
          <RecurringActionsMenu
            status={status}
            onEdit={() => onEdit(transaction)}
            onTogglePause={() => onTogglePause(transaction)}
            onDelete={() => onDelete(transaction)}
            isToggling={isToggling}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </Card>
  );
};
