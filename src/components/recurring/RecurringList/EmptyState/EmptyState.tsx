import { type FC } from "react";
import { CalendarX } from "lucide-react";

type EmptyStateProps = {
  hasActiveFilters: boolean;
};

export const EmptyState: FC<EmptyStateProps> = ({ hasActiveFilters }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <CalendarX className="mb-3 h-10 w-10 text-muted-foreground" />
    <p className="text-sm font-semibold text-foreground">
      {hasActiveFilters
        ? "No matching schedules"
        : "No recurring transactions yet"}
    </p>
    <p className="mt-1 text-sm text-muted-foreground max-w-xs">
      {hasActiveFilters
        ? "Try adjusting your filters."
        : "Create your first recurring schedule using the New recurring button."}
    </p>
  </div>
);
