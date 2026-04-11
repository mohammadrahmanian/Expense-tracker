import { type FC } from "react";
import { Input } from "@/components/ui/input";

type AmountRangeInputsProps = {
  minAmount: number | undefined;
  maxAmount: number | undefined;
  onMinChange: (v: number | undefined) => void;
  onMaxChange: (v: number | undefined) => void;
};

const parseAmount = (raw: string): number | undefined => {
  if (!raw.trim()) return undefined;
  const n = Number(raw);
  return Number.isNaN(n) ? undefined : n;
};

export const AmountRangeInputs: FC<AmountRangeInputsProps> = ({
  minAmount,
  maxAmount,
  onMinChange,
  onMaxChange,
}) => (
  <div className="flex flex-col gap-2.5">
    <span className="text-caption font-medium text-muted-foreground">Amount Range</span>
    <div className="flex items-center gap-3">
      <Input
        type="number"
        inputMode="decimal"
        inputSize="sm"
        placeholder="Min"
        value={minAmount ?? ""}
        onChange={(e) => onMinChange(parseAmount(e.target.value))}
        startAdornment={<span className="text-caption text-muted-foreground">$</span>}
      />
      <span className="text-muted-foreground">—</span>
      <Input
        type="number"
        inputMode="decimal"
        inputSize="sm"
        placeholder="Max"
        value={maxAmount ?? ""}
        onChange={(e) => onMaxChange(parseAmount(e.target.value))}
        startAdornment={<span className="text-caption text-muted-foreground">$</span>}
      />
    </div>
  </div>
);
