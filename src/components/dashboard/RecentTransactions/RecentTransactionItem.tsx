import { type FC } from "react";
import { TransactionTypeIcon } from "@/components/transactions/TransactionTypeIcon";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { type Category, type Transaction } from "@/types";

type RecentTransactionItemProps = {
  transaction: Transaction;
  category: Category | undefined;
  formatAmount: (amount: number) => string;
};

export const RecentTransactionItem: FC<RecentTransactionItemProps> = ({
  transaction,
  category,
  formatAmount,
}) => (
  <div className="flex items-center justify-between p-3 rounded-lg border">
    <div className="flex items-center space-x-3">
      <TransactionTypeIcon type={transaction.type} size="md" />
      <div>
        <p className="font-medium">{transaction.title}</p>
        <div className="flex items-center space-x-2">
          {category && (
            <Badge
              variant="secondary"
              style={{
                backgroundColor: category.color + "20",
                color: category.color,
              }}
            >
              {category.name}
            </Badge>
          )}
          <span className="text-sm text-gray-500">
            {format(new Date(transaction.date), "MMM dd")}
          </span>
        </div>
      </div>
    </div>
    <div
      className={cn(
        "font-semibold",
        transaction.type === "INCOME"
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400",
      )}
    >
      {transaction.type === "INCOME" ? "+" : "-"}
      {formatAmount(transaction.amount)}
    </div>
  </div>
);
