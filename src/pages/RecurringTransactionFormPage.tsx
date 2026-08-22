import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RecurringTransactionForm } from "@/components/recurring/RecurringTransactionForm";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecurringTransactions } from "@/hooks/queries/useRecurringTransactions";

const RecurringTransactionFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mode = id ? "edit" : "create";

  const { data: recurringTransactions, isLoading } = useRecurringTransactions();
  const transaction = id
    ? recurringTransactions?.find((rt) => rt.id === id)
    : undefined;

  const notFound = mode === "edit" && !isLoading && !transaction;

  useEffect(() => {
    if (notFound) {
      navigate("/recurring-transactions", { replace: true });
    }
  }, [notFound, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={mode === "edit" ? "Edit Recurring" : "New Recurring"}
        backTo="/recurring-transactions"
      />

      <div className="px-4 py-5">
        {mode === "edit" && (isLoading || !transaction) ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : mode === "edit" && transaction ? (
          <RecurringTransactionForm
            chrome="page"
            mode="edit"
            transaction={transaction}
            onSuccess={() => navigate("/recurring-transactions")}
            onCancel={() => navigate("/recurring-transactions")}
          />
        ) : (
          <RecurringTransactionForm
            chrome="page"
            mode="create"
            onSuccess={() => navigate("/recurring-transactions")}
            onCancel={() => navigate("/recurring-transactions")}
          />
        )}
      </div>
    </div>
  );
};

export default RecurringTransactionFormPage;
