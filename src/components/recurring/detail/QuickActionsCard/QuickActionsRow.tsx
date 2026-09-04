import { type FC } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActionRow } from "./QuickActionsCard.types";

type QuickActionsRowProps = { row: ActionRow };

export const QuickActionsRow: FC<QuickActionsRowProps> = ({ row }) => (
  <button
    type="button"
    onClick={row.onClick}
    disabled={row.disabled}
    className="flex items-center gap-3 rounded-md p-2.5 text-left hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-45 dark:hover:bg-neutral-800"
  >
    <row.icon
      className={cn(
        "h-4 w-4 shrink-0",
        row.danger ? "text-danger-500" : "text-neutral-500 dark:text-neutral-400",
      )}
    />
    <div className="flex min-w-0 flex-1 flex-col">
      <span
        className={cn(
          "text-sm font-medium",
          row.danger ? "text-danger-500" : "text-foreground",
        )}
      >
        {row.title}
      </span>
      <span className="text-xs text-muted-foreground">{row.subtitle}</span>
    </div>
    <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
  </button>
);
