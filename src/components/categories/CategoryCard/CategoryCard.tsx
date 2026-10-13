import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Category } from "@/types";
import { ICON_BY_NAME } from "@/components/categories/CategoryFormDialog/CategoryFormDialog.constants";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { CategoryIconWrap } from "./CategoryIconWrap";
import { CategoryTotals } from "./CategoryTotals";

type CategoryCardProps = {
  category: Category;
  monthlySpent: number;
  monthlyCount: number;
  totalsLoading?: boolean;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
};

export const CategoryCard: FC<CategoryCardProps> = ({
  category,
  monthlySpent,
  monthlyCount,
  totalsLoading = false,
  onEdit,
  onDelete,
}) => {
  const iconName = category.icon ?? "utensils";
  const Icon = ICON_BY_NAME[iconName] ?? ICON_BY_NAME["utensils"];

  return (
    <Card className="flex flex-col gap-4 border-border bg-surface shadow-none">
      <div className="flex items-center justify-between gap-2 pl-5">
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
      <p className="px-5 text-base font-semibold text-foreground">
        {category.name}
      </p>
      <div className="flex flex-col gap-2 px-5 pb-5">
        <CategoryTotals
          category={category}
          monthlySpent={monthlySpent}
          monthlyCount={monthlyCount}
          totalsLoading={totalsLoading}
        />
      </div>
    </Card>
  );
};
