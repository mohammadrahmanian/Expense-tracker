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
  <TableCell className="relative">
    <div className="flex items-center gap-3">
      <CategoryIconWrap color={color} Icon={Icon} />
      <div className="flex min-w-0 flex-col">
        <Link
          to={to}
          className="text-sm font-semibold text-foreground hover:underline before:absolute before:inset-0 before:z-10"
        >
          <span className="relative z-10 block truncate">{title}</span>
        </Link>
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>
    </div>
  </TableCell>
);
