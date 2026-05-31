import { CategoriesPageHeader } from "@/components/categories/CategoriesPageHeader";
import { CategoryDeleteConfirmDialog } from "@/components/categories/CategoryDeleteConfirmDialog";
import { CategoryExpenseIncomeTabs } from "@/components/categories/CategoryExpenseIncomeTabs";
import { CategoryFormDialog } from "@/components/categories/CategoryFormDialog";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useCategoriesPage } from "@/hooks/useCategoriesPage";

export const Categories = () => {
  const {
    expenseIncomeTabsModel,
    isFormOpen,
    setIsFormOpen,
    editingCategory,
    handleFormSuccess,
    openAdd,
    isLoading,
    loadError,
    isDeleteDialogOpen,
    confirmDelete,
    cancelDelete,
    isDeletingCategory,
  } = useCategoriesPage();

  return (
    <DashboardLayout>
      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      )}
      {loadError && !isLoading && (
        <div className="mb-4 rounded-lg border border-danger-300 bg-danger-50 p-4 dark:border-danger-700 dark:bg-danger-950/30">
          <p className="text-danger-500">
            Failed to load categories. Please try again.
          </p>
        </div>
      )}
      {!isLoading && !loadError && (
        <div className="flex flex-col gap-6">
          <CategoriesPageHeader onAdd={openAdd} />
          <CategoryExpenseIncomeTabs model={expenseIncomeTabsModel} />
          <CategoryFormDialog
            isOpen={isFormOpen}
            onOpenChange={setIsFormOpen}
            editingCategory={editingCategory}
            onSuccess={handleFormSuccess}
          />
          <CategoryDeleteConfirmDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={(open) => {
              if (!open) cancelDelete();
            }}
            onConfirm={confirmDelete}
            isDeleting={isDeletingCategory}
          />
        </div>
      )}
    </DashboardLayout>
  );
};
