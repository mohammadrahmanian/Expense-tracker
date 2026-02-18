import { type FC } from "react";
import { TransactionsPagination } from "@/components/transactions/TransactionsPagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category, Transaction } from "@/types";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { TransactionsListContent } from "./TransactionsListContent";
import { TransactionsListStatus } from "./TransactionsListStatus";

type TransactionsListProps = {
  transactions: Transaction[];
  totalTransactions: number;
  categories: Category[] | undefined;
  isLoading: boolean;
  hasError: boolean;
  transactionsError: boolean;
  transactionsErrorMessage?: string;
  categoriesError: boolean;
  categoriesErrorMessage?: string;
  hasActiveFilters: boolean;
  sortField: "date" | "amount";
  sortOrder: "asc" | "desc";
  onSort: (field: "date" | "amount") => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  isDeletingId: string | undefined;
  formatAmount: (amount: number) => string;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export const TransactionsList: FC<TransactionsListProps> = ({
  transactions,
  totalTransactions,
  categories,
  isLoading,
  hasError,
  transactionsError,
  transactionsErrorMessage,
  categoriesError,
  categoriesErrorMessage,
  hasActiveFilters,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  isDeletingId,
  formatAmount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>
        {`All Transactions ${totalTransactions > 0 ? `(${totalTransactions} total, showing ${transactions.length})` : `(showing ${transactions.length})`}`}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <LoadingSkeleton />
      ) : hasError || transactions.length === 0 ? (
        <TransactionsListStatus
          hasError={hasError}
          transactionsError={transactionsError}
          transactionsErrorMessage={transactionsErrorMessage}
          categoriesError={categoriesError}
          categoriesErrorMessage={categoriesErrorMessage}
          hasActiveFilters={hasActiveFilters}
        />
      ) : (
        <TransactionsListContent
          transactions={transactions}
          categories={categories}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={onSort}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeletingId={isDeletingId}
          formatAmount={formatAmount}
        />
      )}

      {!isLoading && transactions.length > 0 && (
        <TransactionsPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalTransactions={totalTransactions}
          transactionsOnPage={transactions.length}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </CardContent>
  </Card>
);
