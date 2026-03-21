import axios from "axios";
import { apiClient } from "./api-client";
import { handleApiError } from "@/lib/error-handling";

export const authService = {
  login: async (
    email: string,
    password: string,
  ): Promise<{ user: any }> => {
    try {
      const response = await apiClient.post("/users/login", {
        email,
        password,
      });
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
  ): Promise<{ user: any }> => {
    try {
      const response = await apiClient.post("/users/register", {
        email,
        password,
        name,
      });
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
      // Log error silently - AuthContext handles this
      handleApiError(
        error,
        {
          action: "logout",
          feature: "AUTH",
        },
        { showToast: false },
      );
    }
  },

  getCurrentUser: async (): Promise<any> => {
    try {
      const response = await apiClient.get("/users/me");
      return response.data;
    } catch (error) {
      // 401 on /users/me is expected (session expiry check on app start) — skip Sentry and toast
      const is401 =
        axios.isAxiosError(error) && error.response?.status === 401;
      handleApiError(
        error,
        {
          action: "get current user",
          feature: "AUTH",
        },
        { showToast: !is401, reportToSentry: !is401 },
      );
      throw error;
    }
  },
};
