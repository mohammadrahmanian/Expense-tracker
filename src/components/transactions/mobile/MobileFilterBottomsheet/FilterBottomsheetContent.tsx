import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";
import { FilterChipGroup } from "./FilterChipGroup";
import { AmountRangeInputs } from "./AmountRangeInputs";
import { FilterDateSection } from "./FilterDateSection";
import {
  TYPE_OPTIONS,
  SORT_OPTIONS,
  type DraftFilterState,
} from "./FilterBottomsheetContent.utils";

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
        <button
          type="button"
          onClick={onReset}
          className="text-[13px] font-medium text-primary"
        >
          Reset All
        </button>
      </div>
      <div className="flex flex-col gap-5 divide-y divide-border dark:divide-neutral-700">
        <FilterChipGroup
          label="Transaction Type"
          options={TYPE_OPTIONS}
          selected={draft.typeFilter}
          onChange={(v) =>
            onDraftChange({ typeFilter: v as DraftFilterState["typeFilter"] })
          }
        />

        <FilterDateSection draft={draft} onDraftChange={onDraftChange} />

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
