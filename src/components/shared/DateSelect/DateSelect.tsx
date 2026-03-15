import { useState, useEffect, type FC } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";

const DATE_FORMAT = "dd/MM/yyyy";

type DateSelectProps = {
  value: Date | null | undefined;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabledDates?: (date: Date) => boolean;
};

export const DateSelect: FC<DateSelectProps> = ({
  value,
  onChange,
  label,
  placeholder = "DD/MM/YYYY",
  error,
  required,
  disabledDates,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(
    value ? format(value, DATE_FORMAT) : "",
  );

  useEffect(() => {
    setInputValue(value ? format(value, DATE_FORMAT) : "");
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    if (!inputValue) {
      onChange(null);
      return;
    }
    const parsed = parse(inputValue, DATE_FORMAT, new Date());
    if (isValid(parsed)) {
      onChange(parsed);
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    onChange(date ?? null);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          {required && <span className="text-danger-500"> *</span>}
        </Label>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverAnchor asChild>
          <div className="relative">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onClick={() => setIsOpen(true)}
              placeholder={placeholder}
              aria-invalid={error ? true : undefined}
              className={cn(error && "border-danger-500", "pr-9")}
            />
            <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          </div>
        </PopoverAnchor>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Calendar
            mode="single"
            selected={value ?? undefined}
            defaultMonth={value ?? undefined}
            onSelect={handleCalendarSelect}
            disabled={disabledDates}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-danger-500">{error}</p>}
    </div>
  );
};
