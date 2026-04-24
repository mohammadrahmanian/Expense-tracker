import { type FC } from "react";
import { Card } from "@/components/ui/card";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Category } from "@/types";
import { Eye, Folder, Info, MoreHorizontal } from "lucide-react";
import { ICON_BY_NAME } from "../CategoryFormDialog.constants";

type LivePreviewPanelProps = {
  name: string;
  iconName: string;
  color: string;
  parentId: string | null;
  budgetAmount: number | null;
  categories: Category[];
};

export const LivePreviewPanel: FC<LivePreviewPanelProps> = ({
  name,
  iconName,
  color,
  parentId,
  budgetAmount,
  categories,
}) => {
  const { formatAmount } = useCurrency();
  const Icon = ICON_BY_NAME[iconName] ?? ICON_BY_NAME["utensils"];
  const parentLabel = parentId
    ? categories.find((c) => c.id === parentId)?.name ?? "Unresolved parent category"
    : "Top-level category";
  const budgetCap = budgetAmount ?? 0;

  return (
    <aside className="hidden w-[320px] shrink-0 flex-col justify-between gap-6 bg-primary-bg p-7 sm:flex">
      <div className="flex items-center gap-2 text-gold-700 dark:text-gold-300">
        <Eye className="h-3.5 w-3.5" aria-hidden />
        <span className="text-overline tracking-[0.15em]">LIVE PREVIEW</span>
      </div>

      <Card className="flex flex-col gap-5 border-border p-6 shadow-none">
        <div className="flex items-start justify-between gap-3">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg">
            <div
              className="pointer-events-none absolute inset-0 rounded-lg bg-neutral-50 dark:bg-neutral-800"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-lg opacity-[0.16] dark:opacity-[0.3]"
              style={{ backgroundColor: color }}
              aria-hidden
            />
            <Icon className="relative z-10 h-7 w-7" style={{ color }} strokeWidth={2} aria-hidden />
          </div>
          <button
            type="button"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800"
            aria-label="Menu"
            disabled
          >
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xl font-bold tracking-tight text-foreground">
            {name.trim() || "Category name"}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Folder className="h-3 w-3 shrink-0" aria-hidden />
            <span>{parentLabel}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Monthly budget</span>
            <span className="text-muted-foreground">
              {formatAmount(0)} of {formatAmount(budgetCap)}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
            <div className="h-full w-0 rounded-full bg-primary" />
          </div>
        </div>
      </Card>

      <div className="flex gap-2.5 rounded-md border border-gold-100 bg-surface p-3 dark:border-gold-900/40 dark:bg-neutral-900">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-bg dark:bg-primary-bg/50">
          <Info className="h-3.5 w-3.5 text-gold-700 dark:text-gold-300" aria-hidden />
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-xs font-semibold text-foreground">Fill in the form</p>
          <p className="text-[11px] leading-snug text-muted-foreground">
            Watch the card on the left update in real time as you make choices.
          </p>
        </div>
      </div>
    </aside>
  );
};
