import { type FC } from "react";
import { TransactionTabFilterControls } from "./TransactionTabFilterControls";
import { DatePreset } from "@/lib/transactions.utils";
import { cn } from "@/lib/utils";
import { Category } from "@/types";

type TypeTab = "all" | "INCOME" | "EXPENSE";
const TABS: { value: TypeTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "INCOME", label: "Income" },
  { value: "EXPENSE", label: "Expenses" },
];

type TransactionTabFilterBarProps = {
  typeFilter: TypeTab;
  onTypeFilterChange: (value: TypeTab) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  categories: Category[] | undefined;
  datePreset: DatePreset;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onDatePresetChange: (preset: DatePreset) => void;
  onCustomDateSelect: (date: Date) => void;
  onCustomRangeSelect: (from: Date, to: Date) => void;
};

export const TransactionTabFilterBar: FC<TransactionTabFilterBarProps> = ({
  typeFilter,
  onTypeFilterChange,
  searchTerm,
  onSearchTermChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
  datePreset,
  startDate,
  endDate,
  onDatePresetChange,
  onCustomDateSelect,
  onCustomRangeSelect,
}) => (
  <div className="flex flex-col gap-3 border-b border-border px-5 pb-0 md:flex-row md:items-center md:justify-between md:gap-0">
    <div className="flex items-center">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onTypeFilterChange(tab.value)}
          className={cn(
            "px-4 py-3 text-[13px] font-medium transition-colors border-b-2",
            typeFilter === tab.value
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
    <TransactionTabFilterControls
      searchTerm={searchTerm}
      onSearchTermChange={onSearchTermChange}
      categoryFilter={categoryFilter}
      onCategoryFilterChange={onCategoryFilterChange}
      categories={categories}
      datePreset={datePreset}
      startDate={startDate}
      endDate={endDate}
      onDatePresetChange={onDatePresetChange}
      onCustomDateSelect={onCustomDateSelect}
      onCustomRangeSelect={onCustomRangeSelect}
    />
  </div>
);
