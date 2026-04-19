import { type FC } from "react";

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
      <div className="space-y-2">
        <span className="text-overline text-neutral-500 uppercase tracking-[1.5px]">
          Notes
        </span>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add any additional notes..."
          className="w-full rounded-md bg-neutral-100 p-3 text-body text-foreground placeholder:text-neutral-500 outline-none focus-visible:ring-1 focus-visible:ring-gold-500 resize-none dark:bg-neutral-800 dark:placeholder:text-neutral-500"
          rows={3}
        />
      </div>
    </div>
  );
};
