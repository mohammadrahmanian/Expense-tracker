import { type FC } from "react";
import { DateRangeDropdown } from "@/components/transactions/DateRangeDropdown";
import { PillTabsItem, PillTabsList } from "@/components/ui/pill-tabs";
import {
  type DateFilterProps,
  type TypeFilterProps,
} from "@/lib/transactions.utils";

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
  <PillTabsList className="px-0 pb-4">
    {TYPE_PILLS.map((pill) => (
      <PillTabsItem
        key={pill.value}
        onClick={() => typeFilter.onTypeFilterChange(pill.value)}
        selected={typeFilter.typeFilter === pill.value}
      >
        {pill.label}
      </PillTabsItem>
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
  </PillTabsList>
);
