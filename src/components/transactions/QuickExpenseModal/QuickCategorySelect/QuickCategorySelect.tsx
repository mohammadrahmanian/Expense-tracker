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
    <div className="space-y-4">
      <span className="text-overline text-neutral-500 uppercase tracking-[1.5px]">
        Category
      </span>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {quickCategories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.name;

          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => onSelect(cat.name)}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 h-20 rounded-md transition-colors cursor-pointer",
                isSelected
                  ? "bg-gold-50 border-2 border-gold-500 text-gold-500 dark:bg-gold-500/10 dark:border-gold-500 dark:text-gold-400"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700",
              )}
            >
              <Icon className="h-[22px] w-[22px]" />
              <span className="text-[11px] font-semibold">{cat.name}</span>
            </button>
          );
        })}
      </div>
      {selectedCategory && !findCategory(selectedCategory) && (
        <p className="text-caption text-gold-700 bg-gold-50 border border-gold-200 rounded-md p-3 dark:bg-gold-900 dark:text-gold-200 dark:border-gold-700">
          &ldquo;{selectedCategory}&rdquo; category will be created
          automatically.
        </p>
      )}
      {error && <p className="text-caption text-danger-500">{error}</p>}
    </div>
  );
};
