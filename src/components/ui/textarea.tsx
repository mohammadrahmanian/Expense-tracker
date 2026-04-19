import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "flex min-h-[80px] w-full resize-none text-foreground placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-neutral-500",
  {
    variants: {
      variant: {
        default:
          "rounded-sm border border-neutral-200 bg-white px-3 py-2.5 text-body focus-visible:outline-none focus-visible:border-2 focus-visible:border-gold-500 focus-visible:px-[11px] focus-visible:py-[9px] disabled:bg-surface aria-[invalid=true]:border-danger-500 aria-[invalid=true]:bg-danger-50 dark:bg-neutral-800 dark:border-neutral-700 dark:aria-[invalid=true]:bg-danger-700/20",
        underlined:
          "rounded-t-sm rounded-b-none border-0 border-b border-b-neutral-400 bg-neutral-100 px-3 py-2.5 text-base outline-none focus-visible:border-b-2 focus-visible:border-b-gold-500 aria-[invalid=true]:border-b-2 aria-[invalid=true]:border-b-danger-500 aria-[invalid=true]:bg-danger-50 dark:border-b-neutral-600 dark:bg-neutral-800 dark:focus-visible:border-b-2 dark:focus-visible:border-b-gold-500 dark:aria-[invalid=true]:border-b-2 dark:aria-[invalid=true]:border-b-danger-500 dark:aria-[invalid=true]:bg-danger-700/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
