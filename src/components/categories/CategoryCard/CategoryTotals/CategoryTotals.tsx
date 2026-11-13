import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/contexts/CurrencyContext";
import type { Category } from "@/types";
import { budgetProgressPercent } from "../CategoryCard.utils";

type CategoryTotalsProps = {
  category: Category;
  monthlySpent: number;
  monthlyCount: number;
  totalsLoading?: boolean;
};

export const CategoryTotals: FC<CategoryTotalsProps> = ({
  category,
  monthlySpent,
  monthlyCount,
  totalsLoading = false,
}) => {
  const { formatAmount } = useCurrency();
  const budget = category.budgetAmount ?? null;
  const pct = budgetProgressPercent(monthlySpent, budget);
  const amountVerb = category.type === "EXPENSE" ? "spent" : "earned";

  return totalsLoading ? (
    <>
      <Skeleton className="h-4 w-28" aria-hidden />
      <Skeleton className="h-1.5 w-full rounded-full" aria-hidden />
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-3 w-24" aria-hidden />
        <Skeleton className="h-3 w-20" aria-hidden />
      </div>
    </>
  ) : (
    <>
      <p className="text-caption text-muted-foreground">
        {monthlyCount} transaction{monthlyCount === 1 ? "" : "s"}
      </p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          aria-label={`Budget used for ${category.name}`}
          className="h-full rounded-full transition-[width]"
          style={{
            width: `${pct}%`,
            backgroundColor: category.color,
          }}
        />
      </div>
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span className="font-medium text-neutral-600 dark:text-neutral-400">
          {formatAmount(monthlySpent)} {amountVerb}
        </span>
        <span className="text-muted-foreground">
          {budget != null && budget > 0
            ? `${formatAmount(budget)} budget`
            : "No budget"}
        </span>
      </div>
    </>
  );
};
