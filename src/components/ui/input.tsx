import * as React from "react";

import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  variant?: "outline" | "filled";
  inputSize?: "sm" | "md" | "lg";
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "outline", inputSize = "md", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full text-foreground placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          inputSize === "sm" && "h-8 px-2.5 py-1.5 text-caption",
          inputSize === "md" && "h-10 px-3 py-2.5 text-body",
          inputSize === "lg" && "h-12 px-4 py-3.5 text-sm",
          variant === "outline" && [
            "rounded-sm border border-neutral-200 bg-white",
            "focus-visible:border-gold-500 focus-visible:ring-1 focus-visible:ring-gold-500",
            "disabled:bg-surface",
            "aria-[invalid=true]:border-danger-500 aria-[invalid=true]:bg-danger-50",
            "dark:bg-neutral-800 dark:border-neutral-700 dark:placeholder:text-neutral-500",
          ],
          variant === "filled" && [
            "rounded-t-sm rounded-b-none border-0 border-b border-b-neutral-400 bg-neutral-100",
            "focus-visible:border-b-2 focus-visible:border-b-gold-500",
            "disabled:border-b-neutral-300",
            "aria-[invalid=true]:border-b-2 aria-[invalid=true]:border-b-danger-500 aria-[invalid=true]:bg-danger-50",
            "dark:bg-neutral-800 dark:border-b-neutral-600 dark:placeholder:text-neutral-500",
          ],
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
