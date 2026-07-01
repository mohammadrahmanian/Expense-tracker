import { type FC } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type MobileRecurringSearchBarProps = {
  value: string;
  onChange: (v: string) => void;
};

export const MobileRecurringSearchBar: FC<MobileRecurringSearchBarProps> = ({
  value,
  onChange,
}) => (
  <div className="px-5 py-1.5">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search recurring"
        aria-label="Search recurring transactions"
        className="pl-9"
      />
    </div>
  </div>
);
