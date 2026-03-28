import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

type MobileSummaryCardsProps = {
  totalIncome: number;
  totalExpenses: number;
  net: number;
  isLoading: boolean;
  formatAmount: (amount: number) => string;
};

export const MobileSummaryCards: FC<MobileSummaryCardsProps> = ({
  totalIncome,
  totalExpenses,
  net,
  isLoading,
  formatAmount,
}) => (
  <div className="flex flex-col gap-2 pb-2">
    <div className="flex gap-2">
      <SplitCard
        icon={<ArrowUpRight className="h-3.5 w-3.5 text-success-500" />}
        iconBg="bg-success-50"
        label="Income"
        value={`+${formatAmount(totalIncome)}`}
        valueColor="text-success-500"
        isLoading={isLoading}
      />
      <SplitCard
        icon={<ArrowDownLeft className="h-3.5 w-3.5 text-danger-500" />}
        iconBg="bg-danger-50"
        label="Expenses"
        value={`-${formatAmount(totalExpenses)}`}
        valueColor="text-danger-500"
        isLoading={isLoading}
      />
    </div>
    <div className="flex items-center gap-2 rounded-md border border-gold-500 bg-gold-50 px-4 py-2.5 dark:bg-gold-900/40">
      <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary">
        <Wallet className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-[11px] font-medium text-primary dark:text-gold-200">
          Net Balance
        </span>
        {isLoading ? (
          <Skeleton className="h-5 w-24" />
        ) : (
          <span className="text-base font-bold text-primary dark:text-gold-200">
            {net >= 0 ? "+" : "-"}{formatAmount(Math.abs(net))}
          </span>
        )}
      </div>
    </div>
  </div>
);

type SplitCardProps = {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  valueColor: string;
  isLoading: boolean;
};

const SplitCard: FC<SplitCardProps> = ({
  icon,
  iconBg,
  label,
  value,
  valueColor,
  isLoading,
}) => (
  <div className="flex flex-1 flex-col gap-2.5 rounded-md border border-border bg-surface p-3.5 dark:bg-neutral-900">
    <div className="flex items-center gap-2">
      <div className={`flex h-7 w-7 items-center justify-center rounded-sm ${iconBg}`}>
        {icon}
      </div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
    {isLoading ? (
      <Skeleton className="h-6 w-20" />
    ) : (
      <span className={`text-xl font-bold ${valueColor}`}>{value}</span>
    )}
  </div>
);
