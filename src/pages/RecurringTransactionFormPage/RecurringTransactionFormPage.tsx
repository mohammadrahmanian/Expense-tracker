import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RecurringTransactionForm } from "@/components/recurring/RecurringTransactionForm";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecurringTransactions } from "@/hooks/queries/useRecurringTransactions";
import { RecurringFormDesktopHeader } from "./RecurringFormDesktopHeader";
import { RecurringFormMobilePage } from "./RecurringFormMobilePage";

const DESKTOP_FORM_ID = "recurring-transaction-form";
const MOBILE_FORM_ID = "recurring-transaction-form-mobile";

const RecurringTransactionFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mode = id ? "edit" : "create";

  const { data: recurringTransactions, isLoading } =
    useRecurringTransactions();
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

  const onSuccess = () => navigate("/recurring-transactions");
  const onCancel = () => navigate("/recurring-transactions");

  return (
    <>
      <div className="md:hidden">
        <RecurringFormMobilePage
          mode={mode}
          transaction={transaction}
          isLoading={showSkeleton}
          formId={MOBILE_FORM_ID}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </div>

      <div className="hidden md:block">
        <DashboardLayout hideHeader hideFab>
          <RecurringFormDesktopHeader
            mode={mode}
            formId={DESKTOP_FORM_ID}
            onCancel={onCancel}
          />
          {showSkeleton ? (
            <Card className="flex flex-col gap-4 p-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </Card>
          ) : mode === "edit" && transaction ? (
            <RecurringTransactionForm
              formId={DESKTOP_FORM_ID}
              mode="edit"
              transaction={transaction}
              onSuccess={onSuccess}
              onCancel={onCancel}
            />
          ) : (
            <RecurringTransactionForm
              formId={DESKTOP_FORM_ID}
              mode="create"
              onSuccess={onSuccess}
              onCancel={onCancel}
            />
          )}
        </DashboardLayout>
      </div>
    </>
  );
};

export default RecurringTransactionFormPage;
