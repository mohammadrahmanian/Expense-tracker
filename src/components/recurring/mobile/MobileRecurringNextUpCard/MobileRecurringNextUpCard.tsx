import { Card } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";
import { type FC } from "react";

export const MobileRecurringNextUpCard: FC = () => (
  <Card className="p-3.5 bg-info-100 border-info-300 dark:bg-info-700/20 dark:border-info-700">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-info-500 text-white shrink-0">
        <CalendarClock className="h-5 w-5" />
      </div>
      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <span className="text-[10px] font-bold tracking-wider text-info-700 dark:text-info-300">
          NEXT UP
        </span>
        <span className="text-[15px] font-bold text-foreground truncate">
          Coming soon
        </span>
      </div>
    </div>
  </Card>
);
