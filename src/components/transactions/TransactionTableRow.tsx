import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Category, Transaction } from "@/types";
import { format } from "date-fns";
import { ActionsMenu } from "./ActionsMenu";
import { TransactionTypeIcon } from "./TransactionTypeIcon";

interface TransactionTableRowProps {
  transaction: Transaction;
  category: Category;
  formatAmount: (amount: number) => string;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function TransactionTableRow({
  transaction,
  category,
  formatAmount,
  onEdit,
  onDelete,
  isDeleting = false,
}: TransactionTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center space-x-2">
          <TransactionTypeIcon type={transaction.type} size="sm" />
          <span>{transaction.title}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="secondary"
          style={{
            backgroundColor: category.color + "20",
            color: category.color,
          }}
        >
          {category.name}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant={transaction.type === "INCOME" ? "default" : "destructive"}
        >
          {transaction.type}
        </Badge>
      </TableCell>
      <TableCell>
        {format(new Date(transaction.date), "MMM dd, yyyy")}
      </TableCell>
      <TableCell
        className={cn(
          "text-right font-semibold",
          transaction.type === "INCOME"
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400",
        )}
      >
        {transaction.type === "INCOME" ? "+" : "-"}
        {formatAmount(transaction.amount)}
      </TableCell>
      <TableCell>
        <ActionsMenu
          transaction={transaction}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      </TableCell>
    </TableRow>
  );
}
