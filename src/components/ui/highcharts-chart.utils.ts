import Highcharts from "highcharts";
import * as React from "react";

function mergeAxisDefaults(axis: any, isYAxis = false) {
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
    // Defaults go first so caller-provided axis colors can override them.
    ...defaultColors,
    ...axis,
    labels: {
      ...axis?.labels,
      style: {
        color: defaultLabelColor,
        ...axis?.labels?.style,
      },
    },
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
}

export function readRootRadiusPx(): number {
  if (typeof document === "undefined") return 10;
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:absolute;left:-9999px;border-radius:var(--radius);visibility:hidden;pointer-events:none";
  document.documentElement.appendChild(probe);
  const px = parseFloat(getComputedStyle(probe).borderTopLeftRadius);
  probe.remove();
  return Number.isFinite(px) ? Math.round(px) : 10;
}

export function useHighchartsOptions({
  options,
  tooltipBorderRadiusPx,
}: {
  options: Highcharts.Options;
  tooltipBorderRadiusPx: number;
}): Highcharts.Options {
  return React.useMemo(() => {
    // Handle xAxis - can be array or object
    const processedXAxis = Array.isArray(options.xAxis)
      ? options.xAxis.map((axis) => mergeAxisDefaults(axis, false))
      : mergeAxisDefaults(options.xAxis ?? {}, false);

    // Handle yAxis - can be array or object
    const processedYAxis = Array.isArray(options.yAxis)
      ? options.yAxis.map((axis) => mergeAxisDefaults(axis, true))
      : mergeAxisDefaults(options.yAxis ?? {}, true);

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
        borderRadius: tooltipBorderRadiusPx,
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
  }, [options, tooltipBorderRadiusPx]);
}
