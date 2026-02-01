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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createAmountChangeHandler, normalizeAmount } from "@/lib/amount-utils";
import {
  categoriesService,
  recurringTransactionsService,
} from "@/services/api";
import { Category } from "@/types";
import { useCurrency } from "@/contexts/CurrencyContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Info, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";

const recurringTransactionCreateSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(40, "Title must be 40 characters or less"),
    type: z.enum(["INCOME", "EXPENSE"]),
    categoryId: z.string().min(1, "Category is required"),
    recurrenceFrequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
    startDate: z.date(),
    endDate: z.date().optional().nullable(),
    description: z
      .string()
      .max(256, "Description must be 256 characters or less")
      .optional(),
  })
  .refine(
    (data) => {
      // If endDate is provided, it must be after startDate
      if (data.endDate && data.startDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

type RecurringTransactionCreateFormData = z.infer<
  typeof recurringTransactionCreateSchema
>;

interface RecurringTransactionCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const RecurringTransactionCreateForm: React.FC<
  RecurringTransactionCreateFormProps
> = ({ onSuccess, onCancel }) => {
  const { currency } = useCurrency();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [amount, setAmount] = React.useState<string>("");
  const [startCalendarOpen, setStartCalendarOpen] = React.useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = React.useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const allCategories = await categoriesService.getAll();
        setCategories(allCategories);
      } catch (error) {
        toast.error("Failed to load categories. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAmountChange = createAmountChangeHandler(setAmount);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RecurringTransactionCreateFormData>({
    resolver: zodResolver(recurringTransactionCreateSchema),
    defaultValues: {
      title: "",
      type: "EXPENSE",
      categoryId: "",
      recurrenceFrequency: "MONTHLY",
      startDate: new Date(),
      endDate: null,
      description: "",
    },
  });

  const watchType = watch("type");
  const watchStartDate = watch("startDate");
  const watchEndDate = watch("endDate");

  const filteredCategories = categories.filter((cat) => cat.type === watchType);

  const onSubmit = async (data: RecurringTransactionCreateFormData) => {
    try {
      setIsSubmitting(true);

      // Validate amount manually
      if (!amount) {
        toast.error("Please enter an amount");
        setIsSubmitting(false);
        return;
      }

      const normalizedAmount = normalizeAmount(amount.trim());
      const numericAmount = parseFloat(normalizedAmount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        toast.error("Please enter a valid amount");
        setIsSubmitting(false);
        return;
      }

      // Convert start date to UTC to avoid timezone issues on the backend
      const utcStartDate = new Date(
        data.startDate.getTime() - data.startDate.getTimezoneOffset() * 60000,
      );

      // Convert end date to UTC if provided
      const utcEndDate = data.endDate
        ? new Date(
            data.endDate.getTime() - data.endDate.getTimezoneOffset() * 60000,
          )
        : null;

      // Build create payload
      const createPayload = {
        title: data.title,
        amount: numericAmount,
        type: data.type,
        categoryId: data.categoryId,
        startDate: utcStartDate.toISOString(),
        endDate: utcEndDate?.toISOString(),
        description: data.description || undefined,
        recurrenceFrequency: data.recurrenceFrequency,
      };

      await recurringTransactionsService.createRecurring(createPayload);

      toast.success("Recurring transaction created successfully!");
      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create recurring transaction. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add Recurring Transaction</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Transaction Details Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Transaction Details
          </h3>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Monthly Rent, Weekly Groceries"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
              maxLength={40}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Amount and Type */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Amount ({currency === "USD" ? "$" : "€"}){" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  {currency === "USD" ? "$" : "€"}
                </span>
                <Input
                  id="amount"
                  type="text"
                  placeholder="0.00 or 0,00"
                  value={amount}
                  onChange={handleAmountChange}
                  className="pl-8"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Type <span className="text-red-500">*</span>
              </Label>
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
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>
              Category <span className="text-red-500">*</span>
            </Label>
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add a note about this recurring transaction..."
              {...register("description")}
              className={errors.description ? "border-red-500" : ""}
              maxLength={256}
              rows={2}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        {/* Recurrence Settings Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Recurrence Settings
          </h3>

          {/* Frequency */}
          <div className="space-y-2">
            <Label>
              Frequency <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("recurrenceFrequency")}
              onValueChange={(
                value: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY",
              ) => setValue("recurrenceFrequency", value)}
            >
              <SelectTrigger
                className={errors.recurrenceFrequency ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {errors.recurrenceFrequency && (
              <p className="text-sm text-red-500">
                {errors.recurrenceFrequency.message}
              </p>
            )}
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label>
              Start Date <span className="text-red-500">*</span>
            </Label>
            <Popover
              open={startCalendarOpen}
              onOpenChange={setStartCalendarOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watchStartDate && "text-muted-foreground",
                    errors.startDate && "border-red-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watchStartDate ? (
                    format(watchStartDate, "PPP")
                  ) : (
                    <span>Select start date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={watchStartDate}
                  onSelect={(date) => {
                    setValue("startDate", date || new Date());
                    setStartCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label>End Date (optional)</Label>
            <Popover open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watchEndDate && "text-muted-foreground",
                    errors.endDate && "border-red-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watchEndDate ? (
                    format(watchEndDate, "PPP")
                  ) : (
                    <span>Select end date...</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={watchEndDate || undefined}
                  onSelect={(date) => {
                    setValue("endDate", date || null);
                    setEndCalendarOpen(false);
                  }}
                  initialFocus
                  disabled={(date) => date < watchStartDate}
                />
              </PopoverContent>
            </Popover>
            {watchEndDate && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setValue("endDate", null)}
                className="h-auto p-0 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Clear end date
              </Button>
            )}
            {errors.endDate && (
              <p className="text-sm text-red-500">{errors.endDate.message}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Leave empty for indefinite recurrence
            </p>
          </div>

          {/* Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              This will create a recurring schedule that automatically generates
              transactions based on the frequency you selected.
            </AlertDescription>
          </Alert>
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Recurring Transaction"
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};
