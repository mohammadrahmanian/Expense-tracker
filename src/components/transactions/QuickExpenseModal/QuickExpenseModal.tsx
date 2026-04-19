import { type FC, useState } from "react";
import {
  ResponsiveDialog as Dialog,
  ResponsiveDialogContent as DialogContent,
  ResponsiveDialogDescription as DialogDescription,
  ResponsiveDialogTitle as DialogTitle,
} from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Segment, SegmentItem, SegmentList } from "@/components/ui/segment";
import { currencySymbols, useCurrency } from "@/contexts/CurrencyContext";
import { useCreateCategory } from "@/hooks/mutations/useCreateCategory";
import { useCreateTransaction } from "@/hooks/mutations/useCreateTransaction";
import { useCategories } from "@/hooks/queries/useCategories";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { QuickExpenseFields } from "./QuickExpenseFields";
import {
  type QuickExpenseFormData,
  quickExpenseSchema,
} from "./QuickExpenseModal.types";
import { createQuickExpenseSubmitHandler } from "./QuickExpenseModal.utils";

type TransactionKind = "expense" | "income";

type QuickExpenseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const QuickExpenseModal: FC<QuickExpenseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currency } = useCurrency();
  const [transactionKind, setTransactionKind] =
    useState<TransactionKind>("expense");

  const { data: expenseCategories = [], isLoading: expenseCategoriesLoading } =
    useCategories("EXPENSE");
  const { data: incomeCategories = [], isLoading: incomeCategoriesLoading } =
    useCategories("INCOME");

  const createCategory = useCreateCategory();
  const createTransaction = useCreateTransaction();

  const form = useForm<QuickExpenseFormData>({
    resolver: zodResolver(quickExpenseSchema),
    defaultValues: {
      transactionName: "",
      amount: "",
      categoryName: "",
      date: new Date(),
      isRecurring: false,
      recurrenceFrequency: undefined,
    },
  });

  const isPending = createCategory.isPending || createTransaction.isPending;

  const activeCategories =
    transactionKind === "income" ? incomeCategories : expenseCategories;
  const categoriesLoading =
    transactionKind === "income"
      ? incomeCategoriesLoading
      : expenseCategoriesLoading;

  const incomeCategoriesEmpty =
    transactionKind === "income" && incomeCategories.length === 0;

  const handleClose = () => {
    form.reset();
    setTransactionKind("expense");
    onClose();
  };

  const onSubmit = createQuickExpenseSubmitHandler({
    categories: activeCategories,
    transactionType: transactionKind === "income" ? "INCOME" : "EXPENSE",
    createCategoryAsync: createCategory.mutateAsync,
    createTransaction: createTransaction.mutate,
    onSuccess: handleClose,
  });

  const handleTabChange = (value: string) => {
    if (value !== "expense" && value !== "income") return;
    setTransactionKind(value);
    form.setValue("categoryName", "", { shouldValidate: false });
    form.clearErrors("categoryName");
  };

  const title =
    transactionKind === "income" ? "Add Income" : "Add Expense";
  const description =
    transactionKind === "income"
      ? "Pick an income category to get started"
      : "Pick a category to get started";
  const submitLabel =
    transactionKind === "income" ? "Add Income" : "Add Expense";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="-mx-6 sm:-mt-6 flex flex-col gap-4 border-b border-neutral-200 px-6 py-5 dark:border-neutral-700">
          <div className="space-y-0.5">
            <DialogTitle className="text-[18px] font-semibold">
              {title}
            </DialogTitle>
            <DialogDescription className="text-[13px] text-neutral-500">
              {description}
            </DialogDescription>
          </div>
          <Segment value={transactionKind} onValueChange={handleTabChange}>
            <SegmentList>
              <SegmentItem value="expense" variant="default">
                Expense
              </SegmentItem>
              <SegmentItem value="income" variant="default">
                Income
              </SegmentItem>
            </SegmentList>
          </Segment>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <QuickExpenseFields
            form={form}
            currencySymbol={currencySymbols[currency]}
            categories={activeCategories}
            transactionKind={transactionKind}
          />

          <div className="-mx-6 mt-4 flex items-center gap-3 border-t border-neutral-200 px-6 pb-5 pt-4 dark:border-neutral-700">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={
                isPending ||
                categoriesLoading ||
                incomeCategoriesEmpty
              }
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Adding..." : submitLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
