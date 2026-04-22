import { type FC, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import type { CategoryFormData } from "../CategoryFormDialog.types";
import { ColorPicker } from "../ColorPicker";
import { IconPicker } from "../IconPicker";
import { MonthlyBudgetField } from "../MonthlyBudgetField";
import { NameField } from "../NameField";
import { ParentSelect } from "../ParentSelect";
import { TypeSegment } from "../TypeSegment";
import type { Category } from "@/types";
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

type FormPanelProps = {
  editingCategory?: Category;
  register: UseFormRegister<CategoryFormData>;
  watch: UseFormWatch<CategoryFormData>;
  setValue: UseFormSetValue<CategoryFormData>;
  errors: FieldErrors<CategoryFormData>;
  parentOptions: Category[];
  onCancel: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
};

export const FormPanel: FC<FormPanelProps> = ({
  editingCategory,
  register,
  watch,
  setValue,
  errors,
  parentOptions,
  onCancel,
  onSubmit,
  isSubmitting,
}) => (
  <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background dark:bg-neutral-950">
    <header className="border-b border-border px-7 pb-5 pt-6">
      <div className="flex flex-col gap-1 pr-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {editingCategory ? "Edit category" : "Create new category"}
        </h2>
        <p className="text-[13px] text-muted-foreground">
          Group related spend and set a monthly target.
        </p>
      </div>
    </header>
    <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-[18px] overflow-y-auto px-7 py-5">
        <div className="flex flex-col gap-3.5 sm:flex-row sm:flex-nowrap sm:items-stretch">
          <NameField register={register("name")} error={errors.name?.message} />
          <TypeSegment
            value={watch("type")}
            onChange={(v) => setValue("type", v, { shouldValidate: true })}
            error={errors.type?.message}
          />
        </div>
        <IconPicker
          value={watch("icon")}
          onChange={(name) => setValue("icon", name, { shouldValidate: true })}
          error={errors.icon?.message}
        />
        <ColorPicker
          value={watch("color")}
          onChange={(c) => setValue("color", c, { shouldValidate: true })}
          error={errors.color?.message}
        />
        <div className="flex flex-col gap-3.5 sm:flex-row sm:flex-nowrap sm:items-stretch">
          <ParentSelect
            value={watch("parentId")}
            onChange={(id) => setValue("parentId", id, { shouldValidate: true })}
            options={parentOptions}
            error={errors.parentId?.message}
          />
          <MonthlyBudgetField
            value={watch("monthlyBudget")}
            onChange={(v) => setValue("monthlyBudget", v, { shouldValidate: true })}
            error={errors.monthlyBudget?.message}
          />
        </div>
      </div>
      <footer className="flex items-center justify-between gap-3 border-t border-border px-7 py-4">
        <Button type="button" variant="outline" className="min-w-[7rem]" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[10rem]">
          {editingCategory ? "Update category" : "Create category"}
        </Button>
      </footer>
    </form>
  </div>
);
