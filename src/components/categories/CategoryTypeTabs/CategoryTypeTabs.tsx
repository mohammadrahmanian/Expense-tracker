import { type FC } from "react";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

type CategoryTypeTabsProps = {
  value: "EXPENSE" | "INCOME";
  onChange: (value: "EXPENSE" | "INCOME") => void;
};

export const CategoryTypeTabs: FC<CategoryTypeTabsProps> = ({
  value,
  onChange,
}) => (
  <div
    className="flex w-full gap-0 border-b border-border"
    role="tablist"
    aria-label="Category type"
  >
    <button
      type="button"
      role="tab"
      aria-selected={value === "EXPENSE"}
      onClick={() => onChange("EXPENSE")}
      className={cn(
        "flex items-center gap-1.5 px-4 py-2.5 text-body font-medium transition-colors",
        value === "EXPENSE"
          ? "border-b-2 border-primary font-semibold text-primary"
          : "border-b-2 border-transparent text-muted-foreground",
      )}
    >
      <TrendingDown className="h-4 w-4 shrink-0" aria-hidden />
      Expense
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={value === "INCOME"}
      onClick={() => onChange("INCOME")}
      className={cn(
        "flex items-center gap-1.5 px-4 py-2.5 text-body font-medium transition-colors",
        value === "INCOME"
          ? "border-b-2 border-primary font-semibold text-primary"
          : "border-b-2 border-transparent text-muted-foreground",
      )}
    >
      <TrendingUp className="h-4 w-4 shrink-0" aria-hidden />
      Income
    </button>
  </div>
);
