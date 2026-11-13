import { type FC } from "react";
import { SearchBar } from "@/components/ui/search-bar";

type MobileSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export const MobileSearchBar: FC<MobileSearchBarProps> = ({
  value,
  onChange,
}) => (
  <div className="px-0 pb-4">
    <SearchBar
      value={value}
      onChange={onChange}
      placeholder="Search transactions..."
      ariaLabel="Search transactions"
      showClearButton
    />
  </div>
);
