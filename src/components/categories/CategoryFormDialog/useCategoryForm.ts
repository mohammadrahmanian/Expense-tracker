import { useEffect } from "react";
import { useCreateCategory } from "@/hooks/mutations/useCreateCategory";
import { useUpdateCategory } from "@/hooks/mutations/useUpdateCategory";
import { Category } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { categorySchema, type CategoryFormData } from "./CategoryFormDialog.types";

export const useCategoryForm = (
  isOpen: boolean,
  editingCategory: Category | undefined,
  onSuccess: () => void,
  onOpenChange: (open: boolean) => void,
) => {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } =
    useForm<CategoryFormData>({
      resolver: zodResolver(categorySchema),
      defaultValues: { name: "", type: "EXPENSE", color: "#FF6B6B" },
    });

  useEffect(() => {
    if (!isOpen) return;
    if (editingCategory) {
      reset({ name: editingCategory.name, type: editingCategory.type, color: editingCategory.color });
    } else {
      reset();
    }
  }, [isOpen, editingCategory, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, updates: data });
      } else {
        await createCategory.mutateAsync(data);
      }
      reset();
      onSuccess();
    } catch {
      // Error toast handled by mutation hook
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) reset();
    onOpenChange(open);
  };

  return { register, handleFormSubmit: handleSubmit(onSubmit), errors, watch, setValue, handleOpenChange };
};
