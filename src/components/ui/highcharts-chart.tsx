import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import * as React from "react";

import { cn } from "@/lib/utils";

export type HighchartsConfig = {
  [k in string]: {
    label?: React.ReactNode;
    color?: string;
  };
};

type HighchartsContainerProps = {
  config?: HighchartsConfig;
  options: Highcharts.Options;
  className?: string;
  id?: string;
  children?: React.ReactNode;
};

const HighchartsContainer = React.forwardRef<
  HTMLDivElement,
  HighchartsContainerProps
>(({ id, className, config, options, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  // Helper function to merge axis defaults
  const mergeAxisDefaults = (axis: any, isYAxis = false) => {
    const defaultColors = isYAxis
      ? {
          gridLineColor: "hsl(var(--border))",
          lineColor: "hsl(var(--border))",
          tickColor: "hsl(var(--border))",
        }
      : {
          gridLineColor: "#E2E8F0", // Explicit fallback color (slate-200)
          lineColor: "#CBD5E1", // Explicit fallback color (slate-300)
          tickColor: "#CBD5E1",
        };

    const defaultLabelColor = isYAxis
      ? "hsl(var(--muted-foreground))"
      : "#64748B";

    return {
      ...axis,
      labels: {
        style: {
          color: defaultLabelColor,
        },
        ...axis?.labels,
      },
      ...defaultColors,
      visible: isYAxis ? axis?.visible : true,
      ...(isYAxis && {
        title: {
          style: {
            color: "hsl(var(--muted-foreground))",
          },
          ...axis?.title,
        },
      }),
    };
  };

  // Apply dark mode and responsive configuration
  const chartOptions: Highcharts.Options = React.useMemo(() => {
    // Handle xAxis - can be array or object
    let processedXAxis;
    if (Array.isArray(options.xAxis)) {
      processedXAxis = options.xAxis.map((axis) =>
        mergeAxisDefaults(axis, false),
      );
    } else if (options.xAxis) {
      processedXAxis = mergeAxisDefaults(options.xAxis, false);
    } else {
      processedXAxis = mergeAxisDefaults({}, false);
    }

    // Handle yAxis - can be array or object
    let processedYAxis;
    if (Array.isArray(options.yAxis)) {
      processedYAxis = options.yAxis.map((axis) =>
        mergeAxisDefaults(axis, true),
      );
    } else if (options.yAxis) {
      processedYAxis = mergeAxisDefaults(options.yAxis, true);
    } else {
      processedYAxis = mergeAxisDefaults({}, true);
    }

    return {
      ...options,
      chart: {
        ...options.chart,
        backgroundColor: "transparent",
        style: {
          fontFamily: "inherit",
        },
        marginBottom: 100, // Increased space for X-axis labels + legend
        spacingBottom: 20,
      },
      title: {
        ...options.title,
        style: {
          color: "hsl(var(--foreground))",
          ...options.title?.style,
        },
      },
      xAxis: processedXAxis,
      yAxis: processedYAxis,
      legend: {
        ...options.legend,
        itemStyle: {
          color: "hsl(var(--foreground))",
          ...options.legend?.itemStyle,
        },
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
        margin: 20, // Add margin between legend and X-axis
      },
      tooltip: {
        ...options.tooltip,
        backgroundColor: "hsl(var(--background))",
        borderColor: "hsl(var(--border))",
        borderRadius: 8,
        borderWidth: 1,
        shadow: {
          color: "rgba(0, 0, 0, 0.1)",
          offsetX: 0,
          offsetY: 4,
          opacity: 0.1,
          width: 8,
        },
        style: {
          color: "hsl(var(--foreground))",
          fontSize: "12px",
          padding: "8px 12px",
          ...options.tooltip?.style,
        },
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom",
              },
            },
          },
        ],
        ...options.responsive,
      },
    };
  }, [options]);

  return (
    <div
      data-chart={chartId}
      ref={ref}
      className={cn("flex justify-center text-xs", className)}
      {...props}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        containerProps={{ style: { width: "100%", height: "100%" } }}
      />
    </div>
  );
});
HighchartsContainer.displayName = "HighchartsContainer";

export { HighchartsContainer };
