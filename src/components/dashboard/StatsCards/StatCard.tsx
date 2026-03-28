import { type FC, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  changeText?: string;
  changeType?: "positive" | "negative" | "neutral";
};

export const StatCard: FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  changeText,
  changeType = "neutral",
}) => (
  <Card className="p-5 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-semibold tracking-wider text-neutral-600 dark:text-neutral-400 uppercase">
        {title}
      </span>
      {icon}
    </div>
    <span className="text-[28px] font-bold leading-tight text-neutral-900 dark:text-white">
      {value}
    </span>
    <div className="flex items-center gap-1.5">
      {changeText && (
        <span
          className={cn(
            "text-caption font-semibold",
            changeType === "positive" && "text-success-500",
            changeType === "negative" && "text-danger-500",
            changeType === "neutral" && "text-neutral-500",
          )}
        >
          {changeText}
        </span>
      )}
      <span className="text-caption text-neutral-500">{subtitle}</span>
    </div>
  </Card>
);
