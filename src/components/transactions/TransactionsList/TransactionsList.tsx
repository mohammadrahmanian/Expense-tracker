import { type FC } from "react";
import { TransactionTabFilterBar } from "@/components/transactions/TransactionTabFilterBar";
import { TransactionsPagination } from "@/components/transactions/TransactionsPagination";
import { Card } from "@/components/ui/card";
import { DatePreset } from "@/lib/transactions.utils";
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
  typeFilter: "all" | "INCOME" | "EXPENSE";
  onTypeFilterChange: (v: "all" | "INCOME" | "EXPENSE") => void;
  searchTerm: string;
  onSearchTermChange: (v: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (v: string) => void;
  datePreset: DatePreset;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onDatePresetChange: (preset: DatePreset) => void;
  onCustomDateSelect: (date: Date) => void;
  onCustomRangeSelect: (from: Date, to: Date) => void;
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

export const TransactionsList: FC<TransactionsListProps> = (props) => (
  <Card className="overflow-hidden p-0">
    <TransactionTabFilterBar
      typeFilter={props.typeFilter}
      onTypeFilterChange={props.onTypeFilterChange}
      searchTerm={props.searchTerm}
      onSearchTermChange={props.onSearchTermChange}
      categoryFilter={props.categoryFilter}
      onCategoryFilterChange={props.onCategoryFilterChange}
      categories={props.categories}
      datePreset={props.datePreset}
      startDate={props.startDate}
      endDate={props.endDate}
      onDatePresetChange={props.onDatePresetChange}
      onCustomDateSelect={props.onCustomDateSelect}
      onCustomRangeSelect={props.onCustomRangeSelect}
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
          sortField={props.sortField}
          sortOrder={props.sortOrder}
          onSort={props.onSort}
          onEdit={props.onEdit}
          onDelete={props.onDelete}
          isDeletingId={props.isDeletingId}
          formatAmount={props.formatAmount}
        />
      )}
    </div>
    {!props.isLoading && props.transactions.length > 0 && (
      <TransactionsPagination
        currentPage={props.currentPage}
        pageSize={props.pageSize}
        totalTransactions={props.totalTransactions}
        transactionsOnPage={props.transactions.length}
        onPageChange={props.onPageChange}
        onPageSizeChange={props.onPageSizeChange}
      />
    )}
  </Card>
);
