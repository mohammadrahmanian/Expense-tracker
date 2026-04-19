import { useState, type FC } from "react";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { quickCategories } from "../QuickExpenseModal.types";
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

const QUICK_NAMES = new Set(
  quickCategories.filter((c) => c.name !== "Other").map((c) => c.name.toLowerCase()),
);

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
  const isOtherCategory = selectedCategory !== "" && !QUICK_NAMES.has(selectedCategory.toLowerCase());
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
    ? categories.find((c) => c.name.toLowerCase() === selectedCategory.toLowerCase())?.id
    : undefined;

  return (
    <div className="space-y-4">
      <span className="text-overline text-neutral-500 uppercase tracking-[1.5px]">
        Category
      </span>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {quickCategories.map((cat) => {
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

      <Collapsible open={otherExpanded}>
        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <div className="px-px pt-1">
            <Select value={selectedCategoryId ?? ""} onValueChange={handleOtherSelect}>
              <SelectTrigger className="rounded-t-sm rounded-b-none border-0 border-b border-b-neutral-400 bg-neutral-100 data-[state=open]:border-b-2 data-[state=open]:border-b-gold-500 data-[state=open]:rounded-b-none focus-visible:border-b-2 focus-visible:border-b-gold-500 dark:border-b-neutral-600 dark:bg-neutral-800 dark:data-[state=open]:border-b-2 dark:data-[state=open]:border-b-gold-500 dark:focus-visible:border-b-2 dark:focus-visible:border-b-gold-500">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
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
