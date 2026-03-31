import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const MobileLoadingSkeleton: FC = () => (
  <div className="flex flex-col gap-4 px-5 py-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
    ))}
  </div>
);
