import { type FC } from "react";
import { Ellipsis } from "lucide-react";
import { Category } from "@/types";
import { ICON_BY_NAME } from "@/components/categories/CategoryFormDialog/CategoryFormDialog.constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { QuickCategoryCard } from "../QuickCategoryCard";

type QuickCategoryGridProps = {
  quickPickCategories: Category[];
  selectedCategory: string;
  otherExpanded: boolean;
  otherSelectCategories: Category[];
  selectedCategoryId?: string;
  onCardClick: (name: string) => void;
  onOtherSelect: (categoryId: string) => void;
};

export const QuickCategoryGrid: FC<QuickCategoryGridProps> = ({
  quickPickCategories,
  selectedCategory,
  otherExpanded,
  otherSelectCategories,
  selectedCategoryId,
  onCardClick,
  onOtherSelect,
}) => {
  return (
    <>
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
        {quickPickCategories.map((cat, index) => (
          <QuickCategoryCard
            key={cat.id}
            icon={ICON_BY_NAME[cat.icon ?? "utensils"] ?? ICON_BY_NAME.utensils}
            label={cat.name}
            color={cat.color}
            isSelected={
              selectedCategory.toLowerCase() === cat.name.toLowerCase()
            }
            onClick={() => onCardClick(cat.name)}
            className={
              index === 4 && quickPickCategories.length === 5
                ? "hidden sm:flex"
                : undefined
            }
          />
        ))}
        <QuickCategoryCard
          key="other"
          icon={Ellipsis}
          label="Other"
          isSelected={otherExpanded}
          onClick={() => onCardClick("Other")}
        />
      </div>

      <Collapsible open={otherExpanded}>
        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <div className="px-px pt-1">
            <Select
              value={selectedCategoryId ?? ""}
              onValueChange={onOtherSelect}
            >
              <SelectTrigger variant="underlined">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {otherSelectCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};
