import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import * as React from "react";

import { cn } from "@/lib/utils";
import { readRootRadiusPx, useHighchartsOptions } from "./highcharts-chart.utils";

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
  const [rootRadiusPx, setRootRadiusPx] = React.useState(10);

  React.useLayoutEffect(() => {
    setRootRadiusPx(readRootRadiusPx());
  }, []);

  const chartOptions = useHighchartsOptions({
    options,
    tooltipBorderRadiusPx: rootRadiusPx,
  });

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
