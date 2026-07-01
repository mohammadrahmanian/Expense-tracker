import { type FC } from "react";
import { cn } from "@/lib/utils";
import type {
  StatusFilterProps,
  TypeFilterProps,
} from "@/lib/recurring-transactions.utils";

type MobileRecurringChipsProps = {
  statusFilter: StatusFilterProps;
  typeFilter: TypeFilterProps;
};

type ChipDef = {
  label: string;
  isSelected: (sf: StatusFilterProps, tf: TypeFilterProps) => boolean;
  onClick: (sf: StatusFilterProps, tf: TypeFilterProps) => void;
};

const CHIPS: ChipDef[] = [
  {
    label: "All",
    isSelected: (sf, tf) =>
      sf.statusFilter === "all" && tf.typeFilter === "all",
    onClick: (sf, tf) => {
      sf.onStatusFilterChange("all");
      tf.onTypeFilterChange("all");
    },
  },
  {
    label: "Active",
    isSelected: (sf) => sf.statusFilter === "active",
    onClick: (sf) => sf.onStatusFilterChange("active"),
  },
  {
    label: "Paused",
    isSelected: (sf) => sf.statusFilter === "paused",
    onClick: (sf) => sf.onStatusFilterChange("paused"),
  },
  {
    label: "Income",
    isSelected: (_, tf) => tf.typeFilter === "INCOME",
    onClick: (_, tf) => tf.onTypeFilterChange("INCOME"),
  },
  {
    label: "Expenses",
    isSelected: (_, tf) => tf.typeFilter === "EXPENSE",
    onClick: (_, tf) => tf.onTypeFilterChange("EXPENSE"),
  },
];

export const MobileRecurringChips: FC<MobileRecurringChipsProps> = ({
  statusFilter,
  typeFilter,
}) => (
  <div className="flex items-center gap-2 overflow-x-auto px-5 py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    {CHIPS.map((chip) => {
      const selected = chip.isSelected(statusFilter, typeFilter);
      return (
        <button
          key={chip.label}
          type="button"
          onClick={() => chip.onClick(statusFilter, typeFilter)}
          className={cn(
            "whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-colors shrink-0",
            selected
              ? "bg-primary text-primary-foreground"
              : "bg-surface text-foreground border border-border",
          )}
        >
          {chip.label}
        </button>
      );
    })}
  </div>
);
