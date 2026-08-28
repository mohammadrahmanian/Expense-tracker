import { type FC } from "react";
import type { DateRange } from "react-day-picker";
import { DatePreset } from "@/lib/transactions.utils";
import { DateRangeCalendarPanel } from "@/components/transactions/DateRangeCalendarPanel";
import { DateRangePresetList } from "./DateRangePresetList";

type DateRangeDesktopPanelProps = {
  preset: DatePreset;
  calendarMode: "single" | "range" | null;
  pendingDate: Date | undefined;
  pendingRange: DateRange | undefined;
  canApply: boolean;
  onPresetClick: (value: DatePreset) => void;
  onPendingDateChange: (date: Date | undefined) => void;
  onPendingRangeChange: (range: DateRange | undefined) => void;
  onClear: () => void;
  onApply: () => void;
};

export const DateRangeDesktopPanel: FC<DateRangeDesktopPanelProps> = ({
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
}) => (
  <div className="flex items-stretch">
    <DateRangePresetList
      preset={preset}
      calendarMode={calendarMode}
      onPresetClick={onPresetClick}
      showChevron={false}
      className="w-[300px] shrink-0"
    />
    {calendarMode && (
      <>
        <div className="border-l border-border" />
        <DateRangeCalendarPanel
          mode={calendarMode}
          selectedDate={pendingDate}
          selectedRange={pendingRange}
          onDateChange={onPendingDateChange}
          onRangeChange={onPendingRangeChange}
          footer="actions"
          canApply={canApply}
          onClear={onClear}
          onApply={onApply}
          className="w-[320px] shrink-0"
        />
      </>
    )}
  </div>
);
