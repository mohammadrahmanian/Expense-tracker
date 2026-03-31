import { useMemo, type FC } from "react";
import { MobileTransactionsHeader } from "@/components/transactions/mobile/MobileTransactionsHeader";
import { MobileSearchBar } from "@/components/transactions/mobile/MobileSearchBar";
import { MobilePillTabs } from "@/components/transactions/mobile/MobilePillTabs";
import { MobileSummaryCards } from "@/components/transactions/mobile/MobileSummaryCards";
import { MobileTransactionGroup } from "@/components/transactions/mobile/MobileTransactionGroup";
import {
  calculatePageTotals,
  groupTransactionsByDate,
  type DatePreset,
} from "@/lib/transactions.utils";
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
  typeFilter: "all" | "INCOME" | "EXPENSE";
  onTypeFilterChange: (v: "all" | "INCOME" | "EXPENSE") => void;
  searchTerm: string;
  onSearchTermChange: (v: string) => void;
  datePreset: DatePreset;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onDatePresetChange: (preset: DatePreset) => void;
  onCustomDateSelect: (date: Date) => void;
  onCustomRangeSelect: (from: Date, to: Date) => void;
  onEdit: (transaction: Transaction) => void;
  formatAmount: (amount: number) => string;
};

export const MobileTransactionsView: FC<MobileTransactionsViewProps> = (props) => {
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
      <MobileTransactionsHeader totalTransactions={props.totalTransactions} />
      <MobileSearchBar value={props.searchTerm} onChange={props.onSearchTermChange} />
      <MobilePillTabs
        typeFilter={props.typeFilter}
        onTypeFilterChange={props.onTypeFilterChange}
        datePreset={props.datePreset}
        startDate={props.startDate}
        endDate={props.endDate}
        onDatePresetChange={props.onDatePresetChange}
        onCustomDateSelect={props.onCustomDateSelect}
        onCustomRangeSelect={props.onCustomRangeSelect}
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
    </div>
  );
};
