import { type FC } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeCountVariants = cva(
  "inline-flex items-center justify-center rounded-sm border px-[7px] py-0.5 text-[10px] font-semibold",
  {
    variants: {
      colorScheme: {
        danger: "border-danger-300 bg-danger-50 text-danger-700",
        primary: "border-gold-300 bg-gold-50 text-gold-500",
        success: "border-success-300 bg-success-50 text-success-700",
        info: "border-info-300 bg-info-100 text-info-700",
        warning: "border-warning-300 bg-warning-50 text-warning-700",
        neutral: "border-neutral-200 bg-surface text-neutral-600",
      },
    },
    defaultVariants: { colorScheme: "danger" },
  },
);

type BadgeCountProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeCountVariants> & {
    count: number | string;
    max?: number;
  };

const BadgeCount: FC<BadgeCountProps> = ({
  count,
  max = 99,
  colorScheme,
  className,
  ...props
}) => {
  const displayCount =
    typeof count === "number" && count > max ? `${max}+` : count;

  return (
    <span
      className={cn(badgeCountVariants({ colorScheme }), className)}
      {...props}
    >
      {displayCount}
    </span>
  );
};

export { BadgeCount, badgeCountVariants };
export type { BadgeCountProps };
