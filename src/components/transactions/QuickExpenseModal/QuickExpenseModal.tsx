import { type FC } from "react";
import {
  ResponsiveDialog as Dialog,
  ResponsiveDialogContent as DialogContent,
} from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { QuickExpenseFields } from "./QuickExpenseFields";
import { QuickExpenseModalHeader } from "./QuickExpenseModalHeader";
import { useQuickExpenseModal } from "./useQuickExpenseModal";

type QuickExpenseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const QuickExpenseModal: FC<QuickExpenseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    form,
    transactionKind,
    handleTabChange,
    title,
    description,
    submitLabel,
    handleClose,
    onSubmit,
    isPending,
    categoriesLoading,
    incomeCategoriesEmpty,
    currencySymbol,
    activeCategories,
  } = useQuickExpenseModal({ onClose });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <QuickExpenseModalHeader
          title={title}
          description={description}
          tabValue={transactionKind}
          onTabChange={handleTabChange}
        />
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <QuickExpenseFields
            form={form}
            currencySymbol={currencySymbol}
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
