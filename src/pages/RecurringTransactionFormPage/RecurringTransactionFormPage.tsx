import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RecurringTransactionForm } from "@/components/recurring/RecurringTransactionForm";
import type { RecurringFormState } from "@/components/recurring/RecurringTransactionForm/RecurringTransactionForm.types";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecurringTransactions } from "@/hooks/queries/useRecurringTransactions";
import { RecurringFormDesktopHeader } from "./RecurringFormDesktopHeader";

const FORM_ID = "recurring-transaction-form";

const RecurringTransactionFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mode = id ? "edit" : "create";

  const { data: recurringTransactions, isLoading } =
    useRecurringTransactions();
  const transaction = id
    ? recurringTransactions?.find((rt) => rt.id === id)
    : undefined;

  const [formState, setFormState] = useState<RecurringFormState>({
    isPending: false,
    isCategoriesLoading: false,
  });

  const notFound = mode === "edit" && !isLoading && !transaction;
  const showSkeleton = mode === "edit" && (isLoading || !transaction);

  useEffect(() => {
    if (notFound) {
      navigate("/recurring-transactions", { replace: true });
    }
  }, [notFound, navigate]);

  const onSuccess = () => navigate("/recurring-transactions");
  const onCancel = () => navigate("/recurring-transactions");

  return (
    <DashboardLayout hideHeader hideFab hideBottomTab>
      <div className="-mx-4 -mt-4 lg:hidden">
        <PageHeader
          title={mode === "edit" ? "Edit Recurring" : "New Recurring"}
          backTo="/recurring-transactions"
        />
      </div>
      <div className="hidden lg:block">
        <RecurringFormDesktopHeader
          mode={mode}
          formId={FORM_ID}
          isPending={formState.isPending}
          isDisabled={formState.isPending || formState.isCategoriesLoading}
          onCancel={onCancel}
        />
      </div>

      <div className="mt-5 lg:mt-0">
        {showSkeleton ? (
          <Card className="flex flex-col gap-4 p-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </Card>
        ) : mode === "edit" && transaction ? (
          <RecurringTransactionForm
            formId={FORM_ID}
            mode="edit"
            transaction={transaction}
            onSuccess={onSuccess}
            onCancel={onCancel}
            onFormStateChange={setFormState}
          />
        ) : (
          <RecurringTransactionForm
            formId={FORM_ID}
            mode="create"
            onSuccess={onSuccess}
            onCancel={onCancel}
            onFormStateChange={setFormState}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecurringTransactionFormPage;
