import { type FC } from "react";
import { Repeat } from "lucide-react";
import { ToggleChip } from "@/components/ui/toggle-chip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type QuickExpenseFormData } from "../QuickExpenseModal.types";
import { QuickDateChip } from "./QuickDateChip";

type RecurrenceFrequency = NonNullable<
  QuickExpenseFormData["recurrenceFrequency"]
>;

type QuickExpenseRecurrenceControlsProps = {
  date: Date;
  onDateChange: (date: Date) => void;
  isRecurring: boolean;
  onRecurringChange: (pressed: boolean) => void;
  recurrenceFrequency?: RecurrenceFrequency;
  onFrequencyChange: (value: RecurrenceFrequency) => void;
};

export const QuickExpenseRecurrenceControls: FC<
  QuickExpenseRecurrenceControlsProps
> = ({
  date,
  onDateChange,
  isRecurring,
  onRecurringChange,
  recurrenceFrequency,
  onFrequencyChange,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5">
        <QuickDateChip value={date} onChange={onDateChange} />
        <ToggleChip pressed={isRecurring} onPressedChange={onRecurringChange}>
          <Repeat className="h-3.5 w-3.5" />
          {isRecurring ? "Recurring" : "One-time"}
        </ToggleChip>
      </div>
      {isRecurring && (
        <Select
          value={recurrenceFrequency}
          onValueChange={(value) =>
            onFrequencyChange(value as RecurrenceFrequency)
          }
        >
          <SelectTrigger variant="underlined">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DAILY">Daily</SelectItem>
            <SelectItem value="WEEKLY">Weekly</SelectItem>
            <SelectItem value="MONTHLY">Monthly</SelectItem>
            <SelectItem value="YEARLY">Yearly</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
