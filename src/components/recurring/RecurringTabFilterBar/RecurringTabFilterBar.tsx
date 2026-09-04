import { type FC } from "react";
import { cn } from "@/lib/utils";
import { RecurringTabFilterControls } from "./RecurringTabFilterControls";
import type {
  CategoryFilterProps,
  RecurringStatusFilter,
  SearchProps,
  StatusFilterProps,
  TypeFilterProps,
} from "@/lib/recurring-transactions.utils";
import type { Category } from "@/types";

const TABS: { value: RecurringStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "ended", label: "Ended" },
];

type RecurringTabFilterBarProps = {
  statusFilter: StatusFilterProps;
  totalAllCount: number;
  search: SearchProps;
  typeFilter: TypeFilterProps;
  categoryFilter: CategoryFilterProps;
  categories: Category[] | undefined;
};

export const RecurringTabFilterBar: FC<RecurringTabFilterBarProps> = ({
  statusFilter,
  totalAllCount,
  search,
  typeFilter,
  categoryFilter,
  categories,
}) => (
  <div className="flex flex-col gap-3 border-b border-border px-5 pb-0 md:flex-row md:items-center md:justify-between md:gap-0">
    <div className="flex items-center">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => statusFilter.onStatusFilterChange(tab.value)}
          className={cn(
            "px-4 py-3 text-[13px] font-medium transition-colors border-b-2",
            statusFilter.statusFilter === tab.value
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.value === "all" ? `All · ${totalAllCount}` : tab.label}
        </button>
      ))}
    </div>
    <RecurringTabFilterControls
      search={search}
      typeFilter={typeFilter}
      categoryFilter={categoryFilter}
      categories={categories}
    />
  </div>
);
