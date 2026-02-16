import { type FC } from "react";
import { MobileSortControls } from "@/components/transactions/MobileSortControls";
import { TransactionCard } from "@/components/transactions/TransactionCard";
import { TransactionTableHeaders } from "@/components/transactions/TransactionTableHeaders";
import { TransactionTableRow } from "@/components/transactions/TransactionTableRow";
import { TransactionsPagination } from "@/components/transactions/TransactionsPagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody } from "@/components/ui/table";
import { Category, Transaction } from "@/types";
import { AlertCircle } from "lucide-react";

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

const getCategoryById = (categories: Category[] | undefined, categoryId: string, transactionType: "INCOME" | "EXPENSE") =>
  categories?.find((cat) => cat.id === categoryId) ?? {
    id: "missing",
    name: "Uncategorized",
    color: "#6b7280",
    type: transactionType,
  };

const LoadingSkeleton: FC = () => (
  <>
    {/* Mobile skeleton */}
    <div className="md:hidden space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
    {/* Desktop skeleton */}
    <div className="hidden md:block">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    </div>
  </>
);

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
        {totalTransactions > 0
          ? `All Transactions (${totalTransactions} total, showing ${transactions.length})`
          : `All Transactions (showing ${transactions.length})`}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {hasError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to Load Transactions</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-1">
              {transactionsError && (
                <p>
                  &bull; Transactions:{" "}
                  {transactionsErrorMessage || "Unknown error"}
                </p>
              )}
              {categoriesError && (
                <p>
                  &bull; Categories:{" "}
                  {categoriesErrorMessage || "Unknown error"}
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      ) : isLoading ? (
        <LoadingSkeleton />
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            {hasActiveFilters
              ? "No transactions match your filters."
              : "No transactions yet. Start by adding your first transaction!"}
          </p>
        </div>
      ) : (
        <>
          <MobileSortControls
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={onSort}
          />

          {/* Mobile: Card List */}
          <div className="md:hidden space-y-3">
            {transactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                category={getCategoryById(categories, transaction.categoryId, transaction.type)}
                formatAmount={formatAmount}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={isDeletingId === transaction.id}
              />
            ))}
          </div>

          {/* Desktop: Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TransactionTableHeaders
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={onSort}
              />
              <TableBody>
                {transactions.map((transaction) => (
                  <TransactionTableRow
                    key={transaction.id}
                    transaction={transaction}
                    category={getCategoryById(categories, transaction.categoryId, transaction.type)}
                    formatAmount={formatAmount}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isDeleting={isDeletingId === transaction.id}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </>
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
