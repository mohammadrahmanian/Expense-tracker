import { PillTabsItem, PillTabsList } from "@/components/ui/pill-tabs";
import type {
  StatusFilterProps,
  TypeFilterProps,
} from "@/lib/recurring-transactions.utils";
import { type FC } from "react";

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
  <PillTabsList>
    {CHIPS.map((chip) => {
      const selected = chip.isSelected(statusFilter, typeFilter);
      return (
        <PillTabsItem
          key={chip.label}
          onClick={() => chip.onClick(statusFilter, typeFilter)}
          selected={selected}
        >
          {chip.label}
        </PillTabsItem>
      );
    })}
  </PillTabsList>
);
