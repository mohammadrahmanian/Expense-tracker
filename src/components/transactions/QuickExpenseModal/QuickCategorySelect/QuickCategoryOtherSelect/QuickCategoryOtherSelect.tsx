import { type FC } from "react";
import { Category } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

type QuickCategoryOtherSelectProps = {
  open: boolean;
  categories: Category[];
  selectedCategoryId?: string;
  onSelect: (categoryId: string) => void;
};

export const QuickCategoryOtherSelect: FC<QuickCategoryOtherSelectProps> = ({
  open,
  categories,
  selectedCategoryId,
  onSelect,
}) => (
  <Collapsible open={open}>
    <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
      <div className="px-px pt-1">
        <Select value={selectedCategoryId ?? ""} onValueChange={onSelect}>
          <SelectTrigger variant="underlined">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </CollapsibleContent>
  </Collapsible>
);
