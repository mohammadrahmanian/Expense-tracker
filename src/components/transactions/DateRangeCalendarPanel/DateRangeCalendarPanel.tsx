import { type FC } from "react";
import type { DateRange } from "react-day-picker";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DateRangeFooter } from "./DateRangeFooter";
import { formatDateLabel } from "./DateRangeCalendarPanel.utils";

type CalendarModeProps =
  | {
      mode: "single";
      selectedDate?: Date;
      onDateChange: (date: Date | undefined) => void;
    }
  | {
      mode: "range";
      selectedRange?: DateRange;
      onRangeChange: (range: DateRange | undefined) => void;
    };

type FooterProps =
  | {
      footer: "actions";
      canApply: boolean;
      onClear: () => void;
      onApply: () => void;
    }
  | { footer: "summary" };

type DateRangeCalendarPanelProps = CalendarModeProps &
  FooterProps & { className?: string; size?: "default" | "comfortable" };

const COMFORTABLE_CLASS_NAMES = {
  head_cell: "w-11",
  cell: "h-11 w-11 text-base",
  day: "h-11 w-11 text-base",
};

export const DateRangeCalendarPanel: FC<DateRangeCalendarPanelProps> = (
  props,
) => {
  const { className, size = "default" } = props;
  const rangeStart =
    props.mode === "single" ? props.selectedDate : props.selectedRange?.from;
  const rangeEnd = props.mode === "range" ? props.selectedRange?.to : undefined;
  const calendarClassNames =
    size === "comfortable" ? COMFORTABLE_CLASS_NAMES : undefined;

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex justify-center">
        {props.mode === "single" ? (
          <CalendarUI
            key="single"
            mode="single"
            selected={props.selectedDate}
            defaultMonth={rangeStart}
            onSelect={(date) => props.onDateChange(date ?? undefined)}
            classNames={calendarClassNames}
          />
        ) : (
          <CalendarUI
            key="range"
            mode="range"
            selected={props.selectedRange}
            defaultMonth={rangeStart}
            onSelect={props.onRangeChange}
            classNames={calendarClassNames}
          />
        )}
      </div>

      {props.footer === "actions" && (
        <>
          <div className="mx-4 h-px bg-border" />
          <DateRangeFooter
            startDate={rangeStart}
            endDate={rangeEnd}
            onClear={props.onClear}
            onApply={props.onApply}
            canApply={props.canApply}
          />
        </>
      )}

      {props.footer === "summary" && rangeStart && (
        <p className="pb-2 text-center text-caption text-muted-foreground">
          {formatDateLabel(rangeStart, rangeEnd)}
        </p>
      )}
    </div>
  );
};
