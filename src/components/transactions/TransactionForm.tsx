import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  ResponsiveDialogFooter as DialogFooter,
  ResponsiveDialogHeader as DialogHeader,
  ResponsiveDialogTitle as DialogTitle,
} from "@/components/ui/responsive-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { createAmountChangeHandler, normalizeAmount } from "@/lib/amount-utils";
import { Transaction } from "@/types";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCategories } from "@/hooks/queries/useCategories";
import { useCreateTransaction } from "@/hooks/mutations/useCreateTransaction";
import { useUpdateTransaction } from "@/hooks/mutations/useUpdateTransaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { AlertCircle, CalendarIcon, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const transactionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "Category is required"),
  date: z.date(),
  isRecurring: z.boolean().default(false),
  recurrenceFrequency: z
    .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
    .optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  transaction?: Transaction;
  onSuccess: () => void;
  onCancel: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSuccess,
  onCancel,
}) => {
  const { currency } = useCurrency();
  const [amount, setAmount] = React.useState<string>(
    transaction?.amount?.toString() || "",
  );

  // Fetch categories using TanStack Query
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  // Mutation hooks for create and update
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();

  // Update amount state when transaction changes (for editing)
  useEffect(() => {
    if (transaction?.amount) {
      setAmount(transaction.amount.toString());
    }
  }, [transaction]);

  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const handleAmountChange = createAmountChangeHandler(setAmount);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: transaction?.title || "",
      type: transaction?.type || "EXPENSE",
      categoryId: transaction?.categoryId || "",
      date: transaction ? new Date(transaction.date) : new Date(),
      isRecurring: transaction?.isRecurring || false,
      recurrenceFrequency: transaction?.recurrenceFrequency || "MONTHLY",
    },
  });

  const watchType = watch("type");
  const watchIsRecurring = watch("isRecurring");
  const watchDate = watch("date");

  const filteredCategories = categories.filter((cat) => cat.type === watchType);

  // Handle categories loading error
  if (categoriesError) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Edit Transaction" : "Add New Transaction"}
          </DialogTitle>
        </DialogHeader>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to Load Categories</AlertTitle>
          <AlertDescription>
            Unable to load categories. Please try again.
          </AlertDescription>
        </Alert>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Close
          </Button>
        </DialogFooter>
      </>
    );
  }

  const onSubmit = async (data: TransactionFormData) => {
    // Validate amount
    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }

    const normalizedAmount = normalizeAmount(amount.trim());
    const numericAmount = parseFloat(normalizedAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Convert date to UTC to avoid timezone issues
    const utcDate = new Date(
      data.date.getTime() - data.date.getTimezoneOffset() * 60000,
    );

    // Prepare transaction data (backend derives userId from JWT)
    const transactionData = {
      title: data.title,
      amount: numericAmount,
      type: data.type,
      date: utcDate,
      categoryId: data.categoryId,
      isRecurring: data.isRecurring,
      recurrenceFrequency: data.recurrenceFrequency,
    };

    // Use mutation hooks
    if (transaction) {
      updateTransaction.mutate(
        { id: transaction.id, updates: transactionData },
        {
          onSuccess: () => {
            reset();
            setAmount("");
            onSuccess();
          },
        },
      );
    } else {
      createTransaction.mutate(transactionData, {
        onSuccess: () => {
          reset();
          setAmount("");
          onSuccess();
        },
      });
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {transaction ? "Edit Transaction" : "Add New Transaction"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Groceries, Salary"
                {...register("title")}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">
                Amount ({currency === "USD" ? "$" : "€"})
              </Label>
              <Input
                id="amount"
                type="text"
                placeholder="0.00 or 0,00"
                value={amount}
                onChange={handleAmountChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={watchType}
                onValueChange={(value: "INCOME" | "EXPENSE") => {
                  setValue("type", value);
                  setValue("categoryId", ""); // Reset category when type changes
                }}
              >
                <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                  <SelectItem value="INCOME">Income</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={watch("categoryId")}
                onValueChange={(value) => setValue("categoryId", value)}
              >
                <SelectTrigger
                  className={errors.categoryId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
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
              {errors.categoryId && (
                <p className="text-sm text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watchDate && "text-muted-foreground",
                    errors.date && "border-red-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watchDate ? (
                    format(watchDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={watchDate}
                  onSelect={(date) => {
                    setValue("date", date || new Date());
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={watchIsRecurring}
                onCheckedChange={(checked) => setValue("isRecurring", checked)}
              />
              <Label htmlFor="recurring">Recurring transaction</Label>
            </div>

            {watchIsRecurring && (
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  value={watch("recurrenceFrequency")}
                  onValueChange={(
                    value: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY",
                  ) => setValue("recurrenceFrequency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="YEARLY">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={
              createTransaction.isPending || updateTransaction.isPending
            }
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={
              createTransaction.isPending ||
              updateTransaction.isPending ||
              categoriesLoading
            }
          >
            {(createTransaction.isPending || updateTransaction.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {createTransaction.isPending || updateTransaction.isPending
              ? `${transaction ? "Updating" : "Adding"}...`
              : `${transaction ? "Update" : "Add"} Transaction`}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};
