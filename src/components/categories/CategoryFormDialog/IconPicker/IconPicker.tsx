import { type FC } from "react";
import { cn } from "@/lib/utils";
import { Ellipsis, Search } from "lucide-react";
import { ICON_OPTIONS } from "../CategoryFormDialog.constants";

type IconPickerProps = {
  value: string;
  onChange: (name: string) => void;
  error?: string;
};

export const IconPicker: FC<IconPickerProps> = ({ value, onChange, error }) => (
  <div className="flex flex-col gap-2.5">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-foreground">Icon</span>
      <span
        className="inline-flex cursor-not-allowed items-center gap-1.5 text-[11px] text-muted-foreground opacity-60"
        title="Search icons (coming soon)"
        aria-label="Search icons (coming soon)"
        aria-disabled
      >
        <Search className="h-3 w-3" aria-hidden />
        Search icons
      </span>
    </div>
    <div className="grid grid-cols-7 gap-2">
      {ICON_OPTIONS.map(({ name, Icon }) => {
        const selected = value === name;
        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            className={cn(
              "flex h-12 items-center justify-center rounded-md border border-border bg-surface transition-shadow",
              selected && "border-primary ring-2 ring-primary-bg ring-offset-0 dark:ring-primary/40",
            )}
            aria-label={name}
            aria-pressed={selected}
          >
            <Icon className={cn("h-5 w-5", selected ? "text-primary" : "text-neutral-600 dark:text-neutral-400")} />
          </button>
        );
      })}
        <button
          type="button"
          disabled
          aria-disabled
          title="More options (coming soon)"
          aria-label="More options, coming soon"
          className="flex h-12 cursor-not-allowed items-center justify-center rounded-md border border-border bg-neutral-100 opacity-70 dark:bg-neutral-800"
        >
          <Ellipsis className="h-5 w-5 text-muted-foreground" aria-hidden />
        </button>
    </div>
    {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
  </div>
);
