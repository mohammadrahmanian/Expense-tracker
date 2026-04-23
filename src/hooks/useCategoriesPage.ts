import { useDeleteCategory } from "@/hooks/mutations/useDeleteCategory";
import { useCategories } from "@/hooks/queries/useCategories";
import { useMonthlyCategoryTotals } from "@/hooks/queries/useMonthlyCategoryTotals";
import type { Category } from "@/types";
import { useMemo, useState } from "react";

export function useCategoriesPage() {
  const [activeType, setActiveType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();

  const { data: categories = [], isLoading, error } = useCategories();
  const {
    data: totalsByCategoryId = {},
    isLoading: totalsLoading,
    error: totalsError,
  } = useMonthlyCategoryTotals();
  const deleteCategory = useDeleteCategory();

  const searchLower = search.trim().toLowerCase();
  const { categoriesOfType, visibleCategories, totalCount, totalBudget, totalAmount } =
    useMemo(() => {
      const ofType = categories.filter((c) => c.type === activeType);
      const visible = ofType.filter((c) =>
        searchLower ? c.name.toLowerCase().includes(searchLower) : true,
      );
      const budget = ofType.reduce(
        (sum, c) => sum + (c.monthlyBudget ?? 0),
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

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this category? This action cannot be undone.",
      )
    ) {
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

  const openAdd = () => {
    setEditingCategory(undefined);
    setIsFormOpen(true);
  };

  return {
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
    isBusy: isLoading || totalsLoading,
    loadError: error ?? totalsError,
  };
}
