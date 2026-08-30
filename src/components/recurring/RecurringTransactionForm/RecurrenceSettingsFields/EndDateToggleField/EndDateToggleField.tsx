import { type FC } from "react";
import { Calendar } from "lucide-react";
import { DateSelect } from "@/components/shared/DateSelect";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type EndDateToggleFieldProps = {
  hasEndDate: boolean;
  endDate: Date | null | undefined;
  minDate: Date;
  error?: string;
  onToggle: (checked: boolean) => void;
  onSelectDate: (date: Date | null) => void;
};

export const EndDateToggleField: FC<EndDateToggleFieldProps> = ({
  hasEndDate,
  endDate,
  minDate,
  error,
  onToggle,
  onSelectDate,
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between gap-2">
      <Label>End date (optional)</Label>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {hasEndDate ? "Has end date" : "No end date"}
        </span>
        <Switch
          checked={hasEndDate}
          onCheckedChange={onToggle}
          aria-label="Toggle end date"
        />
      </div>
    </div>
    {hasEndDate ? (
      <DateSelect
        value={endDate}
        onChange={onSelectDate}
        placeholder="Select end date..."
        error={error}
        disabledDates={(date) => date < minDate}
      />
    ) : (
      <div className="flex h-12 items-center gap-2 rounded-sm border border-border bg-neutral-100 px-3 opacity-50 dark:border-neutral-700 dark:bg-neutral-800">
        <Calendar className="h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400" />
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          Runs indefinitely
        </span>
      </div>
    )}
  </div>
);
