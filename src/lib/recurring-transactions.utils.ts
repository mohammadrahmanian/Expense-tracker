import {
  format,
  formatDistanceToNow,
  isSameDay,
  isTomorrow,
  isYesterday,
} from "date-fns";
import { Category, RecurringStatus, RecurringTransaction } from "@/types";

// ---------- Status ----------
export const getRecurringStatus = (
  rt: RecurringTransaction,
  now: Date = new Date(),
): RecurringStatus => {
  if (rt.endDate && new Date(rt.endDate).getTime() < now.getTime())
    return "ended";
  if (!rt.isActive) return "paused";
  return "active";
};

// ---------- Frequency pill ----------
const ORDINAL_SUFFIX = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
};

export const formatFrequencyLabel = (rt: RecurringTransaction): string => {
  const start = new Date(rt.startDate);
  switch (rt.recurrenceFrequency) {
    case "DAILY":
      return "Daily";
    case "WEEKLY":
      return `Weekly · ${format(start, "EEE")}`;
    case "MONTHLY":
      return `Monthly · ${ORDINAL_SUFFIX(start.getDate())}`;
    case "YEARLY":
      return `Yearly · ${format(start, "MMM d")}`;
  }
};

// ---------- Name subtitle ----------
export const formatRowSubtitle = (
  rt: RecurringTransaction,
  categoryName: string,
): string => {
  if (rt.endDate)
    return `${categoryName} · Ends ${format(new Date(rt.endDate), "MMM d, yyyy")}`;
  return `${categoryName} · Started ${format(new Date(rt.startDate), "MMM d, yyyy")}`;
};

// ---------- Next-run text ----------
export const formatNextRunRelative = (
  iso: string,
  now: Date = new Date(),
): string => {
  const d = new Date(iso);
  if (isSameDay(d, now)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  if (isYesterday(d)) return "Yesterday";
  return formatDistanceToNow(d, { addSuffix: true });
};

// ---------- Category lookup ----------
export const getCategoryById = (
  categories: Category[] | undefined,
  id: string,
): Category | undefined => categories?.find((c) => c.id === id);

// ---------- Filter state ----------
export type RecurringTypeFilter = "all" | "INCOME" | "EXPENSE";
export type RecurringStatusFilter = "all" | RecurringStatus;
export type RecurringSortOrder = "asc" | "desc";

export type RecurringFilterState = {
  searchTerm: string;
  typeFilter: RecurringTypeFilter;
  statusFilter: RecurringStatusFilter;
  categoryFilter: string;
  sortOrder: RecurringSortOrder;
  currentPage: number;
  pageSize: number;
};

// ---------- Prop bag types ----------
export type SearchProps = {
  searchTerm: string;
  onSearchTermChange: (v: string) => void;
};
export type TypeFilterProps = {
  typeFilter: RecurringTypeFilter;
  onTypeFilterChange: (v: RecurringTypeFilter) => void;
};
export type StatusFilterProps = {
  statusFilter: RecurringStatusFilter;
  onStatusFilterChange: (v: RecurringStatusFilter) => void;
};
export type CategoryFilterProps = {
  categoryFilter: string;
  onCategoryFilterChange: (v: string) => void;
};
export type SortProps = {
  sortOrder: RecurringSortOrder;
  onSortToggle: () => void;
};
export type PaginationProps = {
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

// ---------- Filtering pipeline ----------
const matchesSearch = (rt: RecurringTransaction, q: string): boolean => {
  if (!q) return true;
  const needle = q.toLowerCase();
  return (
    rt.title.toLowerCase().includes(needle) ||
    (rt.description?.toLowerCase().includes(needle) ?? false)
  );
};

export type FilteredResult = {
  baseFiltered: RecurringTransaction[];
  visibleFiltered: RecurringTransaction[];
};

export const applyFilters = (
  list: RecurringTransaction[] | undefined,
  state: RecurringFilterState,
  now: Date = new Date(),
): FilteredResult => {
  if (!list) return { baseFiltered: [], visibleFiltered: [] };

  const base = list.filter(
    (rt) =>
      matchesSearch(rt, state.searchTerm) &&
      (state.typeFilter === "all" || rt.type === state.typeFilter) &&
      (state.categoryFilter === "all" ||
        rt.categoryId === state.categoryFilter),
  );

  const visible =
    state.statusFilter === "all"
      ? base
      : base.filter((rt) => getRecurringStatus(rt, now) === state.statusFilter);

  return { baseFiltered: base, visibleFiltered: visible };
};

export const sortByNextOccurrence = (
  list: RecurringTransaction[],
  order: RecurringSortOrder,
): RecurringTransaction[] => {
  const copy = [...list];
  copy.sort((a, b) => {
    const ta = new Date(a.nextOccurrence).getTime();
    const tb = new Date(b.nextOccurrence).getTime();
    return order === "asc" ? ta - tb : tb - ta;
  });
  return copy;
};

export const paginate = <T>(list: T[], page: number, pageSize: number): T[] => {
  const start = (page - 1) * pageSize;
  return list.slice(start, start + pageSize);
};
