import { type FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog as Dialog,
  ResponsiveDialogContent as DialogContent,
  ResponsiveDialogFooter as DialogFooter,
  ResponsiveDialogHeader as DialogHeader,
  ResponsiveDialogTitle as DialogTitle,
  ResponsiveDialogTrigger as DialogTrigger,
} from "@/components/ui/responsive-dialog";
import { FormInput } from "@/components/shared/FormInput";
import { TypeSelect } from "@/components/shared/TypeSelect";
import { ColorPicker } from "./ColorPicker";
import { categorySchema, type CategoryFormData } from "./CategoryFormDialog.types";
import { useCreateCategory } from "@/hooks/mutations/useCreateCategory";
import { useUpdateCategory } from "@/hooks/mutations/useUpdateCategory";
import { Category } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";

type CategoryFormDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory?: Category;
  onSuccess: () => void;
  onNewClick: () => void;
};

export const CategoryFormDialog: FC<CategoryFormDialogProps> = ({
  isOpen,
  onOpenChange,
  editingCategory,
  onSuccess,
  onNewClick,
}) => {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } =
    useForm<CategoryFormData>({
      resolver: zodResolver(categorySchema),
      defaultValues: { name: "", type: "EXPENSE", color: "#FF6B6B" },
    });

  useEffect(() => {
    if (editingCategory) {
      reset({ name: editingCategory.name, type: editingCategory.type, color: editingCategory.color });
    }
  }, [editingCategory, reset]);

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

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={onNewClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? "Edit Category" : "Create New Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <div className="space-y-4">
            <FormInput
              id="name"
              label="Category Name"
              placeholder="e.g., Food & Dining"
              error={errors.name?.message}
              {...register("name")}
            />
            <TypeSelect
              value={watch("type")}
              onChange={(v) => setValue("type", v)}
              error={errors.type?.message}
            />
            <ColorPicker
              value={watch("color")}
              onChange={(v) => setValue("color", v)}
              error={errors.color?.message}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingCategory ? "Update" : "Create"} Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
