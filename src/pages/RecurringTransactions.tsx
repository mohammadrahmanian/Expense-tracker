import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  ResponsiveDialog,
  ResponsiveDialogContent,
} from "@/components/ui/responsive-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Category, RecurringTransaction } from "@/types";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Edit,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RecurringTransactionForm } from "@/components/recurring/RecurringTransactionForm";
import { RecurringTransactionCreateForm } from "@/components/recurring/RecurringTransactionCreateForm";
import { useRecurringTransactions } from "@/hooks/queries/useRecurringTransactions";
import { useCategories } from "@/hooks/queries/useCategories";
import { useDeleteRecurringTransaction } from "@/hooks/mutations/useDeleteRecurringTransaction";
import { useToggleRecurringTransaction } from "@/hooks/mutations/useToggleRecurringTransaction";

const RecurringTransactions: React.FC = () => {
  const { formatAmount } = useCurrency();

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "INCOME" | "EXPENSE">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // UI state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<RecurringTransaction | null>(null);

  // Fetch data using React Query hooks
  const { data: recurringTransactions, isLoading: recurringLoading } = useRecurringTransactions();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const deleteTransaction = useDeleteRecurringTransaction();
  const toggleTransaction = useToggleRecurringTransaction();

  const isLoading = recurringLoading || categoriesLoading;

  // Filter transactions using useMemo (client-side filtering)
  const filteredTransactions = useMemo(() => {
    if (!recurringTransactions) return [];

    let filtered = [...recurringTransactions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((t) => t.categoryId === categoryFilter);
    }

    return filtered;
  }, [recurringTransactions, searchTerm, typeFilter, categoryFilter]);

  const handleDelete = () => {
    if (!selectedTransaction) return;

    deleteTransaction.mutate(selectedTransaction.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedTransaction(null);
      },
    });
  };

  const handleToggleStatus = () => {
    if (!selectedTransaction) return;

    const newStatus = !selectedTransaction.isActive;
    toggleTransaction.mutate(
      { id: selectedTransaction.id, isActive: newStatus },
      {
        onSuccess: () => {
          setToggleDialogOpen(false);
          setSelectedTransaction(null);
        },
      }
    );
  };

  const handleFormSuccess = () => {
    setEditDialogOpen(false);
    setCreateDialogOpen(false);
    setSelectedTransaction(null);
  };

  const getRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Invalid date";
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories?.find((cat) => cat.id === categoryId);
  };

  const activeTransactions = filteredTransactions.filter((t) => t.isActive);
  const inactiveTransactions = filteredTransactions.filter((t) => !t.isActive);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search recurring transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
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
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            {/* Active Transactions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  ACTIVE RECURRING TRANSACTIONS ({activeTransactions.length})
                </h2>
                <Button size="sm" className="gap-2" onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Add New
                </Button>
              </div>

              {activeTransactions.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No active recurring transactions
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {activeTransactions.map((transaction) => (
                    <RecurringTransactionCard
                      key={transaction.id}
                      transaction={transaction}
                      category={getCategoryInfo(transaction.categoryId)}
                      formatAmount={formatAmount}
                      getRelativeTime={getRelativeTime}
                      onDelete={() => {
                        setSelectedTransaction(transaction);
                        setDeleteDialogOpen(true);
                      }}
                      onToggle={() => {
                        setSelectedTransaction(transaction);
                        setToggleDialogOpen(true);
                      }}
                      onEdit={() => {
                        setSelectedTransaction(transaction);
                        setEditDialogOpen(true);
                      }}
                      isDeleting={deleteTransaction.isPending && selectedTransaction?.id === transaction.id}
                      isToggling={toggleTransaction.isPending && selectedTransaction?.id === transaction.id}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Inactive Transactions */}
            {inactiveTransactions.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  INACTIVE RECURRING TRANSACTIONS ({inactiveTransactions.length})
                </h2>
                <div className="space-y-3">
                  {inactiveTransactions.map((transaction) => (
                    <RecurringTransactionCard
                      key={transaction.id}
                      transaction={transaction}
                      category={getCategoryInfo(transaction.categoryId)}
                      formatAmount={formatAmount}
                      getRelativeTime={getRelativeTime}
                      onDelete={() => {
                        setSelectedTransaction(transaction);
                        setDeleteDialogOpen(true);
                      }}
                      onToggle={() => {
                        setSelectedTransaction(transaction);
                        setToggleDialogOpen(true);
                      }}
                      onEdit={() => {
                        setSelectedTransaction(transaction);
                        setEditDialogOpen(true);
                      }}
                      isDeleting={deleteTransaction.isPending && selectedTransaction?.id === transaction.id}
                      isToggling={toggleTransaction.isPending && selectedTransaction?.id === transaction.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recurring Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recurring transaction? This will not affect
              existing transactions that have already been created.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toggle Status Confirmation Dialog */}
      <AlertDialog open={toggleDialogOpen} onOpenChange={setToggleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedTransaction?.isActive ? "Deactivate" : "Activate"} Recurring Transaction
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedTransaction?.isActive
                ? "Deactivating this recurring transaction will stop creating new transactions from this schedule."
                : "Activating this recurring transaction will resume creating new transactions from this schedule."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatus}>
              {selectedTransaction?.isActive ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Recurring Transaction Dialog */}
      <ResponsiveDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <ResponsiveDialogContent>
          {selectedTransaction && (
            <RecurringTransactionForm
              transaction={selectedTransaction}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setEditDialogOpen(false);
                setSelectedTransaction(null);
              }}
            />
          )}
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      {/* Create Recurring Transaction Dialog */}
      <ResponsiveDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <ResponsiveDialogContent>
          <RecurringTransactionCreateForm
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setCreateDialogOpen(false);
            }}
          />
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </DashboardLayout>
  );
};

