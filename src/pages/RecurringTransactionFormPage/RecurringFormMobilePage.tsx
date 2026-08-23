import { type FC } from "react";
import { RecurringTransactionForm } from "@/components/recurring/RecurringTransactionForm";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { RecurringTransaction } from "@/types";

type RecurringFormMobilePageProps = {
  mode: "create" | "edit";
  transaction: RecurringTransaction | undefined;
  isLoading: boolean;
  formId: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export const RecurringFormMobilePage: FC<RecurringFormMobilePageProps> = ({
  mode,
  transaction,
  isLoading,
  formId,
  onSuccess,
  onCancel,
}) => (
  <div className="min-h-screen bg-background">
    <PageHeader
      title={mode === "edit" ? "Edit Recurring" : "New Recurring"}
      backTo="/recurring-transactions"
    />

    <div className="px-4 py-5">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : mode === "edit" && transaction ? (
        <RecurringTransactionForm
          formId={formId}
          mode="edit"
          transaction={transaction}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      ) : (
        <RecurringTransactionForm
          formId={formId}
          mode="create"
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      )}
    </div>
  </div>
);
