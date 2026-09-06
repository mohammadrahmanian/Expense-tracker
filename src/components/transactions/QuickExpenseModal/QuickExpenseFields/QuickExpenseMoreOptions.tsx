import { type FC } from "react";
import { ChevronDown, ChevronRight, Settings } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MoreOptionsSection } from "./MoreOptionsSection";

type QuickExpenseMoreOptionsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notes: string;
  onNotesChange: (value: string) => void;
};

export const QuickExpenseMoreOptions: FC<QuickExpenseMoreOptionsProps> = ({
  open,
  onOpenChange,
  notes,
  onNotesChange,
}) => {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 text-[13px] font-medium text-gold-500"
        >
          <Settings className="h-3.5 w-3.5" />
          <span>More options (notes)</span>
          {open ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <div className="px-px">
          <MoreOptionsSection notes={notes} onNotesChange={onNotesChange} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
