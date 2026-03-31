import * as React from "react";

import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  variant?: "outline" | "filled";
  inputSize?: "sm" | "md" | "lg";
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  wrapperClassName?: string;
};

const BASE_CLASSES =
  "flex w-full text-foreground placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground";

const OUTLINE_CLASSES = [
  "rounded-sm border border-neutral-200 bg-white",
  "focus-visible:border-gold-500 focus-visible:ring-1 focus-visible:ring-gold-500",
  "disabled:bg-surface",
  "aria-[invalid=true]:border-danger-500 aria-[invalid=true]:bg-danger-50",
  "dark:bg-neutral-800 dark:border-neutral-700 dark:placeholder:text-neutral-500",
];

const FILLED_CLASSES = [
  "rounded-t-sm rounded-b-none border-0 border-b border-b-neutral-400 bg-neutral-100",
  "focus-visible:border-b-2 focus-visible:border-b-gold-500",
  "disabled:border-b-neutral-300",
  "aria-[invalid=true]:border-b-2 aria-[invalid=true]:border-b-danger-500 aria-[invalid=true]:bg-danger-50",
  "dark:bg-neutral-800 dark:border-b-neutral-600 dark:placeholder:text-neutral-500",
];

const OUTLINE_WRAPPER_CLASSES = [
  "rounded-sm border border-neutral-200 bg-white",
  "focus-within:border-gold-500 focus-within:ring-1 focus-within:ring-gold-500",
  "dark:bg-neutral-800 dark:border-neutral-700",
];

const FILLED_WRAPPER_CLASSES = [
  "rounded-t-sm rounded-b-none border-0 border-b border-b-neutral-400 bg-neutral-100",
  "focus-within:border-b-2 focus-within:border-b-gold-500",
  "dark:bg-neutral-800 dark:border-b-neutral-600",
];

const SIZE_TEXT = { sm: "text-caption", md: "text-body", lg: "text-sm" };
const SIZE_FULL = { sm: "h-8 px-2.5 py-1.5", md: "h-10 px-3 py-2.5", lg: "h-12 px-4 py-3.5" };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant = "outline",
      inputSize = "md",
      startAdornment,
      endAdornment,
      wrapperClassName,
      ...props
    },
    ref,
  ) => {
    const hasAdornment = !!startAdornment || !!endAdornment;

    if (hasAdornment) {
      return (
        <div
          aria-invalid={props["aria-invalid"] || undefined}
          className={cn(
            "flex items-center gap-2",
            SIZE_FULL[inputSize],
            variant === "outline" && OUTLINE_WRAPPER_CLASSES,
            variant === "filled" && FILLED_WRAPPER_CLASSES,
            variant === "outline" && OUTLINE_CLASSES,
            variant === "filled" && FILLED_CLASSES,
            wrapperClassName,
          )}
        >
          {startAdornment}
          <input
            type={type}
            className={cn(BASE_CLASSES, "min-w-0 flex-1 bg-transparent", SIZE_TEXT[inputSize], className)}
            ref={ref}
            {...props}
          />
          {endAdornment}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          BASE_CLASSES,
          `${SIZE_FULL[inputSize]} ${SIZE_TEXT[inputSize]}`,
          variant === "outline" && OUTLINE_CLASSES,
          variant === "filled" && FILLED_CLASSES,
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
