import type { LucideIcon } from "lucide-react";
import { type FC } from "react";

type CategoryIconWrapProps = {
  color: string;
  Icon: LucideIcon;
};

export const CategoryIconWrap: FC<CategoryIconWrapProps> = ({
  color,
  Icon,
}) => (
  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md mt-3">
    <div
      className="pointer-events-none absolute inset-0 rounded-md bg-neutral-50 dark:bg-neutral-800"
      aria-hidden
    />
    <div
      className="pointer-events-none absolute inset-0 rounded-md opacity-[0.16] dark:opacity-[0.3]"
      style={{ backgroundColor: color }}
      aria-hidden
    />
    <Icon
      className="relative z-10 h-[22px] w-[22px]"
      style={{ color }}
      strokeWidth={2}
      aria-hidden
    />
  </div>
);
