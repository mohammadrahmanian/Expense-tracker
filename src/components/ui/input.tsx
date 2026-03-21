import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 py-2.5 text-body text-foreground placeholder:text-neutral-500 focus-visible:outline-none focus-visible:border-gold-500 focus-visible:ring-1 focus-visible:ring-gold-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface aria-[invalid=true]:border-danger-500 aria-[invalid=true]:bg-danger-50 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground dark:bg-neutral-800 dark:border-neutral-700 dark:placeholder:text-neutral-500",
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
