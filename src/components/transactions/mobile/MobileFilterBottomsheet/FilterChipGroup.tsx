import { type FC } from "react";
import { Chip } from "@/components/ui/chip";

type ChipOption = {
  value: string;
  label: string;
};

type FilterChipGroupProps = {
  label: string;
  options: ChipOption[];
  selected: string;
  onChange: (value: string) => void;
};

export const FilterChipGroup: FC<FilterChipGroupProps> = ({
  label,
  options,
  selected,
  onChange,
}) => (
  <div className="flex flex-col gap-2.5">
    <span className="text-caption font-medium text-muted-foreground">{label}</span>
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
      {options.map((opt) => (
        <Chip
          key={opt.value}
          variant="outlined"
          selected={selected === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Chip>
      ))}
    </div>
  </div>
);
