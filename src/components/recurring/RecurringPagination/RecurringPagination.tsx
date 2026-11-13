import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type RecurringPaginationProps = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  itemsOnPage: number;
  onPageChange: (page: number) => void;
};

const getPageNumbers = (current: number, total: number): number[] => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(1, Math.min(current - 1, total - 2));
  const end = Math.min(total, start + 2);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export const RecurringPagination: FC<RecurringPaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between border-t border-border px-5 py-3">
      <span className="text-caption text-muted-foreground">
        {totalItems === 0
          ? "No schedules"
          : `Showing ${from}–${to} of ${totalItems} schedules`}
      </span>
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
        {pageNumbers.map((page) => (
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
          disabled={currentPage >= totalPages}
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
