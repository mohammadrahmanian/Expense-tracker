import { Transaction } from "@/types";
import { apiClient } from "./api-client";
import { handleApiError } from "@/lib/error-handling";

export const transactionsService = {
  getAll: async (params?: {
    limit?: number;
    offset?: number;
    sort?: "date" | "amount";
    order?: "asc" | "desc";
    type?: "INCOME" | "EXPENSE";
    fromDate?: string;
    toDate?: string;
    categoryId?: string;
    query?: string;
  }): Promise<{ items: Transaction[]; total: number; count: number }> => {
    try {
      const queryParams = new URLSearchParams();

      if (params) {
        if (params.limit !== undefined)
          queryParams.append("limit", params.limit.toString());
        if (params.offset !== undefined)
          queryParams.append("offset", params.offset.toString());
        if (params.sort) queryParams.append("sort", params.sort);
        if (params.order) queryParams.append("order", params.order);
        if (params.type) queryParams.append("type", params.type);
        if (params.fromDate) queryParams.append("fromDate", params.fromDate);
        if (params.toDate) queryParams.append("toDate", params.toDate);
        if (params.categoryId)
          queryParams.append("categoryId", params.categoryId);
        if (params.query) queryParams.append("query", params.query);
      }

      const queryString = queryParams.toString();
      const url = queryString
        ? `/transactions?${queryString}`
        : "/transactions";

      const response = await apiClient.get<{
        items: Transaction[];
        total: number;
        count: number;
      }>(url);
      return response.data;
    } catch (error) {
      handleApiError(error, {
        action: "fetch transactions",
        feature: "TRANSACTIONS",
      });
      throw error;
    }
  },

  getById: async (id: string): Promise<Transaction> => {
    try {
      const response = await apiClient.get<Transaction>(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, {
        action: "fetch transaction",
        feature: "TRANSACTIONS",
        metadata: { transactionId: id },
      });
      throw error;
    }
  },

  create: async (
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "userId">,
  ): Promise<Transaction> => {
    try {
      const response = await apiClient.post<Transaction>(
        "/transactions",
        transaction,
      );
      return response.data;
    } catch (error) {
      // Log error silently - mutation hook handles user notifications
      handleApiError(
        error,
        {
          action: "create transaction",
          feature: "TRANSACTIONS",
        },
        { showToast: false },
      );
      throw error;
    }
  },

  update: async (
    id: string,
    updates: Partial<Transaction>,
  ): Promise<Transaction> => {
    try {
      const response = await apiClient.put<Transaction>(
        `/transactions/${id}`,
        updates,
      );
      return response.data;
    } catch (error) {
      // Log error silently - mutation hook handles user notifications
      handleApiError(
        error,
        {
          action: "update transaction",
          feature: "TRANSACTIONS",
          metadata: { transactionId: id },
        },
        { showToast: false },
      );
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/transactions/${id}`);
    } catch (error) {
      // Log error silently - mutation hook handles user notifications
      handleApiError(
        error,
        {
          action: "delete transaction",
          feature: "TRANSACTIONS",
          metadata: { transactionId: id },
        },
        { showToast: false },
      );
      throw error;
    }
  },

  getByDateRange: async (
    startDate: string,
    endDate: string,
  ): Promise<Transaction[]> => {
    try {
      const response = await apiClient.get<Transaction[]>(
        `/transactions/date-range?start=${startDate}&end=${endDate}`,
      );
      return response.data;
    } catch (error) {
      handleApiError(error, {
        action: "fetch transactions by date range",
        feature: "TRANSACTIONS",
        metadata: { startDate, endDate },
      });
      throw error;
    }
  },
};
