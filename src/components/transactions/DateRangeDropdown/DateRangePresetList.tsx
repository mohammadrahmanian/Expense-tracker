import { type FC } from "react";
import { DatePreset } from "@/lib/transactions.utils";
import { cn } from "@/lib/utils";
import { Check, ChevronRight } from "lucide-react";
import {
  GROUPED_PRESET_OPTIONS,
  type CalendarMode,
} from "./DateRangeDropdown.utils";

type DateRangePresetListProps = {
  preset: DatePreset;
  calendarMode: CalendarMode;
  onPresetClick: (value: DatePreset) => void;
  showChevron?: boolean;
  className?: string;
  autoFocusValue?: DatePreset;
};

export const DateRangePresetList: FC<DateRangePresetListProps> = ({
  preset,
  calendarMode,
  onPresetClick,
  showChevron = false,
  className,
  autoFocusValue,
}) => (
  <div className={cn("flex flex-col py-2", className)}>
    <span className="px-4 py-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground">
      QUICK SELECT
    </span>
    {GROUPED_PRESET_OPTIONS.map(({ group, options }, gi) => (
      <div key={group}>
        {gi > 0 && <div className="mx-4 my-1 h-px bg-border" />}
        {options.map((option) => {
          const isActive =
            (calendarMode === "single" && option.value === "custom_date") ||
            (calendarMode === "range" && option.value === "custom_range") ||
            (!calendarMode && preset === option.value);
          const isCustom =
            option.value === "custom_date" || option.value === "custom_range";
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              type="button"
              autoFocus={option.value === autoFocusValue}
              onClick={() => onPresetClick(option.value)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-sm px-4 py-2.5 text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-gold-50 text-primary dark:bg-gold-900/40 dark:text-gold-200"
                  : "text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              {option.label}
              {showChevron && isCustom && (
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
              )}
              {(!showChevron || !isCustom) && isActive && (
                <Check className="ml-auto h-4 w-4 text-primary" />
              )}
            </button>
          );
        })}
      </div>
    ))}
  </div>
);
