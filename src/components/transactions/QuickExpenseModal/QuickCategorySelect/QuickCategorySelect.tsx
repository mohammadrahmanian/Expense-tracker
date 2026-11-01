import { useMemo, useState, type FC } from "react";
import { Category } from "@/types";
import { QuickCategoryEmptyState } from "./QuickCategoryEmptyState";
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
  const [otherRequested, setOtherRequested] = useState(false);
  // Derived so a selection hidden by a breakpoint change stays visible in Other.
  const otherExpanded =
    isOtherCategory || (otherRequested && selectedCategory === "");

  const handleCardClick = (name: string) => {
    setOtherRequested(false);
    onSelect(name);
  };
  const handleOtherClick = () => {
    setOtherRequested(true);
    if (!isOtherCategory) onSelect("");
  };
  const handleOtherSelect = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    if (cat) onSelect(cat.name);
  };

  const selectedCategoryId = isOtherCategory
    ? categories.find(
        (c) => c.name.toLowerCase() === selectedCategory.toLowerCase(),
      )?.id
    : undefined;
  const otherSelectCategories = categories.filter(
    (cat) => !quickNames.has(cat.name.toLowerCase()),
  );

  if (categories.length === 0) {
    return <QuickCategoryEmptyState transactionKind="expense" />;
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
        onOtherClick={handleOtherClick}
        onOtherSelect={handleOtherSelect}
      />
      {error && <p className="text-caption text-danger-500">{error}</p>}
    </div>
  );
};
