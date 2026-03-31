import { startOfDay, endOfDay } from "date-fns";
import { useScrollToTopOnChange } from "@/hooks/useScrollToTopOnChange";
import {
  buildInfiniteQueryParams,
  buildQueryParams,
  DatePreset,
  hasActiveFilters,
  TransactionFilterState,
} from "@/lib/transactions.utils";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";

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

  const queryParams = useMemo(() => buildQueryParams(state), [state]);
  const infiniteQueryParams = useMemo(() => buildInfiniteQueryParams(state), [state]);
  const activeFilters = hasActiveFilters(state);

  return { state, dispatch, queryParams, infiniteQueryParams, activeFilters, searchInput, setSearchInput, handleClearFilters };
};
