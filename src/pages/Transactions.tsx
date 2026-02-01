import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { MobileSortControls } from "@/components/transactions/MobileSortControls";
import { TransactionCard } from "@/components/transactions/TransactionCard";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionTableHeaders } from "@/components/transactions/TransactionTableHeaders";
import { TransactionTableRow } from "@/components/transactions/TransactionTableRow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveDialog as Dialog,
  ResponsiveDialogContent as DialogContent,
  ResponsiveDialogTrigger as DialogTrigger
} from "@/components/ui/responsive-dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Transaction } from "@/types";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTransactions } from "@/hooks/queries/useTransactions";
import { useCategories } from "@/hooks/queries/useCategories";
import { useDeleteTransaction } from "@/hooks/mutations/useDeleteTransaction";

const Transactions: React.FC = () => {
  const { formatAmount } = useCurrency();

  // Filter and pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "INCOME" | "EXPENSE">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const prevPageRef = React.useRef<number>(1);
  const prevSortFieldRef = React.useRef<"date" | "amount">("date");
  const prevSortOrderRef = React.useRef<"asc" | "desc">("desc");

  // Build query params for React Query
  const queryParams = useMemo(() => {
    const params: {
      sort: "date" | "amount";
      order: "asc" | "desc";
      limit: number;
      offset: number;
      type?: "INCOME" | "EXPENSE";
      fromDate?: string;
      toDate?: string;
      categoryId?: string;
      query?: string;
    } = {
      sort: sortField,
      order: sortOrder,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    };

    if (searchTerm) {
      params.query = searchTerm;
    }

    if (typeFilter !== "all") {
      params.type = typeFilter;
    }

    if (categoryFilter !== "all") {
      params.categoryId = categoryFilter;
    }

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      params.fromDate = start.toISOString();
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      params.toDate = end.toISOString();
    }

    return params;
  }, [searchTerm, typeFilter, categoryFilter, startDate, endDate, currentPage, pageSize, sortField, sortOrder]);

  // Fetch data using React Query hooks with error states
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    isError: transactionsError,
    error: transactionsErrorInfo
  } = useTransactions(queryParams);

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesErrorInfo
  } = useCategories();

  const deleteTransaction = useDeleteTransaction();

  const isLoading = transactionsLoading || categoriesLoading;
  const hasError = transactionsError || categoriesError;
  const transactions = transactionsData?.items || [];
  const totalTransactions = transactionsData?.total || 0;

  // Reset to page 1 when filters or page size change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, categoryFilter, startDate, endDate, pageSize]);

  // Scroll to top when pagination or sort changes
  useEffect(() => {
    const pageChanged = prevPageRef.current !== currentPage;
    const sortChanged =
      prevSortFieldRef.current !== sortField ||
      prevSortOrderRef.current !== sortOrder;

    if (pageChanged || sortChanged) {
      window.scrollTo(0, 0);
    }

    prevPageRef.current = currentPage;
    prevSortFieldRef.current = sortField;
    prevSortOrderRef.current = sortOrder;
  }, [currentPage, sortField, sortOrder]);

  const getCategoryById = (categoryId: string) => {
    return categories?.find((cat) => cat.id === categoryId);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = (transactionId: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction.mutate(transactionId);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  const handleSort = (field: "date" | "amount") => {
    if (sortField === field) {
      // Toggle order if same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new field with default desc order
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-end items-center">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setEditingTransaction(undefined)}
                disabled={deleteTransaction.isPending}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <TransactionForm
                transaction={editingTransaction}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className={cn("grid gap-4 md:grid-cols-3", hasError && "opacity-50 pointer-events-none")}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <ArrowUpRight className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Income
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {hasError ? '—' : `+${formatAmount(totalIncome)}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <ArrowDownLeft className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Expenses
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {hasError ? '—' : `-${formatAmount(totalExpenses)}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div
                  className={cn(
                    "h-5 w-5 rounded-full",
                    hasError ? "bg-gray-400" :
                    totalIncome - totalExpenses >= 0
                      ? "bg-green-600"
                      : "bg-red-600",
                  )}
                />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Net Amount
                  </p>
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      hasError ? "text-gray-900 dark:text-white" :
                      totalIncome - totalExpenses >= 0
                        ? "text-green-600"
                        : "text-red-600",
                    )}
                  >
                    {hasError ? '—' : `${totalIncome - totalExpenses >= 0 ? "+" : "-"}${formatAmount(Math.abs(totalIncome - totalExpenses))}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={typeFilter}
                onValueChange={(value: "all" | "INCOME" | "EXPENSE") =>
                  setTypeFilter(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "MMM dd, yyyy") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "MMM dd, yyyy") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                  setCategoryFilter("all");
                  setStartDate(undefined);
                  setEndDate(undefined);
                  setCurrentPage(1);
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {totalTransactions > 0
                ? `All Transactions (${totalTransactions} total, showing ${transactions.length})`
                : `All Transactions (showing ${transactions.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Failed to Load Transactions</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-1">
                    {transactionsError && (
                      <p>• Transactions: {transactionsErrorInfo?.message || 'Unknown error'}</p>
                    )}
                    {categoriesError && (
                      <p>• Categories: {categoriesErrorInfo?.message || 'Unknown error'}</p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading transactions...</span>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm || typeFilter !== "all" || categoryFilter !== "all" || startDate || endDate
                    ? "No transactions match your filters."
                    : "No transactions yet. Start by adding your first transaction!"}
                </p>
              </div>
            ) : (
              <>
                {/* Mobile Sort Controls */}
                <MobileSortControls
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />

                {/* Mobile: Card List */}
                <div className="md:hidden space-y-3">
                  {transactions.map((transaction) => {
                    const category = getCategoryById(transaction.categoryId);
                    if (!category) return null; // Should not happen, but TypeScript safety

                    return (
                      <TransactionCard
                        key={transaction.id}
                        transaction={transaction}
                        category={category}
                        formatAmount={formatAmount}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isDeleting={
                          deleteTransaction.isPending &&
                          deleteTransaction.variables === transaction.id
                        }
                      />
                    );
                  })}
                </div>

                {/* Desktop: Table */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TransactionTableHeaders
                      sortField={sortField}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <TableBody>
                      {transactions.map((transaction) => {
                        const category = getCategoryById(transaction.categoryId);
                        if (!category) return null; // Should not happen, but TypeScript safety

                        return (
                          <TransactionTableRow
                            key={transaction.id}
                            transaction={transaction}
                            category={category}
                            formatAmount={formatAmount}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            isDeleting={
                              deleteTransaction.isPending &&
                              deleteTransaction.variables === transaction.id
                            }
                          />
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}

            {/* Pagination Controls */}
            {!isLoading && transactions.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Show</span>
                    <Select
                      value={pageSize.toString()}
                      onValueChange={(value) => setPageSize(Number(value))}
                    >
                      <SelectTrigger className="w-[80px] h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                        <SelectItem value="200">200</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {(currentPage - 1) * pageSize + transactions.length} of {totalTransactions} transactions
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <div className="text-sm font-medium">
                    Page {currentPage} of {Math.ceil(totalTransactions / pageSize)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={(currentPage - 1) * pageSize + transactions.length >= totalTransactions}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
