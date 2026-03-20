import { Category } from "@/types";
import { apiClient } from "./api-client";
import { handleApiError } from "@/lib/error-handling";

export const categoriesService = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get<Category[]>("/categories");
      return response.data;
    } catch (error) {
      handleApiError(error, {
        action: "fetch categories",
        feature: "CATEGORIES",
      });
      throw error;
    }
  },

  getById: async (id: string): Promise<Category> => {
    try {
      const response = await apiClient.get<Category>(`/categories/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, {
        action: "fetch category",
        feature: "CATEGORIES",
        metadata: { categoryId: id },
      });
      throw error;
    }
  },

  create: async (
    category: Omit<Category, "id" | "createdAt" | "updatedAt" | "userId">,
  ): Promise<Category> => {
    try {
      const response = await apiClient.post<Category>("/categories", category);
      return response.data;
    } catch (error) {
      // Log error silently - mutation hook handles user notifications
      handleApiError(
        error,
        {
          action: "create category",
          feature: "CATEGORIES",
        },
        { showToast: false },
      );
      throw error;
    }
  },

  update: async (id: string, updates: Partial<Category>): Promise<Category> => {
    try {
      const response = await apiClient.put<Category>(
        `/categories/${id}`,
        updates,
      );
      return response.data;
    } catch (error) {
      // Log error silently - mutation hook handles user notifications
      handleApiError(
        error,
        {
          action: "update category",
          feature: "CATEGORIES",
          metadata: { categoryId: id },
        },
        { showToast: false },
      );
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/categories/${id}`);
    } catch (error) {
      // Log error silently - mutation hook handles user notifications
      handleApiError(
        error,
        {
          action: "delete category",
          feature: "CATEGORIES",
          metadata: { categoryId: id },
        },
        { showToast: false },
      );
      throw error;
    }
  },
};
