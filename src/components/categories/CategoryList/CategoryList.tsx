import { type FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/types";
import { CategoryItem } from "@/components/categories/CategoryItem";

type CategoryListProps = {
  title: string;
  categories: Category[];
  indicatorColor: string;
  emptyMessage: string;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
};

export const CategoryList: FC<CategoryListProps> = ({
  title,
  categories,
  indicatorColor,
  emptyMessage,
  onEdit,
  onDelete,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: indicatorColor }}
        />
        <span>
          {title} ({categories.length})
        </span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      {categories.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);
