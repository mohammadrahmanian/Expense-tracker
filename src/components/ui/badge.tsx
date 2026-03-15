import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border px-3 py-1 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-gold-300 bg-gold-50 text-gold-500",
        secondary:
          "border-neutral-200 bg-surface text-neutral-600",
        destructive:
          "border-danger-300 bg-danger-50 text-danger-700",
        success:
          "border-success-300 bg-success-50 text-success-700",
        warning:
          "border-warning-300 bg-warning-50 text-warning-700",
        info:
          "border-info-300 bg-info-100 text-info-700",
        outline: "bg-transparent text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
