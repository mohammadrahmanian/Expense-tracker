import { useMemo, useState, type FC } from "react";
import { MobileTransactionsHeader } from "@/components/transactions/mobile/MobileTransactionsHeader";
import { MobileSearchBar } from "@/components/transactions/mobile/MobileSearchBar";
import { MobilePillTabs } from "@/components/transactions/mobile/MobilePillTabs";
import { MobileSummaryCards } from "@/components/transactions/mobile/MobileSummaryCards";
import { MobileTransactionGroup } from "@/components/transactions/mobile/MobileTransactionGroup";
import { MobileFilterBottomsheet } from "@/components/transactions/mobile/MobileFilterBottomsheet";
import {
  calculatePageTotals,
  groupTransactionsByDate,
  type DateFilterProps,
  type SearchProps,
  type TransactionFilterState,
  type TypeFilterProps,
} from "@/lib/transactions.utils";
import type { BulkFilterPayload } from "@/hooks/useTransactionFilters";
import { Category, Transaction } from "@/types";
import { Loader2 } from "lucide-react";
import type { InfiniteData } from "@tanstack/react-query";
import { MobileLoadingSkeleton } from "./MobileLoadingSkeleton";
import { useInfiniteScroll } from "./useInfiniteScroll";

type PageData = { items: Transaction[]; total: number; count: number };

type MobileTransactionsViewProps = {
  infiniteData: InfiniteData<PageData> | undefined;
  totalTransactions: number;
  categories: Category[] | undefined;
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  typeFilter: TypeFilterProps;
  search: SearchProps;
  dateFilter: DateFilterProps;
  filterState: TransactionFilterState;
  hasActiveFilters: boolean;
  onApplyBulkFilters: (payload: BulkFilterPayload) => void;
  onEdit: (transaction: Transaction) => void;
  formatAmount: (amount: number) => string;
};

export const MobileTransactionsView: FC<MobileTransactionsViewProps> = (props) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const transactions = useMemo(
    () => props.infiniteData?.pages.flatMap((p) => p.items) ?? [],
    [props.infiniteData],
  );

  const totals = useMemo(() => calculatePageTotals(transactions), [transactions]);
  const groups = useMemo(() => groupTransactionsByDate(transactions), [transactions]);

  const { sentinelRef } = useInfiniteScroll({
    hasNextPage: props.hasNextPage,
    isFetchingNextPage: props.isFetchingNextPage,
    fetchNextPage: props.fetchNextPage,
  });

  return (
    <div className="flex flex-col gap-0">
      <MobileTransactionsHeader
        totalTransactions={props.totalTransactions}
        onFilterTap={() => setIsFilterOpen(true)}
        hasActiveFilters={props.hasActiveFilters}
      />
      <MobileSearchBar value={props.search.searchTerm} onChange={props.search.onSearchTermChange} />
      <MobilePillTabs
        typeFilter={props.typeFilter}
        dateFilter={props.dateFilter}
      />
      <MobileSummaryCards
        totalIncome={totals.totalIncome}
        totalExpenses={totals.totalExpenses}
        net={totals.net}
        isLoading={props.isLoading}
        formatAmount={props.formatAmount}
      />

      {props.isLoading ? (
        <MobileLoadingSkeleton />
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground">No transactions found</p>
        </div>
      ) : (
        <>
          {groups.map((group) => (
            <MobileTransactionGroup
              key={group.dateKey}
              group={group}
              categories={props.categories}
              formatAmount={props.formatAmount}
              onEdit={props.onEdit}
            />
          ))}
          <div ref={sentinelRef} className="h-1" />
          {props.isFetchingNextPage && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}
        </>
      )}

      <MobileFilterBottomsheet
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filterState={props.filterState}
        categories={props.categories}
        onApply={props.onApplyBulkFilters}
      />
    </div>
  );
};
