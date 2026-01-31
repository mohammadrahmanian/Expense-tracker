/**
 * Centralized React Query key factories for type-safe cache management.
 *
 * Following React Query best practices for hierarchical query keys.
 * Each entity has a factory with methods for different query variations.
 *
 * @see https://tanstack.com/query/latest/docs/react/guides/query-keys
 */

// Type helpers for query parameters
export type TransactionQueryParams = {
  limit?: number;
  offset?: number;
  type?: 'INCOME' | 'EXPENSE';
};

/**
 * Query key factories organized by entity.
 *
 * Structure:
 * - all: Base key for the entity
 * - lists: Key for list queries
 * - list: Key for specific list with params
 * - details: Key for detail queries
 * - detail: Key for specific detail by ID
 */
export const queryKeys = {
  /**
   * Transaction query keys
   */
  transactions: {
    all: ['transactions'] as const,
    lists: () => [...queryKeys.transactions.all, 'list'] as const,
    list: (params?: TransactionQueryParams) =>
      [...queryKeys.transactions.lists(), params] as const,
    details: () => [...queryKeys.transactions.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.transactions.details(), id] as const,
  },

  /**
   * Category query keys
   */
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: (type?: 'INCOME' | 'EXPENSE') =>
      [...queryKeys.categories.lists(), { type }] as const,
    details: () => [...queryKeys.categories.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },

  /**
   * Dashboard query keys
   */
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
    categoryExpenses: () =>
      [...queryKeys.dashboard.all, 'category-expenses'] as const,
    monthlyStats: (year: number, month: number) =>
      [...queryKeys.dashboard.all, 'monthly-stats', { year, month }] as const,
  },

  /**
   * Recurring transaction query keys
   */
  recurringTransactions: {
    all: ['recurring-transactions'] as const,
    lists: () => [...queryKeys.recurringTransactions.all, 'list'] as const,
    details: () => [...queryKeys.recurringTransactions.all, 'detail'] as const,
    detail: (id: string) =>
      [...queryKeys.recurringTransactions.details(), id] as const,
  },

  /**
   * Reports query keys
   */
  reports: {
    all: ['reports'] as const,
    lists: () => [...queryKeys.reports.all, 'list'] as const,
    list: (params: { startDate: string; endDate: string }) =>
      [...queryKeys.reports.lists(), params] as const,
  },
} as const;
