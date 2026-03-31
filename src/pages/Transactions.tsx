import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DeleteTransactionDialog } from "@/components/transactions/DeleteTransactionDialog";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionsList } from "@/components/transactions/TransactionsList";
import { TransactionsPageHeader } from "@/components/transactions/TransactionsPageHeader";
import { TransactionsSummaryCards } from "@/components/transactions/TransactionsSummaryCards";
import { MobileTransactionsView } from "@/components/transactions/mobile/MobileTransactionsView";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog as Dialog,
  ResponsiveDialogContent as DialogContent,
} from "@/components/ui/responsive-dialog";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useDeleteTransaction } from "@/hooks/mutations/useDeleteTransaction";
import { useCategories } from "@/hooks/queries/useCategories";
import { useInfiniteTransactions } from "@/hooks/queries/useInfiniteTransactions";
import { useTransactions } from "@/hooks/queries/useTransactions";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { calculatePageTotals } from "@/lib/transactions.utils";
import { Transaction } from "@/types";
import { Plus } from "lucide-react";
import { useMemo, useState, type FC } from "react";

export const Transactions: FC = () => {
  const isMobile = useIsMobile();
  const { formatAmount } = useCurrency();
  const { state, dispatch, queryParams, infiniteQueryParams, activeFilters, searchInput, setSearchInput } = useTransactionFilters();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [deletingId, setDeletingId] = useState<string | undefined>();

  const { data: transactionsData, isLoading: transactionsLoading, isError: transactionsError, error: transactionsErrorInfo } = useTransactions(queryParams, !isMobile);
  const infiniteQuery = useInfiniteTransactions(infiniteQueryParams, isMobile);
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError, error: categoriesErrorInfo } = useCategories();
  const deleteTransaction = useDeleteTransaction();

  const isLoading = transactionsLoading || categoriesLoading;
  const hasError = transactionsError || categoriesError;
  const transactions = useMemo(() => transactionsData?.items ?? [], [transactionsData?.items]);
  const totalTransactions = isMobile
    ? (infiniteQuery.data?.pages[0]?.total ?? 0)
    : (transactionsData?.total ?? 0);
  const pageTotals = useMemo(() => calculatePageTotals(transactions), [transactions]);

  const handleEdit = (transaction: Transaction) => { setEditingTransaction(transaction); setIsFormOpen(true); };
  const handleDelete = (id: string) => setDeletingId(id);
  const handleDeleteConfirm = () => {
    if (deletingId) deleteTransaction.mutate(deletingId, { onSuccess: () => setDeletingId(undefined) });
  };
  const handleFormClose = () => { setIsFormOpen(false); setEditingTransaction(undefined); };

  const addButton = (
    <Button onClick={() => { setEditingTransaction(undefined); setIsFormOpen(true); }} disabled={deleteTransaction.isPending}>
      <Plus className="h-4 w-4 mr-2" />
      Add Transaction
    </Button>
  );

  return (
    <DashboardLayout>
      {/* Mobile View */}
      <div className="md:hidden">
        <MobileTransactionsView
          infiniteData={infiniteQuery.data}
          totalTransactions={totalTransactions}
          categories={categories}
          isLoading={infiniteQuery.isLoading || categoriesLoading}
          hasNextPage={infiniteQuery.hasNextPage}
          isFetchingNextPage={infiniteQuery.isFetchingNextPage}
          fetchNextPage={infiniteQuery.fetchNextPage}
          typeFilter={state.typeFilter}
          onTypeFilterChange={(v) => dispatch({ type: "SET_TYPE_FILTER", payload: v })}
          searchTerm={searchInput}
          onSearchTermChange={setSearchInput}
          datePreset={state.datePreset}
          startDate={state.startDate}
          endDate={state.endDate}
          onDatePresetChange={(v) => dispatch({ type: "SET_DATE_PRESET", payload: v })}
          onCustomDateSelect={(d) => dispatch({ type: "SET_CUSTOM_DATE", payload: d })}
          onCustomRangeSelect={(from, to) => dispatch({ type: "SET_CUSTOM_RANGE", payload: { from, to } })}
          onEdit={handleEdit}
          formatAmount={formatAmount}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block space-y-5">
        <TransactionsPageHeader addTransactionTrigger={addButton} />

        <TransactionsSummaryCards
          totalIncome={pageTotals.totalIncome}
          totalExpenses={pageTotals.totalExpenses}
          net={pageTotals.net}
          totalTransactions={totalTransactions}
          hasError={hasError}
          isLoading={isLoading}
          formatAmount={formatAmount}
        />

        <TransactionsList
          transactions={transactions}
          totalTransactions={totalTransactions}
          categories={categories}
          isLoading={isLoading}
          hasError={hasError}
          transactionsError={transactionsError}
          transactionsErrorMessage={transactionsErrorInfo?.message}
          categoriesError={categoriesError}
          categoriesErrorMessage={categoriesErrorInfo?.message}
          hasActiveFilters={activeFilters}
          typeFilter={state.typeFilter}
          onTypeFilterChange={(v) => dispatch({ type: "SET_TYPE_FILTER", payload: v })}
          searchTerm={searchInput}
          onSearchTermChange={setSearchInput}
          categoryFilter={state.categoryFilter}
          onCategoryFilterChange={(v) => dispatch({ type: "SET_CATEGORY_FILTER", payload: v })}
          datePreset={state.datePreset}
          startDate={state.startDate}
          endDate={state.endDate}
          onDatePresetChange={(v) => dispatch({ type: "SET_DATE_PRESET", payload: v })}
          onCustomDateSelect={(d) => dispatch({ type: "SET_CUSTOM_DATE", payload: d })}
          onCustomRangeSelect={(from, to) => dispatch({ type: "SET_CUSTOM_RANGE", payload: { from, to } })}
          sortField={state.sortField}
          sortOrder={state.sortOrder}
          onSort={(f) => dispatch({ type: "SORT", payload: f })}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeletingId={deleteTransaction.isPending ? deleteTransaction.variables : undefined}
          formatAmount={formatAmount}
          currentPage={state.currentPage}
          pageSize={state.pageSize}
          onPageChange={(p) => dispatch({ type: "SET_CURRENT_PAGE", payload: p })}
          onPageSizeChange={(p) => dispatch({ type: "SET_PAGE_SIZE", payload: p })}
        />
      </div>

      <Dialog open={isFormOpen} onOpenChange={(open) => (open ? setIsFormOpen(true) : handleFormClose())}>
        <DialogContent className="sm:max-w-2xl">
          <TransactionForm transaction={editingTransaction} onSuccess={handleFormClose} onCancel={handleFormClose} />
        </DialogContent>
      </Dialog>

      <DeleteTransactionDialog
        open={deletingId !== undefined}
        onClose={() => { setDeletingId(undefined); deleteTransaction.reset(); }}
        onConfirm={handleDeleteConfirm}
        isPending={deleteTransaction.isPending}
        error={deleteTransaction.isError ? ((deleteTransaction.error as Error)?.message ?? "Failed to delete transaction") : undefined}
      />
    </DashboardLayout>
  );
};
