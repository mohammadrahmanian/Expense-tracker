import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RecurringTransactionForm } from "@/components/recurring/RecurringTransactionForm";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecurringTransactions } from "@/hooks/queries/useRecurringTransactions";
import { RecurringFormDesktopHeader } from "./RecurringFormDesktopHeader";
import { getRecurringFormReturnTo } from "./RecurringTransactionFormPage.utils";

const FORM_ID = "recurring-transaction-form";

const RecurringTransactionFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const mode = id ? "edit" : "create";
  const from = (location.state as { from?: unknown } | null)?.from;
  const returnTo = getRecurringFormReturnTo(from, id);

  const { data: recurringTransactions, isLoading } = useRecurringTransactions();
  const transaction = id
    ? recurringTransactions?.find((rt) => rt.id === id)
    : undefined;

  const notFound = mode === "edit" && !isLoading && !transaction;
  const showSkeleton = mode === "edit" && (isLoading || !transaction);

  useEffect(() => {
    if (notFound) {
      navigate("/recurring-transactions", { replace: true });
    }
  }, [notFound, navigate]);

  const onSuccess = () => navigate(returnTo, { replace: true });
  const onCancel = () => navigate(returnTo, { replace: true });

  return (
    <DashboardLayout hideHeader hideFab hideBottomTab>
      <div className="-mx-4 -mt-4 lg:hidden">
        <PageHeader
          title={mode === "edit" ? "Edit Recurring" : "New Recurring"}
          backTo={returnTo}
        />
      </div>
      <div className="hidden lg:block">
        <RecurringFormDesktopHeader mode={mode} />
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
          />
        ) : (
          <RecurringTransactionForm
            formId={FORM_ID}
            mode="create"
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecurringTransactionFormPage;
