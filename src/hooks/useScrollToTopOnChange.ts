import { useEffect, useRef } from "react";

export const useScrollToTopOnChange = (
  currentPage: number,
  sortField: string,
  sortOrder: string,
): void => {
  const prevPageRef = useRef(currentPage);
  const prevSortFieldRef = useRef(sortField);
  const prevSortOrderRef = useRef(sortOrder);

  useEffect(() => {
    const pageChanged = prevPageRef.current !== currentPage;
    const sortChanged =
      prevSortFieldRef.current !== sortField ||
      prevSortOrderRef.current !== sortOrder;

    if (pageChanged || sortChanged) {
      window.scrollTo(0, 0);
    }

    prevPageRef.current = currentPage;
    prevSortFieldRef.current = sortField;
    prevSortOrderRef.current = sortOrder;
  }, [currentPage, sortField, sortOrder]);
};
