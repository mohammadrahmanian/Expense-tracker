import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import {
  dashboardService,
  transactionsService,
  categoriesService,
} from "@/services/api";
import { DashboardStats, Transaction, Category } from "@/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpenses: 0,
    currentBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlySavings: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadDashboardData = () => {
      const dashboardStats = dashboardService.getStats();
      setStats(dashboardStats);

      const allTransactions = transactionsService.getAll();
      const recent = allTransactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      setRecentTransactions(recent);

      const allCategories = categoriesService.getAll();
      setCategories(allCategories);
    };

    loadDashboardData();
  }, []);

  const getCategoryById = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  const savingsRate =
    stats.monthlyIncome > 0
      ? (stats.monthlySavings / stats.monthlyIncome) * 100
      : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back! Here's your financial overview.
            </p>
          </div>
          <Link to="/transactions">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </Link>
        </div>

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
                ${stats.currentBalance.toLocaleString()}
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
                +${stats.monthlyIncome.toLocaleString()}
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
                -${stats.monthlyExpenses.toLocaleString()}
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
                ${stats.monthlySavings.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {savingsRate.toFixed(1)}% savings rate
              </p>
            </CardContent>
          </Card>
        </div>

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
                  ${stats.monthlySavings.toLocaleString()} of $
                  {stats.monthlyIncome.toLocaleString()}
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
                            transaction.type === "income"
                              ? "bg-green-100 dark:bg-green-900"
                              : "bg-red-100 dark:bg-red-900",
                          )}
                        >
                          {transaction.type === "income" ? (
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
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600",
                        )}
                      >
                        {transaction.type === "income" ? "+" : "-"}$
                        {transaction.amount.toLocaleString()}
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
