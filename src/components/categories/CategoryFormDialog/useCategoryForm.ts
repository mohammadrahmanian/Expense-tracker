import { useEffect, useMemo } from "react";
import { useCreateCategory } from "@/hooks/mutations/useCreateCategory";
import { useUpdateCategory } from "@/hooks/mutations/useUpdateCategory";
import { useCategories } from "@/hooks/queries/useCategories";
import { Category } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DEFAULT_CATEGORY_FORM } from "./CategoryFormDialog.constants";
import { categorySchema, type CategoryFormData } from "./CategoryFormDialog.types";

export const useCategoryForm = (
  isOpen: boolean,
  editingCategory: Category | undefined,
  onSuccess: () => void,
  onOpenChange: (open: boolean) => void,
) => {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const { data: categories = [] } = useCategories();

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } =
    useForm<CategoryFormData>({
      resolver: zodResolver(categorySchema),
      defaultValues: { ...DEFAULT_CATEGORY_FORM },
    });

  const watchedType = watch("type");
  const watchedParentId = watch("parentId");
  const editingId = editingCategory?.id;

  useEffect(() => {
    if (!watchedParentId) return;
    const parent = categories.find((c) => c.id === watchedParentId);
    if (parent && parent.type !== watchedType) {
      setValue("parentId", null, { shouldValidate: true });
    }
  }, [watchedType, watchedParentId, categories, setValue]);

  const parentOptions = useMemo(() => {
    const excludedForCycle = new Set<string>();
    if (editingId) {
      excludedForCycle.add(editingId);
      const childrenByParent = new Map<string, string[]>();
      for (const c of categories) {
        const p = c.parentId ?? null;
        if (p == null) continue;
        const list = childrenByParent.get(p);
        if (list) list.push(c.id);
        else childrenByParent.set(p, [c.id]);
      }
      const stack = [...(childrenByParent.get(editingId) ?? [])];
      while (stack.length > 0) {
        const id = stack.pop()!;
        if (excludedForCycle.has(id)) continue;
        excludedForCycle.add(id);
        const kids = childrenByParent.get(id);
        if (kids) for (const kid of kids) stack.push(kid);
      }
    }
    return categories.filter(
      (c) => c.type === watchedType && !excludedForCycle.has(c.id),
    );
  }, [categories, watchedType, editingId]);

  useEffect(() => {
    if (!isOpen) return;
    if (editingCategory) {
      reset({
        name: editingCategory.name,
        type: editingCategory.type,
        color: editingCategory.color,
        icon: editingCategory.icon ?? DEFAULT_CATEGORY_FORM.icon,
        parentId: editingCategory.parentId ?? null,
        budgetAmount:
          editingCategory.budgetAmount === undefined
            ? null
            : editingCategory.budgetAmount,
      });
    } else {
      reset({ ...DEFAULT_CATEGORY_FORM });
    }
  }, [isOpen, editingCategory, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    const payload = {
      ...data,
      budgetPeriod: data.budgetAmount == null ? null : ("MONTHLY" as const),
    };
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, updates: payload });
      } else {
        await createCategory.mutateAsync(payload);
      }
      reset({ ...DEFAULT_CATEGORY_FORM });
      onSuccess();
    } catch {
      // Error toast handled by mutation hook
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) reset({ ...DEFAULT_CATEGORY_FORM });
    onOpenChange(open);
  };

  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  return {
    register,
    handleFormSubmit: handleSubmit(onSubmit),
    errors,
    watch,
    setValue,
    handleOpenChange,
    isSubmitting,
    parentOptions,
    categories,
  };
};
