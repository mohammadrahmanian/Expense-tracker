import { type FC } from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";

type TransactionTableHeadersProps = {
  sortField: "date" | "amount";
  sortOrder: "asc" | "desc";
  onSort: (field: "date" | "amount") => void;
};

export const TransactionTableHeaders: FC<TransactionTableHeadersProps> = ({
  sortField,
  sortOrder,
  onSort,
}) => {
  const SortIcon = ({ field }: { field: "date" | "amount" }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3" />;
    return sortOrder === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  };

  const thClass = "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground";

  return (
    <TableHeader className="bg-neutral-50 dark:bg-neutral-800">
      <TableRow className="hover:bg-transparent border-b-0">
        <TableHead className={`${thClass} w-[120px]`}>
          <button type="button" onClick={() => onSort("date")} className="inline-flex items-center gap-1">
            Date <SortIcon field="date" />
          </button>
        </TableHead>
        <TableHead className={thClass}>Transaction</TableHead>
        <TableHead className={`${thClass} w-[140px]`}>Category</TableHead>
        <TableHead className={`${thClass} w-[120px] text-right`}>
          <button type="button" onClick={() => onSort("amount")} className="inline-flex items-center gap-1 ml-auto">
            Amount <SortIcon field="amount" />
          </button>
        </TableHead>
        <TableHead className={`${thClass} w-[40px]`} />
      </TableRow>
    </TableHeader>
  );
};
