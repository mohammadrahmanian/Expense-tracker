import { type FC, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

type TransactionsPageHeaderProps = {
  addTransactionTrigger: ReactNode;
};

export const TransactionsPageHeader: FC<TransactionsPageHeaderProps> = ({
  addTransactionTrigger,
}) => (
  <div className="flex items-center justify-between">
    <div className="flex flex-col gap-1">
      <h1 className="text-h1 text-foreground">Transactions</h1>
      <p className="text-caption text-muted-foreground">
        Track every penny in and out
      </p>
    </div>
    <div className="flex items-center gap-2.5">
      <Button
        variant="outline"
        onClick={() => toast.info("Export is coming soon!")}
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      {addTransactionTrigger}
    </div>
  </div>
);
