import { type FC } from "react";
import { TransactionTableHeaders } from "@/components/transactions/TransactionTableHeaders";
import { TransactionTableRow } from "@/components/transactions/TransactionTableRow";
import { Table, TableBody } from "@/components/ui/table";
import { getCategoryById } from "@/lib/transactions.utils";
import { Category, Transaction } from "@/types";

type TransactionsListContentProps = {
  transactions: Transaction[];
  categories: Category[] | undefined;
  sortField: "date" | "amount";
  sortOrder: "asc" | "desc";
  onSort: (field: "date" | "amount") => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  isDeletingId: string | undefined;
  formatAmount: (amount: number) => string;
};

export const TransactionsListContent: FC<TransactionsListContentProps> = ({
  transactions,
  categories,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  isDeletingId,
  formatAmount,
}) => (
  <div className="overflow-x-auto">
    <Table>
      <TransactionTableHeaders
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={onSort}
      />
      <TableBody>
        {transactions.map((transaction) => (
          <TransactionTableRow
            key={transaction.id}
            transaction={transaction}
            category={getCategoryById(categories, transaction.categoryId, transaction.type)}
            formatAmount={formatAmount}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={isDeletingId === transaction.id}
          />
        ))}
      </TableBody>
    </Table>
  </div>
);
