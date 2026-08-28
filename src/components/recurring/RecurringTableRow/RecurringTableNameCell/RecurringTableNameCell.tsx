import { type FC } from "react";
import { Link } from "react-router-dom";
import { TableCell } from "@/components/ui/table";
import { CategoryIconWrap } from "@/components/categories/CategoryCard/CategoryIconWrap";
import type { LucideIcon } from "lucide-react";

type RecurringTableNameCellProps = {
  title: string;
  subtitle: string;
  color: string;
  Icon: LucideIcon;
  to: string;
};

export const RecurringTableNameCell: FC<RecurringTableNameCellProps> = ({
  title,
  subtitle,
  color,
  Icon,
  to,
}) => (
  <TableCell onClick={(e) => e.stopPropagation()}>
    <div className="flex items-center gap-3">
      <CategoryIconWrap color={color} Icon={Icon} />
      <div className="flex flex-col min-w-0">
        <Link
          to={to}
          className="truncate text-sm font-semibold text-foreground hover:underline"
        >
          {title}
        </Link>
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>
    </div>
  </TableCell>
);
