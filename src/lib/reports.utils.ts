import {
  endOfDay,
  endOfMonth,
  format,
  isAfter,
  startOfMonth,
  subMonths,
} from "date-fns";
import { type CategorySpending, type MonthlyData } from "@/types";

export type TimeRangeValue = "3m" | "6m" | "12m" | "custom";

export const getDateRangeForTimeRange = (
  range: TimeRangeValue,
  customStart?: Date,
  customEnd?: Date,
): { startDate: string; endDate: string } => {
  if (range === "custom") {
    return {
      startDate: customStart ? format(customStart, "yyyy-MM-dd") : "",
      endDate: customEnd ? format(customEnd, "yyyy-MM-dd") : "",
    };
  }

  const monthsToSubtract = range === "3m" ? 3 : range === "6m" ? 6 : 12;
  const endDate = endOfMonth(new Date());
  const startDate = startOfMonth(subMonths(endDate, monthsToSubtract - 1));

  return {
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  };
};

export const validateDateRange = (
  timeRange: TimeRangeValue,
  customStartDate: Date | undefined,
  customEndDate: Date | undefined,
  dateRange: { startDate: string; endDate: string },
): { isValid: boolean; error: string | null } => {
  if (timeRange !== "custom") return { isValid: true, error: null };

  // Check both string representation and Date objects
  if (!dateRange.startDate || !dateRange.endDate || !customStartDate || !customEndDate) {
    return { isValid: false, error: "Please select both start and end dates" };
  }

  const todaysEnd = endOfDay(new Date());
  // Now we can safely use customStartDate and customEndDate
  if (isAfter(customStartDate, todaysEnd) || isAfter(customEndDate, todaysEnd)) {
    return { isValid: false, error: "Dates cannot be in the future" };
  }

  // Apply endOfDay to end date for proper comparison
  const endWithTime = endOfDay(customEndDate);
  if (isAfter(customStartDate, endWithTime)) {
    return { isValid: false, error: "End date must be the same as or after start date" };
  }

  return { isValid: true, error: null };
};

export const addCategoryPercentages = (
  categories: CategorySpending[] | undefined,
): CategorySpending[] => {
  if (!categories) return [];
  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
  return categories.map((cat) => ({
    ...cat,
    percentage: total > 0 ? (cat.amount / total) * 100 : 0,
  }));
};

export const buildCategorySeriesData = (
  monthlyData: MonthlyData[],
  categoryBreakdown: CategorySpending[],
  type: "income" | "expenses",
) => {
  return categoryBreakdown.map((category) => ({
    name: category.categoryName,
    type: "column" as const,
    data: monthlyData.map((month) => {
      const categories =
        type === "income"
          ? month.income.categories
          : month.expenses.categories;
      return categories[category.categoryId] || 0;
    }),
    color: category.color,
  }));
};
