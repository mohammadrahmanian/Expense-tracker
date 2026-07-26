import { type FC, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
} from "@/components/ui/responsive-dialog";
import { RecurringTransactionForm } from "@/components/recurring/RecurringTransactionForm";
import { RecurringPageHeader } from "@/components/recurring/RecurringPageHeader";
import { RecurringSummaryCards } from "@/components/recurring/RecurringSummaryCards";
import { RecurringList } from "@/components/recurring/RecurringList";
import { MobileRecurringTransactionsView } from "@/components/recurring/mobile/MobileRecurringTransactionsView";
import { DeleteRecurringDialog } from "@/components/recurring/DeleteRecurringDialog";
import { ToggleRecurringDialog } from "@/components/recurring/ToggleRecurringDialog";
import { useRecurringTransactions } from "@/hooks/queries/useRecurringTransactions";
import { useCategories } from "@/hooks/queries/useCategories";
import { useDeleteRecurringTransaction } from "@/hooks/mutations/useDeleteRecurringTransaction";
import { useToggleRecurringTransaction } from "@/hooks/mutations/useToggleRecurringTransaction";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useRecurringTransactionsFilters } from "@/hooks/useRecurringTransactionsFilters";
import {
  applyFilters,
  paginate,
  sortByNextOccurrence,
} from "@/lib/recurring-transactions.utils";
import type { RecurringTransaction } from "@/types";

export const RecurringTransactions: FC = () => {
  const { formatAmount } = useCurrency();
  const {
    state,
    searchProps,
    typeFilterProps,
    statusFilterProps,
    categoryFilterProps,
    sortProps,
    paginationProps,
  } = useRecurringTransactionsFilters();

  const recurringQuery = useRecurringTransactions();
  const categoriesQuery = useCategories();

  const deleteMut = useDeleteRecurringTransaction();
  const toggleMut = useToggleRecurringTransaction();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<RecurringTransaction | null>(null);
  const [deleting, setDeleting] = useState<RecurringTransaction | null>(null);
  const [toggling, setToggling] = useState<RecurringTransaction | null>(null);

  const { baseFiltered, visibleFiltered } = useMemo(
    () => applyFilters(recurringQuery.data, state),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      recurringQuery.data,
      state.searchTerm,
      state.typeFilter,
      state.categoryFilter,
      state.statusFilter,
    ],
  );
  const sorted = useMemo(
    () => sortByNextOccurrence(visibleFiltered, state.sortOrder),
    [visibleFiltered, state.sortOrder],
  );
  const pageSlice = useMemo(
    () => paginate(sorted, state.currentPage, state.pageSize),
    [sorted, state.currentPage, state.pageSize],
  );

  const isLoading = recurringQuery.isLoading || categoriesQuery.isLoading;
  const hasError = recurringQuery.isError || categoriesQuery.isError;
  const hasActiveFilters =
    !!state.searchTerm ||
    state.typeFilter !== "all" ||
    state.statusFilter !== "all" ||
    state.categoryFilter !== "all";

  const onEdit = (rt: RecurringTransaction) => setEditing(rt);
  const onDelete = (rt: RecurringTransaction) => setDeleting(rt);
  const onTogglePause = (rt: RecurringTransaction) => setToggling(rt);
  const onCreate = () => setCreateOpen(true);

  return (
    <DashboardLayout>
      <div className="md:hidden">
        <MobileRecurringTransactionsView
          transactions={sorted}
          categories={categoriesQuery.data}
          isLoading={isLoading}
          hasError={hasError}
          totalAllCount={baseFiltered.length}
          hasActiveFilters={hasActiveFilters}
          search={searchProps}
          typeFilter={typeFilterProps}
          statusFilter={statusFilterProps}
          categoryFilter={categoryFilterProps}
          formatAmount={formatAmount}
          onCreate={onCreate}
          onEdit={onEdit}
          onTogglePause={onTogglePause}
          onDelete={onDelete}
          togglingId={toggleMut.isPending ? toggling?.id : undefined}
          deletingId={deleteMut.isPending ? deleting?.id : undefined}
        />
      </div>

      <div className="hidden md:block space-y-5">
        <RecurringPageHeader onCreate={onCreate} />
        <RecurringSummaryCards />
        <RecurringList
          transactions={pageSlice}
          categories={categoriesQuery.data}
          isLoading={isLoading}
          hasError={hasError}
          totalForAllTab={baseFiltered.length}
          totalAfterStatus={sorted.length}
          hasActiveFilters={hasActiveFilters}
          search={searchProps}
          typeFilter={typeFilterProps}
          statusFilter={statusFilterProps}
          categoryFilter={categoryFilterProps}
          sort={sortProps}
          pagination={paginationProps}
          formatAmount={formatAmount}
          onEdit={onEdit}
          onTogglePause={onTogglePause}
          onDelete={onDelete}
          togglingId={toggleMut.isPending ? toggling?.id : undefined}
          deletingId={deleteMut.isPending ? deleting?.id : undefined}
        />
      </div>

      <ResponsiveDialog open={createOpen} onOpenChange={setCreateOpen}>
        <ResponsiveDialogContent>
          <RecurringTransactionForm
            mode="create"
            onSuccess={() => setCreateOpen(false)}
            onCancel={() => setCreateOpen(false)}
          />
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
      >
        <ResponsiveDialogContent>
          {editing && (
            <RecurringTransactionForm
              mode="edit"
              transaction={editing}
              onSuccess={() => setEditing(null)}
              onCancel={() => setEditing(null)}
            />
          )}
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <DeleteRecurringDialog
        target={deleting}
        isPending={deleteMut.isPending}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (!deleting) return;
          deleteMut.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
        }}
      />

      <ToggleRecurringDialog
        target={toggling}
        isPending={toggleMut.isPending}
        onCancel={() => setToggling(null)}
        onConfirm={() => {
          if (!toggling) return;
          toggleMut.mutate(
            { id: toggling.id, active: !toggling.isActive },
            { onSuccess: () => setToggling(null) },
          );
        }}
      />
    </DashboardLayout>
  );
};

export default RecurringTransactions;
