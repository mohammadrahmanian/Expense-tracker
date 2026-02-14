import { type FC } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category } from "@/types";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";

type CategoryItemProps = {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
};

export const CategoryItem: FC<CategoryItemProps> = ({
  category,
  onEdit,
  onDelete,
}) => (
  <div className="flex items-center justify-between p-3 border rounded-lg">
    <div className="flex items-center space-x-3">
      <div
        className="w-6 h-6 rounded-full"
        style={{ backgroundColor: category.color }}
      />
      <span className="font-medium">{category.name}</span>
    </div>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(category)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(category.id)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);
