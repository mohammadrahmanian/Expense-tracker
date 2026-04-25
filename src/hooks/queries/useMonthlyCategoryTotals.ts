import { useQuery } from "@tanstack/react-query";
import { endOfMonth, startOfMonth } from "date-fns";
import { transactionsService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";
import type { Transaction } from "@/types";

/** Sum of amounts and transaction count per category for the current local month. */
export type MonthlyCategoryTotals = Record<
  string,
  { spent: number; count: number }
>;

/**
 * Resolves the current month range in the user's local timezone and serializes
 * the boundaries to ISO (UTC) strings so stored UTC timestamps are compared
 * against the user's local month. This is the single source of truth for the
 * month range used by {@link useMonthlyCategoryTotals}.
 */
export function getLocalMonthRange(now: Date = new Date()): {
  year: number;
  month: number;
  fromDate: string;
  toDate: string;
} {
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  return {
    year: start.getFullYear(),
    month: start.getMonth(),
    fromDate: start.toISOString(),
    toDate: end.toISOString(),
  };
}

async function fetchTransactionsInRange(
  fromDate: string,
  toDate: string,
): Promise<Transaction[]> {
  const limit = 500;
  const items: Transaction[] = [];
  let offset = 0;

  while (true) {
    const page = await transactionsService.getAll({
      fromDate,
      toDate,
      limit,
      offset,
      sort: "date",
      order: "desc",
    });
    items.push(...page.items);
    if (page.items.length < limit) break;
    offset += limit;
  }

  return items;
}

function aggregateByCategory(transactions: Transaction[]): MonthlyCategoryTotals {
  const map: MonthlyCategoryTotals = {};

  for (const t of transactions) {
    const id = t.categoryId;
    if (!map[id]) map[id] = { spent: 0, count: 0 };
    map[id].spent += t.amount;
    map[id].count += 1;
  }

  return map;
}

/**
 * Fetches all transactions in the current local-timezone month and aggregates
 * amount + count per categoryId. The month range is derived via
 * {@link getLocalMonthRange} so stored UTC timestamps map to the user's local
 * month for budget comparisons (no off-by-one for negative UTC offsets).
 */
export function useMonthlyCategoryTotals() {
  const { year, month, fromDate, toDate } = getLocalMonthRange();

  return useQuery({
    queryKey: queryKeys.categories.monthlyTotals(year, month),
    queryFn: async (): Promise<MonthlyCategoryTotals> => {
      const transactions = await fetchTransactionsInRange(fromDate, toDate);
      return aggregateByCategory(transactions);
    },
  });
}
