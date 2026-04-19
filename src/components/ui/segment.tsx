import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const Segment = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root ref={ref} className={cn("w-full", className)} {...props} />
));
Segment.displayName = "Segment";

const segmentItemVariants = cva(
  "flex h-8 min-w-[6rem] flex-1 basis-0 shrink-0 items-center justify-center whitespace-nowrap rounded-sm border border-transparent px-4 text-[13px] font-semibold text-neutral-600 transition-colors hover:bg-neutral-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-700/60",
  {
    variants: {
      variant: {
        default:
          "data-[state=active]:border-primary data-[state=active]:bg-primary-bg data-[state=active]:text-primary data-[state=active]:hover:bg-primary-bg/90 dark:data-[state=active]:hover:bg-primary-bg/90",
        success:
          "data-[state=active]:border-success-300 data-[state=active]:bg-success-50 data-[state=active]:text-success-700 data-[state=active]:hover:bg-success-100 dark:data-[state=active]:border-success-500 dark:data-[state=active]:bg-success-700/25 dark:data-[state=active]:text-success-300 dark:data-[state=active]:hover:bg-success-700/35",
        error:
          "data-[state=active]:border-danger-300 data-[state=active]:bg-danger-50 data-[state=active]:text-danger-700 data-[state=active]:hover:bg-danger-100 dark:data-[state=active]:border-danger-500 dark:data-[state=active]:bg-danger-700/25 dark:data-[state=active]:text-danger-300 dark:data-[state=active]:hover:bg-danger-700/35",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const SegmentList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain">
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "flex h-10 min-w-full items-stretch gap-1 rounded-sm bg-neutral-100 p-1 dark:bg-neutral-900/60",
        className,
      )}
      {...props}
    />
  </div>
));
SegmentList.displayName = "SegmentList";

export type SegmentItemProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
  VariantProps<typeof segmentItemVariants>;

const SegmentItem = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  SegmentItemProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(segmentItemVariants({ variant }), className)}
    {...props}
  />
));
SegmentItem.displayName = "SegmentItem";

export { Segment, SegmentList, SegmentItem, segmentItemVariants };
export { TabsContent } from "@/components/ui/tabs";
