import { useMemo, useState, type FC } from "react";
import { Category } from "@/types";
import { useMediaQuery } from "@/hooks/use-media-query";
import { QuickCategoryGrid } from "./QuickCategoryGrid";
import {
  EXPENSE_QUICK_PICK_NAMES,
  resolveQuickPickCategories,
} from "./QuickCategorySelect.utils";

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
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const quickPickCategories = useMemo(
    () => resolveQuickPickCategories(categories, EXPENSE_QUICK_PICK_NAMES),
    [categories],
  );
  const visibleQuickPicks = isDesktop
    ? quickPickCategories
    : quickPickCategories.slice(0, 4);
  const quickNames = useMemo(
    () => new Set(visibleQuickPicks.map((c) => c.name.toLowerCase())),
    [visibleQuickPicks],
  );
  const isOtherCategory =
    selectedCategory !== "" && !quickNames.has(selectedCategory.toLowerCase());
  const [otherExpanded, setOtherExpanded] = useState(isOtherCategory);

  const handleCardClick = (name: string) => {
    if (name === "Other") {
      setOtherExpanded(true);
      if (!isOtherCategory) onSelect("");
    } else {
      setOtherExpanded(false);
      onSelect(name);
    }
  };
  const handleOtherSelect = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    if (cat) onSelect(cat.name);
  };

  const findCategory = (name: string) =>
    categories.find((cat) => cat.name.toLowerCase() === name.toLowerCase());

  const selectedCategoryId = isOtherCategory
    ? categories.find(
        (c) => c.name.toLowerCase() === selectedCategory.toLowerCase(),
      )?.id
    : undefined;
  const otherSelectCategories = categories.filter(
    (cat) => !quickNames.has(cat.name.toLowerCase()),
  );

  if (categories.length === 0) {
    return (
      <div className="space-y-4">
        <span className="text-overline text-neutral-500 uppercase tracking-[1.5px]">
          Category
        </span>
        <p className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-[13px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/40 dark:text-neutral-400">
          You don&apos;t have any expense categories yet. Add categories in your
          category settings, then come back here to record an expense.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <span className="text-overline text-neutral-500 uppercase tracking-[1.5px]">
        Category
      </span>
      <QuickCategoryGrid
        quickPickCategories={visibleQuickPicks}
        selectedCategory={selectedCategory}
        otherExpanded={otherExpanded}
        otherSelectCategories={otherSelectCategories}
        selectedCategoryId={selectedCategoryId}
        onCardClick={handleCardClick}
        onOtherSelect={handleOtherSelect}
      />

      {selectedCategory &&
        !findCategory(selectedCategory) &&
        !otherExpanded && (
          <p className="text-caption text-gold-700 bg-gold-50 border border-gold-200 rounded-md p-3 dark:bg-gold-900 dark:text-gold-200 dark:border-gold-700">
            &ldquo;{selectedCategory}&rdquo; category will be created
            automatically.
          </p>
        )}
      {error && <p className="text-caption text-danger-500">{error}</p>}
    </div>
  );
};
