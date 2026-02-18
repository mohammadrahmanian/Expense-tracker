import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateSelect } from "@/components/shared/DateSelect";
import { Category } from "@/types";
import { Filter, Search } from "lucide-react";

type TransactionsFiltersProps = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  typeFilter: "all" | "INCOME" | "EXPENSE";
  onTypeFilterChange: (value: "all" | "INCOME" | "EXPENSE") => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  startDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  endDate: Date | undefined;
  onEndDateChange: (date: Date | undefined) => void;
  categories: Category[] | undefined;
  onClearFilters: () => void;
};

export const TransactionsFilters: FC<TransactionsFiltersProps> = ({
  searchTerm,
  onSearchTermChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  categories,
  onClearFilters,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Filters</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid gap-4 md:grid-cols-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DateSelect
          label="Start date"
          placeholder="Start date"
          value={startDate}
          onChange={(date) => onStartDateChange(date ?? undefined)}
        />
        <DateSelect
          label="End date"
          placeholder="End date"
          value={endDate}
          onChange={(date) => onEndDateChange(date ?? undefined)}
        />
        <Button variant="outline" onClick={onClearFilters}>
          <Filter className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      </div>
    </CardContent>
  </Card>
);
