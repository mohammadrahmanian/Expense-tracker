import { type FC } from "react";
import { ICON_BY_NAME } from "@/components/categories/CategoryFormDialog/CategoryFormDialog.constants";
import { RecurringTableRowUI } from "./RecurringTableRowUI";
import { formatRowSubtitle } from "@/lib/recurring-transactions.utils";
import type { Category, RecurringStatus, RecurringTransaction } from "@/types";

type RecurringTableRowProps = {
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

export const RecurringTableRow: FC<RecurringTableRowProps> = ({
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
  const subtitle = formatRowSubtitle(
    transaction,
    category?.name ?? "Uncategorized",
  );

  return (
    <RecurringTableRowUI
      transaction={transaction}
      subtitle={subtitle}
      status={status}
      color={color}
      Icon={Icon}
      amountColor={amountColor}
      sign={sign}
      formatAmount={formatAmount}
      onEdit={() => onEdit(transaction)}
      onTogglePause={() => onTogglePause(transaction)}
      onDelete={() => onDelete(transaction)}
      isToggling={isToggling}
      isDeleting={isDeleting}
    />
  );
};
