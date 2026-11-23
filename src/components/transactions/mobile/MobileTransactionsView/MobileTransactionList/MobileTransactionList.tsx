import { useCallback, useState, type FC, type RefObject } from "react";
import { Loader2 } from "lucide-react";
import { MobileTransactionGroup } from "@/components/transactions/mobile/MobileTransactionGroup";
import { type TransactionDateGroup } from "@/lib/transactions.utils";
import { Category, Transaction } from "@/types";
import { MobileLoadingSkeleton } from "../MobileLoadingSkeleton";

type MobileTransactionListProps = {
  groups: TransactionDateGroup[];
  categories: Category[] | undefined;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  sentinelRef: RefObject<HTMLDivElement>;
  formatAmount: (amount: number) => string;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
};

export const MobileTransactionList: FC<MobileTransactionListProps> = ({
  groups,
  categories,
  isLoading,
  isFetchingNextPage,
  sentinelRef,
  formatAmount,
  onEdit,
  onDelete,
}) => {
  const [openRowId, setOpenRowId] = useState<string | null>(null);

  const handleRowOpenChange = useCallback((id: string, open: boolean) => {
    setOpenRowId((prev) => (open ? id : prev === id ? null : prev));
  }, []);

  if (isLoading) return <MobileLoadingSkeleton />;

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-muted-foreground">No transactions found</p>
      </div>
    );
  }

  return (
    <>
      {groups.map((group) => (
        <MobileTransactionGroup
          key={group.dateKey}
          group={group}
          categories={categories}
          formatAmount={formatAmount}
          openRowId={openRowId}
          onRowOpenChange={handleRowOpenChange}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      <div ref={sentinelRef} className="h-1" />
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      )}
    </>
  );
};
