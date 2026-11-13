import { type FC } from "react";
import { Label } from "@/components/ui/label";
import { Segment, SegmentItem, SegmentList } from "@/components/ui/segment";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type TypeSegmentFieldProps = {
  value: "INCOME" | "EXPENSE";
  onChange: (value: "INCOME" | "EXPENSE") => void;
};

export const TypeSegmentField: FC<TypeSegmentFieldProps> = ({
  value,
  onChange,
}) => (
  <div className="space-y-2">
    <Label>Transaction type</Label>
    <Segment value={value} onValueChange={(v) => onChange(v as "INCOME" | "EXPENSE")}>
      <SegmentList className="h-11">
        <SegmentItem value="EXPENSE" variant="gold" className="h-full gap-1.5">
          <ArrowDownRight className="h-4 w-4" aria-hidden />
          Expense
        </SegmentItem>
        <SegmentItem value="INCOME" variant="gold" className="h-full gap-1.5">
          <ArrowUpRight className="h-4 w-4" aria-hidden />
          Income
        </SegmentItem>
      </SegmentList>
    </Segment>
  </div>
);
