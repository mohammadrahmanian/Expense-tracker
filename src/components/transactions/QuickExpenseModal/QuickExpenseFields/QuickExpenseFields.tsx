import { useState, type FC } from "react";
import { Category } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { ChevronDown, ChevronRight, Pencil, Repeat, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToggleChip } from "@/components/ui/toggle-chip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuickCategorySelect } from "../QuickCategorySelect";
import { type QuickExpenseFormData } from "../QuickExpenseModal.types";
import { QuickDateChip } from "./QuickDateChip";
import { MoreOptionsSection } from "./MoreOptionsSection";

type QuickExpenseFieldsProps = {
  form: UseFormReturn<QuickExpenseFormData>;
  currencySymbol: string;
  categories: Category[];
};

export const QuickExpenseFields: FC<QuickExpenseFieldsProps> = ({
  form,
  currencySymbol,
  categories,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const categoryName = watch("categoryName");
  const isRecurring = watch("isRecurring");
  const [moreOpen, setMoreOpen] = useState(false);
  const [notes, setNotes] = useState("");

  return (
    <>
      {/* Category Grid Section */}
      <div className="py-6">
        <QuickCategorySelect
          selectedCategory={categoryName}
          onSelect={(name) =>
            setValue("categoryName", name, { shouldValidate: true })
          }
          categories={categories}
          error={errors.categoryName?.message}
        />
      </div>

      {/* Form Section */}
      <div className="space-y-4">
        {/* Amount Input */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[30px] font-semibold text-neutral-500">
            {currencySymbol}
          </span>
          <Input
            variant="filled"
            {...register("amount")}
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            className="h-14 pl-14 text-[30px] font-semibold"
          />
        </div>
        {errors.amount && (
          <p className="-mt-2 text-caption text-danger-500">
            {errors.amount.message}
          </p>
        )}

        {/* Description Input */}
        <div className="relative">
          <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            variant="filled"
            {...register("transactionName")}
            placeholder="Lunch at restaurant..."
            className="pl-9"
          />
        </div>

        {/* Meta Chips Row */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <QuickDateChip
              value={watch("date")}
              onChange={(date) => setValue("date", date)}
            />
            <ToggleChip
              pressed={isRecurring}
              onPressedChange={(pressed) => {
                setValue("isRecurring", pressed);
                setValue(
                  "recurrenceFrequency",
                  pressed ? "MONTHLY" : undefined,
                );
              }}
            >
              <Repeat className="h-3.5 w-3.5" />
              {isRecurring ? "Recurring" : "One-time"}
            </ToggleChip>
          </div>
          {isRecurring && (
            <Select
              value={watch("recurrenceFrequency")}
              onValueChange={(value) => {
                setValue(
                  "recurrenceFrequency",
                  value as "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY",
                );
              }}
            >
              <SelectTrigger className="rounded-t-sm rounded-b-none border-0 border-b border-b-neutral-400 bg-neutral-100 data-[state=open]:border-b-2 data-[state=open]:border-b-gold-500 data-[state=open]:rounded-b-none focus-visible:border-b-2 focus-visible:border-b-gold-500 dark:border-b-neutral-600 dark:bg-neutral-800 dark:data-[state=open]:border-b-2 dark:data-[state=open]:border-b-gold-500 dark:focus-visible:border-b-2 dark:focus-visible:border-b-gold-500">
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

        {/* More Options */}
        <Collapsible open={moreOpen} onOpenChange={setMoreOpen}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 text-[13px] font-medium text-gold-500"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>More options (notes, receipt...)</span>
              {moreOpen ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
            <div className="px-px">
              <MoreOptionsSection notes={notes} onNotesChange={setNotes} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </>
  );
};
