import { type FC } from "react";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Category, Transaction } from "@/types";
import { format } from "date-fns";
import { ActionsMenu } from "./ActionsMenu";
import { TransactionTypeIcon } from "./TransactionTypeIcon";

type TransactionTableRowProps = {
  transaction: Transaction;
  category: Category;
  formatAmount: (amount: number) => string;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
};

export const TransactionTableRow: FC<TransactionTableRowProps> = ({
  transaction,
  category,
  formatAmount,
  onEdit,
  onDelete,
  isDeleting = false,
}) => (
  <TableRow>
    <TableCell className="w-[120px] text-[13px] text-muted-foreground">
      {format(new Date(transaction.date), "MMM dd")}
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-2.5">
        <TransactionTypeIcon type={transaction.type} size="sm" />
        <span className="text-[13px] font-medium text-foreground truncate">
          {transaction.title}
        </span>
      </div>
    </TableCell>
    <TableCell className="w-[140px]">
      <Badge variant="default" size="sm">{category.name}</Badge>
    </TableCell>
    <TableCell
      className={cn(
        "w-[120px] text-right text-[13px] font-semibold",
        transaction.type === "INCOME" ? "text-success-500" : "text-danger-500",
      )}
    >
      {transaction.type === "INCOME" ? "+" : "-"}
      {formatAmount(transaction.amount)}
    </TableCell>
    <TableCell className="w-[40px] p-0">
      <ActionsMenu
        transaction={transaction}
        onEdit={onEdit}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />
    </TableCell>
  </TableRow>
);
