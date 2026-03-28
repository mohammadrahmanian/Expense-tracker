import { type FC } from "react";
import { MobileTransactionRow } from "@/components/transactions/mobile/MobileTransactionRow";
import { getCategoryById, type TransactionDateGroup } from "@/lib/transactions.utils";
import { cn } from "@/lib/utils";
import { Category, Transaction } from "@/types";

type MobileTransactionGroupProps = {
  group: TransactionDateGroup;
  categories: Category[] | undefined;
  formatAmount: (amount: number) => string;
  onEdit: (transaction: Transaction) => void;
};

export const MobileTransactionGroup: FC<MobileTransactionGroupProps> = ({
  group,
  categories,
  formatAmount,
  onEdit,
}) => (
  <div>
    <div className="sticky top-0 z-10 flex items-center justify-between bg-background px-5 py-2.5 pb-1.5">
      <span className="text-[13px] font-semibold text-foreground">
        {group.dateLabel}
      </span>
      <span
        className={cn(
          "text-xs font-semibold",
          group.dailyNet >= 0
            ? "text-success-500 dark:text-success-300"
            : "text-danger-500 dark:text-danger-300",
        )}
      >
        {group.dailyNet >= 0 ? "+" : "-"}{formatAmount(Math.abs(group.dailyNet))}
      </span>
    </div>
    {group.transactions.map((tx) => (
      <MobileTransactionRow
        key={tx.id}
        transaction={tx}
        category={getCategoryById(categories, tx.categoryId, tx.type)}
        formatAmount={formatAmount}
        onEdit={onEdit}
      />
    ))}
  </div>
);
