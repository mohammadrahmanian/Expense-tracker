import { type FC } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SummaryCardProps = {
  title: string;
  value: string;
  valueClassName: string;
  isLoading: boolean;
  hasError: boolean;
};

export const SummaryCard: FC<SummaryCardProps> = ({
  title,
  value,
  valueClassName,
  isLoading,
  hasError,
}) => (
  <Card className="p-4 md:p-5 flex flex-col gap-2">
    <span className="text-xs font-medium text-muted-foreground">{title}</span>
    {isLoading ? (
      <Skeleton className="h-7 w-28" />
    ) : (
      <span className={cn("text-xl font-bold", valueClassName)}>
        {hasError ? "\u2014" : value}
      </span>
    )}
  </Card>
);
