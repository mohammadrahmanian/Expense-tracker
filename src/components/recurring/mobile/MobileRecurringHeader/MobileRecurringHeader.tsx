import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { Plus, SlidersHorizontal } from "lucide-react";

type MobileRecurringHeaderProps = {
  totalAllCount: number;
  onFilterTap: () => void;
  onCreate: () => void;
  hasActiveFilters: boolean;
};

export const MobileRecurringHeader: FC<MobileRecurringHeaderProps> = ({
  totalAllCount,
  onFilterTap,
  onCreate,
  hasActiveFilters,
}) => (
  <div className="px-5 py-2.5 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <h1 className="text-2xl font-bold text-foreground tracking-tight">
        Recurring
      </h1>
      <span className="inline-flex items-center rounded-full bg-primary-bg px-2 py-0.5 text-[11px] font-bold text-primary">
        {totalAllCount}
      </span>
    </div>
    <div className="flex items-center gap-2">
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={onFilterTap}
          aria-label="Open filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
        {hasActiveFilters && (
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary pointer-events-none" />
        )}
      </div>
      <Button
        size="icon"
        className="h-9 w-9"
        onClick={onCreate}
        aria-label="Create recurring transaction"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
