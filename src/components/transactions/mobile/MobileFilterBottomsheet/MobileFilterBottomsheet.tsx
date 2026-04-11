import { useCallback, useEffect, useState, type FC } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Category } from "@/types";
import type { TransactionFilterState } from "@/lib/transactions.utils";
import type { BulkFilterPayload } from "@/hooks/useTransactionFilters";
import {
  FilterBottomsheetContent,
  type DraftFilterState,
  toSortOption,
  fromSortOption,
} from "./FilterBottomsheetContent";

type MobileFilterBottomsheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filterState: TransactionFilterState;
  categories: Category[] | undefined;
  onApply: (payload: BulkFilterPayload) => void;
};

const DEFAULT_DRAFT: DraftFilterState = {
  typeFilter: "all",
  datePreset: "this_month",
  startDate: undefined,
  endDate: undefined,
  minAmount: undefined,
  maxAmount: undefined,
  categoryFilter: "all",
  sortOption: "date_desc",
};

const snapshotToDraft = (s: TransactionFilterState): DraftFilterState => ({
  typeFilter: s.typeFilter,
  datePreset: s.datePreset,
  startDate: s.startDate,
  endDate: s.endDate,
  minAmount: s.minAmount,
  maxAmount: s.maxAmount,
  categoryFilter: s.categoryFilter,
  sortOption: toSortOption(s.sortField, s.sortOrder),
});

export const MobileFilterBottomsheet: FC<MobileFilterBottomsheetProps> = ({
  open,
  onOpenChange,
  filterState,
  categories,
  onApply,
}) => {
  const [draft, setDraft] = useState<DraftFilterState>(DEFAULT_DRAFT);

  useEffect(() => {
    if (open) setDraft(snapshotToDraft(filterState));
  }, [open, filterState]);

  const handleDraftChange = useCallback((patch: Partial<DraftFilterState>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleReset = useCallback(() => setDraft(DEFAULT_DRAFT), []);

  const handleApply = useCallback(() => {
    const { field, order } = fromSortOption(draft.sortOption);
    onApply({
      typeFilter: draft.typeFilter,
      datePreset: draft.datePreset,
      startDate: draft.startDate,
      endDate: draft.endDate,
      minAmount: draft.minAmount,
      maxAmount: draft.maxAmount,
      categoryFilter: draft.categoryFilter,
      sortField: field,
      sortOrder: order,
    });
    onOpenChange(false);
  }, [draft, onApply, onOpenChange]);

  const handleCancel = useCallback(() => onOpenChange(false), [onOpenChange]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90dvh]">
        <DrawerTitle className="sr-only">Filters</DrawerTitle>
        <div className="overflow-y-auto pt-2">
          <FilterBottomsheetContent
            draft={draft}
            categories={categories}
            onDraftChange={handleDraftChange}
            onReset={handleReset}
            onApply={handleApply}
            onCancel={handleCancel}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
