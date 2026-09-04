import { type ButtonHTMLAttributes, type FC, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const PillTabsList: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
      className,
    )}
    {...props}
  />
);

type PillTabsItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
};

const PillTabsItem: FC<PillTabsItemProps> = ({
  selected = false,
  className,
  children,
  ...props
}) => (
  <button
    type="button"
    aria-pressed={selected}
    className={cn(
      "shrink-0 whitespace-nowrap rounded-full px-4 py-[7px] text-[13px] font-medium transition-colors",
      selected
        ? "bg-primary font-semibold text-white"
        : "border border-border text-muted-foreground",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

export { PillTabsList, PillTabsItem };
