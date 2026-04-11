import { type FC } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DatePreset } from "@/lib/transactions.utils";
import { cn } from "@/lib/utils";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { DateRangeDropdownContent } from "./DateRangeDropdownContent";
import { getPresetLabel, getPillLabel } from "./DateRangeDropdown.utils";
import { useDateRangeDropdown } from "./useDateRangeDropdown";

type DateRangeDropdownProps = {
  preset: DatePreset;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onPresetChange: (preset: DatePreset) => void;
  onCustomDateSelect: (date: Date) => void;
  onCustomRangeSelect: (from: Date, to: Date) => void;
  variant?: "default" | "pill";
};

export const DateRangeDropdown: FC<DateRangeDropdownProps> = ({
  preset,
  startDate,
  endDate,
  onPresetChange,
  onCustomDateSelect,
  onCustomRangeSelect,
  variant = "default",
}) => {
  const {
    open,
    calendarMode,
    pendingDate,
    pendingRange,
    canApply,
    handleOpenChange,
    handlePresetClick,
    handleApply,
    handleClear,
    setPendingDate,
    setPendingRange,
  } = useDateRangeDropdown({
    preset,
    startDate,
    endDate,
    onPresetChange,
    onCustomDateSelect,
    onCustomRangeSelect,
  });

  const label =
    variant === "pill"
      ? getPillLabel(preset, startDate, endDate)
      : getPresetLabel(preset, startDate, endDate);
  const ChevronIcon = open ? ChevronUp : ChevronDown;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 font-medium transition-colors",
            variant === "pill"
              ? "shrink-0 rounded-full px-3 py-[7px] text-[13px] border border-border text-muted-foreground"
              : "rounded-sm px-3 py-[7px] text-xs font-semibold border",
            variant === "default" &&
              (preset
                ? "border-primary bg-gold-50 text-primary dark:bg-gold-900/40 dark:text-gold-200"
                : "border-border bg-surface text-muted-foreground"),
          )}
        >
          <Calendar className={cn(variant === "pill" ? "h-[13px] w-[13px]" : "h-3.5 w-3.5")} />
          {label}
          {variant === "default" && <ChevronIcon className="h-3.5 w-3.5" />}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[300px] p-0">
        <DateRangeDropdownContent
          preset={preset}
          calendarMode={calendarMode}
          pendingDate={pendingDate}
          pendingRange={pendingRange}
          canApply={canApply}
          onPresetClick={handlePresetClick}
          onPendingDateChange={(d) => setPendingDate(d ?? undefined)}
          onPendingRangeChange={setPendingRange}
          onClear={handleClear}
          onApply={handleApply}
        />
      </PopoverContent>
    </Popover>
  );
};
