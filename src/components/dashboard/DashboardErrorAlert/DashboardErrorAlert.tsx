import { type FC } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type DashboardErrorAlertProps = {
  statsError?: Error | null;
  transactionsError?: Error | null;
  categoriesError?: Error | null;
  categoryExpensesError?: Error | null;
};

export const DashboardErrorAlert: FC<DashboardErrorAlertProps> = ({
  statsError,
  transactionsError,
  categoriesError,
  categoryExpensesError,
}) => {
  const hasError =
    statsError || transactionsError || categoriesError || categoryExpensesError;

  if (!hasError) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Failed to Load Dashboard Data</AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-1">
          {statsError && (
            <p>
              &bull; Dashboard stats: {statsError.message || "Unknown error"}
            </p>
          )}
          {transactionsError && (
            <p>
              &bull; Transactions:{" "}
              {transactionsError.message || "Unknown error"}
            </p>
          )}
          {categoriesError && (
            <p>
              &bull; Categories: {categoriesError.message || "Unknown error"}
            </p>
          )}
          {categoryExpensesError && (
            <p>
              &bull; Category expenses:{" "}
              {categoryExpensesError.message || "Unknown error"}
            </p>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};
