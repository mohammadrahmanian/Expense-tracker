import { type FC } from "react";
import {
  ResponsiveDialog as Dialog,
  ResponsiveDialogContent as DialogContent,
  ResponsiveDialogTitle as DialogTitle,
} from "@/components/ui/responsive-dialog";
import { Category } from "@/types";
import { FormPanel } from "./FormPanel";
import { LivePreviewPanel } from "./LivePreviewPanel";
import { useCategoryForm } from "./useCategoryForm";

type CategoryFormDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory?: Category;
  onSuccess: () => void;
};

export const CategoryFormDialog: FC<CategoryFormDialogProps> = ({
  isOpen,
  onOpenChange,
  editingCategory,
  onSuccess,
}) => {
  const {
    register,
    handleFormSubmit,
    errors,
    watch,
    setValue,
    handleOpenChange,
    isSubmitting,
    parentOptions,
    categories,
  } = useCategoryForm(isOpen, editingCategory, onSuccess, onOpenChange);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:bottom-auto sm:max-h-[90vh] sm:max-w-[900px]">
        <DialogTitle className="sr-only">
          {editingCategory ? "Edit category" : "Create new category"}
        </DialogTitle>
        <div className="-mx-6 flex min-h-0 flex-1 flex-col sm:-mt-6 sm:max-h-[calc(90vh-3rem)] sm:flex-row">
          <LivePreviewPanel
            name={watch("name")}
            iconName={watch("icon")}
            color={watch("color")}
            parentId={watch("parentId")}
            budgetAmount={watch("budgetAmount")}
            categories={categories}
          />
          <FormPanel
            editingCategory={editingCategory}
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
            parentOptions={parentOptions}
            onCancel={() => handleOpenChange(false)}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
