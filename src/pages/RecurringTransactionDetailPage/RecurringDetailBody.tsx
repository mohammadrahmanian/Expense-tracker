import { type FC } from "react";
import { RecurringDetailHero } from "./RecurringDetailHero";
import { UpcomingOccurrencesCard } from "@/components/recurring/detail/UpcomingOccurrencesCard";
import { QuickActionsCard } from "@/components/recurring/detail/QuickActionsCard";
import { ScheduleDetailsCard } from "@/components/recurring/detail/ScheduleDetailsCard";
import type { Category, RecurringStatus, RecurringTransaction } from "@/types";

type RecurringDetailBodyProps = {
  transaction: RecurringTransaction;
  category: Category | undefined;
  status: RecurringStatus;
  formatAmount: (n: number) => string;
  onPause: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isToggling: boolean;
  isDeleting: boolean;
};

export const RecurringDetailBody: FC<RecurringDetailBodyProps> = ({
  transaction,
  category,
  status,
  formatAmount,
  onPause,
  onEdit,
  onDelete,
  isToggling,
  isDeleting,
}) => (
  <div className="flex flex-col gap-5">
    <RecurringDetailHero
      transaction={transaction}
      category={category}
      status={status}
      formatAmount={formatAmount}
    />
    <div className="lg:flex lg:gap-5">
      <div className="lg:flex-1">
        <UpcomingOccurrencesCard
          transaction={transaction}
          status={status}
          formatAmount={formatAmount}
        />
      </div>
      <div className="mt-5 flex flex-col gap-4 lg:mt-0 lg:w-[340px] lg:shrink-0">
        <QuickActionsCard
          status={status}
          onPause={onPause}
          onEdit={onEdit}
          onDelete={onDelete}
          isToggling={isToggling}
          isDeleting={isDeleting}
        />
        <ScheduleDetailsCard transaction={transaction} formatAmount={formatAmount} />
      </div>
    </div>
  </div>
);
