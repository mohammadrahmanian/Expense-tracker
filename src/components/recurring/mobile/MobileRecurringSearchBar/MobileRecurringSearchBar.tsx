import { SearchBar } from "@/components/ui/search-bar";
import { type FC } from "react";

type MobileRecurringSearchBarProps = {
  value: string;
  onChange: (v: string) => void;
};

export const MobileRecurringSearchBar: FC<MobileRecurringSearchBarProps> = ({
  value,
  onChange,
}) => (
  <SearchBar
    value={value}
    onChange={onChange}
    placeholder="Search recurring"
    ariaLabel="Search recurring transactions"
  />
);
