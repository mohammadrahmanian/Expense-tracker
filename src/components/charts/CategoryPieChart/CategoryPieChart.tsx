import { type FC } from "react";
import { Badge } from "@/components/ui/badge";
import { HighchartsContainer } from "@/components/ui/highcharts-chart";
import { escapeHtml } from "@/lib/utils";
import { type CategorySpending } from "@/types";

type CategoryPieChartProps = {
  data: CategorySpending[];
  seriesName: string;
  formatAmount: (amount: number) => string;
  maxLegendItems?: number;
  chartClassName?: string;
};

export const CategoryPieChart: FC<CategoryPieChartProps> = ({
  data,
  seriesName,
  formatAmount,
  maxLegendItems,
  chartClassName = "w-full h-[320px]",
}) => {
  const legendItems = maxLegendItems ? data.slice(0, maxLegendItems) : data;

  return (
    <div className="space-y-4">
      <HighchartsContainer
        className={chartClassName}
        options={{
          chart: { type: "pie" },
          title: { text: undefined },
          series: [
            {
              name: seriesName,
              type: "pie",
              data: data.map((item) => ({
                name: item.categoryName,
                y: item.amount,
                color: item.color,
              })),
              innerSize: "40%",
              dataLabels: { enabled: false },
            },
          ],
          tooltip: {
            formatter: function () {
              return `<b>${escapeHtml(String(this.key))}</b><br/>${formatAmount(this.y || 0)} (${this.percentage?.toFixed(1)}%)`;
            },
          },
          legend: { enabled: false },
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
        {legendItems.map((item) => (
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
  );
};
