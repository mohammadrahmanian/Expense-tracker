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

type ToggleRecurringDialogProps = {
  target: RecurringTransaction | null;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const ToggleRecurringDialog: FC<ToggleRecurringDialogProps> = ({
  target,
  isPending,
  onCancel,
  onConfirm,
}) => {
  const isPausing = target?.isActive ?? false;
  return (
    <AlertDialog open={!!target} onOpenChange={(o) => !o && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isPausing
              ? "Pause recurring transaction"
              : "Resume recurring transaction"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isPausing
              ? "Pausing this schedule will stop new transactions from being created."
              : "Resuming this schedule will continue creating new transactions on the planned cadence."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPausing ? "Pause" : "Resume"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
