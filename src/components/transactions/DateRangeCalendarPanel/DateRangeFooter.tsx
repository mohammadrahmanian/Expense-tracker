import { type FC } from "react";
import { CalendarCheck } from "lucide-react";
import { formatDateLabel } from "./DateRangeCalendarPanel.utils";

type DateRangeFooterProps = {
  dateLabel: Date | undefined;
  endDateLabel?: Date | undefined;
  onClear: () => void;
  onApply: () => void;
  canApply: boolean;
};

export const DateRangeFooter: FC<DateRangeFooterProps> = ({
  dateLabel,
  endDateLabel,
  onClear,
  onApply,
  canApply,
}) => {
  const formattedLabel = formatDateLabel(dateLabel, endDateLabel);

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground min-w-0">
        <CalendarCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="truncate">{formattedLabel}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onClear}
          className="rounded-sm border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onApply}
          disabled={!canApply}
          className="rounded-sm bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          Apply
        </button>
      </div>
    </div>
  );
};
