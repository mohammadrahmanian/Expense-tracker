import { type FC } from "react";
import { Loader2 } from "lucide-react";
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
import type { RecurringTransaction } from "@/types";

type DeleteRecurringDialogProps = {
  target: RecurringTransaction | null;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const DeleteRecurringDialog: FC<DeleteRecurringDialogProps> = ({
  target,
  isPending,
  onCancel,
  onConfirm,
}) => (
  <AlertDialog open={!!target} onOpenChange={(o) => !o && onCancel()}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete recurring transaction</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete &ldquo;{target?.title}&rdquo;? This
          will not affect transactions that have already been created.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          disabled={isPending}
          className="bg-red-600 hover:bg-red-700"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
