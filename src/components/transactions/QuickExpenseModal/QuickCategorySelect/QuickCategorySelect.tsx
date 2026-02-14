import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { quickCategories } from "../QuickExpenseModal.types";

type QuickCategorySelectProps = {
  selectedCategory: string;
  onSelect: (name: string) => void;
  categories: Category[];
  error?: string;
};

export const QuickCategorySelect: FC<QuickCategorySelectProps> = ({
  selectedCategory,
  onSelect,
  categories,
  error,
}) => {
  const findCategory = (name: string) =>
    categories.find((cat) => cat.name.toLowerCase() === name.toLowerCase());

  return (
    <div className="space-y-2">
      <Label>Category</Label>
      <div className="grid grid-cols-3 gap-2">
        {quickCategories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.name;
          const exists = !!findCategory(cat.name);

          return (
            <Button
              key={cat.name}
              type="button"
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "h-16 flex flex-col items-center justify-center gap-1",
                isSelected && "bg-blue-600 hover:bg-blue-700",
                !exists && "opacity-75",
              )}
              onClick={() => onSelect(cat.name)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{cat.name}</span>
              {!exists && (
                <span className="text-[10px] text-red-500">Missing</span>
              )}
            </Button>
          );
        })}
      </div>
      {selectedCategory && !findCategory(selectedCategory) && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            The &ldquo;{selectedCategory}&rdquo; category will be created
            automatically when you add this expense.
          </p>
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