interface RecurringTransactionCardProps {
  transaction: RecurringTransaction;
  category?: Category;
  formatAmount: (amount: number) => string;
  getRelativeTime: (dateString: string) => string;
  onDelete: () => void;
  onToggle: () => void;
  onEdit: () => void;
  isDeleting: boolean;
  isToggling: boolean;
}

const RecurringTransactionCard: React.FC<RecurringTransactionCardProps> = ({
  transaction,
  category,
  formatAmount,
  getRelativeTime,
  onDelete,
  onToggle,
  onEdit,
  isDeleting,
  isToggling,
}) => {
  const TypeIcon = transaction.type === "INCOME" ? ArrowUpRight : ArrowDownLeft;

  return (
    <Card className={cn(!transaction.isActive && "opacity-60")}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                transaction.type === "INCOME"
                  ? "bg-green-100 dark:bg-green-900/20"
                  : "bg-red-100 dark:bg-red-900/20"
              )}
            >
              <TypeIcon
                className={cn(
                  "h-6 w-6",
                  transaction.type === "INCOME"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              {/* Title - full width */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                    {transaction.title}
                  </h3>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{transaction.title}</p>
                </TooltipContent>
              </Tooltip>

              {/* Category */}
              {category && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {category.name}
                </p>
              )}

              {/* Badges row */}
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant={transaction.type === "INCOME" ? "default" : "destructive"}
                  className="shrink-0"
                >
                  {transaction.type}
                </Badge>
                <Badge
                  variant={transaction.isActive ? "default" : "secondary"}
                  className={cn(
                    "shrink-0",
                    transaction.isActive
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                  )}
                >
                  {transaction.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {formatAmount(transaction.amount)}
              </p>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span>Every {transaction.recurrenceFrequency.toLowerCase()}</span>
                <span className="mx-2">•</span>
                {transaction.isActive ? (
                  <span>Next: {getRelativeTime(transaction.nextOccurrence)}</span>
                ) : (
                  <span>Deactivated</span>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggle} disabled={isToggling}>
                {isToggling ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : transaction.isActive ? (
                  <ToggleLeft className="mr-2 h-4 w-4" />
                ) : (
                  <ToggleRight className="mr-2 h-4 w-4" />
                )}
                {transaction.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="text-red-600 focus:text-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecurringTransactions;
