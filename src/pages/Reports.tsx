import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HighchartsContainer } from "@/components/ui/highcharts-chart";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";
import { CategorySpending, MonthlyData } from "@/types";
import { useReports } from "@/hooks/queries/useReports";
import { useMemo } from "react";
import {
  endOfDay,
  endOfMonth,
  format,
  isAfter,
  startOfMonth,
  subMonths,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useState } from "react";

const getDateRangeForTimeRange = (
  range: "3m" | "6m" | "12m" | "custom",
  customStart?: Date,
  customEnd?: Date
): { startDate: string; endDate: string } => {
  if (range === "custom") {
    return {
      startDate: customStart ? format(customStart, "yyyy-MM-dd") : "",
      endDate: customEnd ? format(customEnd, "yyyy-MM-dd") : ""
    };
  }

  const monthsToSubtract = range === "3m" ? 3 : range === "6m" ? 6 : 12;
  const endDate = endOfMonth(new Date());
  const startDate = startOfMonth(subMonths(endDate, monthsToSubtract - 1));

  return {
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd")
  };
};

const Reports: React.FC = () => {
  const { formatAmount } = useCurrency();
  const [timeRange, setTimeRange] = useState<"3m" | "6m" | "12m" | "custom">("6m");
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  const [categoryBreakdownType, setCategoryBreakdownType] = useState<"expenses" | "income">("expenses");

  // Calculate date range based on time range selection
  // Keep this in component - it's UI state logic
  const dateRange = useMemo(() => {
    return getDateRangeForTimeRange(timeRange, customStartDate, customEndDate);
  }, [timeRange, customStartDate, customEndDate]);

  // Validate dates for custom range
  // Keep this in component - it's complex UI validation logic
  const datesAreValid = useMemo(() => {
    if (timeRange !== 'custom') return true;

    const { startDate, endDate } = dateRange;
    if (!startDate || !endDate) return false;

    const todaysEnd = endOfDay(new Date());
    const start = customStartDate!;
    const end = customEndDate!;

    // Check if dates are in the future
    if (isAfter(start, todaysEnd) || isAfter(end, todaysEnd)) return false;

    // Check date order
    if (isAfter(start, end)) return false;

    return true;
  }, [timeRange, dateRange, customStartDate, customEndDate]);

  // Fetch reports data with TanStack Query
  const {
    data: reportsData,
    isLoading,
    error: queryError,
    refetch,
  } = useReports({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    enabled: datesAreValid, // Only fetch when dates are valid
  });

  // Derive error message from validation or query error
  const error = useMemo(() => {
    if (timeRange === 'custom' && !datesAreValid) {
      if (!customStartDate || !customEndDate) {
        return 'Please select both start and end dates';
      }
      if (customStartDate && customEndDate) {
        const todaysEnd = endOfDay(new Date());
        if (isAfter(customStartDate, todaysEnd) || isAfter(customEndDate, todaysEnd)) {
          return 'Dates cannot be in the future';
        }
        if (isAfter(customStartDate, customEndDate)) {
          return 'End date must be the same as or after start date';
        }
      }
    }
    if (queryError) {
      return 'Failed to load reports. Please try again.';
    }
    return null;
  }, [timeRange, datesAreValid, customStartDate, customEndDate, queryError]);

  // Calculate percentages for category breakdown
  // Keep this in component - it's data transformation for display
  const categorySpending = useMemo(() => {
    if (!reportsData?.categoryBreakdown.expenses) return [];
    const total = reportsData.categoryBreakdown.expenses.reduce(
      (sum, cat) => sum + cat.amount,
      0
    );
    return reportsData.categoryBreakdown.expenses.map((cat) => ({
      ...cat,
      percentage: total > 0 ? (cat.amount / total) * 100 : 0,
    }));
  }, [reportsData]);

  const incomeByCategory = useMemo(() => {
    if (!reportsData?.categoryBreakdown.income) return [];
    const total = reportsData.categoryBreakdown.income.reduce(
      (sum, cat) => sum + cat.amount,
      0
    );
    return reportsData.categoryBreakdown.income.map((cat) => ({
      ...cat,
      percentage: total > 0 ? (cat.amount / total) * 100 : 0,
    }));
  }, [reportsData]);

  // Extract data for easier access in JSX
  const summary = reportsData?.summary ?? null;
  const monthlyData = reportsData?.monthlyData ?? [];

  const buildCategorySeriesData = (
    monthlyData: MonthlyData[],
    categoryBreakdown: CategorySpending[],
    type: "income" | "expenses"
  ) => {
    // Build series for each category
    const series = categoryBreakdown.map(category => ({
      name: category.categoryName,
      type: "column" as const,
      data: monthlyData.map(month => {
        const categories = type === "income" ? month.income.categories : month.expenses.categories;
        return categories[category.categoryId] || 0;
      }),
      color: category.color,
    }));

    return series;
  };

  return (
    <DashboardLayout>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-end md:items-center">
          <Select
            value={timeRange}
            onValueChange={(value: "3m" | "6m" | "12m" | "custom") => setTimeRange(value)}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>

          {timeRange === "custom" && (
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full md:w-[200px] justify-start text-left font-normal",
                      !customStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customStartDate ? format(customStartDate, "PPP") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={customStartDate}
                    onSelect={setCustomStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <span className="text-muted-foreground">to</span>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full md:w-[200px] justify-start text-left font-normal",
                      !customEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customEndDate ? format(customEndDate, "PPP") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={customEndDate}
                    onSelect={setCustomEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <Button
                onClick={() => refetch()}
                variant="link"
                size="sm"
                className="underline hover:no-underline"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid gap-3 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Income
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {isLoading ? "..." : formatAmount(summary?.totalIncome || 0)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Expenses
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {isLoading ? "..." : formatAmount(summary?.totalExpenses || 0)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Net Savings
                </p>
                <p
                  className={`text-2xl font-bold ${(summary?.netSavings || 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {isLoading ? "..." : formatAmount(summary?.netSavings || 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts - 3 Column Layout */}
        <div className="grid gap-3 md:grid-cols-3">
          {/* Income vs Expenses Trend */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base font-semibold">Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {monthlyData.length > 0 ? (
                <HighchartsContainer
                  className="w-full"
                  options={{
                    chart: {
                      type: "spline",
                    },
                    title: {
                      text: undefined,
                    },
                    xAxis: {
                      categories: monthlyData.map((d) => d.monthLabel || d.month),
                      labels: {
                        style: {
                          fontSize: '10px',
                        },
                      },
                    },
                    yAxis: {
                      title: {
                        text: undefined,
                      },
                      labels: {
                        style: {
                          fontSize: '10px',
                        },
                      },
                    },
                    series: [
                      {
                        name: "Income",
                        type: "spline",
                        data: monthlyData.map((d) => d.income.total),
                        color: "#00B894",
                        lineWidth: 3,
                      },
                      {
                        name: "Expenses",
                        type: "spline",
                        data: monthlyData.map((d) => d.expenses.total),
                        color: "#FF6B6B",
                        lineWidth: 3,
                      },
                      {
                        name: "Savings",
                        type: "spline",
                        data: monthlyData.map((d) => d.savings),
                        color: "#6C5CE7",
                        lineWidth: 3,
                      },
                    ],
                    tooltip: {
                      formatter: function () {
                        return `<b>${this.series.name}</b><br/>${formatAmount(this.y || 0)}`;
                      },
                    },
                    legend: {
                      enabled: true,
                      itemStyle: {
                        fontSize: '10px',
                      },
                    },
                    plotOptions: {
                      spline: {
                        lineWidth: 3,
                        marker: {
                          enabled: true,
                          radius: 4,
                          lineWidth: 2,
                          lineColor: "#FFFFFF",
                        },
                        states: {
                          hover: {
                            lineWidth: 4,
                          },
                        },
                      },
                    },
                  }}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No data available for the selected time range.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Breakdown Over Time */}
          <Card>
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  {categoryBreakdownType === "expenses"
                    ? "Expense Categories"
                    : "Income Sources"}
                </CardTitle>
                <Select
                  value={categoryBreakdownType}
                  onValueChange={(value: "expenses" | "income") => setCategoryBreakdownType(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expenses">Expenses</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {monthlyData.length > 0 &&
               ((categoryBreakdownType === "expenses" && categorySpending.length > 0) ||
                (categoryBreakdownType === "income" && incomeByCategory.length > 0)) ? (
                <HighchartsContainer
                  className="w-full"
                  options={{
                    chart: {
                      type: "column",
                    },
                    title: {
                      text: undefined,
                    },
                    xAxis: {
                      categories: monthlyData.map((d) => d.monthLabel || d.month),
                      labels: {
                        style: {
                          fontSize: '10px',
                        },
                      },
                    },
                    yAxis: {
                      title: {
                        text: undefined,
                      },
                      labels: {
                        style: {
                          fontSize: '10px',
                        },
                      },
                    },
                    plotOptions: {
                      column: {
                        stacking: "normal",
                        borderWidth: 0,
                      },
                    },
                    series: buildCategorySeriesData(
                      monthlyData,
                      categoryBreakdownType === "expenses" ? categorySpending : incomeByCategory,
                      categoryBreakdownType
                    ),
                    tooltip: {
                      formatter: function () {
                        return `<b>${this.series.name}</b><br/>${formatAmount(this.y || 0)}`;
                      },
                    },
                    legend: {
                      enabled: true,
                      itemStyle: {
                        fontSize: '10px',
                      },
                    },
                  }}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    {categoryBreakdownType === "expenses"
                      ? "No expense data available."
                      : "No income data available."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Comparison */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base font-semibold">Monthly Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {monthlyData.length > 0 ? (
                <HighchartsContainer
                  className="w-full"
                  options={{
                    chart: {
                      type: "column",
                    },
                    title: {
                      text: undefined,
                    },
                    xAxis: {
                      categories: monthlyData.map((d) => d.monthLabel || d.month),
                      labels: {
                        style: {
                          fontSize: '10px',
                        },
                      },
                    },
                    yAxis: {
                      title: {
                        text: undefined,
                      },
                      labels: {
                        style: {
                          fontSize: '10px',
                        },
                      },
                    },
                    series: [
                      {
                        name: "Income",
                        type: "column",
                        data: monthlyData.map((d) => d.income.total),
                        color: "#00B894",
                      },
                      {
                        name: "Expenses",
                        type: "column",
                        data: monthlyData.map((d) => d.expenses.total),
                        color: "#FF6B6B",
                      },
                    ],
                    tooltip: {
                      formatter: function () {
                        return `<b>${this.series.name}</b><br/>${formatAmount(this.y || 0)}`;
                      },
                    },
                    legend: {
                      enabled: true,
                      itemStyle: {
                        fontSize: '10px',
                      },
                    },
                    plotOptions: {
                      column: {
                        borderWidth: 0,
                      },
                    },
                  }}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No data available for the selected time range.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pie Charts - 2 Column Layout */}
        <div className="grid gap-3 md:grid-cols-2">
          {/* Expense Breakdown */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base font-semibold">Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {categorySpending.length > 0 ? (
                <div className="space-y-3">
                  <HighchartsContainer
                    className="w-full h-[320px]"
                    options={{
                      chart: {
                        type: "pie",
                      },
                      title: {
                        text: undefined,
                      },
                      series: [
                        {
                          name: "Expenses",
                          type: "pie",
                          data: categorySpending.map((item) => ({
                            name: item.categoryName,
                            y: item.amount,
                            color: item.color,
                          })),
                          innerSize: "40%",
                          dataLabels: {
                            enabled: false,
                          },
                        },
                      ],
                      tooltip: {
                        formatter: function () {
                          return `<b>${this.key}</b><br/>${formatAmount(this.y || 0)} (${this.percentage?.toFixed(1)}%)`;
                        },
                      },
                      legend: {
                        enabled: false,
                      },
                      plotOptions: {
                        pie: {
                          allowPointSelect: true,
                          cursor: "pointer",
                          borderWidth: 0,
                        },
                      },
                    }}
                  />
                  <div className="space-y-2">
                    {categorySpending.map((item) => (
                      <div
                        key={item.categoryId}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.categoryName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">
                            {(item.percentage ?? 0).toFixed(1)}%
                          </Badge>
                          <span className="text-sm font-medium">
                            {formatAmount(item.amount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No expense data available.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Income Breakdown */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base font-semibold">Income Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {incomeByCategory.length > 0 ? (
                <div className="space-y-3">
                  <HighchartsContainer
                    className="w-full h-[320px]"
                    options={{
                      chart: {
                        type: "pie",
                      },
                      title: {
                        text: undefined,
                      },
                      series: [
                        {
                          name: "Income",
                          type: "pie",
                          data: incomeByCategory.map((item) => ({
                            name: item.categoryName,
                            y: item.amount,
                            color: item.color,
                          })),
                          innerSize: "40%",
                          dataLabels: {
                            enabled: false,
                          },
                        },
                      ],
                      tooltip: {
                        formatter: function () {
                          return `<b>${this.key}</b><br/>${formatAmount(this.y || 0)} (${this.percentage?.toFixed(1)}%)`;
                        },
                      },
                      legend: {
                        enabled: false,
                      },
                      plotOptions: {
                        pie: {
                          allowPointSelect: true,
                          cursor: "pointer",
                          borderWidth: 0,
                        },
                      },
                    }}
                  />
                  <div className="space-y-2">
                    {incomeByCategory.map((item) => (
                      <div
                        key={item.categoryId}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.categoryName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">
                            {(item.percentage ?? 0).toFixed(1)}%
                          </Badge>
                          <span className="text-sm font-medium">
                            {formatAmount(item.amount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No income data available.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
