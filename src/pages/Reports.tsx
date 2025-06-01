import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { transactionsService, categoriesService } from "@/services/api";
import { Transaction, Category, CategorySpending, MonthlyData } from "@/types";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  subMonths,
} from "date-fns";

const Reports: React.FC = () => {
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

  const loadData = () => {
    const allTransactions = transactionsService.getAll();
    const allCategories = categoriesService.getAll();
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
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter((t) => t.type === "expense")
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
      (cat) => cat.type === "expense",
    );
    const expenseSpending = expenseCategories
      .map((category) => {
        const amount = transactions
          .filter((t) => t.type === "expense" && t.categoryId === category.id)
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
    const incomeCategories = categories.filter((cat) => cat.type === "income");
    const incomeByCategory = incomeCategories
      .map((category) => {
        const amount = transactions
          .filter((t) => t.type === "income" && t.categoryId === category.id)
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
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpenses;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reports & Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Detailed insights into your financial patterns.
            </p>
          </div>
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
                  ${totalIncome.toLocaleString()}
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
                  ${totalExpenses.toLocaleString()}
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
                  ${currentBalance.toLocaleString()}
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
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [
                      `$${value.toLocaleString()}`,
                      "",
                    ]}
                    labelStyle={{ color: "black" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#00B894"
                    strokeWidth={3}
                    name="Income"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#FF6B6B"
                    strokeWidth={3}
                    name="Expenses"
                  />
                  <Line
                    type="monotone"
                    dataKey="savings"
                    stroke="#6C5CE7"
                    strokeWidth={3}
                    name="Savings"
                  />
                </LineChart>
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [
                      `$${value.toLocaleString()}`,
                      "",
                    ]}
                    labelStyle={{ color: "black" }}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#00B894" name="Income" />
                  <Bar dataKey="expenses" fill="#FF6B6B" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
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
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={categorySpending}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="amount"
                      >
                        {categorySpending.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [
                          `$${value.toLocaleString()}`,
                          "Amount",
                        ]}
                        labelStyle={{ color: "black" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
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
                            ${item.amount.toLocaleString()}
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
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={incomeByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="amount"
                      >
                        {incomeByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [
                          `$${value.toLocaleString()}`,
                          "Amount",
                        ]}
                        labelStyle={{ color: "black" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
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
                            ${item.amount.toLocaleString()}
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
