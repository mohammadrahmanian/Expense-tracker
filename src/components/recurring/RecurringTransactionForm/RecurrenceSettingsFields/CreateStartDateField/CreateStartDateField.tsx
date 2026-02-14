import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { RecurringTransactionCreateFormData } from "../../RecurringTransactionForm.types";

type CreateStartDateFieldProps = {
  form: UseFormReturn<RecurringTransactionCreateFormData>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CreateStartDateField: FC<CreateStartDateFieldProps> = ({
  form,
  isOpen,
  onOpenChange,
}) => {
  const {
    formState: { errors },
    watch,
    setValue,
  } = form;
  const watchStartDate = watch("startDate");

  return (
    <div className="space-y-2">
      <Label>
        Start Date <span className="text-red-500">*</span>
      </Label>
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !watchStartDate && "text-muted-foreground",
              errors.startDate && "border-red-500",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {watchStartDate ? (
              format(watchStartDate, "PPP")
            ) : (
              <span>Select start date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={watchStartDate}
            onSelect={(date) => {
              setValue("startDate", date || new Date());
              onOpenChange(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {errors.startDate && (
        <p className="text-sm text-red-500">{errors.startDate.message}</p>
      )}
    </div>
  );
};
