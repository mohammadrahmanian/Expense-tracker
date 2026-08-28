import { type FC } from "react";
import type { DateRange } from "react-day-picker";
import { ChevronLeft } from "lucide-react";
import { DatePreset } from "@/lib/transactions.utils";
import { DateRangeCalendarPanel } from "@/components/transactions/DateRangeCalendarPanel";
import { DateRangePresetList } from "./DateRangePresetList";

type DateRangeMobileSheetProps = {
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
  onBack: () => void;
};

export const DateRangeMobileSheet: FC<DateRangeMobileSheetProps> = ({
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
  onBack,
}) => {
  if (!calendarMode) {
    return (
      <div className="flex flex-col">
        <h2 className="px-4 pb-2 pt-1 text-sm font-semibold text-foreground">
          Select Date
        </h2>
        <DateRangePresetList
          preset={preset}
          calendarMode={calendarMode}
          onPresetClick={onPresetClick}
          showChevron
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 px-4 pb-2 pt-1">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to the date options"
          className="rounded-sm p-1 text-muted-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-sm font-semibold text-foreground">
          {calendarMode === "single" ? "Custom Date" : "Custom Date Range"}
        </h2>
      </div>
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
      />
    </div>
  );
};
