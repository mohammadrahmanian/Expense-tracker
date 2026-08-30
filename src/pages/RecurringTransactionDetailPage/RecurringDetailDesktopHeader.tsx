import { type FC } from "react";
import { Link } from "react-router-dom";
import { Ellipsis, Pause, Pencil, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { RecurringStatus } from "@/types";

type RecurringDetailDesktopHeaderProps = {
  title: string;
  status: RecurringStatus;
  onPause: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isToggling: boolean;
  isDeleting: boolean;
};

export const RecurringDetailDesktopHeader: FC<
  RecurringDetailDesktopHeaderProps
> = ({ title, status, onPause, onEdit, onDelete, isToggling, isDeleting }) => (
  <div className="mb-6 flex items-center justify-between gap-4">
    <div className="flex flex-col gap-1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/recurring-transactions">Recurring</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
    </div>
    <div className="flex items-center gap-3">
      {status !== "ended" && (
        <Button
          type="button"
          variant="outline"
          onClick={onPause}
          disabled={isToggling}
        >
          {status === "paused" ? (
            <>
              <Play className="mr-2 h-4 w-4" />
              Resume
            </>
          ) : (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </>
          )}
        </Button>
      )}
      <Button type="button" variant="outline" onClick={onEdit}>
        <Pencil className="mr-2 h-4 w-4" />
        Edit
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="More actions"
          >
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isDeleting}
            className="text-danger-500 focus:text-danger-500"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
);
