import { type FC } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TypeSelectProps {
  value: "INCOME" | "EXPENSE";
  onChange: (value: "INCOME" | "EXPENSE") => void;
  error?: string;
  required?: boolean;
}

export const TypeSelect: FC<TypeSelectProps> = ({
  value,
  onChange,
  error,
  required,
}) => (
  <div className="space-y-2">
    <Label>Type{required && <span className="text-red-500"> *</span>}</Label>
    <Select
      value={value}
      onValueChange={(v) => onChange(v as "INCOME" | "EXPENSE")}
    >
      <SelectTrigger className={error ? "border-red-500" : ""}>
        <SelectValue placeholder="Select type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="EXPENSE">Expense</SelectItem>
        <SelectItem value="INCOME">Income</SelectItem>
      </SelectContent>
    </Select>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
