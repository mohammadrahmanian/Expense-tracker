import { Budget, Category, DashboardStats, Transaction } from "@/types";
import axios, { AxiosInstance, AxiosResponse } from "axios";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL environment variable is required. Please set it in your .env file (e.g., VITE_API_BASE_URL=http://localhost:4000/api)",
  );
}

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// API Error handling utility
const handleApiError = (error: any): never => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || "An error occurred";
    throw new Error(`${error.response.status}: ${message}`);
  } else if (error.request) {
    // Request was made but no response received
    throw new Error("Network error: No response from server");
  } else {
    // Something else happened
    throw new Error(error.message || "An unexpected error occurred");
  }
};

// Transactions Service
export const transactionsService = {
  getAll: async (): Promise<Transaction[]> => {
    try {
      const response = await apiClient.get<Transaction[]>("/transactions");
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getById: async (id: string): Promise<Transaction> => {
    try {
      const response = await apiClient.get<Transaction>(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
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
      handleApiError(error);
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
      handleApiError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/transactions/${id}`);
    } catch (error) {
      handleApiError(error);
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
      handleApiError(error);
    }
  },
};

// Categories Service
export const categoriesService = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get<Category[]>("/categories");
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getById: async (id: string): Promise<Category> => {
    try {
      const response = await apiClient.get<Category>(`/categories/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  create: async (
    category: Omit<Category, "id" | "createdAt" | "updatedAt" | "userId">,
  ): Promise<Category> => {
    try {
      const response = await apiClient.post<Category>("/categories", category);
      return response.data;
    } catch (error) {
      handleApiError(error);
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
      handleApiError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/categories/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },
};

// Budgets Service
export const budgetsService = {
  getAll: async (): Promise<Budget[]> => {
    try {
      const response = await apiClient.get<Budget[]>("/budgets");
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getById: async (id: string): Promise<Budget> => {
    try {
      const response = await apiClient.get<Budget>(`/budgets/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  create: async (budget: Omit<Budget, "id">): Promise<Budget> => {
    try {
      const response = await apiClient.post<Budget>("/budgets", budget);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  update: async (id: string, updates: Partial<Budget>): Promise<Budget> => {
    try {
      const response = await apiClient.put<Budget>(`/budgets/${id}`, updates);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/budgets/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },
};

// Dashboard Service
export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await apiClient.get<DashboardStats>("/dashboard/stats");
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getMonthlyStats: async (
    year: number,
    month: number,
  ): Promise<DashboardStats> => {
    try {
      const response = await apiClient.get<DashboardStats>(
        `/dashboard/stats/monthly?year=${year}&month=${month}`,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

// Auth Service
export const authService = {
  login: async (
    email: string,
    password: string,
  ): Promise<{ token: string; user: any }> => {
    try {
      const response = await apiClient.post("/users/login", {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  register: async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ token: string; user: any }> => {
    try {
      const response = await apiClient.post("/users/register", {
        email,
        password,
        name,
      });
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/users/logout/");
    } catch (error) {
      // Even if logout fails on server, clear local token
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("authToken");
    }
  },

  getCurrentUser: async (): Promise<any> => {
    try {
      const response = await apiClient.get("/users/me");
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

// Export the configured axios instance for custom requests
export { apiClient };
