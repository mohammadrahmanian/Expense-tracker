import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInCalendarDays,
  endOfDay,
  format,
  formatDistance,
  isValid,
  startOfDay,
} from "date-fns";
import { Category, RecurringStatus, RecurringTransaction } from "@/types";

/**
 * The API stores recurring-transaction dates (`startDate`, `endDate`,
 * `nextOccurrence`) as UTC midnight of the intended civil day — the backend's
 * `calculateNextOccurrenceOnce` normalizes via
 * `Date.UTC(getUTCFullYear/Month/Date)`, and a pinned backend test asserts
 * the UTC Y-M-D is the series identity. `new Date(iso)` + local getters would
 * then shift the displayed day by the viewer's UTC offset (e.g. a Pacific
 * user reads "2026-01-15T00:00:00.000Z" back as "Jan 14, 16:00" local).
 * This reconstructs a Date whose LOCAL components match those UTC digits —
 * the exact inverse of the form's `toUTC()` write-side helper — so every
 * local getter/formatter downstream shows the day the value actually
 * represents. Only valid for these UTC-midnight-normalized fields, not for
 * genuine instant fields like `createdAt`.
 */
export function parseRecurringDate(iso: string): Date {
  const d = new Date(iso);
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds(),
    d.getUTCMilliseconds(),
  );
}

// ---------- Status ----------
export const getRecurringStatus = (
  rt: RecurringTransaction,
  now: Date = new Date(),
): RecurringStatus => {
  if (rt.endDate && endOfDay(parseRecurringDate(rt.endDate)) < now)
    return "ended";
  if (!rt.isActive) return "paused";
  return "active";
};

export const STATUS_BADGE: Record<
  RecurringStatus,
  { variant: "success" | "warning" | "secondary"; label: string }
> = {
  active: { variant: "success", label: "Active" },
  paused: { variant: "warning", label: "Paused" },
  ended: { variant: "secondary", label: "Ended" },
};

// ---------- Frequency pill ----------
export const ORDINAL_SUFFIX = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
};

export const formatFrequencyLabel = (rt: RecurringTransaction): string => {
  const start = parseRecurringDate(rt.startDate);
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

// ---------- Schedule phrase (live-form-values, for the recurring form's preview card) ----------
export const formatSchedulePhrase = ({
  recurrenceFrequency,
  startDate,
}: {
  recurrenceFrequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  startDate: Date;
}): string => {
  switch (recurrenceFrequency) {
    case "DAILY":
      return "Every day";
    case "WEEKLY":
      return `Every week on ${format(startDate, "EEEE")}`;
    case "MONTHLY":
      return `Every month on the ${ORDINAL_SUFFIX(startDate.getDate())}`;
    case "YEARLY":
      return `Every year on ${format(startDate, "MMM d")}`;
  }
};

export const formatPerOccurrenceSubline = (
  rt: RecurringTransaction,
): string => {
  const start = parseRecurringDate(rt.startDate);
  switch (rt.recurrenceFrequency) {
    case "DAILY":
      return "per occurrence · every day";
    case "WEEKLY":
      return `per occurrence · on ${format(start, "EEEE")}`;
    case "MONTHLY":
      return `per occurrence · on the ${ORDINAL_SUFFIX(start.getDate())}`;
    case "YEARLY":
      return `per occurrence · on ${format(start, "MMM d")}`;
  }
};

/**
 * Create-mode-only, client-side approximation of the first occurrence for the
 * pre-save preview card. Valid because `CreateStartDateField` disables past dates
 * (`disabledDates={(d) => d < startOfToday()}`), so `startDate` is always today or
 * later, making it a safe stand-in for "first occurrence". The server computes the
 * authoritative `nextOccurrence` after the recurring transaction is actually created.
 */
export const getFirstOccurrence = (startDate: Date): Date => startDate;

// ---------- Name subtitle ----------
export const formatRowSubtitle = (
  rt: RecurringTransaction,
  categoryName: string,
): string => {
  if (rt.endDate)
    return `${categoryName} · Ends ${format(parseRecurringDate(rt.endDate), "MMM d, yyyy")}`;
  return `${categoryName} · Started ${format(parseRecurringDate(rt.startDate), "MMM d, yyyy")}`;
};

// ---------- Next-run text ----------
export const formatNextRunRelative = (
  date: Date,
  now: Date = new Date(),
): string => {
  const dayDiff = differenceInCalendarDays(date, now);
  if (dayDiff === 0) return "Today";
  if (dayDiff === 1) return "Tomorrow";
  if (dayDiff === -1) return "Yesterday";
  return formatDistance(date, now, { addSuffix: true });
};

// ---------- Occurrence preview (next N occurrences for the form preview card) ----------
export type OccurrencePreview = {
  date: Date;
  weekday: string;
  monthShort: string;
  dayOfMonth: string;
  relativeLabel: string;
};

type RecurrenceFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

/**
 * Computed from `startDate` directly (not by repeatedly adding one interval to the
 * previous occurrence) so MONTHLY/YEARLY don't drift off the original day-of-month
 * (e.g. Jan 31 -> Feb 28 -> Mar 28 instead of Mar 31).
 */
function addIntervals(
  startDate: Date,
  frequency: RecurrenceFrequency,
  count: number,
): Date {
  switch (frequency) {
    case "DAILY":
      return addDays(startDate, count);
    case "WEEKLY":
      return addWeeks(startDate, count);
    case "MONTHLY":
      return addMonths(startDate, count);
    case "YEARLY":
      return addYears(startDate, count);
  }
}

export function getNextOccurrences({
  startDate,
  frequency,
  endDate,
  count = 3,
  fromDate = startOfDay(new Date()),
}: {
  startDate: Date;
  frequency: RecurrenceFrequency;
  endDate?: Date | null;
  count?: number;
  fromDate?: Date;
}): OccurrencePreview[] {
  if (!isValid(startDate)) return [];

  const cutoff = fromDate > startDate ? fromDate : startDate;

  const MAX_SKIP_ITERATIONS = 10000;
  let index = 0;
  while (
    addIntervals(startDate, frequency, index) < cutoff &&
    index < MAX_SKIP_ITERATIONS
  ) {
    index++;
  }

  const occurrences: OccurrencePreview[] = [];
  while (occurrences.length < count) {
    const date = addIntervals(startDate, frequency, index);
    if (endDate && date > endDate) break;
    occurrences.push({
      date,
      weekday: format(date, "EEEE"),
      monthShort: format(date, "MMM").toUpperCase(),
      dayOfMonth: format(date, "dd"),
      relativeLabel: formatNextRunRelative(date, fromDate),
    });
    index++;
  }

  return occurrences;
}

export function countOccurrencesUntil({
  startDate,
  frequency,
  endDate,
  until,
}: {
  startDate: Date;
  frequency: RecurrenceFrequency;
  endDate?: Date | null;
  until: Date;
}): number {
  if (!isValid(startDate)) return 0;

  const start = startOfDay(startDate);
  const untilDay = startOfDay(until);
  if (start > untilDay) return 0;

  const endCap = endDate && isValid(endDate) ? startOfDay(endDate) : null;
  const cap =
    endCap && endCap.getTime() < untilDay.getTime() ? endCap : untilDay;

  let count = 0;
  while (addIntervals(start, frequency, count) <= cap) {
    count++;
  }

  return count;
}

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
