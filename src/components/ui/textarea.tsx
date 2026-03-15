import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-sm border border-neutral-200 bg-white px-3 py-2.5 text-body text-foreground placeholder:text-neutral-500 focus-visible:outline-none focus-visible:border-2 focus-visible:border-gold-500 focus-visible:px-[11px] focus-visible:py-[9px] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface aria-[invalid=true]:border-danger-500 aria-[invalid=true]:bg-danger-50 dark:bg-neutral-800 dark:border-neutral-700 dark:placeholder:text-neutral-500",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
