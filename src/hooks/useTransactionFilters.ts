import { useScrollToTopOnChange } from "@/hooks/useScrollToTopOnChange";
import {
  buildQueryParams,
  hasActiveFilters,
  TransactionFilterState,
} from "@/lib/transactions.utils";
import { useMemo, useReducer } from "react";

type TransactionFilterAction =
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_TYPE_FILTER"; payload: "all" | "INCOME" | "EXPENSE" }
  | { type: "SET_CATEGORY_FILTER"; payload: string }
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
  startDate: undefined,
  endDate: undefined,
  currentPage: 1,
  pageSize: 50,
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
    case "SET_START_DATE":
      return { ...state, startDate: action.payload, currentPage: 1 };
    case "SET_END_DATE":
      return { ...state, endDate: action.payload, currentPage: 1 };
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
        startDate: undefined,
        endDate: undefined,
        currentPage: 1,
      };
  }
};

export const useTransactionFilters = () => {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  useScrollToTopOnChange(state.currentPage, state.sortField, state.sortOrder);

  const queryParams = useMemo(() => buildQueryParams(state), [state]);
  const activeFilters = hasActiveFilters(state);

  return { state, dispatch, queryParams, activeFilters };
};
