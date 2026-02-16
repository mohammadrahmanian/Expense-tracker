import { type FC, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { CategoryBreakdownChart } from "@/components/reports/CategoryBreakdownChart";
import { IncomeVsExpensesChart } from "@/components/reports/IncomeVsExpensesChart";
import { MonthlyComparisonChart } from "@/components/reports/MonthlyComparisonChart";
import { ReportsErrorAlert } from "@/components/reports/ReportsErrorAlert";
import { ReportsPieCharts } from "@/components/reports/ReportsPieCharts";
import { ReportsSummaryStats } from "@/components/reports/ReportsSummaryStats";
import { TimeRangePicker } from "@/components/reports/TimeRangePicker";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useReports } from "@/hooks/queries/useReports";
import {
  addCategoryPercentages,
  getDateRangeForTimeRange,
  validateDateRange,
  type TimeRangeValue,
} from "@/lib/reports.utils";

export const Reports: FC = () => {
  const { formatAmount } = useCurrency();
  const [timeRange, setTimeRange] = useState<TimeRangeValue>("6m");
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();
  const [categoryBreakdownType, setCategoryBreakdownType] = useState<
    "expenses" | "income"
  >("expenses");

  const dateRange = useMemo(
    () => getDateRangeForTimeRange(timeRange, customStartDate, customEndDate),
    [timeRange, customStartDate, customEndDate],
  );

  const { isValid: datesAreValid, error: validationError } = useMemo(
    () => validateDateRange(timeRange, customStartDate, customEndDate, dateRange),
    [timeRange, customStartDate, customEndDate, dateRange],
  );

  const {
    data: reportsData,
    isLoading,
    error: queryError,
    refetch,
  } = useReports({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    enabled: datesAreValid,
  });

  const error = validationError
    ?? (queryError ? "Failed to load reports. Please try again." : null);

  const categorySpending = useMemo(
    () => addCategoryPercentages(reportsData?.categoryBreakdown.expenses),
    [reportsData],
  );
  const incomeByCategory = useMemo(
    () => addCategoryPercentages(reportsData?.categoryBreakdown.income),
    [reportsData],
  );

  const summary = reportsData?.summary ?? null;
  const monthlyData = reportsData?.monthlyData ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-3">
        <TimeRangePicker
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          customStartDate={customStartDate}
          onCustomStartDateChange={setCustomStartDate}
          customEndDate={customEndDate}
          onCustomEndDateChange={setCustomEndDate}
        />

        {error && (
          <ReportsErrorAlert
            error={error}
            onRetry={queryError ? () => refetch() : undefined}
          />
        )}

        <ReportsSummaryStats summary={summary} isLoading={isLoading} formatAmount={formatAmount} />

        <div className="grid gap-3 md:grid-cols-3">
          <IncomeVsExpensesChart monthlyData={monthlyData} isLoading={isLoading} formatAmount={formatAmount} />
          <CategoryBreakdownChart
            monthlyData={monthlyData}
            categorySpending={categorySpending}
            incomeByCategory={incomeByCategory}
            categoryBreakdownType={categoryBreakdownType}
            onCategoryBreakdownTypeChange={setCategoryBreakdownType}
            isLoading={isLoading}
            formatAmount={formatAmount}
          />
          <MonthlyComparisonChart monthlyData={monthlyData} isLoading={isLoading} formatAmount={formatAmount} />
        </div>

        <ReportsPieCharts
          categorySpending={categorySpending}
          incomeByCategory={incomeByCategory}
          isLoading={isLoading}
          formatAmount={formatAmount}
        />
      </div>
    </DashboardLayout>
  );
};
