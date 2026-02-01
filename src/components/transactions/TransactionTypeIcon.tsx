import { cn } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface TransactionTypeIconProps {
  type: "INCOME" | "EXPENSE";
  size?: "sm" | "md" | "lg";
}

export function TransactionTypeIcon({
  type,
  size = "md",
}: TransactionTypeIconProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center",
        sizeClasses[size],
        type === "INCOME"
          ? "bg-green-100 dark:bg-green-900"
          : "bg-red-100 dark:bg-red-900"
      )}
    >
      {type === "INCOME" ? (
        <ArrowUpRight
          className={cn(
            iconSizes[size],
            "text-green-600 dark:text-green-400"
          )}
        />
      ) : (
        <ArrowDownLeft
          className={cn(iconSizes[size], "text-red-600 dark:text-red-400")}
        />
      )}
    </div>
  );
}
