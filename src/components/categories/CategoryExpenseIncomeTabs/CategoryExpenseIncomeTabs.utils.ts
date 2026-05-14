import type { MonthlyCategoryTotals } from "@/hooks/queries/useMonthlyCategoryTotals";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

export type CategoryType = "EXPENSE" | "INCOME";

export type CategoryExpenseIncomeTabsModel = {
  activeType: CategoryType;
  onActiveTypeChange: (type: CategoryType) => void;
  search: string;
  onSearchChange: (value: string) => void;
  totalCount: number;
  totalBudget: number;
  totalAmount: number;
  visibleCategories: Category[];
  totalsByCategoryId: MonthlyCategoryTotals;
  totalsLoading: boolean;
  emptyMessage: string;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
};

export const tabsListClass = cn(
  "flex h-auto w-full justify-start gap-0 rounded-none border-b border-border bg-transparent p-0 text-muted-foreground",
);

export const tabsTriggerClass = cn(
  "flex items-center gap-1.5 rounded-none border-b-2 border-transparent bg-transparent px-4 py-2.5 text-body font-medium shadow-none transition-colors",
  "data-[state=active]:border-primary data-[state=active]:font-semibold data-[state=active]:text-primary",
  "data-[state=inactive]:text-muted-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
);

export const buildCategoryCardGridProps = (
  visibleCategories: Category[],
  totalsByCategoryId: MonthlyCategoryTotals,
  totalsLoading: boolean,
  emptyMessage: string,
  onEdit: (category: Category) => void,
  onDelete: (categoryId: string) => void,
) => ({
  categories: visibleCategories,
  totalsByCategoryId,
  totalsLoading,
  emptyMessage,
  onEdit,
  onDelete,
});
