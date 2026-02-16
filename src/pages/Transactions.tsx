import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionsFilters } from "@/components/transactions/TransactionsFilters";
import { TransactionsList } from "@/components/transactions/TransactionsList";
import { TransactionsSummaryCards } from "@/components/transactions/TransactionsSummaryCards";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog as Dialog,
  ResponsiveDialogContent as DialogContent,
  ResponsiveDialogTrigger as DialogTrigger,
} from "@/components/ui/responsive-dialog";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useDeleteTransaction } from "@/hooks/mutations/useDeleteTransaction";
import { useCategories } from "@/hooks/queries/useCategories";
import { useTransactions } from "@/hooks/queries/useTransactions";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { calculatePageTotals } from "@/lib/transactions.utils";
import { Transaction } from "@/types";
import { Plus } from "lucide-react";
import { useMemo, useState, type FC } from "react";

export const Transactions: FC = () => {
  const { formatAmount } = useCurrency();
  const { state, dispatch, queryParams, activeFilters } = useTransactionFilters();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  const { data: transactionsData, isLoading: transactionsLoading, isError: transactionsError, error: transactionsErrorInfo } = useTransactions(queryParams);
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError, error: categoriesErrorInfo } = useCategories();
  const deleteTransaction = useDeleteTransaction();

  const isLoading = transactionsLoading || categoriesLoading;
  const hasError = transactionsError || categoriesError;
  const transactions = transactionsData?.items || [];
  const totalTransactions = transactionsData?.total || 0;
  const pageTotals = useMemo(() => calculatePageTotals(transactions), [transactions]);

  const handleEdit = (transaction: Transaction) => { setEditingTransaction(transaction); setIsFormOpen(true); };
  const handleDelete = (id: string) => { if (confirm("Are you sure you want to delete this transaction?")) deleteTransaction.mutate(id); };
  const handleFormClose = () => { setIsFormOpen(false); setEditingTransaction(undefined); };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-end items-center">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTransaction(undefined)} disabled={deleteTransaction.isPending}>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <TransactionForm transaction={editingTransaction} onSuccess={handleFormClose} onCancel={handleFormClose} />
            </DialogContent>
          </Dialog>
        </div>

        <TransactionsSummaryCards totalIncome={pageTotals.totalIncome} totalExpenses={pageTotals.totalExpenses} net={pageTotals.net} hasError={hasError} isLoading={isLoading} formatAmount={formatAmount} />

        <TransactionsFilters searchTerm={state.searchTerm} onSearchTermChange={v => dispatch({ type: "SET_SEARCH_TERM", payload: v })} typeFilter={state.typeFilter} onTypeFilterChange={v => dispatch({ type: "SET_TYPE_FILTER", payload: v })} categoryFilter={state.categoryFilter} onCategoryFilterChange={v => dispatch({ type: "SET_CATEGORY_FILTER", payload: v })} startDate={state.startDate} onStartDateChange={v => dispatch({ type: "SET_START_DATE", payload: v })} endDate={state.endDate} onEndDateChange={v => dispatch({ type: "SET_END_DATE", payload: v })} categories={categories} onClearFilters={() => dispatch({ type: "CLEAR_FILTERS" })} />

        <TransactionsList transactions={transactions} totalTransactions={totalTransactions} categories={categories} isLoading={isLoading} hasError={hasError} transactionsError={transactionsError} transactionsErrorMessage={transactionsErrorInfo?.message} categoriesError={categoriesError} categoriesErrorMessage={categoriesErrorInfo?.message} hasActiveFilters={activeFilters} sortField={state.sortField} sortOrder={state.sortOrder} onSort={f => dispatch({ type: "SORT", payload: f })} onEdit={handleEdit} onDelete={handleDelete} isDeletingId={deleteTransaction.isPending ? deleteTransaction.variables : undefined} formatAmount={formatAmount} currentPage={state.currentPage} pageSize={state.pageSize} onPageChange={p => dispatch({ type: "SET_CURRENT_PAGE", payload: p })} onPageSizeChange={p => dispatch({ type: "SET_PAGE_SIZE", payload: p })} />
      </div>
    </DashboardLayout>
  );
};
