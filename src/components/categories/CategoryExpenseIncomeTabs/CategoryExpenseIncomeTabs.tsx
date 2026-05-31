import { type FC } from "react";
import { CategoryCardGrid } from "@/components/categories/CategoryCardGrid";
import { CategorySearchField } from "@/components/categories/CategorySearchField";
import { CategoryStatsRow } from "@/components/categories/CategoryStatsRow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  buildCategoryCardGridProps,
  tabsListClass,
  tabsTriggerClass,
  type CategoryExpenseIncomeTabsModel,
  type CategoryType,
} from "./CategoryExpenseIncomeTabs.utils";

type CategoryExpenseIncomeTabsProps = {
  model: CategoryExpenseIncomeTabsModel;
};

export const CategoryExpenseIncomeTabs: FC<CategoryExpenseIncomeTabsProps> = ({
  model,
}) => {
  const {
    activeType,
    onActiveTypeChange,
    search,
    onSearchChange,
    totalCount,
    totalBudget,
    totalAmount,
    visibleCategories,
    totalsByCategoryId,
    totalsLoading,
    emptyMessage,
    onEdit,
    onDelete,
  } = model;

  const sharedGrid = buildCategoryCardGridProps(
    visibleCategories,
    totalsByCategoryId,
    totalsLoading,
    emptyMessage,
    onEdit,
    onDelete,
  );

  return (
    <Tabs
      value={activeType}
      onValueChange={(v) => onActiveTypeChange(v as CategoryType)}
    >
      <TabsList aria-label="Category type" className={tabsListClass}>
        <TabsTrigger value="EXPENSE" className={tabsTriggerClass}>
          <TrendingDown className="h-4 w-4 shrink-0" aria-hidden />
          Expense
        </TabsTrigger>
        <TabsTrigger value="INCOME" className={tabsTriggerClass}>
          <TrendingUp className="h-4 w-4 shrink-0" aria-hidden />
          Income
        </TabsTrigger>
      </TabsList>
      <div className="mt-6">
        <CategorySearchField value={search} onChange={onSearchChange} />
      </div>
      <div aria-live="polite" aria-atomic="true" className="mt-6">
        <CategoryStatsRow
          totalCount={totalCount}
          totalBudget={totalBudget}
          totalAmount={totalAmount}
          type={activeType}
        />
      </div>
      <TabsContent value="EXPENSE" className="mt-6 focus-visible:outline-none">
        <CategoryCardGrid {...sharedGrid} />
      </TabsContent>
      <TabsContent value="INCOME" className="mt-6 focus-visible:outline-none">
        <CategoryCardGrid {...sharedGrid} />
      </TabsContent>
    </Tabs>
  );
};
