import { type FC } from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const RecurringTableHeaders: FC = () => (
  <TableHeader>
    <TableRow className="bg-neutral-50 dark:bg-neutral-800">
      <TableHead className="text-overline uppercase text-muted-foreground tracking-wider">
        Name
      </TableHead>
      <TableHead className="w-[140px] text-right text-overline uppercase text-muted-foreground tracking-wider">
        Amount
      </TableHead>
      <TableHead className="w-[160px] text-overline uppercase text-muted-foreground tracking-wider">
        Frequency
      </TableHead>
      <TableHead className="w-[160px] text-overline uppercase text-muted-foreground tracking-wider">
        Next run
      </TableHead>
      <TableHead className="w-[120px] text-overline uppercase text-muted-foreground tracking-wider">
        Status
      </TableHead>
      <TableHead className="w-[48px]" />
    </TableRow>
  </TableHeader>
);
