import type { CategoryExpenseIncomeTabsModel } from "@/components/categories/CategoryExpenseIncomeTabs/CategoryExpenseIncomeTabs.utils";
import { useDeleteCategory } from "@/hooks/mutations/useDeleteCategory";
import { useCategories } from "@/hooks/queries/useCategories";
import { useMonthlyCategoryTotals } from "@/hooks/queries/useMonthlyCategoryTotals";
import type { Category } from "@/types";
import { useCallback, useMemo, useRef, useState } from "react";

export function useCategoriesPage() {
  const [activeType, setActiveType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const pendingDeleteIdRef = useRef<string | null>(null);
  pendingDeleteIdRef.current = pendingDeleteId;

  const { data: categories = [], isLoading, error } = useCategories();
  const { data: totalsByCategoryId = {}, isLoading: totalsLoading } =
    useMonthlyCategoryTotals();
  const deleteCategory = useDeleteCategory();

  const searchLower = search.trim().toLowerCase();
  const { categoriesOfType, visibleCategories, totalCount, totalBudget, totalAmount } =
    useMemo(() => {
      const ofType = categories.filter((c) => c.type === activeType);
      const visible = ofType.filter((c) =>
        searchLower ? c.name.toLowerCase().includes(searchLower) : true,
      );
      const budget = ofType.reduce(
        (sum, c) => sum + (c.budgetAmount ?? 0),
        0,
      );
      const amount = ofType.reduce(
        (sum, c) => sum + (totalsByCategoryId[c.id]?.spent ?? 0),
        0,
      );
      return {
        categoriesOfType: ofType,
        visibleCategories: visible,
        totalCount: ofType.length,
        totalBudget: budget,
        totalAmount: amount,
      };
    }, [categories, activeType, searchLower, totalsByCategoryId]);

  const emptyMessage = useMemo(() => {
    if (categoriesOfType.length === 0) {
      return activeType === "EXPENSE"
        ? "No expense categories yet. Create your first one!"
        : "No income categories yet. Create your first one!";
    }
    return "No categories match your search.";
  }, [categoriesOfType.length, activeType]);

  const handleEdit = useCallback((category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback((categoryId: string) => {
    setPendingDeleteId(categoryId);
  }, []);

  const cancelDelete = useCallback(() => {
    setPendingDeleteId(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    const id = pendingDeleteIdRef.current;
    if (!id) return;
    try {
      await deleteCategory.mutateAsync(id);
      setPendingDeleteId(null);
    } catch {
      // Error toast handled by mutation hook
    }
  }, [deleteCategory]);

  const handleFormSuccess = useCallback(() => {
    setIsFormOpen(false);
    setEditingCategory(undefined);
  }, []);

  const openAdd = useCallback(() => {
    setEditingCategory(undefined);
    setIsFormOpen(true);
  }, []);

  const expenseIncomeTabsModel: CategoryExpenseIncomeTabsModel = useMemo(
    () => ({
      activeType,
      onActiveTypeChange: setActiveType,
      search,
      onSearchChange: setSearch,
      totalCount,
      totalBudget,
      totalAmount,
      visibleCategories,
      totalsByCategoryId,
      totalsLoading,
      emptyMessage,
      onEdit: handleEdit,
      onDelete: handleDelete,
    }),
    [
      activeType,
      setActiveType,
      setSearch,
      totalCount,
      totalBudget,
      totalAmount,
      visibleCategories,
      totalsByCategoryId,
      totalsLoading,
      emptyMessage,
      search,
      handleEdit,
      handleDelete,
    ],
  );

  return {
    expenseIncomeTabsModel,
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
    /** True while categories or monthly totals are loading (for callers that need combined pending state). */
    isBusy: isLoading || totalsLoading,
    loadError: error,
    isDeleteDialogOpen: pendingDeleteId !== null,
    confirmDelete,
    cancelDelete,
    isDeletingCategory: deleteCategory.isPending,
  };
}
