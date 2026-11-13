import { type FC } from "react";
import { Ellipsis } from "lucide-react";
import { Category } from "@/types";
import { getCategoryIcon } from "@/components/categories/CategoryFormDialog/CategoryFormDialog.constants";
import { QuickCategoryCard } from "../QuickCategoryCard";
import { QuickCategoryOtherSelect } from "../QuickCategoryOtherSelect";

type QuickCategoryGridProps = {
  quickPickCategories: Category[];
  selectedCategory: string;
  otherExpanded: boolean;
  otherSelectCategories: Category[];
  selectedCategoryId?: string;
  onCardClick: (name: string) => void;
  onOtherClick: () => void;
  onOtherSelect: (categoryId: string) => void;
};

export const QuickCategoryGrid: FC<QuickCategoryGridProps> = ({
  quickPickCategories,
  selectedCategory,
  otherExpanded,
  otherSelectCategories,
  selectedCategoryId,
  onCardClick,
  onOtherClick,
  onOtherSelect,
}) => {
  return (
    <>
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
        {quickPickCategories.map((cat) => (
          <QuickCategoryCard
            key={cat.id}
            icon={getCategoryIcon(cat.icon)}
            label={cat.name}
            isSelected={
              selectedCategory.toLowerCase() === cat.name.toLowerCase()
            }
            onClick={() => onCardClick(cat.name)}
          />
        ))}
        <QuickCategoryCard
          key="other"
          icon={Ellipsis}
          label="Other"
          isSelected={otherExpanded}
          onClick={onOtherClick}
        />
      </div>

      <QuickCategoryOtherSelect
        open={otherExpanded}
        categories={otherSelectCategories}
        selectedCategoryId={selectedCategoryId}
        onSelect={onOtherSelect}
      />
    </>
  );
};
