import { useState, type FC } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";

type QuickDateChipProps = {
  value: Date;
  onChange: (date: Date) => void;
};

const formatDateLabel = (date: Date) => {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d");
};

export const QuickDateChip: FC<QuickDateChipProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 h-9 rounded-md bg-neutral-100 px-3 text-[13px] font-medium text-neutral-600 hover:bg-neutral-200 transition-colors"
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>{formatDateLabel(value)}</span>
          <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value}
          onSelect={(date) => {
            if (date) onChange(date);
            setIsOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
