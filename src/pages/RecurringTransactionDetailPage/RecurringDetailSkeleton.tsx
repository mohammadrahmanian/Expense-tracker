import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const RecurringDetailSkeleton: FC = () => (
  <div className="flex flex-col gap-5">
    <Skeleton className="h-40 w-full" />
    <div className="flex flex-col gap-5 lg:flex-row">
      <Skeleton className="order-2 h-64 lg:order-none lg:flex-1" />
      <Skeleton className="order-1 h-64 lg:order-none lg:w-[340px]" />
    </div>
  </div>
);
