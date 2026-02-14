import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { ResponsiveDialogFooter as DialogFooter } from "@/components/ui/responsive-dialog";
import { Loader2 } from "lucide-react";

type RecurringTransactionFormFooterProps = {
  mode: "create" | "edit";
  isPending: boolean;
  isCategoriesLoading: boolean;
  onCancel: () => void;
};

export const RecurringTransactionFormFooter: FC<
  RecurringTransactionFormFooterProps
> = ({ mode, isPending, isCategoriesLoading, onCancel }) => {
  const submitLabel =
    mode === "edit" ? "Save Changes" : "Create Recurring Transaction";
  const pendingLabel = mode === "edit" ? "Saving..." : "Creating...";

  return (
    <DialogFooter>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="flex-1"
        disabled={isPending}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        className="flex-1"
        disabled={isPending || isCategoriesLoading}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {pendingLabel}
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </DialogFooter>
  );
};
