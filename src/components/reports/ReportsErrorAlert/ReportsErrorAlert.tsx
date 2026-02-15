import { type FC } from "react";
import { Button } from "@/components/ui/button";

type ReportsErrorAlertProps = {
  error: string;
  onRetry: () => void;
};

export const ReportsErrorAlert: FC<ReportsErrorAlertProps> = ({
  error,
  onRetry,
}) => (
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <p className="text-red-600 dark:text-red-400">{error}</p>
      <Button
        onClick={onRetry}
        variant="link"
        size="sm"
        className="underline hover:no-underline"
      >
        Retry
      </Button>
    </div>
  </div>
);
