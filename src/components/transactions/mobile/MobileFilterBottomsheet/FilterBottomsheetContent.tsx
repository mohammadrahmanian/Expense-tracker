import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Category } from "@/types";
import type { DatePreset } from "@/lib/transactions.utils";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { FilterChipGroup } from "./FilterChipGroup";
import { AmountRangeInputs } from "./AmountRangeInputs";

export type DraftFilterState = {
  typeFilter: "all" | "INCOME" | "EXPENSE";
  datePreset: DatePreset;
  startDate: Date | undefined;
  endDate: Date | undefined;
  minAmount: number | undefined;
  maxAmount: number | undefined;
  categoryFilter: string;
  sortOption: string;
};

const TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "INCOME", label: "Income" },
  { value: "EXPENSE", label: "Expense" },
];

const DATE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
  { value: "custom_range", label: "Custom" },
];

const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
  { value: "amount_desc", label: "Highest" },
  { value: "amount_asc", label: "Lowest" },
];

export const toSortOption = (field: "date" | "amount", order: "asc" | "desc") =>
  `${field}_${order}`;

export const fromSortOption = (opt: string): { field: "date" | "amount"; order: "asc" | "desc" } => {
  const [field, order] = opt.split("_") as ["date" | "amount", "asc" | "desc"];
  return { field, order };
};

type FilterBottomsheetContentProps = {
  draft: DraftFilterState;
  categories: Category[] | undefined;
  onDraftChange: (patch: Partial<DraftFilterState>) => void;
  onReset: () => void;
  onApply: () => void;
  onCancel: () => void;
};

export const FilterBottomsheetContent: FC<FilterBottomsheetContentProps> = ({
  draft,
  categories,
  onDraftChange,
  onReset,
  onApply,
  onCancel,
}) => {
  const categoryOptions = [
    { value: "all", label: "All" },
    ...(categories?.map((c) => ({ value: c.id, label: c.name })) ?? []),
  ];

  return (
    <div className="flex flex-col gap-0 px-5 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-5">
        <h2 className="text-h2 font-semibold text-foreground">Filters</h2>
        <button type="button" onClick={onReset} className="text-[13px] font-medium text-primary">
          Reset All
        </button>
      </div>

      <div className="flex flex-col gap-5 divide-y divide-border dark:divide-neutral-700">
        <FilterChipGroup
          label="Transaction Type"
          options={TYPE_OPTIONS}
          selected={draft.typeFilter}
          onChange={(v) => onDraftChange({ typeFilter: v as DraftFilterState["typeFilter"] })}
        />

        <div className="pt-5">
          <FilterChipGroup
            label="Date Range"
            options={DATE_OPTIONS}
            selected={draft.datePreset ?? ""}
            onChange={(v) => onDraftChange({
              datePreset: v as DatePreset,
              ...(v !== "custom_range" && { startDate: undefined, endDate: undefined }),
            })}
          />
          {draft.datePreset === "custom_range" && (
            <div className="mt-3 flex flex-col items-center gap-2">
              <Calendar
                mode="range"
                selected={
                  draft.startDate || draft.endDate
                    ? { from: draft.startDate, to: draft.endDate }
                    : undefined
                }
                defaultMonth={draft.startDate}
                onSelect={(range: DateRange | undefined) =>
                  onDraftChange({ startDate: range?.from, endDate: range?.to })
                }
              />
              {draft.startDate && (
                <p className="text-caption text-muted-foreground">
                  {format(draft.startDate, "MMM dd, yyyy")}
                  {draft.endDate && ` — ${format(draft.endDate, "MMM dd, yyyy")}`}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="pt-5">
          <AmountRangeInputs
            minAmount={draft.minAmount}
            maxAmount={draft.maxAmount}
            onMinChange={(v) => onDraftChange({ minAmount: v })}
            onMaxChange={(v) => onDraftChange({ maxAmount: v })}
          />
        </div>

        {/* TODO: Switch to multi-select when backend supports multiple categoryIds */}
        <div className="pt-5">
          <FilterChipGroup
            label="Categories"
            options={categoryOptions}
            selected={draft.categoryFilter}
            onChange={(v) => onDraftChange({ categoryFilter: v })}
          />
        </div>

        <div className="pt-5">
          <FilterChipGroup
            label="Sort By"
            options={SORT_OPTIONS}
            selected={draft.sortOption}
            onChange={(v) => onDraftChange({ sortOption: v })}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 pt-6">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={onApply}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
