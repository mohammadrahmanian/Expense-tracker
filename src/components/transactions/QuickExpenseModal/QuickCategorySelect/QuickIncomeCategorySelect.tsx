import { type FC } from "react";
import { cn } from "@/lib/utils";
import { Category } from "@/types";

type QuickIncomeCategorySelectProps = {
  selectedCategory: string;
  onSelect: (name: string) => void;
  categories: Category[];
  error?: string;
};

export const QuickIncomeCategorySelect: FC<QuickIncomeCategorySelectProps> = ({
  selectedCategory,
  onSelect,
  categories,
  error,
}) => {
  if (categories.length === 0) {
    return (
      <div className="space-y-4">
        <span className="text-overline text-neutral-500 uppercase tracking-[1.5px]">
          Category
        </span>
        <p className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-[13px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/40 dark:text-neutral-400">
          You don&apos;t have any income categories yet. Add categories in your
          category settings, then come back here to record income.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <span className="text-overline text-neutral-500 uppercase tracking-[1.5px]">
        Category
      </span>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {categories.map((cat) => {
          const isSelected =
            selectedCategory.toLowerCase() === cat.name.toLowerCase();
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.name)}
              className={cn(
                "flex min-h-20 flex-col items-center justify-center gap-2 rounded-md px-2 py-3 transition-colors",
                isSelected
                  ? "border-2 border-gold-500 bg-gold-50 text-gold-600 dark:border-gold-500 dark:bg-gold-500/10 dark:text-gold-400"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700",
              )}
            >
              <div
                className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white dark:ring-neutral-900"
                style={{ backgroundColor: cat.color }}
              />
              <span className="line-clamp-2 text-center text-[11px] font-semibold">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
      {error && <p className="text-caption text-danger-500">{error}</p>}
    </div>
  );
};
