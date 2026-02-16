import { escapeHtml } from "@/lib/utils";
import { type MonthlyData } from "@/types";

export const getIncomeVsExpensesOptions = (
  monthlyData: MonthlyData[],
  formatAmount: (amount: number) => string,
  markerLineColor: string,
): Highcharts.Options => ({
  chart: { type: "spline" },
  title: { text: undefined },
  xAxis: {
    categories: monthlyData.map((d) => d.monthLabel || d.month),
    labels: { style: { fontSize: "10px" } },
  },
  yAxis: {
    title: { text: undefined },
    labels: { style: { fontSize: "10px" } },
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
      return `<b>${escapeHtml(this.series.name)}</b><br/>${formatAmount(this.y || 0)}`;
    },
  },
  legend: {
    enabled: true,
    itemStyle: { fontSize: "10px" },
  },
  plotOptions: {
    spline: {
      lineWidth: 3,
      marker: {
        enabled: true,
        radius: 4,
        lineWidth: 2,
        lineColor: markerLineColor,
      },
      states: { hover: { lineWidth: 4 } },
    },
  },
});
