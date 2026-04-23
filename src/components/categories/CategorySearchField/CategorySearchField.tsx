import { type ChangeEvent, type FC } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type CategorySearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export const CategorySearchField: FC<CategorySearchFieldProps> = ({
  value,
  onChange,
}) => (
  <Input
    value={value}
    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    placeholder="Search categories..."
    aria-label="Search categories"
    startAdornment={
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
    }
  />
);
