import { type FC } from "react";
import { motion } from "framer-motion";
import { Category, Transaction } from "@/types";
import { MobileTransactionRowActions } from "./MobileTransactionRowActions";
import { MobileTransactionRowContent } from "./MobileTransactionRowContent";
import { useSwipeReveal } from "./useSwipeReveal";

type MobileTransactionRowProps = {
  transaction: Transaction;
  category: Category;
  formatAmount: (amount: number) => string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
};

export const MobileTransactionRow: FC<MobileTransactionRowProps> = ({
  transaction,
  category,
  formatAmount,
  isOpen,
  onOpenChange,
  onEdit,
  onDelete,
}) => {
  const { motionProps, close } = useSwipeReveal({ isOpen, onOpenChange });

  const handleEdit = () => {
    close();
    onEdit(transaction);
  };

  const handleDelete = () => {
    close();
    onDelete(transaction.id);
  };

  return (
    <div className="relative overflow-hidden border-b border-border">
      <MobileTransactionRowActions
        onEdit={handleEdit}
        onDelete={handleDelete}
        onFocus={() => onOpenChange(true)}
      />
      <motion.div
        {...motionProps}
        className="relative touch-pan-y select-none bg-background"
      >
        <MobileTransactionRowContent
          transaction={transaction}
          category={category}
          formatAmount={formatAmount}
        />
      </motion.div>
    </div>
  );
};
