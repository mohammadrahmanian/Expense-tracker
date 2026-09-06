import { type FC } from "react";
import type { LucideIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ReadOnlyFieldProps = {
  label: string;
  value: string;
  hint: string;
  capitalize?: boolean;
  icon?: LucideIcon;
};

export const ReadOnlyField: FC<ReadOnlyFieldProps> = ({
  label,
  value,
  hint,
  capitalize,
  icon: Icon,
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="flex h-10 items-center gap-2 rounded-sm border border-border bg-neutral-100 px-3 dark:border-neutral-700 dark:bg-neutral-800">
      {Icon && (
        <Icon className="h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400" />
      )}
      <p
        className={cn(
          "text-sm text-foreground",
          capitalize && "capitalize",
        )}
      >
        {value}
      </p>
    </div>
    <p className="text-xs text-muted-foreground">{hint}</p>
  </div>
);
