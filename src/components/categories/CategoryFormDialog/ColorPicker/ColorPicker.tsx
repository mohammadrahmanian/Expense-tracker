import { type FC, useRef } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { COLOR_OPTIONS } from "../CategoryFormDialog.constants";

/** Values accepted by native `<input type="color">` (exactly # + 6 hex digits). */
const FULL_HEX_COLOR_RE = /^#[0-9A-Fa-f]{6}$/;

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
  error?: string;
};

export const ColorPicker: FC<ColorPickerProps> = ({ value, onChange, error }) => {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const pickerValue = FULL_HEX_COLOR_RE.test(value) ? value : COLOR_OPTIONS[0];

  return (
    <div className="flex flex-col gap-2.5">
      <Label className="text-xs font-semibold text-foreground">Color</Label>
      <div className="flex flex-wrap items-center gap-2.5">
        {COLOR_OPTIONS.map((color) => {
          const selected = value.toLowerCase() === color.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              aria-label={`Color ${color}`}
              className={cn(
                "h-7 w-7 shrink-0 rounded-full border border-neutral-200 transition-shadow dark:border-neutral-700",
                selected && "ring-2 ring-neutral-900/30 ring-offset-2 ring-offset-background dark:ring-neutral-100/40",
              )}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
            />
          );
        })}
        <input
          ref={colorInputRef}
          type="color"
          aria-label="Pick custom color"
          value={pickerValue}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
          tabIndex={-1}
        />
        <button
          type="button"
          aria-label="Custom color"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-neutral-100 dark:bg-neutral-800"
          onClick={() => colorInputRef.current?.click()}
        >
          <Plus className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
      {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
};
