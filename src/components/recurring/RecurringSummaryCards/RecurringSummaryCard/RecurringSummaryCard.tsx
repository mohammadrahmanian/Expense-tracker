import { type FC } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type RecurringSummaryCardProps = {
  overline: string;
  value: string;
  valueClassName?: string;
  caption: string;
  isLoading: boolean;
  hasError: boolean;
};

export const RecurringSummaryCard: FC<RecurringSummaryCardProps> = ({
  overline,
  value,
  valueClassName,
  caption,
  isLoading,
  hasError,
}) => (
  <Card className="p-5 flex flex-col gap-1.5">
    <span className="text-overline uppercase text-muted-foreground tracking-wider">
      {overline}
    </span>
    {isLoading ? (
      <Skeleton className="h-7 w-32" />
    ) : hasError ? (
      <span className="text-2xl font-bold text-muted-foreground">—</span>
    ) : (
      <span
        className={cn(
          "text-2xl font-bold tracking-tight",
          valueClassName ?? "text-foreground",
        )}
      >
        {value}
      </span>
    )}
    {isLoading ? (
      <Skeleton className="h-3 w-24" />
    ) : hasError ? (
      <span className="text-caption text-muted-foreground invisible">—</span>
    ) : (
      <span className="text-caption text-muted-foreground">{caption}</span>
    )}
  </Card>
);
