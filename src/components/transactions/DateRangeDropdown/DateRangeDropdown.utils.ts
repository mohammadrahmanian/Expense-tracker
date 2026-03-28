import { DatePreset } from "@/lib/transactions.utils";
import { format } from "date-fns";
import {
  Calendar,
  CalendarCheck,
  CalendarMinus,
  CalendarArrowDown,
  CalendarSearch,
  CalendarRange,
  type LucideIcon,
} from "lucide-react";

type PresetOption = {
  value: DatePreset;
  label: string;
  icon: LucideIcon;
  group: "day" | "month" | "custom";
};

export const PRESET_OPTIONS: PresetOption[] = [
  { value: "today", label: "Today", icon: CalendarCheck, group: "day" },
  { value: "yesterday", label: "Yesterday", icon: CalendarMinus, group: "day" },
  { value: "this_month", label: "This Month", icon: Calendar, group: "month" },
  { value: "last_month", label: "Last Month", icon: CalendarArrowDown, group: "month" },
  { value: "custom_date", label: "Custom Date", icon: CalendarSearch, group: "custom" },
  { value: "custom_range", label: "Custom Date Range", icon: CalendarRange, group: "custom" },
];

export const getPillLabel = (
  preset: DatePreset,
  startDate?: Date,
  endDate?: Date,
): string => {
  if (preset === "custom_date" && startDate) {
    return format(startDate, "MMM dd");
  }
  if (preset === "custom_range" && startDate && endDate) {
    return `${format(startDate, "MMM dd")} – ${format(endDate, "MMM dd")}`;
  }
  switch (preset) {
    case "today":
      return "Today";
    case "yesterday":
      return "Yesterday";
    case "this_month":
      return format(new Date(), "MMM");
    case "last_month": {
      const d = new Date();
      d.setMonth(d.getMonth() - 1);
      return format(d, "MMM");
    }
    default:
      return "Date";
  }
};

export const getPresetLabel = (
  preset: DatePreset,
  startDate?: Date,
  endDate?: Date,
): string => {
  if (preset === "custom_date" && startDate) {
    return format(startDate, "MMM dd, yyyy");
  }
  if (preset === "custom_range" && startDate && endDate) {
    return `${format(startDate, "MMM dd")} – ${format(endDate, "MMM dd, yyyy")}`;
  }
  return PRESET_OPTIONS.find((o) => o.value === preset)?.label ?? "Select Date";
};
