import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveDialog as Dialog, 
  ResponsiveDialogContent as DialogContent, 
  ResponsiveDialogTrigger as DialogTrigger 
} from "@/components/ui/responsive-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { categoriesService, transactionsService } from "@/services/api";
import { Category, Transaction } from "@/types";
import { format } from "date-fns";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Edit,
  Filter,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useDataRefresh } from "@/contexts/DataRefreshContext";

const Transactions: React.FC = () => {
  const { formatAmount } = useCurrency();
  const { refreshTrigger } = useDataRefresh();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "INCOME" | "EXPENSE">(
    "all",
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const scrollPositionRef = React.useRef<number>(0);

  useEffect(() => {
    loadCategories();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, categoryFilter, startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [refreshTrigger, searchTerm, typeFilter, categoryFilter, startDate, endDate, currentPage, sortField, sortOrder]);

  const loadCategories = async () => {
    try {
      const allCategories = await categoriesService.getAll();
      setCategories(allCategories);
    } catch (error) {
      toast.error("Failed to load categories. Please try again.");
    }
  };

  const loadData = async () => {
    try {
      // Save scroll position before loading
      scrollPositionRef.current = window.scrollY;

      setIsLoading(true);

      // Build filter params for API
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

      const allTransactions = await transactionsService.getAll(params);
      setTransactions(allTransactions);

      // Restore scroll position after data loads
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current);
      });
    } catch (error) {
      toast.error("Failed to load transactions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryById = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = async (transactionId: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      try {
        setIsLoading(true);
        await transactionsService.delete(transactionId);
        await loadData();
        toast.success("Transaction deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete transaction. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
    loadData();
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

  const getSortIcon = (field: "date" | "amount") => {
    if (sortField !== field) {
      return <ChevronsUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground/60" />;
    }
    return sortOrder === "asc" ? (
      <ChevronUp className="ml-1 h-3.5 w-3.5 text-primary/80" />
    ) : (
      <ChevronDown className="ml-1 h-3.5 w-3.5 text-primary/80" />
    );
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
                disabled={isLoading}
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
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <ArrowUpRight className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Income
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    +{formatAmount(totalIncome)}
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
                    -{formatAmount(totalExpenses)}
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
                      totalIncome - totalExpenses >= 0
                        ? "text-green-600"
                        : "text-red-600",
                    )}
                  >
                    {totalIncome - totalExpenses >= 0 ? "+" : "-"}{formatAmount(Math.abs(totalIncome - totalExpenses))}
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
                  {categories.map((category) => (
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
              All Transactions ({transactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>
                        <button
                          type="button"
                          onClick={() => handleSort("date")}
                          className={cn(
                            "inline-flex items-center h-8 px-2 hover:bg-muted/50 rounded-md transition-colors -ml-2",
                            sortField === "date" && "font-semibold"
                          )}
                        >
                          Date
                          {getSortIcon("date")}
                        </button>
                      </TableHead>
                      <TableHead className="text-right">
                        <button
                          type="button"
                          onClick={() => handleSort("amount")}
                          className={cn(
                            "inline-flex items-center h-8 px-2 hover:bg-muted/50 rounded-md transition-colors float-right",
                            sortField === "amount" && "font-semibold"
                          )}
                        >
                          Amount
                          {getSortIcon("amount")}
                        </button>
                      </TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => {
                      const category = getCategoryById(transaction.categoryId);
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center",
                                  transaction.type === "INCOME"
                                    ? "bg-green-100 dark:bg-green-900"
                                    : "bg-red-100 dark:bg-red-900",
                                )}
                              >
                                {transaction.type === "INCOME" ? (
                                  <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                                ) : (
                                  <ArrowDownLeft className="h-4 w-4 text-red-600 dark:text-red-400" />
                                )}
                              </div>
                              <span>{transaction.title}</span>
                              {transaction.isRecurring && (
                                <Badge variant="secondary" className="text-xs">
                                  Recurring
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              style={{
                                backgroundColor: category?.color + "20",
                                color: category?.color,
                              }}
                            >
                              {category?.name}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                transaction.type === "INCOME"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(transaction.date), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "text-right font-semibold",
                              transaction.type === "INCOME"
                                ? "text-green-600"
                                : "text-red-600",
                            )}
                          >
                            {transaction.type === "INCOME" ? "+" : "-"}{formatAmount(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEdit(transaction)}
                                  disabled={isLoading}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(transaction.id)}
                                  className="text-red-600"
                                  disabled={isLoading}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && transactions.length > 0 && (
              <div className="flex items-center justify-between px-2 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {(currentPage - 1) * pageSize + transactions.length} transactions
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
                    Page {currentPage}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={transactions.length < pageSize}
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
