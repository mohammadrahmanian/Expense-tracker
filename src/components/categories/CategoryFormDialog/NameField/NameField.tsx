import { type FC } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Tag } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

type NameFieldProps = {
  register: UseFormRegisterReturn;
  error?: string;
};

export const NameField: FC<NameFieldProps> = ({ register, error }) => (
  <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-1">
    <Label htmlFor="category-name" className="text-xs font-semibold text-foreground">
      Name
    </Label>
    <div className="relative">
      <Tag
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        id="category-name"
        placeholder="e.g. Groceries"
        className={cn("h-11 rounded-md border-border bg-background pl-10", error && "border-red-500")}
        {...register}
      />
    </div>
    {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
  </div>
);
