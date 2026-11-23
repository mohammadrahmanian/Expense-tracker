import { type FC } from "react";
import { cn } from "@/lib/utils";
import { Category, Transaction } from "@/types";
import { getCategoryIcon } from "../MobileTransactionRow.utils";

type MobileTransactionRowContentProps = {
  transaction: Transaction;
  category: Category;
  formatAmount: (amount: number) => string;
};

export const MobileTransactionRowContent: FC<
  MobileTransactionRowContentProps
> = ({ transaction, category, formatAmount }) => {
  const Icon = getCategoryIcon(category.name);
  const isIncome = transaction.type === "INCOME";

  return (
    <div className="flex w-full items-center gap-3 px-5 py-3 text-left">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          isIncome
            ? "bg-success-50 dark:bg-success-700/20"
            : "bg-danger-50 dark:bg-danger-700/20",
        )}
      >
        <Icon
          className={cn(
            "h-[18px] w-[18px]",
            isIncome
              ? "text-success-500 dark:text-success-300"
              : "text-danger-500 dark:text-danger-300",
          )}
        />
      </div>
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <span className="truncate text-sm font-medium text-foreground">
          {transaction.title}
        </span>
        <span className="text-xs text-muted-foreground">{category.name}</span>
      </div>
      <span
        className={cn(
          "shrink-0 text-sm font-semibold",
          isIncome
            ? "text-success-500 dark:text-success-300"
            : "text-danger-500 dark:text-danger-300",
        )}
      >
        {isIncome ? "+" : "-"}
        {formatAmount(transaction.amount)}
      </span>
    </div>
  );
};
