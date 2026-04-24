import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrency } from "@/contexts/CurrencyContext";
import type { Category } from "@/types";
import { ICON_BY_NAME } from "@/components/categories/CategoryFormDialog/CategoryFormDialog.constants";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { CategoryIconWrap } from "./CategoryIconWrap";
import { budgetProgressPercent } from "./CategoryCard.utils";

type CategoryCardProps = {
  category: Category;
  monthlySpent: number;
  monthlyCount: number;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
};

export const CategoryCard: FC<CategoryCardProps> = ({
  category,
  monthlySpent,
  monthlyCount,
  onEdit,
  onDelete,
}) => {
  const { formatAmount } = useCurrency();
  const iconName = category.icon ?? "utensils";
  const Icon = ICON_BY_NAME[iconName] ?? ICON_BY_NAME["utensils"];
  const budget = category.budgetAmount ?? null;
  const pct = budgetProgressPercent(monthlySpent, budget);
  const amountVerb = category.type === "EXPENSE" ? "spent" : "earned";

  return (
    <Card className="flex flex-col gap-4 border-border bg-surface p-5 shadow-none">
      <div className="flex items-center justify-between gap-2">
        <CategoryIconWrap color={category.color} Icon={Icon} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-muted-foreground"
              aria-label={`Actions for ${category.name}`}
            >
              <MoreVertical className="h-[18px] w-[18px]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(category)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(category.id)}
              className="text-danger-500 focus:text-danger-500"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-base font-semibold text-foreground">{category.name}</p>
      <div className="flex flex-col gap-2">
        <p className="text-caption text-muted-foreground">
          {monthlyCount} transaction{monthlyCount === 1 ? "" : "s"}
        </p>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
          <div
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
      </div>
    </Card>
  );
};
