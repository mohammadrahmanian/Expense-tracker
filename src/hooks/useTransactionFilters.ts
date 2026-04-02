import { startOfDay, endOfDay } from "date-fns";
import { useScrollToTopOnChange } from "@/hooks/useScrollToTopOnChange";
import {
  buildInfiniteQueryParams,
  buildQueryParams,
  DatePreset,
  hasActiveFilters,
  TransactionFilterState,
  type DateFilterProps,
  type SearchProps,
  type TypeFilterProps,
  type SortProps,
  type PaginationProps,
} from "@/lib/transactions.utils";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";

type TransactionFilterAction =
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_TYPE_FILTER"; payload: "all" | "INCOME" | "EXPENSE" }
  | { type: "SET_CATEGORY_FILTER"; payload: string }
  | { type: "SET_DATE_PRESET"; payload: DatePreset }
  | { type: "SET_CUSTOM_DATE"; payload: Date }
  | { type: "SET_CUSTOM_RANGE"; payload: { from: Date; to: Date } }
  | { type: "SET_START_DATE"; payload: Date | undefined }
  | { type: "SET_END_DATE"; payload: Date | undefined }
  | { type: "SET_PAGE_SIZE"; payload: number }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SORT"; payload: "date" | "amount" }
  | { type: "CLEAR_FILTERS" };

const initialState: TransactionFilterState = {
  searchTerm: "",
  typeFilter: "all",
  categoryFilter: "all",
  datePreset: "this_month",
  startDate: undefined,
  endDate: undefined,
  currentPage: 1,
  pageSize: 10,
  sortField: "date",
  sortOrder: "desc",
};

const filterReducer = (
  state: TransactionFilterState,
  action: TransactionFilterAction,
): TransactionFilterState => {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload, currentPage: 1 };
    case "SET_TYPE_FILTER":
      return { ...state, typeFilter: action.payload, currentPage: 1 };
    case "SET_CATEGORY_FILTER":
      return { ...state, categoryFilter: action.payload, currentPage: 1 };
    case "SET_DATE_PRESET":
      return {
        ...state,
        datePreset: action.payload,
        startDate: undefined,
        endDate: undefined,
        currentPage: 1,
      };
    case "SET_CUSTOM_DATE": {
      const date = action.payload;
      return {
        ...state,
        datePreset: "custom_date",
        startDate: startOfDay(date),
        endDate: endOfDay(date),
        currentPage: 1,
      };
    }
    case "SET_CUSTOM_RANGE":
      return {
        ...state,
        datePreset: "custom_range",
        startDate: startOfDay(action.payload.from),
        endDate: endOfDay(action.payload.to),
        currentPage: 1,
      };
    case "SET_START_DATE":
      return { ...state, startDate: action.payload, datePreset: "custom_range", currentPage: 1 };
    case "SET_END_DATE":
      return { ...state, endDate: action.payload, datePreset: "custom_range", currentPage: 1 };
    case "SET_PAGE_SIZE":
      return { ...state, pageSize: action.payload, currentPage: 1 };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SORT":
      return {
        ...state,
        sortField: action.payload,
        sortOrder:
          state.sortField === action.payload
            ? state.sortOrder === "asc"
              ? "desc"
              : "asc"
            : "desc",
        currentPage: 1,
      };
    case "CLEAR_FILTERS":
      return {
        ...state,
        searchTerm: "",
        typeFilter: "all",
        categoryFilter: "all",
        datePreset: "this_month",
        startDate: undefined,
        endDate: undefined,
        currentPage: 1,
      };
  }
};

export const useTransactionFilters = () => {
  const [state, dispatch] = useReducer(filterReducer, initialState);
  const [searchInput, setSearchInput] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Tick that updates at midnight so relative date presets (today/this_month/etc.)
  // roll forward automatically without requiring a page reload.
  const [dateTick, setDateTick] = useState(() => startOfDay(new Date()).getTime());
  useEffect(() => {
    const msUntilMidnight = startOfDay(new Date(Date.now() + 86_400_000)).getTime() - Date.now();
    const timer = setTimeout(() => setDateTick(startOfDay(new Date()).getTime()), msUntilMidnight);
    return () => clearTimeout(timer);
  }, [dateTick]);

  useScrollToTopOnChange(state.currentPage, state.sortField, state.sortOrder);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      dispatch({ type: "SET_SEARCH_TERM", payload: searchInput });
    }, 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchInput]);

  const handleClearFilters = () => {
    setSearchInput("");
    dispatch({ type: "CLEAR_FILTERS" });
  };

  const queryParams = useMemo(() => buildQueryParams(state), [state, dateTick]);
  const infiniteQueryParams = useMemo(() => buildInfiniteQueryParams(state), [state, dateTick]);
  const activeFilters = hasActiveFilters(state);

  const dateFilterProps: DateFilterProps = useMemo(() => ({
    datePreset: state.datePreset,
    startDate: state.startDate,
    endDate: state.endDate,
    onDatePresetChange: (v: DatePreset) => dispatch({ type: "SET_DATE_PRESET", payload: v }),
    onCustomDateSelect: (d: Date) => dispatch({ type: "SET_CUSTOM_DATE", payload: d }),
    onCustomRangeSelect: (from: Date, to: Date) => dispatch({ type: "SET_CUSTOM_RANGE", payload: { from, to } }),
  }), [state.datePreset, state.startDate, state.endDate]);

  const searchProps: SearchProps = useMemo(() => ({
    searchTerm: searchInput,
    onSearchTermChange: setSearchInput,
  }), [searchInput]);

  const typeFilterProps: TypeFilterProps = useMemo(() => ({
    typeFilter: state.typeFilter,
    onTypeFilterChange: (v: "all" | "INCOME" | "EXPENSE") => dispatch({ type: "SET_TYPE_FILTER", payload: v }),
  }), [state.typeFilter]);

  const sortProps: SortProps = useMemo(() => ({
    sortField: state.sortField,
    sortOrder: state.sortOrder,
    onSort: (f: "date" | "amount") => dispatch({ type: "SORT", payload: f }),
  }), [state.sortField, state.sortOrder]);

  const paginationProps: PaginationProps = useMemo(() => ({
    currentPage: state.currentPage,
    pageSize: state.pageSize,
    onPageChange: (p: number) => dispatch({ type: "SET_CURRENT_PAGE", payload: p }),
    onPageSizeChange: (p: number) => dispatch({ type: "SET_PAGE_SIZE", payload: p }),
  }), [state.currentPage, state.pageSize]);

  const onCategoryFilterChange = useCallback(
    (v: string) => dispatch({ type: "SET_CATEGORY_FILTER", payload: v }),
    [],
  );

  return {
    state,
    queryParams,
    infiniteQueryParams,
    activeFilters,
    handleClearFilters,
    dateFilterProps,
    searchProps,
    typeFilterProps,
    sortProps,
    paginationProps,
    onCategoryFilterChange,
  };
};
