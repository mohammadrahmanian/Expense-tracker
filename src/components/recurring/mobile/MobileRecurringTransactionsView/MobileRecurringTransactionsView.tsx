import { type FC, useState } from "react";
import { MobileRecurringHeader } from "@/components/recurring/mobile/MobileRecurringHeader";
import { MobileRecurringSearchBar } from "@/components/recurring/mobile/MobileRecurringSearchBar";
import { MobileRecurringSummaryCards } from "@/components/recurring/mobile/MobileRecurringSummaryCards";
import { MobileRecurringNextUpCard } from "@/components/recurring/mobile/MobileRecurringNextUpCard";
import { MobileRecurringChips } from "@/components/recurring/mobile/MobileRecurringChips";
import { MobileRecurringCard } from "@/components/recurring/mobile/MobileRecurringCard";
import { MobileRecurringFilterBottomsheet } from "@/components/recurring/mobile/MobileRecurringFilterBottomsheet";
import { MobileLoadingSkeleton } from "./MobileLoadingSkeleton";
import {
  getCategoryById,
  getRecurringStatus,
} from "@/lib/recurring-transactions.utils";
import type {
  CategoryFilterProps,
  SearchProps,
  StatusFilterProps,
  TypeFilterProps,
} from "@/lib/recurring-transactions.utils";
import type {
  Category,
  RecurringTransaction,
  RecurringTransactionsStats,
} from "@/types";

type Props = {
  transactions: RecurringTransaction[];
  categories: Category[] | undefined;
  stats: RecurringTransactionsStats | undefined;
  isLoading: boolean;
  hasError: boolean;
  statsLoading: boolean;
  statsError: boolean;
  totalAllCount: number;
  hasActiveFilters: boolean;
  search: SearchProps;
  typeFilter: TypeFilterProps;
  statusFilter: StatusFilterProps;
  categoryFilter: CategoryFilterProps;
  formatAmount: (n: number) => string;
  onCreate: () => void;
  onEdit: (rt: RecurringTransaction) => void;
  onTogglePause: (rt: RecurringTransaction) => void;
  onDelete: (rt: RecurringTransaction) => void;
  togglingId: string | undefined;
  deletingId: string | undefined;
};

export const MobileRecurringTransactionsView: FC<Props> = ({
  transactions,
  categories,
  stats,
  isLoading,
  hasError,
  statsLoading,
  statsError,
  totalAllCount,
  hasActiveFilters,
  search,
  typeFilter,
  statusFilter,
  categoryFilter,
  formatAmount,
  onCreate,
  onEdit,
  onTogglePause,
  onDelete,
  togglingId,
  deletingId,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div>
      <MobileRecurringHeader
        totalAllCount={totalAllCount}
        onFilterTap={() => setIsFilterOpen(true)}
        hasActiveFilters={hasActiveFilters}
        onCreate={onCreate}
      />
      <MobileRecurringSearchBar
        value={search.searchTerm}
        onChange={search.onSearchTermChange}
      />
      <MobileRecurringSummaryCards
        stats={stats}
        isLoading={statsLoading}
        hasError={statsError}
        formatAmount={formatAmount}
      />
      <MobileRecurringNextUpCard
        nextUp={stats?.nextUp ?? null}
        isLoading={statsLoading}
        hasError={statsError}
        formatAmount={formatAmount}
      />
      <MobileRecurringChips
        statusFilter={statusFilter}
        typeFilter={typeFilter}
      />
      <div className="flex flex-col gap-2.5 px-5 pb-4">
        {isLoading ? (
          <MobileLoadingSkeleton />
        ) : hasError ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Couldn't load recurring transactions.
          </p>
        ) : transactions.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            {hasActiveFilters
              ? "No matching schedules."
              : "No recurring transactions yet."}
          </p>
        ) : (
          transactions.map((rt) => (
            <MobileRecurringCard
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
          ))
        )}
      </div>
      <MobileRecurringFilterBottomsheet
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        categoryFilter={categoryFilter}
        categories={categories}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
      />
    </div>
  );
};
