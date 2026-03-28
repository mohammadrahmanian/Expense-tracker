import { type FC } from "react";
import { TransactionTypeIcon } from "@/components/transactions/TransactionTypeIcon";
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
  <div className="flex items-center gap-3 rounded-lg bg-surface dark:bg-neutral-800 p-4 border border-neutral-200 dark:border-neutral-700">
    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gold-50 dark:bg-gold-500/10 flex items-center justify-center">
      <TransactionTypeIcon type={transaction.type} size="md" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-body font-semibold text-neutral-900 dark:text-white truncate">
        {transaction.title}
      </p>
      <span className="text-[11px] text-neutral-500">
        {category ? `${category.name} · ` : ""}
        {format(new Date(transaction.date), "MMM dd")}
      </span>
    </div>
    <span
      className={cn(
        "text-base font-bold flex-shrink-0",
        transaction.type === "INCOME"
          ? "text-success-500"
          : "text-danger-500",
      )}
    >
      {transaction.type === "INCOME" ? "+" : "-"}
      {formatAmount(transaction.amount)}
    </span>
  </div>
);
