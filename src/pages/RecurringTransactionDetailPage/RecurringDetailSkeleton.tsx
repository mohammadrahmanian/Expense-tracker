import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const RecurringDetailSkeleton: FC = () => (
  <div className="flex flex-col gap-5">
    <Skeleton className="h-40 w-full" />
    <div className="lg:flex lg:gap-5">
      <Skeleton className="h-64 lg:flex-1" />
      <Skeleton className="mt-5 h-64 lg:mt-0 lg:w-[340px]" />
    </div>
  </div>
);
