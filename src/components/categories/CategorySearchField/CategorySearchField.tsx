import { type FC } from "react";
import { SearchBar } from "@/components/ui/search-bar";

type CategorySearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export const CategorySearchField: FC<CategorySearchFieldProps> = ({
  value,
  onChange,
}) => (
  <SearchBar
    value={value}
    onChange={onChange}
    placeholder="Search categories..."
    ariaLabel="Search categories"
  />
);
