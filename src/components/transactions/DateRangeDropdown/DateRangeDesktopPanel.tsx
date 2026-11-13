import { type FC } from "react";
import { DateRangeCalendarPanel } from "@/components/transactions/DateRangeCalendarPanel";
import { DateRangePresetList } from "./DateRangePresetList";
import type { DateRangePanelProps } from "./DateRangeDropdown.utils";

export const DateRangeDesktopPanel: FC<DateRangePanelProps> = ({
  preset,
  calendarMode,
  pendingDate,
  pendingRange,
  canApply,
  onPresetClick,
  onPendingDateChange,
  onPendingRangeChange,
  onClear,
  onApply,
}) => {
  const footerProps = {
    footer: "actions" as const,
    canApply,
    onClear,
    onApply,
  };

  return (
    <div className="flex items-stretch">
      <DateRangePresetList
        preset={preset}
        calendarMode={calendarMode}
        onPresetClick={onPresetClick}
        showChevron={false}
        className="w-[300px] shrink-0"
      />
      {calendarMode === "single" && (
        <DateRangeCalendarPanel
          mode="single"
          selectedDate={pendingDate}
          onDateChange={onPendingDateChange}
          className="w-[280px] shrink-0 border-l border-border"
          {...footerProps}
        />
      )}
      {calendarMode === "range" && (
        <DateRangeCalendarPanel
          mode="range"
          selectedRange={pendingRange}
          onRangeChange={onPendingRangeChange}
          className="w-[280px] shrink-0 border-l border-border"
          {...footerProps}
        />
      )}
    </div>
  );
};
