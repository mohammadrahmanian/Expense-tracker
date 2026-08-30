import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DeleteRecurringDialog } from "@/components/recurring/DeleteRecurringDialog";
import { ToggleRecurringDialog } from "@/components/recurring/ToggleRecurringDialog";
import { useRecurringTransactions } from "@/hooks/queries/useRecurringTransactions";
import { useCategories } from "@/hooks/queries/useCategories";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getCategoryById, getRecurringStatus } from "@/lib/recurring-transactions.utils";
import { RecurringDetailPageHeader } from "./RecurringDetailPageHeader";
import { RecurringDetailBody } from "./RecurringDetailBody";
import { RecurringDetailSkeleton } from "./RecurringDetailSkeleton";
import { useRecurringDetailDialogs } from "./useRecurringDetailDialogs";

const RecurringTransactionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { formatAmount } = useCurrency();

  const { data: recurringTransactions, isLoading } = useRecurringTransactions();
  const { data: categories } = useCategories();
  const transaction = recurringTransactions?.find((rt) => rt.id === id);

  const dialogs = useRecurringDetailDialogs(transaction, () =>
    navigate("/recurring-transactions"),
  );

  const notFound = !isLoading && !transaction;
  const showSkeleton = isLoading || !transaction;

  useEffect(() => {
    if (notFound) {
      navigate("/recurring-transactions", { replace: true });
    }
  }, [notFound, navigate]);

  const onEdit = () =>
    transaction &&
    navigate(`/recurring-transactions/${transaction.id}/edit`, {
      state: { from: `/recurring-transactions/${transaction.id}` },
    });

  return (
    <DashboardLayout hideHeader hideFab hideBottomTab>
      <RecurringDetailPageHeader
        transaction={transaction}
        onEdit={onEdit}
        onPause={dialogs.openToggle}
        onDelete={dialogs.openDelete}
        isToggling={dialogs.isToggling}
        isDeleting={dialogs.isDeleting}
      />

      <div className="mt-5 lg:mt-0">
        {showSkeleton ? (
          <RecurringDetailSkeleton />
        ) : (
          <RecurringDetailBody
            transaction={transaction}
            category={getCategoryById(categories, transaction.categoryId)}
            status={getRecurringStatus(transaction)}
            formatAmount={formatAmount}
            onPause={dialogs.openToggle}
            onEdit={onEdit}
            onDelete={dialogs.openDelete}
            isToggling={dialogs.isToggling}
            isDeleting={dialogs.isDeleting}
          />
        )}
      </div>
      <DeleteRecurringDialog
        target={dialogs.deleteTarget}
        isPending={dialogs.isDeleting}
        onCancel={dialogs.onCancelDelete}
        onConfirm={dialogs.onConfirmDelete}
      />
      <ToggleRecurringDialog
        target={dialogs.toggleTarget}
        isPending={dialogs.isToggling}
        onCancel={dialogs.onCancelToggle}
        onConfirm={dialogs.onConfirmToggle}
      />
    </DashboardLayout>
  );
};

export default RecurringTransactionDetailPage;
