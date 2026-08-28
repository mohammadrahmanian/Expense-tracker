import { type FC } from "react";
import type { DateRange } from "react-day-picker";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DateRangeFooter } from "./DateRangeFooter";
import { formatDateLabel } from "./DateRangeCalendarPanel.utils";

type DateRangeCalendarPanelProps = {
  mode: "single" | "range";
  selectedDate?: Date;
  selectedRange?: DateRange;
  onDateChange: (date: Date | undefined) => void;
  onRangeChange: (range: DateRange | undefined) => void;
  footer: "actions" | "summary";
  canApply?: boolean;
  onClear?: () => void;
  onApply?: () => void;
  className?: string;
};

export const DateRangeCalendarPanel: FC<DateRangeCalendarPanelProps> = ({
  mode,
  selectedDate,
  selectedRange,
  onDateChange,
  onRangeChange,
  footer,
  canApply = false,
  onClear,
  onApply,
  className,
}) => {
  const rangeStart = mode === "single" ? selectedDate : selectedRange?.from;
  const rangeEnd = mode === "range" ? selectedRange?.to : undefined;

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex justify-center">
        {mode === "single" ? (
          <CalendarUI
            mode="single"
            selected={selectedDate}
            defaultMonth={rangeStart}
            onSelect={(date) => onDateChange(date ?? undefined)}
          />
        ) : (
          <CalendarUI
            mode="range"
            selected={selectedRange}
            defaultMonth={rangeStart}
            onSelect={onRangeChange}
          />
        )}
      </div>

      {footer === "actions" && (
        <>
          <div className="mx-4 h-px bg-border" />
          <DateRangeFooter
            dateLabel={rangeStart}
            endDateLabel={rangeEnd}
            onClear={onClear ?? (() => {})}
            onApply={onApply ?? (() => {})}
            canApply={canApply}
          />
        </>
      )}

      {footer === "summary" && rangeStart && (
        <p className="pb-2 text-center text-caption text-muted-foreground">
          {formatDateLabel(rangeStart, rangeEnd)}
        </p>
      )}
    </div>
  );
};
