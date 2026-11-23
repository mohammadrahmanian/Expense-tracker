import { useMemo } from "react";
import {
  calculatePageTotals,
  groupTransactionsByDate,
} from "@/lib/transactions.utils";
import type { MobileInfiniteData } from "./MobileTransactionsView.types";

export const useTransactionGroups = (infiniteData: MobileInfiniteData) => {
  const transactions = useMemo(
    () => infiniteData?.pages.flatMap((p) => p.items) ?? [],
    [infiniteData],
  );

  const totals = useMemo(
    () => calculatePageTotals(transactions),
    [transactions],
  );
  const groups = useMemo(
    () => groupTransactionsByDate(transactions),
    [transactions],
  );

  return { totals, groups };
};
