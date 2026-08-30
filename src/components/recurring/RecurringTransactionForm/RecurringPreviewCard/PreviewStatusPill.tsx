import { type FC } from "react";

type PreviewStatusPillProps = {
  isValid: boolean;
};

export const PreviewStatusPill: FC<PreviewStatusPillProps> = ({ isValid }) =>
  isValid ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-success-300 bg-success-50 px-2.5 py-1 text-[11px] font-semibold text-success-700 dark:border-success-500 dark:bg-success-700/25 dark:text-success-300">
      <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
      Ready
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-600 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
      Incomplete
    </span>
  );
