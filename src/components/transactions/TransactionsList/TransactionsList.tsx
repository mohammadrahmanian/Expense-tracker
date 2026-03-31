import { type FC } from "react";
import { TransactionTabFilterBar } from "@/components/transactions/TransactionTabFilterBar";
import { TransactionsPagination } from "@/components/transactions/TransactionsPagination";
import { Card } from "@/components/ui/card";
import {
  type DateFilterProps,
  type SearchProps,
  type TypeFilterProps,
  type SortProps,
  type PaginationProps,
} from "@/lib/transactions.utils";
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
  typeFilter: TypeFilterProps;
  search: SearchProps;
  dateFilter: DateFilterProps;
  categoryFilter: string;
  onCategoryFilterChange: (v: string) => void;
  sort: SortProps;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  isDeletingId: string | undefined;
  formatAmount: (amount: number) => string;
  pagination: PaginationProps;
};

export const TransactionsList: FC<TransactionsListProps> = (props) => (
  <Card className="overflow-hidden p-0">
    <TransactionTabFilterBar
      typeFilter={props.typeFilter}
      search={props.search}
      dateFilter={props.dateFilter}
      categoryFilter={props.categoryFilter}
      onCategoryFilterChange={props.onCategoryFilterChange}
      categories={props.categories}
    />
    <div className="min-h-[300px]">
      {props.isLoading ? (
        <LoadingSkeleton />
      ) : props.hasError || props.transactions.length === 0 ? (
        <TransactionsListStatus
          hasError={props.hasError}
          transactionsError={props.transactionsError}
          transactionsErrorMessage={props.transactionsErrorMessage}
          categoriesError={props.categoriesError}
          categoriesErrorMessage={props.categoriesErrorMessage}
          hasActiveFilters={props.hasActiveFilters}
        />
      ) : (
        <TransactionsListContent
          transactions={props.transactions}
          categories={props.categories}
          sortField={props.sort.sortField}
          sortOrder={props.sort.sortOrder}
          onSort={props.sort.onSort}
          onEdit={props.onEdit}
          onDelete={props.onDelete}
          isDeletingId={props.isDeletingId}
          formatAmount={props.formatAmount}
        />
      )}
    </div>
    {!props.isLoading && props.transactions.length > 0 && (
      <TransactionsPagination
        currentPage={props.pagination.currentPage}
        pageSize={props.pagination.pageSize}
        totalTransactions={props.totalTransactions}
        transactionsOnPage={props.transactions.length}
        onPageChange={props.pagination.onPageChange}
        onPageSizeChange={props.pagination.onPageSizeChange}
      />
    )}
  </Card>
);
