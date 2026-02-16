import { type FC } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type TimeRangeValue } from "@/lib/reports.utils";

type TimeRangePickerProps = {
  timeRange: TimeRangeValue;
  onTimeRangeChange: (value: TimeRangeValue) => void;
  customStartDate: Date | undefined;
  onCustomStartDateChange: (date: Date | undefined) => void;
  customEndDate: Date | undefined;
  onCustomEndDateChange: (date: Date | undefined) => void;
};

export const TimeRangePicker: FC<TimeRangePickerProps> = ({
  timeRange,
  onTimeRangeChange,
  customStartDate,
  onCustomStartDateChange,
  customEndDate,
  onCustomEndDateChange,
}) => (
  <div className="flex flex-col gap-4 md:flex-row md:justify-end md:items-center">
    <Select value={timeRange} onValueChange={onTimeRangeChange}>
      <SelectTrigger className="w-full md:w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="3m">Last 3 months</SelectItem>
        <SelectItem value="6m">Last 6 months</SelectItem>
        <SelectItem value="12m">Last 12 months</SelectItem>
        <SelectItem value="custom">Custom range</SelectItem>
      </SelectContent>
    </Select>

    {timeRange === "custom" && (
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full md:w-[200px] justify-start text-left font-normal",
                !customStartDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {customStartDate ? format(customStartDate, "PPP") : "Start date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={customStartDate}
              onSelect={onCustomStartDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <span className="text-muted-foreground">to</span>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full md:w-[200px] justify-start text-left font-normal",
                !customEndDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {customEndDate ? format(customEndDate, "PPP") : "End date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={customEndDate}
              onSelect={onCustomEndDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    )}
  </div>
);
