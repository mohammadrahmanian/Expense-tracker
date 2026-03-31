import { type FC } from "react";
import { TransactionTabFilterControls } from "./TransactionTabFilterControls";
import { type DateFilterProps, type SearchProps, type TypeFilterProps } from "@/lib/transactions.utils";
import { cn } from "@/lib/utils";
import { Category } from "@/types";

const TABS: { value: TypeFilterProps["typeFilter"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "INCOME", label: "Income" },
  { value: "EXPENSE", label: "Expenses" },
];

type TransactionTabFilterBarProps = {
  typeFilter: TypeFilterProps;
  search: SearchProps;
  dateFilter: DateFilterProps;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  categories: Category[] | undefined;
};

export const TransactionTabFilterBar: FC<TransactionTabFilterBarProps> = ({
  typeFilter,
  search,
  dateFilter,
  categoryFilter,
  onCategoryFilterChange,
  categories,
}) => (
  <div className="flex flex-col gap-3 border-b border-border px-5 pb-0 md:flex-row md:items-center md:justify-between md:gap-0">
    <div className="flex items-center">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => typeFilter.onTypeFilterChange(tab.value)}
          className={cn(
            "px-4 py-3 text-[13px] font-medium transition-colors border-b-2",
            typeFilter.typeFilter === tab.value
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
    <TransactionTabFilterControls
      search={search}
      dateFilter={dateFilter}
      categoryFilter={categoryFilter}
      onCategoryFilterChange={onCategoryFilterChange}
      categories={categories}
    />
  </div>
);
