import { type FC } from "react";
import { Card } from "@/components/ui/card";

const ComingSoonCard: FC<{ overline: string }> = ({ overline }) => (
  <Card className="p-5 flex flex-col gap-1.5">
    <span className="text-overline uppercase text-muted-foreground tracking-wider">
      {overline}
    </span>
    <span className="text-base font-semibold text-foreground">
      Coming soon
    </span>
  </Card>
);

export const RecurringSummaryCards: FC = () => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
    <div className="col-span-2 md:col-span-3">
      <ComingSoonCard overline="SUMMARY" />
    </div>
    <ComingSoonCard overline="NEXT UP" />
  </div>
);
