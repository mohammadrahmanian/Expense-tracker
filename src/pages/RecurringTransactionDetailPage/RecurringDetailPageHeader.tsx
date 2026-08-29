import { type FC } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { getRecurringStatus } from "@/lib/recurring-transactions.utils";
import { RecurringDetailDesktopHeader } from "./RecurringDetailDesktopHeader";
import type { RecurringTransaction } from "@/types";

type RecurringDetailPageHeaderProps = {
  transaction: RecurringTransaction | undefined;
  onEdit: () => void;
  onPause: () => void;
  onDelete: () => void;
  isToggling: boolean;
  isDeleting: boolean;
};

export const RecurringDetailPageHeader: FC<RecurringDetailPageHeaderProps> = ({
  transaction,
  onEdit,
  onPause,
  onDelete,
  isToggling,
  isDeleting,
}) => (
  <>
    <div className="-mx-4 -mt-4 lg:hidden">
      <PageHeader
        title={transaction?.title ?? <Skeleton className="h-6 w-40" />}
        backTo="/recurring-transactions"
        trailing={
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Edit"
            onClick={onEdit}
            disabled={!transaction}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        }
      />
    </div>
    <div className="hidden lg:block">
      {transaction ? (
        <RecurringDetailDesktopHeader
          title={transaction.title}
          status={getRecurringStatus(transaction)}
          onPause={onPause}
          onEdit={onEdit}
          onDelete={onDelete}
          isToggling={isToggling}
          isDeleting={isDeleting}
        />
      ) : (
        <Skeleton className="mb-6 h-16 w-full" />
      )}
    </div>
  </>
);
