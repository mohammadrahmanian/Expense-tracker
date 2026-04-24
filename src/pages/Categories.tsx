import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { CategoriesPageHeader } from "@/components/categories/CategoriesPageHeader";
import { CategoryCardGrid } from "@/components/categories/CategoryCardGrid";
import { CategoryFormDialog } from "@/components/categories/CategoryFormDialog";
import { CategorySearchField } from "@/components/categories/CategorySearchField";
import { CategoryStatsRow } from "@/components/categories/CategoryStatsRow";
import { CategoryTypeTabs } from "@/components/categories/CategoryTypeTabs";
import { useCategoriesPage } from "@/hooks/useCategoriesPage";

export const Categories = () => {
  const {
    activeType,
    setActiveType,
    search,
    setSearch,
    isFormOpen,
    setIsFormOpen,
    editingCategory,
    totalsByCategoryId,
    visibleCategories,
    totalCount,
    totalBudget,
    totalAmount,
    emptyMessage,
    handleEdit,
    handleDelete,
    handleFormSuccess,
    openAdd,
    isLoading,
    totalsLoading,
    loadError,
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
          <CategoryTypeTabs value={activeType} onChange={setActiveType} />
          <CategorySearchField value={search} onChange={setSearch} />
          <CategoryStatsRow
            totalCount={totalCount}
            totalBudget={totalBudget}
            totalAmount={totalAmount}
            type={activeType}
          />
          <CategoryCardGrid
            categories={visibleCategories}
            totalsByCategoryId={totalsByCategoryId}
            totalsLoading={totalsLoading}
            emptyMessage={emptyMessage}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <CategoryFormDialog
            isOpen={isFormOpen}
            onOpenChange={setIsFormOpen}
            editingCategory={editingCategory}
            onSuccess={handleFormSuccess}
          />
        </div>
      )}
    </DashboardLayout>
  );
};
