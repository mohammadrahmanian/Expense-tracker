import {
  Budget,
  Category,
  CategorySpending,
  DashboardStats,
  RecurringTransaction,
  ReportsResponse,
  Transaction,
} from "@/types";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { handleApiError } from "@/lib/error-handling";

// Navigation singleton for use outside React components
let navigationCallback: ((path: string) => void) | null = null;

export const setNavigationCallback = (callback: (path: string) => void) => {
  navigationCallback = callback;
};

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
  withCredentials: true, // Enable sending/receiving cookies in cross-origin requests
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
      // Only redirect if not already on auth pages
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        if (navigationCallback) {
          navigationCallback("/login");
        } else {
          // Fallback to window.location if navigation callback is not set
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

// Transactions Service
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
        {
          showToast: false,
          reportToSentry: false,
        },
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
        {
          showToast: false,
          reportToSentry: false,
        },
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
        {
          showToast: false,
          reportToSentry: false,
        },
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

// Categories Service
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
        {
          showToast: false,
          reportToSentry: false,
        },
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
        {
          showToast: false,
          reportToSentry: false,
        },
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
        {
          showToast: false,
          reportToSentry: false,
        },
      );
      throw error;
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
        {
          showToast: false,
          reportToSentry: false,
        },
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
        {
          showToast: false,
          reportToSentry: false,
        },
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
        {
          showToast: false,
          reportToSentry: false,
        },
      );
      throw error;
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
      handleApiError(error, {
        action: "fetch stats",
        feature: "DASHBOARD",
      });
      throw error;
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
      handleApiError(error, {
        action: "fetch monthly stats",
        feature: "DASHBOARD",
        metadata: { year, month },
      });
      throw error;
    }
  },

  getReports: async (
    startDate: string,
    endDate: string,
  ): Promise<ReportsResponse> => {
    try {
      const response = await apiClient.get<ReportsResponse>(
        `/dashboard/reports?startDate=${startDate}&endDate=${endDate}`,
      );
      return response.data;
    } catch (error) {
      handleApiError(error, {
        action: "fetch reports",
        feature: "REPORTS",
        metadata: { startDate, endDate },
      });
      throw error;
    }
  },

  getCategoryExpenses: async (): Promise<CategorySpending[]> => {
    // Get current month's transactions and categories
    // Note: Internal service calls handle their own errors (toast + Sentry)
    // No outer try-catch needed to avoid duplicate error handling
    const [transactionsResponse, categories] = await Promise.all([
      transactionsService.getAll(),
      categoriesService.getAll(),
    ]);

    const transactions = transactionsResponse.items;

    const now = new Date();
    const currentMonth = now.getUTCMonth();
    const currentYear = now.getUTCFullYear();

    // Filter transactions for current month and expenses only
    const currentMonthExpenses = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transaction.type === "EXPENSE" &&
        transactionDate.getUTCMonth() === currentMonth &&
        transactionDate.getUTCFullYear() === currentYear
      );
    });

    // Group expenses by category
    const categoryTotals = new Map<string, number>();
    currentMonthExpenses.forEach((transaction) => {
      const current = categoryTotals.get(transaction.categoryId) || 0;
      categoryTotals.set(transaction.categoryId, current + transaction.amount);
    });

    // Create CategorySpending array
    const categorySpending: CategorySpending[] = [];
    let totalExpenses = 0;

    categoryTotals.forEach((amount, categoryId) => {
      const category = categories.find((cat) => cat.id === categoryId);
      if (category && amount > 0) {
        categorySpending.push({
          categoryId: category.id,
          categoryName: category.name,
          amount,
          color: category.color,
          percentage: 0, // Will be calculated after we have the total
        });
        totalExpenses += amount;
      }
    });

    // Calculate percentages and sort by amount (descending)
    categorySpending.forEach((spending) => {
      spending.percentage =
        totalExpenses > 0 ? (spending.amount / totalExpenses) * 100 : 0;
    });

    categorySpending.sort((a, b) => b.amount - a.amount);

    // Take top 5 categories and group the rest into "Others"
    const top5Categories = categorySpending.slice(0, 5);
    const remainingCategories = categorySpending.slice(5);

    const result: CategorySpending[] = [...top5Categories];

    if (remainingCategories.length > 0) {
      const othersAmount = remainingCategories.reduce(
        (sum, cat) => sum + cat.amount,
        0,
      );
      const othersPercentage =
        totalExpenses > 0 ? (othersAmount / totalExpenses) * 100 : 0;

      result.push({
        categoryId: "others",
        categoryName: "Others",
        amount: othersAmount,
        color: "#6B7280", // Neutral gray color
        percentage: othersPercentage,
      });
    }

    return result;
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
      // Log error silently - AuthContext handles user notifications
      handleApiError(
        error,
        {
          action: "login",
          feature: "AUTH",
        },
        {
          showToast: false,
          reportToSentry: false,
        },
      );
      throw error;
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
      // Log error silently - AuthContext handles user notifications
      handleApiError(
        error,
        {
          action: "register",
          feature: "AUTH",
        },
        {
          showToast: false,
          reportToSentry: false,
        },
      );
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/users/logout");
    } catch (error) {
      // Even if logout fails on server, clear local token
      // Log error silently - AuthContext handles this
      handleApiError(
        error,
        {
          action: "logout",
          feature: "AUTH",
        },
        {
          showToast: false,
          reportToSentry: false,
        },
      );
    } finally {
      localStorage.removeItem("authToken");
    }
  },

  getCurrentUser: async (): Promise<any> => {
    try {
      const response = await apiClient.get("/users/me");
      return response.data;
    } catch (error) {
      handleApiError(error, {
        action: "get current user",
        feature: "AUTH",
      });
      throw error;
    }
  },
};

// Recurring Transactions Service
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
        {
          showToast: false,
          reportToSentry: false,
        },
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
        {
          showToast: false,
          reportToSentry: false,
        },
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
        {
          showToast: false,
          reportToSentry: false,
        },
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
        {
          showToast: false,
          reportToSentry: false,
        },
      );
      throw error;
    }
  },
};

// Export the configured axios instance for custom requests
export { apiClient };
