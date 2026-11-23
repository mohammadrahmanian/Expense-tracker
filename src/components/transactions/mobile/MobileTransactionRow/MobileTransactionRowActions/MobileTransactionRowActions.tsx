import { type FC } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type MobileTransactionRowActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  onFocus: () => void;
};

const ACTION_BUTTON_CLASS =
  "flex h-full w-20 flex-col items-center justify-center gap-1 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring";

export const MobileTransactionRowActions: FC<
  MobileTransactionRowActionsProps
> = ({ onEdit, onDelete, onFocus }) => (
  <div className="absolute inset-y-0 right-0 flex">
    <button
      type="button"
      aria-label="Edit transaction"
      onClick={onEdit}
      onFocus={onFocus}
      className={cn(
        ACTION_BUTTON_CLASS,
        "bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100",
      )}
    >
      <Pencil className="h-4 w-4" aria-hidden="true" />
      Edit
    </button>
    <button
      type="button"
      aria-label="Delete transaction"
      onClick={onDelete}
      onFocus={onFocus}
      className={cn(
        ACTION_BUTTON_CLASS,
        "bg-danger-500 text-danger-50 dark:bg-danger-700 dark:text-danger-100",
      )}
    >
      <Trash2 className="h-4 w-4" aria-hidden="true" />
      Delete
    </button>
  </div>
);
