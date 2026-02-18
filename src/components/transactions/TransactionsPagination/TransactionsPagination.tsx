import { type FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TransactionsPaginationProps = {
  currentPage: number;
  pageSize: number;
  totalTransactions: number;
  transactionsOnPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export const TransactionsPagination: FC<TransactionsPaginationProps> = ({
  currentPage,
  pageSize,
  totalTransactions,
  transactionsOnPage,
  onPageChange,
  onPageSizeChange,
}) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Show</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-[80px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="200">200</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="text-sm text-muted-foreground">
        Showing {(currentPage - 1) * pageSize + 1} to{" "}
        {(currentPage - 1) * pageSize + transactionsOnPage} of{" "}
        {totalTransactions} transactions
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>
      <div className="text-sm font-medium">
        Page {currentPage} of {Math.ceil(totalTransactions / pageSize)}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={
          (currentPage - 1) * pageSize + transactionsOnPage >= totalTransactions
        }
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  </div>
);
