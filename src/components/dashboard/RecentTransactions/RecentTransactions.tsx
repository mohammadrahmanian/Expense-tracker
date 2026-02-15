import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Link to="/transactions">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isError ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p className="text-sm font-medium">Unable to load transactions</p>
            <p className="text-xs text-muted-foreground mt-1">
              {errorMessage || "An error occurred"}
            </p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No transactions yet. Start by adding your first transaction!
            </p>
            <Link to="/transactions" className="mt-4 inline-block">
              <Button>Add Transaction</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
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
      </CardContent>
    </Card>
  );
};
