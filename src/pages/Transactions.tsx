import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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

const Transactions: React.FC = () => {
  const { formatAmount } = useCurrency();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "INCOME" | "EXPENSE">(
    "all",
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, typeFilter, categoryFilter]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const allTransactions = await transactionsService.getAll();
      const allCategories = await categoriesService.getAll();
      setTransactions(allTransactions);
      setCategories(allCategories);
    } catch (error) {
      toast.error("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter((transaction) =>
        transaction.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.type === typeFilter,
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.categoryId === categoryFilter,
      );
    }

    // Sort by date (newest first)
    filtered = filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    setFilteredTransactions(filtered);
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

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Transactions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your income and expense transactions.
            </p>
          </div>
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
            <div className="grid gap-4 md:grid-cols-4">
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
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                  setCategoryFilter("all");
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
              All Transactions ({filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading transactions...</span>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {transactions.length === 0
                    ? "No transactions yet. Start by adding your first transaction!"
                    : "No transactions match your filters."}
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
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => {
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
