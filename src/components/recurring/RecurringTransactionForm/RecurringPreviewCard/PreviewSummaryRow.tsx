import { type FC } from "react";
import { ICON_BY_NAME } from "@/components/categories/CategoryFormDialog/CategoryFormDialog.constants";
import { cn } from "@/lib/utils";
import { Category } from "@/types";

type PreviewSummaryRowProps = {
  title: string;
  type: "INCOME" | "EXPENSE";
  amount: string;
  category: Category | undefined;
};

export const PreviewSummaryRow: FC<PreviewSummaryRowProps> = ({
  title,
  type,
  amount,
  category,
}) => {
  const Icon = ICON_BY_NAME[category?.icon ?? "utensils"] ?? ICON_BY_NAME.utensils;

  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-gold-50 dark:bg-gold-700/25">
        <Icon className="h-5 w-5 text-gold-500 dark:text-gold-300" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[15px] font-semibold text-foreground">
          {title}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {category?.name ?? "No category"}
        </span>
      </div>
      <span
        className={cn(
          "shrink-0 text-[15px] font-bold",
          type === "INCOME" ? "text-success-500" : "text-danger-500",
        )}
      >
        {amount}
      </span>
    </div>
  );
};
