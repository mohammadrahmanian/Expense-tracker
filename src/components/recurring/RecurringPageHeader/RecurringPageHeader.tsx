import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type RecurringPageHeaderProps = {
  onCreate: () => void;
};

export const RecurringPageHeader: FC<RecurringPageHeaderProps> = ({
  onCreate,
}) => (
  <div className="flex items-center justify-between">
    <div className="flex flex-col gap-1">
      <h1 className="text-h1 text-foreground">Recurring transactions</h1>
      <p className="text-caption text-muted-foreground">
        Repeating expenses and income scheduled to run automatically.
      </p>
    </div>
    <Button onClick={onCreate}>
      <Plus className="mr-2 h-4 w-4" />
      New recurring
    </Button>
  </div>
);
