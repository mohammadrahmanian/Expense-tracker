import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type CategoriesPageHeaderProps = {
  onAdd: () => void;
};

export const CategoriesPageHeader: FC<CategoriesPageHeaderProps> = ({
  onAdd,
}) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex flex-col gap-1">
      <h1 className="text-h1 text-foreground">Categories</h1>
      <p className="text-body text-muted-foreground">
        Manage your expense and income categories
      </p>
    </div>
    <Button type="button" onClick={onAdd} className="w-full shrink-0 sm:w-auto">
      <Plus className="mr-2 h-4 w-4" aria-hidden />
      Add Category
    </Button>
  </div>
);
