import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AmountFieldProps = {
  currencySymbol: string;
  error?: string;
  required?: boolean;
} & Omit<React.ComponentProps<typeof Input>, "type">;

export const AmountField = React.forwardRef<HTMLInputElement, AmountFieldProps>(
  ({ currencySymbol, error, required, id = "amount", className, ...inputProps }, ref) => (
    <div className="space-y-2">
      <Label htmlFor={id}>
        Amount ({currencySymbol})
        {required && <span className="text-red-500"> *</span>}
      </Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {currencySymbol}
        </span>
        <Input
          ref={ref}
          id={id}
          type="text"
          inputMode="decimal"
          placeholder="0.00 or 0,00"
          className={cn("pl-8", error && "border-red-500", className)}
          {...inputProps}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  ),
);

AmountField.displayName = "AmountField";
