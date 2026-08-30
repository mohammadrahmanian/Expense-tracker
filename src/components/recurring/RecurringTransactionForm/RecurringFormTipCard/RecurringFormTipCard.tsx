import { type FC } from "react";
import { Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";

export const RecurringFormTipCard: FC = () => (
  <Card className="flex items-start gap-2.5 border-info-300 bg-info-100 p-3.5 dark:border-info-700 dark:bg-info-700/20">
    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-info-700 dark:text-info-300" />
    <div className="flex flex-col gap-1">
      <span className="text-sm font-semibold text-info-700 dark:text-info-300">
        Auto-run on schedule
      </span>
      <p className="text-xs leading-relaxed text-info-700 dark:text-info-300">
        Each occurrence is added to your transactions list on its date.
      </p>
    </div>
  </Card>
);
