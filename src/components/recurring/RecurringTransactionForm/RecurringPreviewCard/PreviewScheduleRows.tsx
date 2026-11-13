import { type FC } from "react";
import { Infinity as InfinityIcon, Repeat } from "lucide-react";

type PreviewScheduleRowsProps = {
  schedulePhrase: string;
  endDatePhrase: string;
};

export const PreviewScheduleRows: FC<PreviewScheduleRowsProps> = ({
  schedulePhrase,
  endDatePhrase,
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2 text-sm text-info-700 dark:text-info-300">
      <Repeat className="h-4 w-4 shrink-0" />
      <span>{schedulePhrase}</span>
    </div>
    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
      <InfinityIcon className="h-4 w-4 shrink-0" />
      <span>{endDatePhrase}</span>
    </div>
  </div>
);
