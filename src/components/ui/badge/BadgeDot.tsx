import { type FC } from "react";

import { cn } from "@/lib/utils";

type BadgeDotColor =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "primary"
  | "neutral";

const colorMap: Record<BadgeDotColor, string> = {
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
  info: "bg-info-500",
  primary: "bg-gold-500",
  neutral: "bg-neutral-300",
};

type BadgeDotProps = {
  color?: BadgeDotColor;
  className?: string;
};

const BadgeDot: FC<BadgeDotProps> = ({ color = "primary", className }) => (
  <span
    className={cn(
      "inline-block h-2 w-2 shrink-0 rounded-full",
      colorMap[color],
      className,
    )}
  />
);

export { BadgeDot };
export type { BadgeDotProps, BadgeDotColor };
