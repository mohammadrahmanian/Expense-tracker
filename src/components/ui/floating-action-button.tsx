import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuickExpenseModal } from './quick-expense-modal';

export const FloatingActionButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className={cn(
          "!fixed !bottom-32 !right-6 lg:!bottom-6 h-14 w-14 rounded-full shadow-lg",
          "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
          "z-50 transition-all duration-200 ease-in-out",
          "hover:scale-110 active:scale-95"
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