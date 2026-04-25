import { type FC } from "react";
import { Card } from "@/components/ui/card";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  getAmountStatTitle,
  getAmountStatValueClassName,
} from "./CategoryStatsRow.utils";

type CategoryStatsRowProps = {
  totalCount: number;
  totalBudget: number;
  totalAmount: number;
  type: "EXPENSE" | "INCOME";
};

export const CategoryStatsRow: FC<CategoryStatsRowProps> = ({
  totalCount,
  totalBudget,
  totalAmount,
  type,
}) => {
  const { formatAmount } = useCurrency();
  const amountTitle = getAmountStatTitle(type);
  const amountClass = getAmountStatValueClassName(type);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="flex flex-col gap-1 border-border bg-surface p-5">
        <span className="text-[13px] font-medium text-muted-foreground">
          Total Categories
        </span>
        <span className="text-[26px] font-bold leading-tight text-foreground">
          {totalCount}
        </span>
      </Card>
      <Card className="flex flex-col gap-1 border-border bg-surface p-5">
        <span className="text-[13px] font-medium text-muted-foreground">
          Monthly Budget
        </span>
        <span className="text-[26px] font-bold leading-tight text-foreground">
          {formatAmount(totalBudget)}
        </span>
      </Card>
      <Card className="flex flex-col gap-1 border-border bg-surface p-5">
        <span className="text-[13px] font-medium text-muted-foreground">
          {amountTitle}
        </span>
        <span
          className={`text-[26px] font-bold leading-tight ${amountClass}`}
        >
          {formatAmount(totalAmount)}
        </span>
      </Card>
    </div>
  );
};
