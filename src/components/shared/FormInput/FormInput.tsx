import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormInputProps = {
  label: string;
  error?: string;
  required?: boolean;
} & React.ComponentProps<typeof Input>;

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, required, id, className, ...inputProps }, ref) => (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}{required && <span className="text-red-500"> *</span>}
      </Label>
      <Input
        ref={ref}
        id={id}
        className={cn(error && "border-red-500", className)}
        {...inputProps}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  ),
);
