import { type FC } from "react";
import {
  ResponsiveDialogDescription as DialogDescription,
  ResponsiveDialogTitle as DialogTitle,
} from "@/components/ui/responsive-dialog";
import { Segment, SegmentItem, SegmentList } from "@/components/ui/segment";
import type { TransactionKind } from "./useQuickExpenseModal";

type QuickExpenseModalHeaderProps = {
  title: string;
  description: string;
  tabValue: TransactionKind;
  onTabChange: (value: string) => void;
};

export const QuickExpenseModalHeader: FC<QuickExpenseModalHeaderProps> = ({
  title,
  description,
  tabValue,
  onTabChange,
}) => (
  <div className="-mx-6 sm:-mt-6 flex flex-col gap-4 border-b border-neutral-200 px-6 py-5 dark:border-neutral-700">
    <div className="space-y-0.5">
      <DialogTitle className="text-[18px] font-semibold">{title}</DialogTitle>
      <DialogDescription className="text-[13px] text-neutral-500">
        {description}
      </DialogDescription>
    </div>
    <Segment value={tabValue} onValueChange={onTabChange}>
      <SegmentList>
        <SegmentItem value="expense" variant="default">
          Expense
        </SegmentItem>
        <SegmentItem value="income" variant="default">
          Income
        </SegmentItem>
      </SegmentList>
    </Segment>
  </div>
);
