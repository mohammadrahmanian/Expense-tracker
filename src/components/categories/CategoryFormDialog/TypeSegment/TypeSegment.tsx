import { type FC } from "react";
import { Label } from "@/components/ui/label";
import { Segment, SegmentItem, SegmentList } from "@/components/ui/segment";
import { ArrowDown, ArrowUp } from "lucide-react";

type TypeSegmentProps = {
  value: "INCOME" | "EXPENSE";
  onChange: (v: "INCOME" | "EXPENSE") => void;
  error?: string;
};

export const TypeSegment: FC<TypeSegmentProps> = ({ value, onChange, error }) => (
  <div className="flex w-full min-w-0 flex-col gap-2 sm:h-full sm:w-[13.5rem] sm:min-w-[13.5rem] sm:shrink-0">
    <Label className="text-xs font-semibold text-foreground">Type</Label>
    <Segment
      value={value}
      onValueChange={(v) => onChange(v as "INCOME" | "EXPENSE")}
      className="h-full w-full"
    >
      <SegmentList className="h-full min-h-[2.75rem] w-full">
        <SegmentItem value="EXPENSE" variant="error" className="gap-1 text-xs">
          <ArrowDown className="h-3 w-3" aria-hidden />
          Expense
        </SegmentItem>
        <SegmentItem value="INCOME" variant="success" className="gap-1 text-xs">
          <ArrowUp className="h-3 w-3" aria-hidden />
          Income
        </SegmentItem>
      </SegmentList>
    </Segment>
    {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
  </div>
);
