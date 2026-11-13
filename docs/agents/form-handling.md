# Form Handling Standards

All forms in this codebase use **React Hook Form + Zod**. No exceptions.

---

## Required Libraries

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
```

---

## Standard Form Pattern

### 1. Define Zod Schema

```typescript
const transactionFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  amount: z
    .number()
    .positive("Amount must be positive")
    .max(999999999.99, "Amount too large"),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "Category is required"),
  date: z.date(),
});
```

### 2. Infer TypeScript Type

```typescript
type TransactionFormData = z.infer<typeof transactionFormSchema>;
```

### 3. Use in Component

```typescript
function TransactionForm({ onSubmit, defaultValues }: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: 'EXPENSE',
      date: new Date(),
      ...defaultValues,
    },
  });

  const onSubmitForm = async (data: TransactionFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      // Error handled by mutation hook with toast
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      {/* Form fields */}
    </form>
  );
}
```

---

## Form Field Components

Use the shared field components with `register` (or `Controller` for non-native inputs):

```typescript
import { FormInput } from '@/components/shared/FormInput';

// In your component
const form = useForm<FormData>({
  resolver: zodResolver(schema),
});

return (
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormInput
      id="title"
      label="Title"
      placeholder="Grocery shopping"
      error={form.formState.errors.title?.message}
      {...form.register('title')}
    />
  </form>
);
```

---

## Amount Input Handling

Amount fields need special handling for decimal separator support.

### Using Amount Utilities

```typescript
import { normalizeAmount, createAmountChangeHandler } from '@/lib/amount-utils';

function AmountField() {
  const [displayValue, setDisplayValue] = useState('');

  // Validates and sets display value
  const handleChange = createAmountChangeHandler(setDisplayValue);

  // Before form submission
  const numericAmount = parseFloat(normalizeAmount(displayValue));

  return (
    <Input
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      placeholder="0.00"
    />
  );
}
```

### Accepted Formats

- `1234.56` (US format)
- `1234,56` (European format)

Both are normalized to `1234.56` before API submission.

---

## Loading States

```typescript
function MyForm() {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input disabled={isSubmitting} />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
```

---

## Error Handling

### Validation Errors

Shown inline through the field `error` prop:

```typescript
<FormInput
  id="email"
  label="Email"
  error={errors.email?.message} // "Email is required"
  {...register('email')}
/>
```

### API Errors

Handled in mutation hooks with toast:

```typescript
// In mutation hook
onError: (error) => {
  toast.error(
    error instanceof Error
      ? error.message
      : "Failed to save. Please try again.",
  );
};
```

---

## Common Zod Patterns

### Required String

```typescript
z.string().min(1, "Field is required");
```

### Optional String

```typescript
z.string().optional();
// or
z.string().nullable();
```

### Positive Number

```typescript
z.number().positive("Must be positive");
```

### Enum/Select

```typescript
z.enum(["INCOME", "EXPENSE"], {
  required_error: "Please select a type",
});
```

### Date

```typescript
z.date({
  required_error: "Date is required",
});
```

### Email

```typescript
z.string().email("Invalid email address");
```

### Password

```typescript
z.string().min(8, "Password must be at least 8 characters").max(100);
```

---

## Form Schema Naming

Use `{Feature}FormSchema` pattern:

- `TransactionFormSchema`
- `CategoryFormSchema`
- `LoginFormSchema`
- `RegisterFormSchema`
- `RecurringTransactionFormSchema`

---

## Complete Example

```typescript
import { type FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from '@/components/shared/FormInput';
import { TypeSelect } from '@/components/shared/TypeSelect';
import { Button } from '@/components/ui/button';

// Schema
const categoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  type: z.enum(['INCOME', 'EXPENSE']),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

// Component
type CategoryFormProps = {
  defaultValues?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
};

export const CategoryForm: FC<CategoryFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { type: 'EXPENSE', ...defaultValues },
  });

  const onSubmitForm = async (data: CategoryFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <FormInput
        id="name"
        label="Name"
        required
        error={errors.name?.message}
        {...register('name')}
      />

      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <TypeSelect
            value={field.value}
            onChange={field.onChange}
            error={errors.type?.message}
            required
          />
        )}
      />

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};
```
