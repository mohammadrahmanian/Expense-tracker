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
import { useScrollToTopOnChange } from "@/hooks/useScrollToTopOnChange";
import {
  buildQueryParams,
  calculatePageTotals,
  hasActiveFilters,
} from "@/lib/transactions.utils";
import { Transaction } from "@/types";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState, type FC } from "react";

export const Transactions: FC = () => {
  const { formatAmount } = useCurrency();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "INCOME" | "EXPENSE">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  const queryParams = useMemo(
    () => buildQueryParams({ searchTerm, typeFilter, categoryFilter, startDate, endDate, currentPage, pageSize, sortField, sortOrder }),
    [searchTerm, typeFilter, categoryFilter, startDate, endDate, currentPage, pageSize, sortField, sortOrder],
  );

  const { data: transactionsData, isLoading: transactionsLoading, isError: transactionsError, error: transactionsErrorInfo } = useTransactions(queryParams);
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError, error: categoriesErrorInfo } = useCategories();
  const deleteTransaction = useDeleteTransaction();

  const isLoading = transactionsLoading || categoriesLoading;
  const hasError = transactionsError || categoriesError;
  const transactions = transactionsData?.items || [];
  const totalTransactions = transactionsData?.total || 0;
  const pageTotals = useMemo(() => calculatePageTotals(transactions), [transactions]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, typeFilter, categoryFilter, startDate, endDate, pageSize]);
  useScrollToTopOnChange(currentPage, sortField, sortOrder);

  const handleSort = (field: "date" | "amount") => {
    if (sortField === field) { setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }
    else { setSortField(field); setSortOrder("desc"); }
    setCurrentPage(1);
  };

  const handleEdit = (transaction: Transaction) => { setEditingTransaction(transaction); setIsFormOpen(true); };
  const handleDelete = (id: string) => { if (confirm("Are you sure you want to delete this transaction?")) deleteTransaction.mutate(id); };
  const handleFormClose = () => { setIsFormOpen(false); setEditingTransaction(undefined); };
  const handleClearFilters = () => { setSearchTerm(""); setTypeFilter("all"); setCategoryFilter("all"); setStartDate(undefined); setEndDate(undefined); setCurrentPage(1); };

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

        <TransactionsFilters searchTerm={searchTerm} onSearchTermChange={setSearchTerm} typeFilter={typeFilter} onTypeFilterChange={setTypeFilter} categoryFilter={categoryFilter} onCategoryFilterChange={setCategoryFilter} startDate={startDate} onStartDateChange={setStartDate} endDate={endDate} onEndDateChange={setEndDate} categories={categories} onClearFilters={handleClearFilters} />

        <TransactionsList transactions={transactions} totalTransactions={totalTransactions} categories={categories} isLoading={isLoading} hasError={hasError} transactionsError={transactionsError} transactionsErrorMessage={transactionsErrorInfo?.message} categoriesError={categoriesError} categoriesErrorMessage={categoriesErrorInfo?.message} hasActiveFilters={hasActiveFilters({ searchTerm, typeFilter, categoryFilter, startDate, endDate })} sortField={sortField} sortOrder={sortOrder} onSort={handleSort} onEdit={handleEdit} onDelete={handleDelete} isDeletingId={deleteTransaction.isPending ? deleteTransaction.variables : undefined} formatAmount={formatAmount} currentPage={currentPage} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
      </div>
    </DashboardLayout>
  );
};
