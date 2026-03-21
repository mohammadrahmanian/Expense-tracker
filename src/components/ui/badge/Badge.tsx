import { type FC } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { dotColorMap, dotSizeMap } from "./Badge.utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-gold-300 bg-gold-50 text-gold-500",
        secondary: "border-neutral-200 bg-surface text-neutral-600",
        destructive: "border-danger-300 bg-danger-50 text-danger-700",
        success: "border-success-300 bg-success-50 text-success-700",
        warning: "border-warning-300 bg-warning-50 text-warning-700",
        info: "border-info-300 bg-info-100 text-info-700",
        outline: "bg-transparent text-foreground",
        "ghost-success": "border-success-300 bg-transparent text-success-500",
        "ghost-warning": "border-warning-300 bg-transparent text-warning-500",
        "ghost-danger": "border-danger-300 bg-transparent text-danger-500",
        "ghost-info": "border-info-300 bg-transparent text-info-500",
        "ghost-neutral": "border-neutral-200 bg-transparent text-neutral-500",
        "ghost-primary": "border-gold-300 bg-transparent text-gold-500",
      },
      size: {
        sm: "gap-1 px-2 py-0.5 text-[10px]",
        md: "gap-1.5 px-3 py-[5px] text-[11px]",
        lg: "gap-1.5 px-3.5 py-1.5 text-[13px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants> & {
    withDot?: boolean;
    icon?: React.ReactNode;
    dismissible?: boolean;
    onDismiss?: () => void;
  };

const Badge: FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "md",
  withDot,
  icon,
  dismissible,
  onDismiss,
  children,
  ...props
}) => (
  <div
    className={cn(
      badgeVariants({ variant, size }),
      dismissible && "pr-2",
      className,
    )}
    {...props}
  >
    {icon}
    {withDot && !icon && (
      <span
        className={cn(
          "shrink-0 rounded-[1px]",
          dotSizeMap[size ?? "md"],
          dotColorMap[variant ?? "default"],
        )}
      />
    )}
    {children}
    {dismissible && (
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 opacity-70 hover:opacity-100"
        aria-label="Dismiss"
      >
        <X className="h-3 w-3" />
      </button>
    )}
  </div>
);

export { Badge, badgeVariants };
export type { BadgeProps };
