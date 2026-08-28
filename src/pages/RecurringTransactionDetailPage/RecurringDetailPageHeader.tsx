import { type FC } from "react";
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
        title={transaction?.title ?? ""}
        backTo="/recurring-transactions"
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
