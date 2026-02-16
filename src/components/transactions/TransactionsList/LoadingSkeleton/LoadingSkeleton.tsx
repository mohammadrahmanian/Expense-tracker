import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSkeleton: FC = () => (
  <>
    {/* Mobile skeleton */}
    <div className="md:hidden space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
    {/* Desktop skeleton */}
    <div className="hidden md:block">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    </div>
  </>
);
