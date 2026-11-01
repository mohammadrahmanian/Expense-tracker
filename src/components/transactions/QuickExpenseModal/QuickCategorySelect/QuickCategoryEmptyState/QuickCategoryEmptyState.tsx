import { type FC } from "react";

type QuickCategoryEmptyStateProps = {
  transactionKind: "expense" | "income";
};

const RECORD_LABEL = {
  expense: "an expense",
  income: "income",
} as const;

export const QuickCategoryEmptyState: FC<QuickCategoryEmptyStateProps> = ({
  transactionKind,
}) => (
  <div className="space-y-4">
    <span className="text-overline text-neutral-500 uppercase tracking-[1.5px]">
      Category
    </span>
    <p className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-[13px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/40 dark:text-neutral-400">
      You don&apos;t have any {transactionKind} categories yet. Add categories
      in your category settings, then come back here to record{" "}
      {RECORD_LABEL[transactionKind]}.
    </p>
  </div>
);
