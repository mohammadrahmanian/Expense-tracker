import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { type Category, type Transaction } from "@/types";
import { RecentTransactionItem } from "./RecentTransactionItem";

type RecentTransactionsProps = {
  transactions: Transaction[];
  categories: Category[] | undefined;
  isError: boolean;
  errorMessage?: string;
  formatAmount: (amount: number) => string;
};

export const RecentTransactions: FC<RecentTransactionsProps> = ({
  transactions,
  categories,
  isError,
  errorMessage,
  formatAmount,
}) => {
  const getCategoryById = (categoryId: string) =>
    categories?.find((cat) => cat.id === categoryId);

  return (
    <div className="rounded-lg bg-surface dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h2 text-neutral-900 dark:text-white">
          Recent Transactions
        </h2>
        <Link to="/transactions">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>
      {isError ? (
        <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p className="text-body font-medium">Unable to load transactions</p>
          <p className="text-caption text-neutral-500 mt-1">
            {errorMessage || "An error occurred"}
          </p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-neutral-500">
            No transactions yet. Start by adding your first transaction!
          </p>
          <Link to="/transactions" className="mt-4 inline-block">
            <Button>Add Transaction</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <RecentTransactionItem
              key={transaction.id}
              transaction={transaction}
              category={getCategoryById(transaction.categoryId)}
              formatAmount={formatAmount}
            />
          ))}
        </div>
      )}
    </div>
  );
};
