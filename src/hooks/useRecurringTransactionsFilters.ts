import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  RecurringFilterState,
  RecurringStatusFilter,
  RecurringTypeFilter,
  SearchProps,
  TypeFilterProps,
  StatusFilterProps,
  CategoryFilterProps,
  PaginationProps,
} from "@/lib/recurring-transactions.utils";

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_TYPE"; payload: RecurringTypeFilter }
  | { type: "SET_STATUS"; payload: RecurringStatusFilter }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_PAGE"; payload: number };

const PAGE_SIZE = 10;

const initialState: RecurringFilterState = {
  searchTerm: "",
  typeFilter: "all",
  statusFilter: "all",
  categoryFilter: "all",
  sortOrder: "asc",
  currentPage: 1,
  pageSize: PAGE_SIZE,
};

const reducer = (s: RecurringFilterState, a: Action): RecurringFilterState => {
  switch (a.type) {
    case "SET_SEARCH":
      return { ...s, searchTerm: a.payload, currentPage: 1 };
    case "SET_TYPE":
      return { ...s, typeFilter: a.payload, currentPage: 1 };
    case "SET_STATUS":
      return { ...s, statusFilter: a.payload, currentPage: 1 };
    case "SET_CATEGORY":
      return { ...s, categoryFilter: a.payload, currentPage: 1 };
    case "SET_PAGE":
      return { ...s, currentPage: a.payload };
  }
};

export const useRecurringTransactionsFilters = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchInput, setSearchInput] = useState("");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      dispatch({ type: "SET_SEARCH", payload: searchInput });
    }, 300);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [searchInput]);

  const searchProps: SearchProps = useMemo(
    () => ({
      searchTerm: searchInput,
      onSearchTermChange: setSearchInput,
    }),
    [searchInput],
  );

  const typeFilterProps: TypeFilterProps = useMemo(
    () => ({
      typeFilter: state.typeFilter,
      onTypeFilterChange: (v: RecurringTypeFilter) =>
        dispatch({ type: "SET_TYPE", payload: v }),
    }),
    [state.typeFilter],
  );

  const statusFilterProps: StatusFilterProps = useMemo(
    () => ({
      statusFilter: state.statusFilter,
      onStatusFilterChange: (v: RecurringStatusFilter) =>
        dispatch({ type: "SET_STATUS", payload: v }),
    }),
    [state.statusFilter],
  );

  const categoryFilterProps: CategoryFilterProps = useMemo(
    () => ({
      categoryFilter: state.categoryFilter,
      onCategoryFilterChange: (v: string) =>
        dispatch({ type: "SET_CATEGORY", payload: v }),
    }),
    [state.categoryFilter],
  );

  const paginationProps: PaginationProps = useMemo(
    () => ({
      currentPage: state.currentPage,
      pageSize: state.pageSize,
      onPageChange: (p: number) => dispatch({ type: "SET_PAGE", payload: p }),
    }),
    [state.currentPage, state.pageSize],
  );

  return {
    state,
    searchProps,
    typeFilterProps,
    statusFilterProps,
    categoryFilterProps,
    paginationProps,
  };
};
