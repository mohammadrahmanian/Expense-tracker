import { type FC } from "react";
import type { Category } from "@/types";
import type { MonthlyCategoryTotals } from "@/hooks/queries/useMonthlyCategoryTotals";
import { CategoryCard } from "@/components/categories/CategoryCard";

type CategoryCardGridProps = {
  categories: Category[];
  totalsByCategoryId: MonthlyCategoryTotals;
  totalsLoading: boolean;
  emptyMessage: string;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
};

export const CategoryCardGrid: FC<CategoryCardGridProps> = ({
  categories,
  totalsByCategoryId,
  totalsLoading,
  emptyMessage,
  onEdit,
  onDelete,
}) => {
  if (categories.length === 0) {
    return (
      <p
        role="status"
        className="py-12 text-center text-body text-muted-foreground"
      >
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const t = totalsByCategoryId[category.id] ?? { spent: 0, count: 0 };
        return (
          <CategoryCard
            key={category.id}
            category={category}
            monthlySpent={t.spent}
            monthlyCount={t.count}
            totalsLoading={totalsLoading}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};
