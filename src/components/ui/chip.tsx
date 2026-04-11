import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-[6px] text-[13px] font-medium transition-colors cursor-pointer",
  {
    variants: {
      variant: {
        filled: [
          "bg-neutral-100 text-neutral-600",
          "hover:bg-neutral-200",
          "dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700",
        ],
        outlined: [
          "border border-border bg-transparent text-neutral-600",
          "hover:bg-neutral-50",
          "dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800",
        ],
      },
    },
    defaultVariants: {
      variant: "filled",
    },
  },
);

const selectedFilledClasses = [
  "bg-gold-500 text-white",
  "hover:bg-gold-300",
  "dark:bg-gold-500 dark:text-white dark:hover:bg-gold-300",
];

const selectedOutlinedClasses = [
  "border-gold-500 bg-gold-50 text-gold-600",
  "hover:bg-gold-100",
  "dark:border-gold-400 dark:bg-gold-900 dark:text-gold-300 dark:hover:bg-gold-800",
];

type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof chipVariants> & {
    selected?: boolean;
  };

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant = "filled", selected = false, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={selected}
      className={cn(
        chipVariants({ variant }),
        selected && (variant === "outlined" ? selectedOutlinedClasses : selectedFilledClasses),
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
