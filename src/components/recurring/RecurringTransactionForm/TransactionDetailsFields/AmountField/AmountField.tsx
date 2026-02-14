import { type FC, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AmountFieldProps = {
  currencySymbol: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const AmountField: FC<AmountFieldProps> = ({
  currencySymbol,
  value,
  onChange,
}) => (
  <div className="space-y-2">
    <Label htmlFor="amount">
      Amount ({currencySymbol}) <span className="text-red-500">*</span>
    </Label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
        {currencySymbol}
      </span>
      <Input
        id="amount"
        type="text"
        placeholder="0.00 or 0,00"
        value={value}
        onChange={onChange}
        className="pl-8"
        required
      />
    </div>
  </div>
);
