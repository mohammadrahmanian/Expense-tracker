import { Budget } from "@/types";
import { apiClient } from "./api-client";
import { handleApiError } from "@/lib/error-handling";

export const budgetsService = {
  getAll: async (): Promise<Budget[]> => {
    try {
      const response = await apiClient.get<Budget[]>("/budgets");
      return response.data;
    } catch (error) {
      handleApiError(error, {
        action: "fetch budgets",
        feature: "BUDGETS",
      });
      throw error;
    }
  },

  getById: async (id: string): Promise<Budget> => {
    try {
      const response = await apiClient.get<Budget>(`/budgets/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, {
        action: "fetch budget",
        feature: "BUDGETS",
        metadata: { budgetId: id },
      });
      throw error;
    }
  },

  create: async (budget: Omit<Budget, "id">): Promise<Budget> => {
    try {
      const response = await apiClient.post<Budget>("/budgets", budget);
      return response.data;
    } catch (error) {
      // Log error silently - mutation hook handles user notifications
      handleApiError(
        error,
        {
          action: "create budget",
          feature: "BUDGETS",
        },
        { showToast: false },
      );
      throw error;
    }
  },

  update: async (id: string, updates: Partial<Budget>): Promise<Budget> => {
    try {
      const response = await apiClient.put<Budget>(`/budgets/${id}`, updates);
      return response.data;
    } catch (error) {
      // Log error silently - mutation hook handles user notifications
      handleApiError(
        error,
        {
          action: "update budget",
          feature: "BUDGETS",
          metadata: { budgetId: id },
        },
        { showToast: false },
      );
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/budgets/${id}`);
    } catch (error) {
      // Log error silently - mutation hook handles user notifications
      handleApiError(
        error,
        {
          action: "delete budget",
          feature: "BUDGETS",
          metadata: { budgetId: id },
        },
        { showToast: false },
      );
      throw error;
    }
  },
};
