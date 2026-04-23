import { useQuery } from "@tanstack/react-query";
import { transactionsService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";
import type { Transaction } from "@/types";

/** Sum of amounts and transaction count per category for the current UTC month. */
export type MonthlyCategoryTotals = Record<
  string,
  { spent: number; count: number }
>;

function currentUtcYearMonth(): { year: number; month: number } {
  const now = new Date();
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() };
}

function monthRangeIso(year: number, month: number): {
  fromDate: string;
  toDate: string;
} {
  const from = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
  const to = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
  return { fromDate: from.toISOString(), toDate: to.toISOString() };
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
 * Fetches all transactions in the current UTC month and aggregates amount + count per categoryId.
 */
export function useMonthlyCategoryTotals() {
  const { year, month } = currentUtcYearMonth();

  return useQuery({
    queryKey: queryKeys.categories.monthlyTotals(year, month),
    queryFn: async (): Promise<MonthlyCategoryTotals> => {
      const { fromDate, toDate } = monthRangeIso(year, month);
      const transactions = await fetchTransactionsInRange(fromDate, toDate);
      return aggregateByCategory(transactions);
    },
  });
}
