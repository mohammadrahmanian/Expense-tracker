import { type FC } from "react";
import { DateRangeDropdown } from "@/components/transactions/DateRangeDropdown";
import { type DateFilterProps, type TypeFilterProps } from "@/lib/transactions.utils";
import { cn } from "@/lib/utils";

const TYPE_PILLS: { value: TypeFilterProps["typeFilter"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "INCOME", label: "Income" },
  { value: "EXPENSE", label: "Expenses" },
];

type MobilePillTabsProps = {
  typeFilter: TypeFilterProps;
  dateFilter: DateFilterProps;
};

export const MobilePillTabs: FC<MobilePillTabsProps> = ({
  typeFilter,
  dateFilter,
}) => (
  <div className="flex items-center gap-2 overflow-x-auto px-0 pb-4 scrollbar-none">
    {TYPE_PILLS.map((pill) => (
      <button
        key={pill.value}
        type="button"
        onClick={() => typeFilter.onTypeFilterChange(pill.value)}
        className={cn(
          "shrink-0 rounded-full px-4 py-[7px] text-[13px] font-medium transition-colors",
          typeFilter.typeFilter === pill.value
            ? "bg-primary font-semibold text-white"
            : "border border-border text-muted-foreground",
        )}
      >
        {pill.label}
      </button>
    ))}
    <DateRangeDropdown
      preset={dateFilter.datePreset}
      startDate={dateFilter.startDate}
      endDate={dateFilter.endDate}
      onPresetChange={dateFilter.onDatePresetChange}
      onCustomDateSelect={dateFilter.onCustomDateSelect}
      onCustomRangeSelect={dateFilter.onCustomRangeSelect}
      variant="pill"
    />
  </div>
);
