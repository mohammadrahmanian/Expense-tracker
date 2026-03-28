import { type FC } from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { DatePreset } from "@/lib/transactions.utils";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { DateRangeFooter } from "./DateRangeFooter";
import { PRESET_OPTIONS } from "./DateRangeDropdown.utils";
import type { DateRange } from "react-day-picker";

type DateRangeDropdownContentProps = {
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

const GROUPS = ["day", "month", "custom"] as const;

export const DateRangeDropdownContent: FC<DateRangeDropdownContentProps> = ({
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
  <>
    <div className="flex flex-col py-2">
      <span className="px-4 py-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground">
        QUICK SELECT
      </span>
      {GROUPS.map((group, gi) => (
        <div key={group}>
          {gi > 0 && <div className="mx-4 my-1 h-px bg-border" />}
          {PRESET_OPTIONS.filter((o) => o.group === group).map((option) => {
            const isActive =
              (calendarMode === "single" && option.value === "custom_date") ||
              (calendarMode === "range" && option.value === "custom_range") ||
              (!calendarMode && preset === option.value);
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onPresetClick(option.value)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-sm px-4 py-2.5 text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-gold-50 text-primary dark:bg-gold-900/40 dark:text-gold-200"
                    : "text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800",
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                {option.label}
                {isActive && <Check className="ml-auto h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
      ))}
    </div>

    {calendarMode === "single" && (
      <>
        <div className="mx-4 h-px bg-border" />
        <CalendarUI
          mode="single"
          selected={pendingDate}
          defaultMonth={pendingDate}
          onSelect={(date) => onPendingDateChange(date ?? undefined)}
        />
        <div className="mx-4 h-px bg-border" />
        <DateRangeFooter
          dateLabel={pendingDate}
          onClear={onClear}
          onApply={onApply}
          canApply={canApply}
        />
      </>
    )}

    {calendarMode === "range" && (
      <>
        <div className="mx-4 h-px bg-border" />
        <CalendarUI
          mode="range"
          selected={pendingRange}
          defaultMonth={pendingRange?.from}
          onSelect={onPendingRangeChange}
        />
        <div className="mx-4 h-px bg-border" />
        <DateRangeFooter
          dateLabel={pendingRange?.from}
          endDateLabel={pendingRange?.to}
          onClear={onClear}
          onApply={onApply}
          canApply={canApply}
        />
      </>
    )}
  </>
);
