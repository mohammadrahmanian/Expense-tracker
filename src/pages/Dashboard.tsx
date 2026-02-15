import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardErrorAlert } from "@/components/dashboard/DashboardErrorAlert";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { SavingsProgress } from "@/components/dashboard/SavingsProgress";
import { ExpenseByCategory } from "@/components/dashboard/ExpenseByCategory";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useMemo } from "react";
import { useDashboardStats } from "@/hooks/queries/useDashboardStats";
import { useTransactions } from "@/hooks/queries/useTransactions";
import { useCategories } from "@/hooks/queries/useCategories";
import { useCategoryExpenses } from "@/hooks/queries/useCategoryExpenses";

const Dashboard = () => {
  const { formatAmount } = useCurrency();

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    error: statsErrorDetails,
  } = useDashboardStats();

  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    isError: transactionsError,
    error: transactionsErrorDetails,
  } = useTransactions();

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesErrorDetails,
  } = useCategories();

  const {
    data: categoryExpenses,
    isLoading: categoryExpensesLoading,
    isError: categoryExpensesError,
    error: categoryExpensesErrorDetails,
  } = useCategoryExpenses();

  const isLoading =
    statsLoading || transactionsLoading || categoriesLoading || categoryExpensesLoading;
  const hasError =
    statsError || transactionsError || categoriesError || categoryExpensesError;

  const savingsRate =
    stats?.monthlyIncome && stats.monthlyIncome > 0
      ? (stats.monthlySaving / stats.monthlyIncome) * 100
      : 0;

  const recentTransactions = useMemo(() => {
    if (!transactionsData?.items) return [];
    return [...transactionsData.items]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactionsData]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardErrorAlert
          statsError={statsErrorDetails}
          transactionsError={transactionsErrorDetails}
          categoriesError={categoriesErrorDetails}
          categoryExpensesError={categoryExpensesErrorDetails}
        />
        <StatsCards
          stats={stats}
          hasError={hasError}
          statsError={statsError}
          formatAmount={formatAmount}
          savingsRate={savingsRate}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SavingsProgress
            stats={stats}
            statsError={statsError}
            formatAmount={formatAmount}
            savingsRate={savingsRate}
          />
          <ExpenseByCategory
            categoryExpenses={categoryExpenses}
            categoryExpensesError={categoryExpensesError}
            categoryExpensesErrorMessage={categoryExpensesErrorDetails?.message}
            monthlyExpenses={formatAmount(stats?.monthlyExpenses || 0)}
            statsError={statsError}
            isLoading={categoryExpensesLoading}
            formatAmount={formatAmount}
          />
        </div>
        <RecentTransactions
          transactions={recentTransactions}
          categories={categories}
          isError={transactionsError || categoriesError}
          errorMessage={
            transactionsError
              ? transactionsErrorDetails?.message || "An error occurred"
              : categoriesErrorDetails?.message || "An error occurred"
          }
          formatAmount={formatAmount}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
