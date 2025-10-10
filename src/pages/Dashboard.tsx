import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HighchartsContainer } from "@/components/ui/highcharts-chart";
import { cn } from "@/lib/utils";
import {
  categoriesService,
  dashboardService,
  transactionsService,
} from "@/services/api";
import { Category, CategorySpending, DashboardStats, Transaction } from "@/types";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useDataRefresh } from "@/contexts/DataRefreshContext";
import { format } from "date-fns";
import {
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  Plus,
  TrendingDown,
  TrendingUp,
  Wallet
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const { formatAmount } = useCurrency();
  const { refreshTrigger } = useDataRefresh();
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpenses: 0,
    currentBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlySaving: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryExpenses, setCategoryExpenses] = useState<CategorySpending[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);

        // Load dashboard stats from API
        const dashboardStats = await dashboardService.getStats();
        setStats(dashboardStats);

        // Load recent transactions
        const transactionsResponse = await transactionsService.getAll();
        const allTransactions = transactionsResponse.items;
        const recent = allTransactions
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .slice(0, 5);
        setRecentTransactions(recent);

        // Load categories
        const allCategories = await categoriesService.getAll();
        setCategories(allCategories);

        // Load category expenses for bubble chart
        try {
          const expenses = await dashboardService.getCategoryExpenses();
          setCategoryExpenses(expenses || []);
        } catch (error) {
          console.error('Failed to load category expenses:', error);
          setCategoryExpenses([]);
        }
      } catch (error) {
        toast.error("Failed to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [refreshTrigger]); // Re-run when refreshTrigger changes

  const getCategoryById = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  const savingsRate =
    stats.monthlyIncome > 0
      ? (stats.monthlySaving / stats.monthlyIncome) * 100
      : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Balance
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatAmount(stats.currentBalance || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total income minus expenses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Income
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +{formatAmount(stats.monthlyIncome || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                This month's earnings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Expenses
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                -{formatAmount(stats.monthlyExpenses || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                This month's spending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Savings
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatAmount(stats.monthlySaving || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {savingsRate.toFixed(1)}% savings rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Savings Progress and Expense by Category - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Savings Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Savings Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Monthly Savings</span>
                  <span>
                    {formatAmount(stats.monthlySaving || 0)} of {formatAmount(stats.monthlyIncome || 0)}
                  </span>
                </div>
                <Progress
                  value={Math.max(0, Math.min(100, savingsRate))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {savingsRate >= 20
                    ? "Great job! You're saving well."
                    : "Consider increasing your savings rate to 20% or more."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Expense by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Expense by Category</CardTitle>
              <p className="text-sm text-muted-foreground">
                Current month: {formatAmount(stats.monthlyExpenses || 0)}
              </p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-sm text-muted-foreground">Loading chart...</div>
                </div>
              ) : categoryExpenses.length > 0 ? (
                <div className="space-y-4">
                  <HighchartsContainer
                    className="w-full h-[320px]"
                    options={{
                      chart: {
                        type: 'pie',
                        marginBottom: 30,
                        spacingBottom: 10,
                        marginTop: 20,
                        spacingTop: 10,
                      },
                      title: {
                        text: undefined,
                      },
                      series: [{
                        name: 'Expenses',
                        type: 'pie',
                        data: categoryExpenses.map((item) => ({
                          name: item.categoryName,
                          y: item.amount,
                          color: item.color,
                        })),
                        innerSize: '40%',
                        dataLabels: {
                          enabled: false,
                        },
                      }],
                      tooltip: {
                        formatter: function() {
                          return `<b>${this.point.name}</b><br/>${formatAmount(this.y || 0)} (${this.percentage?.toFixed(1)}%)`;
                        },
                      },
                      legend: {
                        enabled: false,
                      },
                      plotOptions: {
                        pie: {
                          allowPointSelect: true,
                          cursor: 'pointer',
                          borderWidth: 0,
                        },
                      },
                    }}
                  />
                  <div className="space-y-2">
                    {categoryExpenses.slice(0, 5).map((item) => (
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
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-sm font-medium">No expense data for this month</p>
                  <p className="text-xs text-muted-foreground mt-1">Start adding transactions to see your spending breakdown</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Link to="/transactions">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No transactions yet. Start by adding your first transaction!
                </p>
                <Link to="/transactions" className="mt-4 inline-block">
                  <Button>Add Transaction</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => {
                  const category = getCategoryById(transaction.categoryId);
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            transaction.type === "INCOME"
                              ? "bg-green-100 dark:bg-green-900"
                              : "bg-red-100 dark:bg-red-900",
                          )}
                        >
                          {transaction.type === "INCOME" ? (
                            <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <ArrowDownLeft className="h-5 w-5 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.title}</p>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="secondary"
                              style={{
                                backgroundColor: category?.color + "20",
                                color: category?.color,
                              }}
                            >
                              {category?.name}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {format(new Date(transaction.date), "MMM dd")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "font-semibold",
                          transaction.type === "INCOME"
                            ? "text-green-600"
                            : "text-red-600",
                        )}
                      >
                        {transaction.type === "INCOME" ? "+" : "-"}{formatAmount(transaction.amount)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
