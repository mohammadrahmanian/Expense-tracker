import { useState, type FC } from "react";
import { Category } from "@/types";
import { QuickCategoryEmptyState } from "./QuickCategoryEmptyState";
import { incomeCategories } from "../QuickExpenseModal.types";
import { QuickCategoryCard } from "./QuickCategoryCard";
import { QuickCategoryOtherSelect } from "./QuickCategoryOtherSelect";

const QUICK_INCOME_NAMES = new Set(
  incomeCategories
    .filter((c) => c.name !== "Other")
    .map((c) => c.name.toLowerCase()),
);

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
  const isOtherCategory =
    selectedCategory !== "" &&
    !QUICK_INCOME_NAMES.has(selectedCategory.toLowerCase());
  const [otherExpanded, setOtherExpanded] = useState(isOtherCategory);

  const findCategory = (name: string) =>
    categories.find((cat) => cat.name.toLowerCase() === name.toLowerCase());

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

  const selectedCategoryId = isOtherCategory
    ? findCategory(selectedCategory)?.id
    : undefined;
  const otherSelectCategories = categories.filter(
    (cat) => !QUICK_INCOME_NAMES.has(cat.name.toLowerCase()),
  );

  if (categories.length === 0) {
    return <QuickCategoryEmptyState transactionKind="income" />;
  }

  return (
    <div className="space-y-4">
      <span className="text-overline text-neutral-500 uppercase tracking-[1.5px]">
        Category
      </span>
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
        {incomeCategories.map((cat) => (
          <QuickCategoryCard
            key={cat.name}
            icon={cat.icon}
            label={cat.name}
            isSelected={
              cat.name === "Other"
                ? otherExpanded
                : selectedCategory.toLowerCase() === cat.name.toLowerCase()
            }
            onClick={() => handleCardClick(cat.name)}
          />
        ))}
      </div>

      <QuickCategoryOtherSelect
        open={otherExpanded}
        categories={otherSelectCategories}
        selectedCategoryId={selectedCategoryId}
        onSelect={handleOtherSelect}
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
