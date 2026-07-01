import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const MobileLoadingSkeleton: FC = () => (
  <div className="flex flex-col gap-3 px-5 pb-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="rounded-lg border border-border p-3.5 flex flex-col gap-2.5"
      >
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-sm" />
        </div>
      </div>
    ))}
  </div>
);
