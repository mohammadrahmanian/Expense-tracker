import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ResponsiveDialog as Dialog,
  ResponsiveDialogContent as DialogContent,
  ResponsiveDialogDescription as DialogDescription,
  ResponsiveDialogHeader as DialogHeader,
  ResponsiveDialogTitle as DialogTitle,
} from '@/components/ui/responsive-dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCurrency } from '@/contexts/CurrencyContext';
import { transactionsService, categoriesService } from '@/services/api';
import { Category } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CalendarIcon, UtensilsCrossed, Heart, Home, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickCategories = [
  { name: 'Food', icon: UtensilsCrossed, color: '#FF6B6B' },
  { name: 'Health', icon: Heart, color: '#4ECDC4' },
  { name: 'Household', icon: Home, color: '#45B7D1' },
];

export const QuickExpenseModal: React.FC<QuickExpenseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { formatAmount, currency } = useCurrency();
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [transactionName, setTransactionName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const allCategories = await categoriesService.getAll();
      setCategories(allCategories.filter(cat => cat.type === 'EXPENSE'));
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load categories. Please try again.');
    }
  };

  const findCategoryByName = (name: string): Category | undefined => {
    return categories.find(cat => 
      cat.name.toLowerCase() === name.toLowerCase()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !selectedCategory) {
      toast.error('Please fill in all required fields');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    try {
      let category = findCategoryByName(selectedCategory);
      
      // If category doesn't exist, create it
      if (!category) {
        const newCategory = await categoriesService.create({
          name: selectedCategory,
          type: 'EXPENSE',
          color: quickCategories.find(cat => cat.name === selectedCategory)?.color || '#6366f1',
        });
        category = newCategory;
        
        // Refresh categories list
        await loadCategories();
        
        toast.success(`Created "${selectedCategory}" category`);
      }

      const title = transactionName.trim() || `${selectedCategory} expense`;
      
      await transactionsService.create({
        title,
        amount: numericAmount,
        type: 'EXPENSE',
        categoryId: category.id,
        date,
        isRecurring: false,
      });

      toast.success('Expense added successfully!');
      handleClose();
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Failed to add expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setSelectedCategory('');
    setTransactionName('');
    setDate(new Date());
    setIsCalendarOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Add Expense</DialogTitle>
          <DialogDescription>
            Quickly add a Food, Health, or Household expense.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-3">
            <Label>Category</Label>
            <div className="grid grid-cols-3 gap-2">
              {quickCategories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.name;
                const category = findCategoryByName(cat.name);
                
                return (
                  <Button
                    key={cat.name}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "h-16 flex flex-col items-center justify-center gap-1",
                      isSelected && "bg-blue-600 hover:bg-blue-700",
                      !category && "opacity-75"
                    )}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{cat.name}</span>
                    {!category && (
                      <span className="text-[10px] text-red-500">Missing</span>
                    )}
                  </Button>
                );
              })}
            </div>
            {selectedCategory && !findCategoryByName(selectedCategory) && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  ℹ️ The "{selectedCategory}" category will be created automatically when you add this expense.
                </p>
              </div>
            )}
          </div>

          {/* Transaction Name Input (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="transactionName">
              Transaction Name 
              <span className="text-xs text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="transactionName"
              type="text"
              placeholder={selectedCategory ? `${selectedCategory} expense` : "Enter transaction name..."}
              value={transactionName}
              onChange={(e) => setTransactionName(e.target.value)}
            />
            {selectedCategory && !transactionName.trim() && (
              <p className="text-xs text-muted-foreground">
                Will use "{selectedCategory} expense" as default
              </p>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {currency === 'USD' ? '$' : '€'}
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                required
              />
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    if (selectedDate) {
                      setDate(selectedDate);
                      setIsCalendarOpen(false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || !selectedCategory || !amount}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Expense'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};