import { type FC } from "react";
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
      <span className="text-overline text-neutral-500 uppercase">Category</span>
      <div className="flex flex-row gap-2">
        {quickCategories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.name;
          const exists = !!findCategory(cat.name);

          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => onSelect(cat.name)}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1.5 rounded-[8px] bg-surface transition-colors cursor-pointer",
                isSelected
                  ? "border-2 border-gold-500 p-[11px]"
                  : "border border-neutral-200 p-3 hover:border-neutral-300",
                !exists && "opacity-75",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  isSelected ? "text-gold-500" : "text-neutral-500",
                )}
              />
              <span
                className={cn(
                  "text-caption font-medium",
                  isSelected ? "text-gold-500" : "text-neutral-600",
                )}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
      {selectedCategory && !findCategory(selectedCategory) && (
        <div className="p-3 bg-gold-50 border border-gold-200 rounded-[8px]">
          <p className="text-caption text-gold-700">
            The &ldquo;{selectedCategory}&rdquo; category will be created
            automatically when you add this expense.
          </p>
        </div>
      )}
      {error && <p className="text-caption text-danger-500">{error}</p>}
    </div>
  );
};
