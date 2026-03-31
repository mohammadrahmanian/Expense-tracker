import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  subDays,
  subMonths,
  format,
  isToday,
  isYesterday,
} from "date-fns";
import { Category, Transaction } from "@/types";

export type DatePreset =
  | "today"
  | "yesterday"
  | "this_month"
  | "last_month"
  | "custom_date"
  | "custom_range"
  | null;

export type TransactionFilterState = {
  searchTerm: string;
  typeFilter: "all" | "INCOME" | "EXPENSE";
  categoryFilter: string;
  datePreset: DatePreset;
  startDate: Date | undefined;
  endDate: Date | undefined;
  currentPage: number;
  pageSize: number;
  sortField: "date" | "amount";
  sortOrder: "asc" | "desc";
};

export type DateFilterProps = {
  datePreset: DatePreset;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onDatePresetChange: (preset: DatePreset) => void;
  onCustomDateSelect: (date: Date) => void;
  onCustomRangeSelect: (from: Date, to: Date) => void;
};

export type SearchProps = {
  searchTerm: string;
  onSearchTermChange: (v: string) => void;
};

export type TypeFilterProps = {
  typeFilter: "all" | "INCOME" | "EXPENSE";
  onTypeFilterChange: (v: "all" | "INCOME" | "EXPENSE") => void;
};

export type SortProps = {
  sortField: "date" | "amount";
  sortOrder: "asc" | "desc";
  onSort: (field: "date" | "amount") => void;
};

export type PaginationProps = {
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export const computeDateRange = (
  preset: DatePreset,
): { start: Date | undefined; end: Date | undefined } => {
  const now = new Date();
  switch (preset) {
    case "today":
      return { start: startOfDay(now), end: endOfDay(now) };
    case "yesterday": {
      const yesterday = subDays(now, 1);
      return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
    }
    case "this_month":
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case "last_month": {
      const lastMonth = subMonths(now, 1);
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
    }
    default:
      return { start: undefined, end: undefined };
  }
};

const resolveDateRange = (
  state: TransactionFilterState,
): { start: Date | undefined; end: Date | undefined } => {
  if (state.startDate || state.endDate) {
    return { start: state.startDate, end: state.endDate };
  }
  return computeDateRange(state.datePreset);
};

const formatDateBoundaries = (
  start: Date | undefined,
  end: Date | undefined,
): { fromDate?: string; toDate?: string } => {
  const result: { fromDate?: string; toDate?: string } = {};
  if (start) {
    const s = new Date(start);
    s.setHours(0, 0, 0, 0);
    result.fromDate = s.toISOString();
  }
  if (end) {
    const e = new Date(end);
    e.setHours(23, 59, 59, 999);
    result.toDate = e.toISOString();
  }
  return result;
};

export const buildQueryParams = (state: TransactionFilterState) => {
  const params: {
    sort: "date" | "amount";
    order: "asc" | "desc";
    limit: number;
    offset: number;
    type?: "INCOME" | "EXPENSE";
    fromDate?: string;
    toDate?: string;
    categoryId?: string;
    query?: string;
  } = {
    sort: state.sortField,
    order: state.sortOrder,
    limit: state.pageSize,
    offset: (state.currentPage - 1) * state.pageSize,
  };

  if (state.searchTerm) params.query = state.searchTerm;
  if (state.typeFilter !== "all") params.type = state.typeFilter;
  if (state.categoryFilter !== "all") params.categoryId = state.categoryFilter;

  const { start, end } = resolveDateRange(state);
  Object.assign(params, formatDateBoundaries(start, end));

  return params;
};

export const buildInfiniteQueryParams = (state: TransactionFilterState) => {
  const params: {
    sort: "date" | "amount";
    order: "asc" | "desc";
    type?: "INCOME" | "EXPENSE";
    fromDate?: string;
    toDate?: string;
    categoryId?: string;
    query?: string;
  } = {
    sort: state.sortField,
    order: state.sortOrder,
  };

  if (state.searchTerm) params.query = state.searchTerm;
  if (state.typeFilter !== "all") params.type = state.typeFilter;
  if (state.categoryFilter !== "all") params.categoryId = state.categoryFilter;

  const { start, end } = resolveDateRange(state);
  Object.assign(params, formatDateBoundaries(start, end));

  return params;
};

export const calculatePageTotals = (transactions: Transaction[]) => {
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  return { totalIncome, totalExpenses, net: totalIncome - totalExpenses };
};

export const hasActiveFilters = (
  state: Pick<
    TransactionFilterState,
    | "searchTerm"
    | "typeFilter"
    | "categoryFilter"
    | "datePreset"
  >,
): boolean =>
  !!(
    state.searchTerm ||
    state.typeFilter !== "all" ||
    state.categoryFilter !== "all" ||
    (state.datePreset && state.datePreset !== "this_month")
  );

export type TransactionDateGroup = {
  dateKey: string;
  dateLabel: string;
  date: Date;
  transactions: Transaction[];
  dailyNet: number;
};

export const groupTransactionsByDate = (
  transactions: Transaction[],
): TransactionDateGroup[] => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const grouped = new Map<string, Transaction[]>();

  for (const tx of transactions) {
    const d = new Date(tx.date);
    const key = format(d, "yyyy-MM-dd");
    const existing = grouped.get(key);
    if (existing) {
      existing.push(tx);
    } else {
      grouped.set(key, [tx]);
    }
  }

  return Array.from(grouped.entries())
    .map(([key, txs]) => {
      const date = new Date(txs[0].date);
      let dateLabel: string;

      if (isToday(date)) {
        dateLabel = `Today, ${format(date, "MMM dd")}`;
      } else if (isYesterday(date)) {
        dateLabel = `Yesterday, ${format(date, "MMM dd")}`;
      } else if (date.getFullYear() === currentYear) {
        dateLabel = format(date, "MMM dd");
      } else {
        dateLabel = format(date, "MMM dd, yyyy");
      }

      const dailyNet = txs.reduce(
        (sum, t) => sum + (t.type === "INCOME" ? t.amount : -t.amount),
        0,
      );

      return { dateKey: key, dateLabel, date, transactions: txs, dailyNet };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const getCategoryById = (
  categories: Category[] | undefined,
  categoryId: string,
  transactionType: "INCOME" | "EXPENSE",
): Category =>
  categories?.find((cat) => cat.id === categoryId) ?? {
    id: "missing",
    name: "Uncategorized",
    color: "#6b7280",
    type: transactionType,
  };
