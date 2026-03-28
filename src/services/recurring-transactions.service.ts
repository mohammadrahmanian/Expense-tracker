import { RecurringTransaction } from "@/types";
import { apiClient } from "./api-client";
import { handleApiError } from "@/lib/error-handling";

export const recurringTransactionsService = {
  getAll: async (): Promise<RecurringTransaction[]> => {
    try {
      const response = await apiClient.get<{
        recurringTransactions: RecurringTransaction[];
      }>("/recurring-transactions");
      return response.data.recurringTransactions;
    } catch (error) {
      handleApiError(error, {
        action: "fetch recurring transactions",
        feature: "RECURRING",
      });
      throw error;
    }
  },

  createRecurring: async (data: {
    title: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    categoryId: string;
    startDate: string;
    endDate?: string;
    description?: string;
    recurrenceFrequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  }): Promise<RecurringTransaction> => {
    try {
      const response = await apiClient.post<RecurringTransaction>(
        "/recurring-transactions",
        data,
      );
      return response.data;
    } catch (error) {
      // Log error silently - mutation hook handles user notifications
      handleApiError(
        error,
        {
          action: "create recurring transaction",
          feature: "RECURRING",
        },
        { showToast: false },
      );
      throw error;
    }
  },

  update: async (
    id: string,
    data: Partial<RecurringTransaction>,
  ): Promise<void> => {
    try {
      await apiClient.put(`/recurring-transactions/${id}`, data);
    } catch (error) {
      // Log error silently - mutation hook handles user notifications
      handleApiError(
        error,
        {
          action: "update recurring transaction",
          feature: "RECURRING",
          metadata: { recurringTransactionId: id },
        },
        { showToast: false },
      );
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/recurring-transactions/${id}`);
    } catch (error) {
      // Log error silently - mutation hook handles user notifications
      handleApiError(
        error,
        {
          action: "delete recurring transaction",
          feature: "RECURRING",
          metadata: { recurringTransactionId: id },
        },
        { showToast: false },
      );
      throw error;
    }
  },

  toggleStatus: async (id: string, active: boolean): Promise<void> => {
    try {
      await apiClient.post(`/recurring-transactions/${id}/toggle`, { active });
    } catch (error) {
      // Log error silently - mutation hook handles user notifications
      handleApiError(
        error,
        {
          action: "toggle recurring transaction",
          feature: "RECURRING",
          metadata: { recurringTransactionId: id, active },
        },
        { showToast: false },
      );
      throw error;
    }
  },
};
