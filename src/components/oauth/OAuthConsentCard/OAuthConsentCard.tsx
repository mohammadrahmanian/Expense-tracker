import { type FC } from "react";
import { Check, Loader2, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_ACCESS_SUMMARY =
  "read your transactions, categories, budgets and log new transactions";

type OAuthConsentCardProps = {
  clientName: string | null;
  scope: string | null;
  isSubmitting: boolean;
  pendingAction: "approve" | "deny" | null;
  onApprove: () => void;
  onDeny: () => void;
};

export const OAuthConsentCard: FC<OAuthConsentCardProps> = ({
  clientName,
  scope,
  isSubmitting,
  pendingAction,
  onApprove,
  onDeny,
}) => {
  const appName = clientName?.trim() || "An application";
  const accessSummary = scope?.trim() || DEFAULT_ACCESS_SUMMARY;

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Allow{" "}
          <span className="text-blue-600 dark:text-blue-400">{appName}</span> to
          access your Expensio finances?
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You're about to give an external AI agent access to your financial
          data. Only approve if you started this from{" "}
          <span className="font-medium text-gray-900 dark:text-white">
            {appName}
          </span>
          .
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Access granted
        </p>
        <p className="mt-1.5 text-sm text-gray-700 dark:text-gray-300">
          {accessSummary}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          type="button"
          className="w-full"
          onClick={onApprove}
          disabled={isSubmitting}
        >
          {pendingAction === "approve" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          Approve
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onDeny}
          disabled={isSubmitting}
        >
          {pendingAction === "deny" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
          Deny
        </Button>
      </div>
    </div>
  );
};
