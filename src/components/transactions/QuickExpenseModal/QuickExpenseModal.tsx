import { type FC } from "react";
import {
  ResponsiveDialog as Dialog,
  ResponsiveDialogContent as DialogContent,
  ResponsiveDialogDescription as DialogDescription,
  ResponsiveDialogHeader as DialogHeader,
  ResponsiveDialogTitle as DialogTitle,
} from "@/components/ui/responsive-dialog";
import { TransactionFormFooter } from "../TransactionForm/TransactionFormFooter";
import { currencySymbols, useCurrency } from "@/contexts/CurrencyContext";
import { useCreateCategory } from "@/hooks/mutations/useCreateCategory";
import { useCreateTransaction } from "@/hooks/mutations/useCreateTransaction";
import { useCategories } from "@/hooks/queries/useCategories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { QuickExpenseFields } from "./QuickExpenseFields";
import {
  type QuickExpenseFormData,
  quickExpenseSchema,
} from "./QuickExpenseModal.types";
import { createQuickExpenseSubmitHandler } from "./QuickExpenseModal.utils";

type QuickExpenseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const QuickExpenseModal: FC<QuickExpenseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currency } = useCurrency();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories("EXPENSE");
  const createCategory = useCreateCategory();
  const createTransaction = useCreateTransaction();

  const form = useForm<QuickExpenseFormData>({
    resolver: zodResolver(quickExpenseSchema),
    defaultValues: { transactionName: "", amount: "", categoryName: "", date: new Date() },
  });

  const isPending = createCategory.isPending || createTransaction.isPending;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = createQuickExpenseSubmitHandler({
    categories,
    createCategoryAsync: createCategory.mutateAsync,
    createTransaction: createTransaction.mutate,
    onSuccess: handleClose,
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Quick Add Expense</DialogTitle>
          <DialogDescription>
            Quickly add a Food, Health, or Household expense.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <QuickExpenseFields
            form={form}
            currencySymbol={currencySymbols[currency]}
            categories={categories}
          />
          <TransactionFormFooter
            isEditing={false}
            isPending={isPending}
            isCategoriesLoading={categoriesLoading}
            onCancel={handleClose}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};
