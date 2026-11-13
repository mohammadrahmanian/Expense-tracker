import { Card } from "@/components/ui/card";
import { type FC } from "react";

export const MobileRecurringSummaryCards: FC = () => (
  <Card className="p-3.5 flex flex-col gap-1">
    <span className="text-overline uppercase text-muted-foreground tracking-wider">
      SUMMARY
    </span>
    <span className="text-base font-semibold text-foreground">Coming soon</span>
  </Card>
);
