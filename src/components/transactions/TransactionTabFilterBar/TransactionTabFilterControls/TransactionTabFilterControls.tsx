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
import { Category } from "@/types";
import { Search, X } from "lucide-react";

type TransactionTabFilterControlsProps = {
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

export const TransactionTabFilterControls: FC<
  TransactionTabFilterControlsProps
> = ({
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
  <div className="flex items-center gap-2.5 pb-3 md:pb-0">
    <div className="relative w-[200px]">
      <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        placeholder="Search..."
        aria-label="Search transactions"
        className="h-8 pl-8 pr-8 text-xs"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => onSearchTermChange("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/80 p-0.5 text-white hover:bg-muted-foreground dark:text-background dark:hover:bg-muted-foreground"
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
);
