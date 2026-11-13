import { type FC, useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import { DrawerTitle } from "@/components/ui/drawer";
import { DateRangeCalendarPanel } from "@/components/transactions/DateRangeCalendarPanel";
import { DateRangePresetList } from "./DateRangePresetList";
import {
  CALENDAR_MODE_TO_PRESET,
  type CalendarMode,
  type DateRangePanelProps,
} from "./DateRangeDropdown.utils";

type DateRangeMobileSheetProps = DateRangePanelProps & { onBack: () => void };

const HEADING_CLASS = "text-sm font-semibold text-foreground";
const STEP_ONE_HEADING_CLASS = `px-4 pb-2 pt-1 ${HEADING_CLASS}`;

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
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const prevModeRef = useRef<CalendarMode>(null);

  useEffect(() => {
    if (calendarMode && !prevModeRef.current) backButtonRef.current?.focus();
    prevModeRef.current = calendarMode;
  }, [calendarMode]);

  if (!calendarMode) {
    const autoFocusValue = prevModeRef.current
      ? CALENDAR_MODE_TO_PRESET[prevModeRef.current]
      : undefined;
    return (
      <div className="flex flex-col">
        <DrawerTitle className={STEP_ONE_HEADING_CLASS}>
          Select Date
        </DrawerTitle>
        <DateRangePresetList
          preset={preset}
          calendarMode={calendarMode}
          onPresetClick={onPresetClick}
          showChevron
          autoFocusValue={autoFocusValue}
        />
      </div>
    );
  }

  const footerProps = {
    footer: "actions" as const,
    canApply,
    onClear,
    onApply,
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 px-4 pb-2 pt-1">
        <button
          ref={backButtonRef}
          type="button"
          onClick={onBack}
          aria-label="Back to the date options"
          className="rounded-sm p-1 text-muted-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <DrawerTitle className={HEADING_CLASS}>
          {calendarMode === "single" ? "Custom Date" : "Custom Date Range"}
        </DrawerTitle>
      </div>
      {calendarMode === "single" ? (
        <DateRangeCalendarPanel
          mode="single"
          selectedDate={pendingDate}
          onDateChange={onPendingDateChange}
          size="comfortable"
          {...footerProps}
        />
      ) : (
        <DateRangeCalendarPanel
          mode="range"
          selectedRange={pendingRange}
          onRangeChange={onPendingRangeChange}
          size="comfortable"
          {...footerProps}
        />
      )}
    </div>
  );
};
