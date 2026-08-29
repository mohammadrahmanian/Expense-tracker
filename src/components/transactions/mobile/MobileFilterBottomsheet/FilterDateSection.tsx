import { type FC } from "react";
import type { DateRange } from "react-day-picker";
import type { DatePreset } from "@/lib/transactions.utils";
import { DateRangeCalendarPanel } from "@/components/transactions/DateRangeCalendarPanel";
import { FilterChipGroup } from "./FilterChipGroup";
import {
  DATE_OPTIONS,
  type DraftFilterState,
} from "./FilterBottomsheetContent.utils";

type FilterDateSectionProps = {
  draft: DraftFilterState;
  onDraftChange: (patch: Partial<DraftFilterState>) => void;
};

export const FilterDateSection: FC<FilterDateSectionProps> = ({
  draft,
  onDraftChange,
}) => (
  <div className="pt-5">
    <FilterChipGroup
      label="Date Range"
      options={DATE_OPTIONS}
      selected={draft.datePreset ?? ""}
      onChange={(v) =>
        onDraftChange({
          datePreset: v as DatePreset,
          ...(v !== "custom_range" && {
            startDate: undefined,
            endDate: undefined,
          }),
        })
      }
    />
    {draft.datePreset === "custom_range" && (
      <DateRangeCalendarPanel
        mode="range"
        selectedRange={
          draft.startDate || draft.endDate
            ? { from: draft.startDate, to: draft.endDate }
            : undefined
        }
        onRangeChange={(range: DateRange | undefined) =>
          onDraftChange({ startDate: range?.from, endDate: range?.to })
        }
        footer="summary"
        size="comfortable"
        className="mt-3"
      />
    )}
  </div>
);
