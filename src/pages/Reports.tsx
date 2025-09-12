import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HighchartsContainer } from "@/components/ui/highcharts-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency } from "@/contexts/CurrencyContext";
import { categoriesService, transactionsService } from "@/services/api";
import { Category, CategorySpending, MonthlyData, Transaction } from "@/types";
import {
  eachMonthOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
} from "date-fns";
import React, { useEffect, useState } from "react";

const Reports: React.FC = () => {
  const { formatAmount } = useCurrency();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [timeRange, setTimeRange] = useState<"3m" | "6m" | "12m">("6m");
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>(
    [],
  );
  const [incomeByCategory, setIncomeByCategory] = useState<CategorySpending[]>(
    [],
  );

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    processChartData();
  }, [transactions, categories, timeRange]);

  const loadData = async () => {
    const allTransactions = await transactionsService.getAll();
    const allCategories = await categoriesService.getAll();
    setTransactions(allTransactions);
    setCategories(allCategories);
  };

  const processChartData = () => {
    const months = getMonthsForRange(timeRange);

    // Process monthly data
    const monthlyStats = months.map((month) => {
      const monthTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate >= startOfMonth(month) &&
          transactionDate <= endOfMonth(month)
        );
      });

      const income = monthTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month: format(month, "MMM yyyy"),
        income,
        expenses,
        savings: income - expenses,
      };
    });

    setMonthlyData(monthlyStats);

    // Process category spending (expenses only)
    const expenseCategories = categories.filter(
      (cat) => cat.type === "EXPENSE",
    );
    const expenseSpending = expenseCategories
      .map((category) => {
        const amount = transactions
          .filter((t) => t.type === "EXPENSE" && t.categoryId === category.id)
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          categoryId: category.id,
          categoryName: category.name,
          amount,
          color: category.color,
          percentage: 0, // Will be calculated below
        };
      })
      .filter((item) => item.amount > 0);

    const totalExpenses = expenseSpending.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const spendingWithPercentages = expenseSpending.map((item) => ({
      ...item,
      percentage: totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0,
    }));

    setCategorySpending(spendingWithPercentages);

    // Process income by category
    const incomeCategories = categories.filter((cat) => cat.type === "INCOME");
    const incomeByCategory = incomeCategories
      .map((category) => {
        const amount = transactions
          .filter((t) => t.type === "INCOME" && t.categoryId === category.id)
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          categoryId: category.id,
          categoryName: category.name,
          amount,
          color: category.color,
          percentage: 0,
        };
      })
      .filter((item) => item.amount > 0);

    const totalIncome = incomeByCategory.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const incomeWithPercentages = incomeByCategory.map((item) => ({
      ...item,
      percentage: totalIncome > 0 ? (item.amount / totalIncome) * 100 : 0,
    }));

    setIncomeByCategory(incomeWithPercentages);
  };

  const getMonthsForRange = (range: "3m" | "6m" | "12m") => {
    const monthsToSubtract = range === "3m" ? 3 : range === "6m" ? 6 : 12;
    const endDate = new Date();
    const startDate = subMonths(endDate, monthsToSubtract - 1);
    return eachMonthOfInterval({ start: startDate, end: endDate });
  };

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpenses;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-end items-center">
          <Select
            value={timeRange}
            onValueChange={(value: "3m" | "6m" | "12m") => setTimeRange(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Income
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {formatAmount(totalIncome)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Expenses
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {formatAmount(totalExpenses)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Net Savings
                </p>
                <p
                  className={`text-3xl font-bold ${currentBalance >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatAmount(currentBalance)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <HighchartsContainer
                className="w-full h-[420px]"
                options={{
                  chart: {
                    type: "spline",
                  },
                  title: {
                    text: undefined,
                  },
                  xAxis: {
                    categories: monthlyData.map((d) => d.month),
                  },
                  yAxis: {
                    title: {
                      text: "Amount",
                    },
                  },
                  series: [
                    {
                      name: "Income",
                      type: "spline",
                      data: monthlyData.map((d) => d.income),
                      color: "#00B894",
                      lineWidth: 3,
                    },
                    {
                      name: "Expenses",
                      type: "spline",
                      data: monthlyData.map((d) => d.expenses),
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

        {/* Monthly Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <HighchartsContainer
                className="w-full h-[420px]"
                options={{
                  chart: {
                    type: "column",
                  },
                  title: {
                    text: undefined,
                  },
                  xAxis: {
                    categories: monthlyData.map((d) => d.month),
                  },
                  yAxis: {
                    title: {
                      text: "Amount",
                    },
                  },
                  series: [
                    {
                      name: "Income",
                      type: "column",
                      data: monthlyData.map((d) => d.income),
                      color: "#00B894",
                    },
                    {
                      name: "Expenses",
                      type: "column",
                      data: monthlyData.map((d) => d.expenses),
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

        <div className="grid gap-6 md:grid-cols-2">
          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {categorySpending.length > 0 ? (
                <div className="space-y-4">
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
                          return `<b>${this.point.name}</b><br/>${formatAmount(this.y || 0)} (${this.percentage?.toFixed(1)}%)`;
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
                            {item.percentage.toFixed(1)}%
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
            <CardHeader>
              <CardTitle>Income Breakdown by Source</CardTitle>
            </CardHeader>
            <CardContent>
              {incomeByCategory.length > 0 ? (
                <div className="space-y-4">
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
                          return `<b>${this.point.name}</b><br/>${formatAmount(this.y || 0)} (${this.percentage?.toFixed(1)}%)`;
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
                            {item.percentage.toFixed(1)}%
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
