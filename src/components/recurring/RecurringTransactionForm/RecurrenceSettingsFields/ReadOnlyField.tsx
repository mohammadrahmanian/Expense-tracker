import { type FC } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ReadOnlyFieldProps = {
  label: string;
  value: string;
  hint: string;
  capitalize?: boolean;
};

export const ReadOnlyField: FC<ReadOnlyFieldProps> = ({
  label,
  value,
  hint,
  capitalize,
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
      <p
        className={cn(
          "text-sm text-gray-700 dark:text-gray-300",
          capitalize && "capitalize",
        )}
      >
        {value}
      </p>
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
  </div>
);
