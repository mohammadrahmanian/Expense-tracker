import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { CategoryFormDialog } from "@/components/categories/CategoryFormDialog";
import { CategoryList } from "@/components/categories/CategoryList";
import { Category } from "@/types";
import { useCategories } from "@/hooks/queries/useCategories";
import { useDeleteCategory } from "@/hooks/mutations/useDeleteCategory";
import { useState } from "react";

const Categories = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();

  const { data: categories = [], isLoading, error } = useCategories();
  const deleteCategory = useDeleteCategory();

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      try {
        await deleteCategory.mutateAsync(categoryId);
      } catch {
        // Error toast handled by mutation hook
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingCategory(undefined);
  };

  const incomeCategories = categories.filter((cat) => cat.type === "INCOME");
  const expenseCategories = categories.filter((cat) => cat.type === "EXPENSE");

  return (
    <DashboardLayout>
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">Loading categories...</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <p className="text-red-600 dark:text-red-400">Failed to load categories. Please try again.</p>
        </div>
      )}
      {!isLoading && !error && (
        <div className="space-y-6">
          <div className="flex justify-end items-center">
            <CategoryFormDialog
              isOpen={isFormOpen}
              onOpenChange={setIsFormOpen}
              editingCategory={editingCategory}
              onSuccess={handleFormSuccess}
              onNewClick={() => setEditingCategory(undefined)}
            />
          </div>
          <CategoryList
            title="Income Categories"
            categories={incomeCategories}
            indicatorColor="#22c55e"
            emptyMessage="No income categories yet. Create your first one!"
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <CategoryList
            title="Expense Categories"
            categories={expenseCategories}
            indicatorColor="#ef4444"
            emptyMessage="No expense categories yet. Create your first one!"
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default Categories;
