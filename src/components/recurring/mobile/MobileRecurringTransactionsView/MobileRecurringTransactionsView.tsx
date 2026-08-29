import { MobileRecurringCard } from "@/components/recurring/mobile/MobileRecurringCard";
import { MobileRecurringChips } from "@/components/recurring/mobile/MobileRecurringChips";
import { MobileRecurringFilterBottomsheet } from "@/components/recurring/mobile/MobileRecurringFilterBottomsheet";
import { MobileRecurringHeader } from "@/components/recurring/mobile/MobileRecurringHeader";
import { MobileRecurringNextUpCard } from "@/components/recurring/mobile/MobileRecurringNextUpCard";
import { MobileRecurringSearchBar } from "@/components/recurring/mobile/MobileRecurringSearchBar";
import { MobileRecurringSummaryCards } from "@/components/recurring/mobile/MobileRecurringSummaryCards";
import type {
  CategoryFilterProps,
  SearchProps,
  StatusFilterProps,
  TypeFilterProps,
} from "@/lib/recurring-transactions.utils";
import {
  getCategoryById,
  getRecurringStatus,
} from "@/lib/recurring-transactions.utils";
import type { Category, RecurringTransaction } from "@/types";
import { type FC, useState } from "react";
import { MobileLoadingSkeleton } from "./MobileLoadingSkeleton";

type Props = {
  transactions: RecurringTransaction[];
  categories: Category[] | undefined;
  isLoading: boolean;
  hasError: boolean;
  totalAllCount: number;
  hasActiveFilters: boolean;
  search: SearchProps;
  typeFilter: TypeFilterProps;
  statusFilter: StatusFilterProps;
  categoryFilter: CategoryFilterProps;
  formatAmount: (n: number) => string;
  onCreate: () => void;
  onOpen: (rt: RecurringTransaction) => void;
  onEdit: (rt: RecurringTransaction) => void;
  onTogglePause: (rt: RecurringTransaction) => void;
  onDelete: (rt: RecurringTransaction) => void;
  togglingId: string | undefined;
  deletingId: string | undefined;
};

export const MobileRecurringTransactionsView: FC<Props> = ({
  transactions,
  categories,
  isLoading,
  hasError,
  totalAllCount,
  hasActiveFilters,
  search,
  typeFilter,
  statusFilter,
  categoryFilter,
  formatAmount,
  onCreate,
  onOpen,
  onEdit,
  onTogglePause,
  onDelete,
  togglingId,
  deletingId,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
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
      <MobileRecurringSummaryCards />
      <MobileRecurringNextUpCard />
      <MobileRecurringChips
        statusFilter={statusFilter}
        typeFilter={typeFilter}
      />
      <div className="flex flex-col gap-2.5">
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
              onOpen={onOpen}
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
