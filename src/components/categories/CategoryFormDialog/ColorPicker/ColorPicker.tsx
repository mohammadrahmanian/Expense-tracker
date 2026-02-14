import { type FC } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PREDEFINED_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#00B894",
  "#00CEC9",
  "#6C5CE7",
  "#A29BFE",
  "#FD79A8",
  "#FDCB6E",
  "#E17055",
  "#81ECEC",
  "#74B9FF",
  "#55A3FF",
  "#FF7675",
  "#E84393",
];

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
  error?: string;
};

export const ColorPicker: FC<ColorPickerProps> = ({
  value,
  onChange,
  error,
}) => (
  <div className="space-y-2">
    <Label>Color</Label>
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <div
          className="w-8 h-8 rounded-full border-2 border-gray-300"
          style={{ backgroundColor: value }}
        />
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-8 p-0 border-0"
        />
        <span className="text-sm text-gray-500">{value}</span>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {PREDEFINED_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className="w-8 h-8 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
    </div>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
