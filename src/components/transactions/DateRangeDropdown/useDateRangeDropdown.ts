import { useCallback, useMemo, useState } from "react";
import { DatePreset } from "@/lib/transactions.utils";
import type { DateRange } from "react-day-picker";
import type {
  CalendarMode,
  DateRangePanelProps,
} from "./DateRangeDropdown.utils";

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
  const [calendarMode, setCalendarMode] = useState<CalendarMode>(null);
  const [pendingDate, setPendingDate] = useState<Date | undefined>();
  const [pendingRange, setPendingRange] = useState<DateRange | undefined>();

  const resetLocal = useCallback(() => {
    setCalendarMode(null);
    setPendingDate(undefined);
    setPendingRange(undefined);
  }, []);

  const handleOpenChange = useCallback(
    (v: boolean) => {
      setOpen(v);
      if (v) {
        if (preset === "custom_date") {
          setCalendarMode("single");
          setPendingDate(startDate);
        } else if (preset === "custom_range") {
          setCalendarMode("range");
          setPendingRange(
            startDate && endDate ? { from: startDate, to: endDate } : undefined,
          );
        }
      } else {
        resetLocal();
      }
    },
    [preset, startDate, endDate, resetLocal],
  );

  const handlePresetClick = useCallback(
    (value: DatePreset) => {
      if (value === "custom_date") {
        setCalendarMode("single");
        setPendingDate(startDate);
        return;
      }
      if (value === "custom_range") {
        setCalendarMode("range");
        setPendingRange(
          startDate && endDate ? { from: startDate, to: endDate } : undefined,
        );
        return;
      }
      resetLocal();
      onPresetChange(value);
      setOpen(false);
    },
    [startDate, endDate, onPresetChange, resetLocal],
  );

  const handleApply = useCallback(() => {
    if (calendarMode === "single" && pendingDate) {
      onCustomDateSelect(pendingDate);
    } else if (
      calendarMode === "range" &&
      pendingRange?.from &&
      pendingRange?.to
    ) {
      onCustomRangeSelect(pendingRange.from, pendingRange.to);
    }
    resetLocal();
    setOpen(false);
  }, [
    calendarMode,
    pendingDate,
    pendingRange,
    onCustomDateSelect,
    onCustomRangeSelect,
    resetLocal,
  ]);

  const handleClear = useCallback(() => {
    setPendingDate(undefined);
    setPendingRange(undefined);
  }, []);

  const handleBack = useCallback(() => {
    resetLocal();
  }, [resetLocal]);

  const handlePendingDateChange = useCallback((date: Date | undefined) => {
    setPendingDate(date ?? undefined);
  }, []);

  const canApply =
    (calendarMode === "single" && !!pendingDate) ||
    (calendarMode === "range" && !!pendingRange?.from && !!pendingRange?.to);

  const panelProps: DateRangePanelProps = useMemo(
    () => ({
      preset,
      calendarMode,
      pendingDate,
      pendingRange,
      canApply,
      onPresetClick: handlePresetClick,
      onPendingDateChange: handlePendingDateChange,
      onPendingRangeChange: setPendingRange,
      onClear: handleClear,
      onApply: handleApply,
    }),
    [
      preset,
      calendarMode,
      pendingDate,
      pendingRange,
      canApply,
      handlePresetClick,
      handlePendingDateChange,
      handleClear,
      handleApply,
    ],
  );

  return {
    open,
    panelProps,
    handleOpenChange,
    handleBack,
  };
};
