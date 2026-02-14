import { type FC } from "react";
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
import { useCategoryForm } from "./useCategoryForm";
import { Category } from "@/types";
import { Plus } from "lucide-react";

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
  const { register, handleFormSubmit, errors, watch, setValue, handleOpenChange } =
    useCategoryForm(isOpen, editingCategory, onSuccess, onOpenChange);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
        <form onSubmit={handleFormSubmit} className="flex flex-col h-full">
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
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} className="flex-1">
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
