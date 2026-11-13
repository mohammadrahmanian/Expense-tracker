import { useState } from "react";
import { useDeleteRecurringTransaction } from "@/hooks/mutations/useDeleteRecurringTransaction";
import { useToggleRecurringTransaction } from "@/hooks/mutations/useToggleRecurringTransaction";
import type { RecurringTransaction } from "@/types";

export function useRecurringDetailDialogs(
  transaction: RecurringTransaction | undefined,
  onDeleteSuccess: () => void,
) {
  const deleteMut = useDeleteRecurringTransaction();
  const toggleMut = useToggleRecurringTransaction();
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  return {
    deleteTarget: deleting && transaction ? transaction : null,
    toggleTarget: toggling && transaction ? transaction : null,
    isDeleting: deleteMut.isPending,
    isToggling: toggleMut.isPending,
    openDelete: () => setDeleting(true),
    openToggle: () => setToggling(true),
    onCancelDelete: () => setDeleting(false),
    onCancelToggle: () => setToggling(false),
    onConfirmDelete: () => {
      if (!transaction) return;
      deleteMut.mutate(transaction.id, { onSuccess: onDeleteSuccess });
    },
    onConfirmToggle: () => {
      if (!transaction) return;
      toggleMut.mutate(
        { id: transaction.id, active: !transaction.isActive },
        { onSuccess: () => setToggling(false) },
      );
    },
  };
}
