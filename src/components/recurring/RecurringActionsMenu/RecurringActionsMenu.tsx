import { type FC } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  Loader2,
  MoreHorizontal,
  Pause,
  Play,
  Trash2,
} from "lucide-react";
import type { RecurringStatus } from "@/types";

type RecurringActionsMenuProps = {
  status: RecurringStatus;
  onEdit: () => void;
  onTogglePause: () => void;
  onDelete: () => void;
  isToggling: boolean;
  isDeleting: boolean;
};

export const RecurringActionsMenu: FC<RecurringActionsMenuProps> = ({
  status,
  onEdit,
  onTogglePause,
  onDelete,
  isToggling,
  isDeleting,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={onEdit}>
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </DropdownMenuItem>
      {status === "active" && (
        <DropdownMenuItem onClick={onTogglePause} disabled={isToggling}>
          {isToggling ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Pause className="mr-2 h-4 w-4" />
          )}
          Pause
        </DropdownMenuItem>
      )}
      {status === "paused" && (
        <DropdownMenuItem onClick={onTogglePause} disabled={isToggling}>
          {isToggling ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          Resume
        </DropdownMenuItem>
      )}
      <DropdownMenuItem
        onClick={onDelete}
        className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="mr-2 h-4 w-4" />
        )}
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
