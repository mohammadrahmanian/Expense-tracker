import { type FC } from "react";
import { DateRangeDropdown } from "@/components/transactions/DateRangeDropdown";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePreset } from "@/lib/transactions.utils";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { Search, X } from "lucide-react";

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
    <div className="flex items-center gap-2.5 pb-3 md:pb-0">
      <div className="relative w-[200px]">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          placeholder="Search..."
          className="h-8 pl-8 pr-8 text-xs"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchTermChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/80 p-0.5 text-white hover:bg-muted-foreground"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        )}
      </div>
      <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
        <SelectTrigger className="h-8 w-[140px] text-xs">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories?.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DateRangeDropdown
        preset={datePreset}
        startDate={startDate}
        endDate={endDate}
        onPresetChange={onDatePresetChange}
        onCustomDateSelect={onCustomDateSelect}
        onCustomRangeSelect={onCustomRangeSelect}
      />
    </div>
  </div>
);
