import { type FC } from "react";
import { ICON_BY_NAME } from "@/components/categories/CategoryFormDialog/CategoryFormDialog.constants";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Category } from "@/types";

type CategorySelectProps = {
  value: string;
  onChange: (value: string) => void;
  categories: Category[];
  error?: string;
  required?: boolean;
};

const CategoryIconChip: FC<{ category: Category }> = ({ category }) => {
  const Icon = ICON_BY_NAME[category.icon ?? "utensils"] ?? ICON_BY_NAME.utensils;
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-gold-50 dark:bg-gold-700/25">
      <Icon className="h-3.5 w-3.5" style={{ color: category.color }} />
    </span>
  );
};

export const CategorySelect: FC<CategorySelectProps> = ({
  value,
  onChange,
  categories,
  error,
  required,
}) => {
  const selected = categories.find((category) => category.id === value);

  return (
    <div className="space-y-2">
      <Label>
        Category{required && <span className="text-danger-500"> *</span>}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn(error && "border-danger-500")}>
          {selected ? (
            <div className="flex items-center gap-2 min-w-0">
              <CategoryIconChip category={selected} />
              <span className="truncate">{selected.name}</span>
            </div>
          ) : (
            <SelectValue placeholder="Select category" />
          )}
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <div className="flex items-center gap-2">
                <CategoryIconChip category={category} />
                <span>{category.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-danger-500">{error}</p>}
    </div>
  );
};
