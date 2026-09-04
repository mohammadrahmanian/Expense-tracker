import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CategoryFilterProps,
  SearchProps,
  TypeFilterProps,
} from "@/lib/recurring-transactions.utils";
import type { Category } from "@/types";
import { Search, X } from "lucide-react";
import { type FC } from "react";

type RecurringTabFilterControlsProps = {
  search: SearchProps;
  typeFilter: TypeFilterProps;
  categoryFilter: CategoryFilterProps;
  categories: Category[] | undefined;
};

export const RecurringTabFilterControls: FC<
  RecurringTabFilterControlsProps
> = ({ search, typeFilter, categoryFilter, categories }) => (
  <div className="flex items-center gap-2.5 pb-3 md:pb-0">
    <div className="relative w-[200px]">
      <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={search.searchTerm}
        onChange={(e) => search.onSearchTermChange(e.target.value)}
        placeholder="Search recurring…"
        aria-label="Search recurring transactions"
        className="h-8 pl-8 pr-8 text-xs"
      />
      {search.searchTerm && (
        <button
          type="button"
          onClick={() => search.onSearchTermChange("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/80 p-0.5 text-white hover:bg-muted-foreground dark:text-background dark:hover:bg-muted-foreground"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </div>
    <Select
      value={typeFilter.typeFilter}
      onValueChange={(v) =>
        typeFilter.onTypeFilterChange(v as "all" | "INCOME" | "EXPENSE")
      }
    >
      <SelectTrigger className="h-8 w-[140px] text-xs">
        <SelectValue placeholder="All types" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All types</SelectItem>
        <SelectItem value="INCOME">Income</SelectItem>
        <SelectItem value="EXPENSE">Expenses</SelectItem>
      </SelectContent>
    </Select>
    <Select
      value={categoryFilter.categoryFilter}
      onValueChange={categoryFilter.onCategoryFilterChange}
    >
      <SelectTrigger className="h-8 w-[160px] text-xs">
        <SelectValue placeholder="All categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All categories</SelectItem>
        {categories?.map((cat) => (
          <SelectItem key={cat.id} value={cat.id}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
