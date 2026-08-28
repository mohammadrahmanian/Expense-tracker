import { forwardRef, type ButtonHTMLAttributes } from "react";
import { DatePreset } from "@/lib/transactions.utils";
import { cn } from "@/lib/utils";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";

type DateRangeTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: "default" | "pill";
  label: string;
  open: boolean;
  preset: DatePreset;
};

export const DateRangeTrigger = forwardRef<
  HTMLButtonElement,
  DateRangeTriggerProps
>(({ variant, label, open, preset, className, ...props }, ref) => {
  const ChevronIcon = open ? ChevronUp : ChevronDown;

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 font-medium transition-colors",
        variant === "pill"
          ? "shrink-0 rounded-full px-3 py-[7px] text-[13px] border border-border text-muted-foreground"
          : "rounded-sm px-3 py-[7px] text-xs font-semibold border",
        variant === "default" &&
          (preset
            ? "border-primary bg-gold-50 text-primary dark:bg-gold-900/40 dark:text-gold-200"
            : "border-border bg-surface text-muted-foreground"),
        className,
      )}
      {...props}
    >
      <Calendar
        className={cn(variant === "pill" ? "h-[13px] w-[13px]" : "h-3.5 w-3.5")}
      />
      {label}
      {variant === "default" && <ChevronIcon className="h-3.5 w-3.5" />}
    </button>
  );
});
DateRangeTrigger.displayName = "DateRangeTrigger";
