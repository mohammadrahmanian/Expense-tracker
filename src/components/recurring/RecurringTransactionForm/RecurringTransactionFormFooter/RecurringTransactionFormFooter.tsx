import { type FC, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type RecurringTransactionFormFooterProps = {
  layout: "mobile" | "desktop";
  mode: "create" | "edit";
  isPending: boolean;
  isCategoriesLoading: boolean;
  onCancel: () => void;
  firstOccurrenceNote: ReactNode;
};

export const RecurringTransactionFormFooter: FC<
  RecurringTransactionFormFooterProps
> = ({ layout, mode, isPending, isCategoriesLoading, onCancel, firstOccurrenceNote }) => {
  const pendingLabel = mode === "edit" ? "Saving..." : "Creating...";
  const isDisabled = isPending || isCategoriesLoading;

  const submitContent = (label: string) =>
    isPending ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {pendingLabel}
      </>
    ) : (
      label
    );

  if (layout === "desktop") {
    return (
      <div className="flex items-center justify-between gap-4 border-t border-border bg-neutral-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        {firstOccurrenceNote}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isDisabled}>
            {submitContent(mode === "edit" ? "Save changes" : "Save recurring")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 flex flex-col gap-3 border-t border-border bg-background px-4 py-4 mobile-safe-bottom">
      {firstOccurrenceNote}
      <Button type="submit" className="w-full" disabled={isDisabled}>
        {submitContent(
          mode === "edit" ? "Save changes" : "Save recurring transaction",
        )}
      </Button>
      <button
        type="button"
        onClick={onCancel}
        disabled={isPending}
        className="text-center text-sm font-medium text-muted-foreground disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
};
