import { type FC } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { currencySymbols, useCurrency } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";

type MonthlyBudgetFieldProps = {
  value: number | null;
  onChange: (v: number | null) => void;
  error?: string;
};

const parseBudget = (raw: string): number | null => {
  if (raw === "" || raw === ".") return null;
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n)) return null;
  return n;
};

export const MonthlyBudgetField: FC<MonthlyBudgetFieldProps> = ({ value, onChange, error }) => {
  const { currency } = useCurrency();
  const symbol = currencySymbols[currency];

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-1">
      <div className="flex items-center justify-between">
        <Label htmlFor="monthly-budget" className="text-xs font-semibold text-foreground">
          Monthly budget
        </Label>
        <span className="text-[11px] text-muted-foreground">{currency}</span>
      </div>
      <div
        className={cn(
          "flex h-11 items-center gap-2 rounded-md border border-border bg-background px-3.5",
          error && "border-red-500",
        )}
      >
        <span className="shrink-0 text-sm font-semibold text-muted-foreground">{symbol}</span>
        <Input
          id="monthly-budget"
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          className="h-9 flex-1 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
          value={value === null ? "" : String(value)}
          onChange={(e) => onChange(parseBudget(e.target.value))}
        />
        <span className="shrink-0 text-[11px] text-muted-foreground">/ month</span>
      </div>
      {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
};
