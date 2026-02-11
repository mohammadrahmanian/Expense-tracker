import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormData } from "../TransactionForm.types";

type ScheduleFieldsProps = {
  form: UseFormReturn<TransactionFormData>;
};

export const ScheduleFields: React.FC<ScheduleFieldsProps> = ({ form }) => {
  const { watch, setValue } = form;
  const watchIsRecurring = watch("isRecurring");

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="recurring"
            checked={watchIsRecurring}
            onCheckedChange={(checked) => setValue("isRecurring", checked)}
          />
          <Label htmlFor="recurring">Recurring transaction</Label>
        </div>
        {watchIsRecurring && (
          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select
              value={watch("recurrenceFrequency")}
              onValueChange={(
                value: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY",
              ) => setValue("recurrenceFrequency", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </>
  );
};
