import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { RecurringTableHeaders } from "@/components/recurring/RecurringTableHeaders";

export const LoadingSkeleton: FC = () => (
  <div className="overflow-x-auto">
    <Table>
      <RecurringTableHeaders />
      <TableBody>
        {Array.from({ length: 6 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Skeleton className="h-11 w-11 rounded-md shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-20 ml-auto" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-28 rounded-full" />
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-16 rounded-sm" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-8 rounded-md" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
