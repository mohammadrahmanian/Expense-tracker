import { type FC } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type MoreOptionsSectionProps = {
  notes: string;
  onNotesChange: (value: string) => void;
};

export const MoreOptionsSection: FC<MoreOptionsSectionProps> = ({
  notes,
  onNotesChange,
}) => {
  return (
    <div className="space-y-4 pt-2">
      {/* Notes Field */}
      <div className="space-y-2 pb-1">
        <Label
          htmlFor="notes"
          className="text-overline text-neutral-500 uppercase tracking-[1.5px]"
        >
          Notes
        </Label>
        <Textarea
          id="notes"
          variant="underlined"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add any additional notes..."
          rows={3}
        />
      </div>
    </div>
  );
};
