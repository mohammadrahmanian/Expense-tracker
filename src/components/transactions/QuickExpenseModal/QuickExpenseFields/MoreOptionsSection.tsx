import { type FC } from "react";
import { Upload } from "lucide-react";

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

      {/* Receipt Upload Area */}
      <div className="space-y-2">
        <span className="text-overline text-neutral-500 uppercase tracking-[1.5px]">
          Receipt
        </span>
        <button
          type="button"
          className="flex w-full flex-col items-center justify-center gap-2 h-20 rounded-md border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          <Upload className="h-5 w-5 text-neutral-500" />
          <span className="text-[13px] font-medium">
            Upload receipt image
          </span>
          <span className="text-[11px] text-neutral-500">
            PNG, JPG up to 5MB
          </span>
        </button>
      </div>
    </div>
  );
};
