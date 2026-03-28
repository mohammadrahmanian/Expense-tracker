import { type FC } from "react";
import { DateRangeDropdown } from "@/components/transactions/DateRangeDropdown";
import { DatePreset } from "@/lib/transactions.utils";
import { cn } from "@/lib/utils";

type TypeTab = "all" | "INCOME" | "EXPENSE";

const TYPE_PILLS: { value: TypeTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "INCOME", label: "Income" },
  { value: "EXPENSE", label: "Expenses" },
];

type MobilePillTabsProps = {
  typeFilter: TypeTab;
  onTypeFilterChange: (value: TypeTab) => void;
  datePreset: DatePreset;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onDatePresetChange: (preset: DatePreset) => void;
  onCustomDateSelect: (date: Date) => void;
  onCustomRangeSelect: (from: Date, to: Date) => void;
};

export const MobilePillTabs: FC<MobilePillTabsProps> = ({
  typeFilter,
  onTypeFilterChange,
  datePreset,
  startDate,
  endDate,
  onDatePresetChange,
  onCustomDateSelect,
  onCustomRangeSelect,
}) => (
  <div className="flex items-center gap-2 overflow-x-auto px-0 pb-4 scrollbar-none">
    {TYPE_PILLS.map((pill) => (
      <button
        key={pill.value}
        type="button"
        onClick={() => onTypeFilterChange(pill.value)}
        className={cn(
          "shrink-0 rounded-full px-4 py-[7px] text-[13px] font-medium transition-colors",
          typeFilter === pill.value
            ? "bg-primary font-semibold text-white"
            : "border border-border text-muted-foreground",
        )}
      >
        {pill.label}
      </button>
    ))}
    <DateRangeDropdown
      preset={datePreset}
      startDate={startDate}
      endDate={endDate}
      onPresetChange={onDatePresetChange}
      onCustomDateSelect={onCustomDateSelect}
      onCustomRangeSelect={onCustomRangeSelect}
      variant="pill"
    />
  </div>
);
