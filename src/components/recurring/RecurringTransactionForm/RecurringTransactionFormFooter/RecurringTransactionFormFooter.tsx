import { type FC, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveDialogFooter as DialogFooter } from "@/components/ui/responsive-dialog";

type RecurringTransactionFormFooterProps = {
  chrome: "dialog" | "page";
  mode: "create" | "edit";
  isPending: boolean;
  isCategoriesLoading: boolean;
  onCancel: () => void;
  firstOccurrenceNote: ReactNode;
};

export const RecurringTransactionFormFooter: FC<
  RecurringTransactionFormFooterProps
> = ({ chrome, mode, isPending, isCategoriesLoading, onCancel, firstOccurrenceNote }) => {
  const submitLabel =
    mode === "edit" ? "Save changes" : "Save recurring transaction";
  const pendingLabel = mode === "edit" ? "Saving..." : "Creating...";
  const isDisabled = isPending || isCategoriesLoading;

  const submitContent = isPending ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {pendingLabel}
    </>
  ) : (
    submitLabel
  );

  if (chrome === "dialog") {
    return (
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isDisabled}>
          {submitContent}
        </Button>
      </DialogFooter>
    );
  }

  return (
    <div className="sticky bottom-0 flex flex-col gap-3 border-t border-border bg-background px-4 py-4 mobile-safe-bottom">
      {firstOccurrenceNote}
      <Button type="submit" className="w-full" disabled={isDisabled}>
        {submitContent}
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
