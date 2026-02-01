import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Category, Transaction } from "@/types";
import { format } from "date-fns";
import { ActionsMenu } from "./ActionsMenu";
import { TransactionTypeIcon } from "./TransactionTypeIcon";

interface TransactionCardProps {
  transaction: Transaction;
  category: Category;
  formatAmount: (amount: number) => string;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function TransactionCard({
  transaction,
  category,
  formatAmount,
  onEdit,
  onDelete,
  isDeleting = false,
}: TransactionCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          {/* Left: Icon + Info */}
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <TransactionTypeIcon type={transaction.type} size="md" />

            <div className="flex-1 min-w-0">
              {/* Title */}
              <p className="font-medium truncate mb-1">{transaction.title}</p>

              {/* Category & Date */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{
                    backgroundColor: category.color + "20",
                    color: category.color,
                  }}
                >
                  {category.name}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(transaction.date), "MMM dd, yyyy")}
                </span>
              </div>

              {/* Amount */}
              <div
                className={cn(
                  "text-lg font-bold mt-2",
                  transaction.type === "INCOME"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                {transaction.type === "INCOME" ? "+" : "-"}
                {formatAmount(transaction.amount)}
              </div>
            </div>
          </div>

          {/* Right: Actions Menu */}
          <ActionsMenu
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        </div>
      </CardContent>
    </Card>
  );
}
