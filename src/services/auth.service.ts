import { apiClient } from "./api-client";
import { handleApiError } from "@/lib/error-handling";

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
        { showToast: false },
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
        { showToast: false },
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
        { showToast: false },
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
