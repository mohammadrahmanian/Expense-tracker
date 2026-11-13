import { type FC } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  showClearButton?: boolean;
};

export const SearchBar: FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder,
  ariaLabel,
  showClearButton = false,
}) => (
  <Input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    aria-label={ariaLabel}
    className="text-base"
    startAdornment={
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
    }
    endAdornment={
      showClearButton && value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted-foreground text-white"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      ) : undefined
    }
  />
);
