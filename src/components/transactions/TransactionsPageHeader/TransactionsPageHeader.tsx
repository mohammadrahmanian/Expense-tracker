import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

export const TransactionsPageHeader: FC = () => (
  <div className="flex items-center justify-between">
    <div className="flex flex-col gap-1">
      <h1 className="text-h1 text-foreground">Transactions</h1>
      <p className="text-caption text-muted-foreground">
        Track every penny in and out
      </p>
    </div>
    <Button
      variant="outline"
      onClick={() => toast.info("Export is coming soon!")}
    >
      <Download className="h-4 w-4 mr-2" />
      Export
    </Button>
  </div>
);
