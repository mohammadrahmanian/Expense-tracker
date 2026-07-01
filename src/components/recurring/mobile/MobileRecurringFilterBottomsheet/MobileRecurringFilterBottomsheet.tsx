import { type FC } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
  CategoryFilterProps,
  RecurringStatusFilter,
  RecurringTypeFilter,
  StatusFilterProps,
  TypeFilterProps,
} from "@/lib/recurring-transactions.utils";
import type { Category } from "@/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statusFilter: StatusFilterProps;
  typeFilter: TypeFilterProps;
  categoryFilter: CategoryFilterProps;
  categories: Category[] | undefined;
};

const STATUS_CHIPS: { value: RecurringStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "ended", label: "Ended" },
];
const TYPE_CHIPS: { value: RecurringTypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "INCOME", label: "Income" },
  { value: "EXPENSE", label: "Expenses" },
];

export const MobileRecurringFilterBottomsheet: FC<Props> = ({
  open,
  onOpenChange,
  statusFilter,
  typeFilter,
  categoryFilter,
  categories,
}) => {
  const handleClear = () => {
    statusFilter.onStatusFilterChange("all");
    typeFilter.onTypeFilterChange("all");
    categoryFilter.onCategoryFilterChange("all");
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90dvh]">
        <DrawerTitle className="sr-only">Filters</DrawerTitle>
        <div className="overflow-y-auto pt-2 pb-6 space-y-5 px-5">
          <h2 className="text-base font-semibold">Filters</h2>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Status
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUS_CHIPS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => statusFilter.onStatusFilterChange(c.value)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold border transition-colors",
                    statusFilter.statusFilter === c.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface text-foreground border-border",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Type
            </p>
            <div className="flex flex-wrap gap-2">
              {TYPE_CHIPS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => typeFilter.onTypeFilterChange(c.value)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold border transition-colors",
                    typeFilter.typeFilter === c.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface text-foreground border-border",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Category
            </p>
            <Select
              value={categoryFilter.categoryFilter}
              onValueChange={categoryFilter.onCategoryFilterChange}
            >
              <SelectTrigger>
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
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleClear}>
              Clear filters
            </Button>
            <Button className="flex-1" onClick={() => onOpenChange(false)}>
              Apply
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
