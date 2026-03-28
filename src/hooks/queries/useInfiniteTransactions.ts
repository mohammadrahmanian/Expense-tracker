import { useInfiniteQuery } from "@tanstack/react-query";
import { transactionsService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";

type InfiniteTransactionParams = {
  limit?: number;
  sort?: "date" | "amount";
  order?: "asc" | "desc";
  type?: "INCOME" | "EXPENSE";
  fromDate?: string;
  toDate?: string;
  categoryId?: string;
  query?: string;
};

const PAGE_SIZE = 20;

export function useInfiniteTransactions(
  params?: InfiniteTransactionParams,
  enabled = true,
) {
  const { limit = PAGE_SIZE, ...filterParams } = params ?? {};

  return useInfiniteQuery({
    queryKey: queryKeys.transactions.infiniteList(filterParams),
    queryFn: ({ pageParam = 0 }) =>
      transactionsService.getAll({ ...filterParams, limit, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const nextOffset = (lastPageParam as number) + lastPage.count;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    enabled,
  });
}
