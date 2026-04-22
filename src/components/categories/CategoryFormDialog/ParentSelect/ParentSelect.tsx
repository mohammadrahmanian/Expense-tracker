import { type FC } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types";
import { Folder } from "lucide-react";

const TOP_VALUE = "__top__";

type ParentSelectProps = {
  value: string | null;
  onChange: (id: string | null) => void;
  options: Category[];
  error?: string;
};

export const ParentSelect: FC<ParentSelectProps> = ({ value, onChange, options, error }) => (
  <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-1">
    <div className="flex items-center justify-between">
      <Label className="text-xs font-semibold text-foreground">Parent</Label>
      <span className="text-[11px] text-muted-foreground">Optional</span>
    </div>
    <Select
      value={value ?? TOP_VALUE}
      onValueChange={(v) => onChange(v === TOP_VALUE ? null : v)}
    >
      <SelectTrigger
        className={`h-11 rounded-md border-border bg-background ${error ? "border-red-500" : ""}`}
      >
        {/* Use a div wrapper so SelectTrigger's [&>span]:line-clamp-1 does not apply to this flex row (breaks icon/text alignment). */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Folder className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="min-w-0 flex-1 truncate text-left">
            <SelectValue placeholder="Top level category" />
          </span>
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={TOP_VALUE}>Top level category</SelectItem>
        {options.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
  </div>
);
