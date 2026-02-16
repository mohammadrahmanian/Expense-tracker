import { type FC, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type SummaryCardProps = {
  icon: ReactNode;
  title: string;
  isLoading: boolean;
  hasError: boolean;
  valueClass: string;
  formattedValue: string;
};

export const SummaryCard: FC<SummaryCardProps> = ({
  icon,
  title,
  isLoading,
  hasError,
  valueClass,
  formattedValue,
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center space-x-2">
        {icon}
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <p className={valueClass}>
              {hasError ? "\u2014" : formattedValue}
            </p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);
