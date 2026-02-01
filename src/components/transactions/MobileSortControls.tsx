import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";

interface MobileSortControlsProps {
  sortField: "date" | "amount";
  sortOrder: "asc" | "desc";
  onSort: (field: "date" | "amount") => void;
}

export function MobileSortControls({
  sortField,
  sortOrder,
  onSort,
}: MobileSortControlsProps) {
  const getSortIcon = (field: "date" | "amount") => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  };

  return (
    <div className="md:hidden flex items-center gap-2 mb-4">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Button
        variant={sortField === "date" ? "default" : "outline"}
        size="sm"
        onClick={() => onSort("date")}
        className="gap-1"
      >
        Date
        {getSortIcon("date")}
      </Button>
      <Button
        variant={sortField === "amount" ? "default" : "outline"}
        size="sm"
        onClick={() => onSort("amount")}
        className="gap-1"
      >
        Amount
        {getSortIcon("amount")}
      </Button>
    </div>
  );
}
