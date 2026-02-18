import { type FC } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type TransactionsListStatusProps = {
  hasError: boolean;
  transactionsError: boolean;
  transactionsErrorMessage?: string;
  categoriesError: boolean;
  categoriesErrorMessage?: string;
  hasActiveFilters: boolean;
};

export const TransactionsListStatus: FC<TransactionsListStatusProps> = ({
  hasError,
  transactionsError,
  transactionsErrorMessage,
  categoriesError,
  categoriesErrorMessage,
  hasActiveFilters,
}) => {
  if (hasError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Failed to Load Transactions</AlertTitle>
        <AlertDescription>
          <div className="mt-2 space-y-1">
            {transactionsError && (
              <p>
                &bull; Transactions:{" "}
                {transactionsErrorMessage || "Unknown error"}
              </p>
            )}
            {categoriesError && (
              <p>
                &bull; Categories:{" "}
                {categoriesErrorMessage || "Unknown error"}
              </p>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="text-center py-8">
      <p className="text-gray-500 dark:text-gray-400">
        {hasActiveFilters
          ? "No transactions match your filters."
          : "No transactions yet. Start by adding your first transaction!"}
      </p>
    </div>
  );
};
