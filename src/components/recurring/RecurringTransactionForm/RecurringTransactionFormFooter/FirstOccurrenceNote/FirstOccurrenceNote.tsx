import { type FC } from "react";
import { format } from "date-fns";
import { CircleCheck } from "lucide-react";
import { useWatch, type Control } from "react-hook-form";
import {
  getFirstOccurrence,
  formatNextRunRelative,
  parseRecurringDate,
} from "@/lib/recurring-transactions.utils";
import type { RecurringTransactionFormValues } from "../../RecurringTransactionForm.types";

type FirstOccurrenceNoteProps = {
  control: Control<RecurringTransactionFormValues>;
} & ({ mode: "create" } | { mode: "edit"; nextOccurrenceISO: string });

export const FirstOccurrenceNote: FC<FirstOccurrenceNoteProps> = (props) => {
  const startDate = useWatch({ control: props.control, name: "startDate" });

  const date =
    props.mode === "create"
      ? getFirstOccurrence(startDate)
      : parseRecurringDate(props.nextOccurrenceISO);
  const relative = formatNextRunRelative(date).toLowerCase();
  const prefix = props.mode === "create" ? "First occurrence" : "Next occurrence";
  const text = `${prefix} runs ${relative}, ${format(date, "MMM d, yyyy")}.`;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <CircleCheck className="h-4 w-4 shrink-0 text-success-500" />
      <span>{text}</span>
    </div>
  );
};
