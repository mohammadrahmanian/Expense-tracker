import type { DatePreset } from "@/lib/transactions.utils";

export type DraftFilterState = {
  typeFilter: "all" | "INCOME" | "EXPENSE";
  datePreset: DatePreset;
  startDate: Date | undefined;
  endDate: Date | undefined;
  minAmount: number | undefined;
  maxAmount: number | undefined;
  categoryFilter: string;
  sortOption: string;
};

export const TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "INCOME", label: "Income" },
  { value: "EXPENSE", label: "Expense" },
];

export const DATE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
  { value: "custom_range", label: "Custom" },
];

export const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
  { value: "amount_desc", label: "Highest" },
  { value: "amount_asc", label: "Lowest" },
];

export const toSortOption = (field: "date" | "amount", order: "asc" | "desc") =>
  `${field}_${order}`;

export const fromSortOption = (
  opt: string,
): { field: "date" | "amount"; order: "asc" | "desc" } => {
  const [field, order] = opt.split("_") as ["date" | "amount", "asc" | "desc"];
  return { field, order };
};
