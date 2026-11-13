import { format } from "date-fns";

export const formatDateLabel = (start?: Date, end?: Date): string => {
  if (!start) return "No date selected";
  if (!end) return format(start, "MMM dd, yyyy");
  return start.getFullYear() !== end.getFullYear()
    ? `${format(start, "MMM dd, yyyy")} – ${format(end, "MMM dd, yyyy")}`
    : `${format(start, "MMM dd")} – ${format(end, "MMM dd, yyyy")}`;
};
