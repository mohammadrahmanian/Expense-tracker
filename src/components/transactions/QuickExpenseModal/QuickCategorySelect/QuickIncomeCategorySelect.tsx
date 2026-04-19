import { useState, type FC } from "react";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { incomeCategories } from "../QuickExpenseModal.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";

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
    ? categories.find(
        (c) => c.name.toLowerCase() === selectedCategory.toLowerCase(),
      )?.id
    : undefined;

  const otherSelectCategories = categories.filter(
    (cat) => !QUICK_INCOME_NAMES.has(cat.name.toLowerCase()),
  );

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
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {incomeCategories.map((cat) => {
          const Icon = cat.icon;
          const isSelected =
            cat.name === "Other"
              ? otherExpanded
              : selectedCategory.toLowerCase() === cat.name.toLowerCase();

          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => handleCardClick(cat.name)}
              className={cn(
                "flex h-20 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md transition-colors",
                isSelected
                  ? "border-2 border-gold-500 bg-gold-50 text-gold-500 dark:bg-gold-500/10 dark:border-gold-500 dark:text-gold-400"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700",
              )}
            >
              <Icon className="h-[22px] w-[22px]" />
              <span className="text-[11px] font-semibold">{cat.name}</span>
            </button>
          );
        })}
      </div>

      <Collapsible open={otherExpanded}>
        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <div className="px-px pt-1">
            <Select
              value={selectedCategoryId ?? ""}
              onValueChange={handleOtherSelect}
            >
              <SelectTrigger variant="underlined">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {otherSelectCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {selectedCategory && !findCategory(selectedCategory) && !otherExpanded && (
        <p className="text-caption text-gold-700 bg-gold-50 border border-gold-200 rounded-md p-3 dark:bg-gold-900 dark:text-gold-200 dark:border-gold-700">
          &ldquo;{selectedCategory}&rdquo; category will be created
          automatically.
        </p>
      )}
      {error && <p className="text-caption text-danger-500">{error}</p>}
    </div>
  );
};
