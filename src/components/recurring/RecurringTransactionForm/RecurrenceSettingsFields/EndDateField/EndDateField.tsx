import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

type EndDateFieldProps = {
  watchEndDate: Date | null | undefined;
  minDate: Date;
  error?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (date: Date | undefined) => void;
  onClear: () => void;
};

export const EndDateField: FC<EndDateFieldProps> = ({
  watchEndDate,
  minDate,
  error,
  isOpen,
  onOpenChange,
  onSelect,
  onClear,
}) => (
  <div className="space-y-2">
    <Label>End Date (optional)</Label>
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !watchEndDate && "text-muted-foreground",
            error && "border-red-500",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {watchEndDate ? (
            format(watchEndDate, "PPP")
          ) : (
            <span>Select end date...</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={watchEndDate || undefined}
          onSelect={(date) => {
            onSelect(date);
            onOpenChange(false);
          }}
          initialFocus
          disabled={(date) => date < minDate}
        />
      </PopoverContent>
    </Popover>
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
    {error && <p className="text-sm text-red-500">{error}</p>}
    <p className="text-xs text-gray-500 dark:text-gray-400">
      Leave empty for indefinite recurrence
    </p>
  </div>
);
