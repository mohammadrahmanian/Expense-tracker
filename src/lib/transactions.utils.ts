import { Category, Transaction } from "@/types";

export type TransactionFilterState = {
  searchTerm: string;
  typeFilter: "all" | "INCOME" | "EXPENSE";
  categoryFilter: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  currentPage: number;
  pageSize: number;
  sortField: "date" | "amount";
  sortOrder: "asc" | "desc";
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

  if (state.startDate) {
    const start = new Date(state.startDate);
    start.setHours(0, 0, 0, 0);
    params.fromDate = start.toISOString();
  }

  if (state.endDate) {
    const end = new Date(state.endDate);
    end.setHours(23, 59, 59, 999);
    params.toDate = end.toISOString();
  }

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
    "searchTerm" | "typeFilter" | "categoryFilter" | "startDate" | "endDate"
  >,
): boolean =>
  !!(
    state.searchTerm ||
    state.typeFilter !== "all" ||
    state.categoryFilter !== "all" ||
    state.startDate ||
    state.endDate
  );

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
