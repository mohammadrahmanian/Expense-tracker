import { type FC } from "react";
import { DatePreset } from "@/lib/transactions.utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { DateRangeDropdownView } from "./DateRangeDropdownView";
import {
  getPresetLabel,
  getPillLabel,
  LARGE_SCREEN_QUERY,
} from "./DateRangeDropdown.utils";
import { useDateRangeDropdown } from "./useDateRangeDropdown";

type DateRangeDropdownProps = {
  preset: DatePreset;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onPresetChange: (preset: DatePreset) => void;
  onCustomDateSelect: (date: Date) => void;
  onCustomRangeSelect: (from: Date, to: Date) => void;
  variant?: "default" | "pill";
};

export const DateRangeDropdown: FC<DateRangeDropdownProps> = ({
  preset,
  startDate,
  endDate,
  onPresetChange,
  onCustomDateSelect,
  onCustomRangeSelect,
  variant = "default",
}) => {
  const { open, panelProps, handleOpenChange, handleBack } =
    useDateRangeDropdown({
      preset,
      startDate,
      endDate,
      onPresetChange,
      onCustomDateSelect,
      onCustomRangeSelect,
    });

  const isLargeScreen = useMediaQuery(LARGE_SCREEN_QUERY);
  const label =
    variant === "pill"
      ? getPillLabel(preset, startDate, endDate)
      : getPresetLabel(preset, startDate, endDate);

  return (
    <DateRangeDropdownView
      isLargeScreen={isLargeScreen}
      open={open}
      onOpenChange={handleOpenChange}
      variant={variant}
      label={label}
      preset={preset}
      panelProps={panelProps}
      onBack={handleBack}
    />
  );
};
