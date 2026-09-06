import { type FC } from "react";
import { Category } from "@/types";
import {
  QuickCategorySelect,
  QuickIncomeCategorySelect,
} from "../QuickCategorySelect";

type TransactionKind = "expense" | "income";

type QuickExpenseCategorySectionProps = {
  transactionKind: TransactionKind;
  categoryName: string;
  categories: Category[];
  onSelect: (name: string) => void;
  error?: string;
};

export const QuickExpenseCategorySection: FC<
  QuickExpenseCategorySectionProps
> = ({ transactionKind, categoryName, categories, onSelect, error }) => {
  return (
    // key remounts picker so tab switch resets local UI (e.g. Other)
    <div key={transactionKind} className="pt-6 pb-0 sm:pb-6">
      {transactionKind === "expense" ? (
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
