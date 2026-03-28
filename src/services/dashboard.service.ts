import { DashboardStats, ReportsResponse } from "@/types";
import { apiClient } from "./api-client";
import { handleApiError } from "@/lib/error-handling";

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
};
