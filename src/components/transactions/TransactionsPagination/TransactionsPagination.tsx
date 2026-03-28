import { useMemo, type FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TransactionsPaginationProps = {
  currentPage: number;
  pageSize: number;
  totalTransactions: number;
  transactionsOnPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

const PAGE_SIZE_OPTIONS = ["10", "25", "50", "100"];

export const TransactionsPagination: FC<TransactionsPaginationProps> = ({
  currentPage,
  pageSize,
  totalTransactions,
  transactionsOnPage,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalTransactions / pageSize));
  const isLastPage =
    (currentPage - 1) * pageSize + transactionsOnPage >= totalTransactions;

  const visiblePages = useMemo(() => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 2) return [1, 2, 3];
    if (currentPage >= totalPages - 1) return [totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 1, currentPage, currentPage + 1];
  }, [currentPage, totalPages]);

  return (
    <div className="flex flex-col gap-3 border-t border-border px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
        <span>Rows per page</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(v) => onPageSizeChange(Number(v))}
        >
          <SelectTrigger className="h-8 w-[60px] text-xs font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((v) => (
              <SelectItem key={v} value={v}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mx-1 h-4 w-px bg-border" />
        <span>
          Page {currentPage} of {totalPages} &middot; {totalTransactions} transactions
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-3 text-xs"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </Button>
        {visiblePages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-sm text-xs font-medium transition-colors",
              page === currentPage
                ? "bg-primary text-white"
                : "border border-border text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800",
            )}
          >
            {page}
          </button>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-3 text-xs"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
