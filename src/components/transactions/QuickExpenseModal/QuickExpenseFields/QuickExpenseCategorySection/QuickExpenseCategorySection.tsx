import { type FC } from "react";
import { Category } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  QuickCategorySelect,
  QuickIncomeCategorySelect,
} from "../../QuickCategorySelect";

type TransactionKind = "expense" | "income";

type QuickExpenseCategorySectionProps = {
  transactionKind: TransactionKind;
  categoryName: string;
  categories: Category[];
  isLoading: boolean;
  onSelect: (name: string) => void;
  error?: string;
};

export const QuickExpenseCategorySection: FC<
  QuickExpenseCategorySectionProps
> = ({
  transactionKind,
  categoryName,
  categories,
  isLoading,
  onSelect,
  error,
}) => {
  return (
    // key remounts picker so tab switch resets local UI (e.g. Other)
    <div key={transactionKind} className="pt-6 pb-0 sm:pb-6">
      {isLoading ? (
        // Avoid flashing the "no categories" empty state before data arrives
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton
              key={i}
              className="h-14 sm:h-20 rounded-md last:hidden sm:last:block"
            />
          ))}
        </div>
      ) : transactionKind === "expense" ? (
        <QuickCategorySelect
          selectedCategory={categoryName}
          onSelect={onSelect}
          categories={categories}
          error={error}
        />
      ) : (
        <QuickIncomeCategorySelect
          selectedCategory={categoryName}
          onSelect={onSelect}
          categories={categories}
          error={error}
        />
      )}
    </div>
  );
};
