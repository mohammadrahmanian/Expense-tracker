import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { DateSelect } from "@/components/shared/DateSelect";

type EndDateFieldProps = {
  watchEndDate: Date | null | undefined;
  minDate: Date;
  error?: string;
  onSelect: (date: Date | null) => void;
  onClear: () => void;
};

export const EndDateField: FC<EndDateFieldProps> = ({
  watchEndDate,
  minDate,
  error,
  onSelect,
  onClear,
}) => (
  <div className="space-y-2">
    <DateSelect
      value={watchEndDate}
      onChange={(date) => onSelect(date)}
      label="End Date (optional)"
      placeholder="Select end date..."
      error={error}
      disabledDates={(date) => date < minDate}
    />
    {watchEndDate && (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="h-auto p-0 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        Clear end date
      </Button>
    )}
    <p className="text-xs text-gray-500 dark:text-gray-400">
      Leave empty for indefinite recurrence
    </p>
  </div>
);
