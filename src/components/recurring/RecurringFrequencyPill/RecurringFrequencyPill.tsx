import { type FC } from "react";
import { Repeat } from "lucide-react";
import { formatFrequencyLabel } from "@/lib/recurring-transactions.utils";
import type { RecurringTransaction } from "@/types";

type RecurringFrequencyPillProps = {
  rt: RecurringTransaction;
};

export const RecurringFrequencyPill: FC<RecurringFrequencyPillProps> = ({
  rt,
}) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-info-100 px-2.5 py-1 text-[11px] font-semibold text-info-700 dark:bg-info-700/20 dark:text-info-300 ring-1 ring-inset ring-info-300 dark:ring-info-700">
    <Repeat className="h-3 w-3" />
    {formatFrequencyLabel(rt)}
  </span>
);
