import { type FC, useRef } from "react";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

type CategoryType = "EXPENSE" | "INCOME";

type CategoryTypeTabsProps = {
  value: CategoryType;
  onChange: (value: CategoryType) => void;
};

const ORDER: CategoryType[] = ["EXPENSE", "INCOME"];

export const CategoryTypeTabs: FC<CategoryTypeTabsProps> = ({ value, onChange }) => {
  const expenseRef = useRef<HTMLButtonElement>(null);
  const incomeRef = useRef<HTMLButtonElement>(null);

  const focusType = (t: CategoryType) => {
    (t === "EXPENSE" ? expenseRef : incomeRef).current?.focus();
  };

  const moveTo = (next: CategoryType) => {
    onChange(next);
    focusType(next);
  };

  const handleKeyDown =
    (thisType: CategoryType) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const i = ORDER.indexOf(thisType);
      if (e.key === "ArrowRight") {
        e.preventDefault();
        moveTo(ORDER[(i + 1) % ORDER.length]!);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        moveTo(ORDER[(i - 1 + ORDER.length) % ORDER.length]!);
      }
    };

  return (
    <div className="flex w-full gap-0 border-b border-border" role="radiogroup" aria-label="Category type">
      <button
        ref={expenseRef}
        type="button"
        role="radio"
        aria-checked={value === "EXPENSE"}
        tabIndex={value === "EXPENSE" ? 0 : -1}
        onClick={() => onChange("EXPENSE")}
        onKeyDown={handleKeyDown("EXPENSE")}
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
        ref={incomeRef}
        type="button"
        role="radio"
        aria-checked={value === "INCOME"}
        tabIndex={value === "INCOME" ? 0 : -1}
        onClick={() => onChange("INCOME")}
        onKeyDown={handleKeyDown("INCOME")}
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
};
