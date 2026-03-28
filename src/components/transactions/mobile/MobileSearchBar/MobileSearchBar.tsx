import { type FC } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type MobileSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export const MobileSearchBar: FC<MobileSearchBarProps> = ({
  value,
  onChange,
}) => (
  <div className="px-0 pb-4">
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search transactions..."
      className="text-sm font-medium placeholder:text-muted-foreground"
      wrapperClassName="h-auto border-primary bg-surface px-3.5 py-2.5 dark:bg-neutral-900"
      startAdornment={
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
      }
      endAdornment={
        value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted-foreground text-white"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        ) : undefined
      }
    />
  </div>
);
