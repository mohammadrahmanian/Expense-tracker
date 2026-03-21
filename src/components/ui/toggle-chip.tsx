import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";

import { cn } from "@/lib/utils";

const ToggleChip = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1.5 h-9 rounded-md px-3 text-[13px] font-medium transition-colors cursor-pointer",
      "bg-neutral-100 text-neutral-600",
      "data-[state=on]:bg-gold-50 data-[state=on]:text-gold-600",
      "hover:bg-neutral-200 data-[state=on]:hover:bg-gold-100",
      "dark:bg-neutral-800 dark:text-neutral-400",
      "dark:data-[state=on]:bg-gold-900 dark:data-[state=on]:text-gold-300",
      className,
    )}
    {...props}
  >
    {children}
  </TogglePrimitive.Root>
));
ToggleChip.displayName = "ToggleChip";

export { ToggleChip };
