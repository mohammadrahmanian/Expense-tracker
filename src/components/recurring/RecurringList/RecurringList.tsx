import { type FC } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { RecurringTabFilterBar } from "@/components/recurring/RecurringTabFilterBar";
import { RecurringTableHeaders } from "@/components/recurring/RecurringTableHeaders";
import { RecurringTableRow } from "@/components/recurring/RecurringTableRow";
import { RecurringPagination } from "@/components/recurring/RecurringPagination";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";
import {
  getCategoryById,
  getRecurringStatus,
} from "@/lib/recurring-transactions.utils";
import type {
  CategoryFilterProps,
  PaginationProps,
  SearchProps,
  StatusFilterProps,
  TypeFilterProps,
} from "@/lib/recurring-transactions.utils";
import type { Category, RecurringTransaction } from "@/types";

const ErrorState: FC = () => (
  <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
    Couldn't load recurring transactions. Please try again.
  </div>
);

type RecurringListProps = {
  transactions: RecurringTransaction[];
  categories: Category[] | undefined;
  isLoading: boolean;
  hasError: boolean;
  totalForAllTab: number;
  totalAfterStatus: number;
  hasActiveFilters: boolean;
  search: SearchProps;
  typeFilter: TypeFilterProps;
  statusFilter: StatusFilterProps;
  categoryFilter: CategoryFilterProps;
  pagination: PaginationProps;
  formatAmount: (n: number) => string;
  onEdit: (rt: RecurringTransaction) => void;
  onTogglePause: (rt: RecurringTransaction) => void;
  onDelete: (rt: RecurringTransaction) => void;
  togglingId: string | undefined;
  deletingId: string | undefined;
};

export const RecurringList: FC<RecurringListProps> = ({
  transactions,
  categories,
  isLoading,
  hasError,
  totalForAllTab,
  totalAfterStatus,
  hasActiveFilters,
  search,
  typeFilter,
  statusFilter,
  categoryFilter,
  pagination,
  formatAmount,
  onEdit,
  onTogglePause,
  onDelete,
  togglingId,
  deletingId,
}) => (
  <Card className="overflow-hidden p-0">
    <RecurringTabFilterBar
      statusFilter={statusFilter}
      totalAllCount={totalForAllTab}
      search={search}
      typeFilter={typeFilter}
      categoryFilter={categoryFilter}
      categories={categories}
    />
    <div className="min-h-[300px]">
      {isLoading ? (
        <LoadingSkeleton />
      ) : hasError ? (
        <ErrorState />
      ) : transactions.length === 0 ? (
        <EmptyState hasActiveFilters={hasActiveFilters} />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <RecurringTableHeaders />
            <TableBody>
              {transactions.map((rt) => (
                <RecurringTableRow
                  key={rt.id}
                  transaction={rt}
                  category={getCategoryById(categories, rt.categoryId)}
                  status={getRecurringStatus(rt)}
                  formatAmount={formatAmount}
                  onEdit={onEdit}
                  onTogglePause={onTogglePause}
                  onDelete={onDelete}
                  isToggling={togglingId === rt.id}
                  isDeleting={deletingId === rt.id}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
    {!isLoading && !hasError && totalAfterStatus > 0 && (
      <RecurringPagination
        currentPage={pagination.currentPage}
        pageSize={pagination.pageSize}
        totalItems={totalAfterStatus}
        itemsOnPage={transactions.length}
        onPageChange={pagination.onPageChange}
      />
    )}
  </Card>
);
