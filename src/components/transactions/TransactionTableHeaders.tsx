import { Button } from "@/components/ui/button";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

interface TransactionTableHeadersProps {
  sortField: "date" | "amount";
  sortOrder: "asc" | "desc";
  onSort: (field: "date" | "amount") => void;
}

export function TransactionTableHeaders({
  sortField,
  sortOrder,
  onSort,
}: TransactionTableHeadersProps) {
  const getSortIcon = (field: "date" | "amount") => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead>Title</TableHead>
        <TableHead>Category</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("date")}
            className="h-8 px-2 lg:px-3"
          >
            Date
            {getSortIcon("date")}
          </Button>
        </TableHead>
        <TableHead className="text-right">
          <Button
            variant="ghost"
            onClick={() => onSort("amount")}
            className="h-8 px-2 lg:px-3"
          >
            Amount
            {getSortIcon("amount")}
          </Button>
        </TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
