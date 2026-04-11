import { useState } from "react";
import { DatePreset } from "@/lib/transactions.utils";
import type { DateRange } from "react-day-picker";

type UseDateRangeDropdownParams = {
  preset: DatePreset;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onPresetChange: (preset: DatePreset) => void;
  onCustomDateSelect: (date: Date) => void;
  onCustomRangeSelect: (from: Date, to: Date) => void;
};

export const useDateRangeDropdown = ({
  preset,
  startDate,
  endDate,
  onPresetChange,
  onCustomDateSelect,
  onCustomRangeSelect,
}: UseDateRangeDropdownParams) => {
  const [open, setOpen] = useState(false);
  const [calendarMode, setCalendarMode] = useState<"single" | "range" | null>(null);
  const [pendingDate, setPendingDate] = useState<Date | undefined>();
  const [pendingRange, setPendingRange] = useState<DateRange | undefined>();

  const resetLocal = () => {
    setCalendarMode(null);
    setPendingDate(undefined);
    setPendingRange(undefined);
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (v) {
      if (preset === "custom_date") {
        setCalendarMode("single");
        setPendingDate(startDate);
      } else if (preset === "custom_range") {
        setCalendarMode("range");
        setPendingRange(startDate && endDate ? { from: startDate, to: endDate } : undefined);
      }
    } else {
      resetLocal();
    }
  };

  const handlePresetClick = (value: DatePreset) => {
    if (value === "custom_date") {
      setCalendarMode("single");
      setPendingDate(startDate);
      return;
    }
    if (value === "custom_range") {
      setCalendarMode("range");
      setPendingRange(startDate && endDate ? { from: startDate, to: endDate } : undefined);
      return;
    }
    resetLocal();
    onPresetChange(value);
    setOpen(false);
  };

  const handleApply = () => {
    if (calendarMode === "single" && pendingDate) {
      onCustomDateSelect(pendingDate);
    } else if (calendarMode === "range" && pendingRange?.from && pendingRange?.to) {
      onCustomRangeSelect(pendingRange.from, pendingRange.to);
    }
    resetLocal();
    setOpen(false);
  };

  const handleClear = () => {
    setPendingDate(undefined);
    setPendingRange(undefined);
  };

  const canApply =
    (calendarMode === "single" && !!pendingDate) ||
    (calendarMode === "range" && !!pendingRange?.from && !!pendingRange?.to);

  return {
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
  };
};
