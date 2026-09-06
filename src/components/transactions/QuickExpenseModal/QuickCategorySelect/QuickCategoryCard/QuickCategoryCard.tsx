import { type FC } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type QuickCategoryCardProps = {
  icon: LucideIcon;
  label: string;
  color?: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
};

export const QuickCategoryCard: FC<QuickCategoryCardProps> = ({
  icon: Icon,
  label,
  color,
  isSelected,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 h-14 sm:h-20 rounded-md transition-colors cursor-pointer",
        isSelected
          ? "bg-gold-50 border-2 border-gold-500 text-gold-500 dark:bg-gold-500/10 dark:border-gold-500 dark:text-gold-400"
          : "bg-neutral-100 border-2 border-transparent text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700",
        className,
      )}
    >
      <Icon
        className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px]"
        style={color ? { color } : undefined}
      />
      <span
        className="px-1 max-w-full truncate text-[10px] sm:text-[11px] font-semibold"
        title={label}
      >
        {label}
      </span>
    </button>
  );
};
