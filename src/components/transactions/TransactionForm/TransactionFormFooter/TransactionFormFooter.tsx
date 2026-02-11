import { Button } from "@/components/ui/button";
import { ResponsiveDialogFooter as DialogFooter } from "@/components/ui/responsive-dialog";
import { Loader2 } from "lucide-react";

type TransactionFormFooterProps = {
  isEditing: boolean;
  isPending: boolean;
  isCategoriesLoading: boolean;
  onCancel: () => void;
};

export const TransactionFormFooter: React.FC<TransactionFormFooterProps> = ({
  isEditing,
  isPending,
  isCategoriesLoading,
  onCancel,
}) => {
  return (
    <DialogFooter className="mt-6">
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
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending
          ? `${isEditing ? "Updating" : "Adding"}...`
          : `${isEditing ? "Update" : "Add"} Transaction`}
      </Button>
    </DialogFooter>
  );
};
