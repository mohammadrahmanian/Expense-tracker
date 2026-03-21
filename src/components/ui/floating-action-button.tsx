import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuickExpenseModal } from "@/components/transactions/QuickExpenseModal";

export const FloatingActionButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className={cn(
          "!fixed !bottom-6 !right-6 hidden lg:!flex h-14 w-14 rounded-full shadow-lg",
          "bg-gold-500 hover:bg-gold-600 dark:bg-gold-500 dark:hover:bg-gold-600",
          "z-50 transition-all duration-200 ease-in-out",
          "hover:scale-110 active:scale-95",
        )}
        size="sm"
      >
        <Plus className="h-6 w-6 text-white" />
      </Button>

      <QuickExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
