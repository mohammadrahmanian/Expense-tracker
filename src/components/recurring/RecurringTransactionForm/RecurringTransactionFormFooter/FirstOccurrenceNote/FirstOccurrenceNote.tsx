import { type FC } from "react";
import { format } from "date-fns";
import { CircleCheck } from "lucide-react";
import { getFirstOccurrence, formatNextRunRelative } from "@/lib/recurring-transactions.utils";

type FirstOccurrenceNoteProps =
  | { mode: "create"; startDate: Date }
  | { mode: "edit"; nextOccurrenceISO: string };

export const FirstOccurrenceNote: FC<FirstOccurrenceNoteProps> = (props) => {
  const iso =
    props.mode === "create"
      ? getFirstOccurrence(props.startDate).toISOString()
      : props.nextOccurrenceISO;
  const relative = formatNextRunRelative(iso).toLowerCase();
  const prefix = props.mode === "create" ? "First occurrence" : "Next occurrence";
  const text = `${prefix} runs ${relative}, ${format(new Date(iso), "MMM d, yyyy")}.`;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <CircleCheck className="h-4 w-4 shrink-0 text-success-500" />
      <span>{text}</span>
    </div>
  );
};
