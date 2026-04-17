import { type FC } from "react";
import {
  ResponsiveDialog as Dialog,
  ResponsiveDialogContent as DialogContent,
  ResponsiveDialogDescription as DialogDescription,
  ResponsiveDialogTitle as DialogTitle,
} from "@/components/ui/responsive-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { currencySymbols, useCurrency } from "@/contexts/CurrencyContext";
import { useCreateCategory } from "@/hooks/mutations/useCreateCategory";
import { useCreateTransaction } from "@/hooks/mutations/useCreateTransaction";
import { useCategories } from "@/hooks/queries/useCategories";
import { useIsMobile } from "@/hooks/use-mobile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
  const isMobile = useIsMobile();
  const { currency } = useCurrency();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories("EXPENSE");
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

  const formContent = (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <QuickExpenseFields
          form={form}
          currencySymbol={currencySymbols[currency]}
          categories={categories}
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
            disabled={isPending || categoriesLoading}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Adding..." : "Add Expense"}
          </Button>
        </div>
      </form>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()} dismissible={false}>
        <DrawerContent className="max-h-[90dvh]" onOverlayClick={handleClose}>
          <div className="px-6 pt-2 pb-2">
            <DrawerTitle className="text-[18px] font-semibold">
              Add Expense
            </DrawerTitle>
            <DrawerDescription className="text-[13px] text-neutral-500">
              Pick a category to get started
            </DrawerDescription>
          </div>
          <div className="overflow-y-auto px-6">{formContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="-mx-6 sm:-mt-6 flex items-center justify-between border-b border-neutral-200 px-6 py-5 dark:border-neutral-700">
          <div className="space-y-0.5">
            <DialogTitle className="text-[18px] font-semibold">
              Add Expense
            </DialogTitle>
            <DialogDescription className="text-[13px] text-neutral-500">
              Pick a category to get started
            </DialogDescription>
          </div>
        </div>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};
