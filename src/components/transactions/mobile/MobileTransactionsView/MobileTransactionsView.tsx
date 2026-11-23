import { useState, type FC } from "react";
import { MobileTransactionsHeader } from "@/components/transactions/mobile/MobileTransactionsHeader";
import { MobileSearchBar } from "@/components/transactions/mobile/MobileSearchBar";
import { MobilePillTabs } from "@/components/transactions/mobile/MobilePillTabs";
import { MobileSummaryCards } from "@/components/transactions/mobile/MobileSummaryCards";
import { MobileFilterBottomsheet } from "@/components/transactions/mobile/MobileFilterBottomsheet";
import {
  type DateFilterProps,
  type SearchProps,
  type TransactionFilterState,
  type TypeFilterProps,
} from "@/lib/transactions.utils";
import type { BulkFilterPayload } from "@/hooks/useTransactionFilters";
import { Category, Transaction } from "@/types";
import { MobileTransactionList } from "./MobileTransactionList";
import type { MobileInfiniteData } from "./MobileTransactionsView.types";
import { useInfiniteScroll } from "./useInfiniteScroll";
import { useTransactionGroups } from "./useTransactionGroups";

type MobileTransactionsViewProps = {
  infiniteData: MobileInfiniteData;
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
  onDelete: (id: string) => void;
  formatAmount: (amount: number) => string;
};

export const MobileTransactionsView: FC<MobileTransactionsViewProps> = (
  props,
) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { totals, groups } = useTransactionGroups(props.infiniteData);
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
      <MobileSearchBar
        value={props.search.searchTerm}
        onChange={props.search.onSearchTermChange}
      />
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

      <MobileTransactionList
        groups={groups}
        categories={props.categories}
        isLoading={props.isLoading}
        isFetchingNextPage={props.isFetchingNextPage}
        sentinelRef={sentinelRef}
        formatAmount={props.formatAmount}
        onEdit={props.onEdit}
        onDelete={props.onDelete}
      />

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
