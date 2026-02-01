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

Use shadcn/ui form components for consistency:

```typescript
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// In your component
const form = useForm<FormData>({
  resolver: zodResolver(schema),
});

return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Grocery shopping" {...field} />
            </FormControl>
            <FormMessage /> {/* Shows validation error */}
          </FormItem>
        )}
      />
    </form>
  </Form>
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

Shown inline via `<FormMessage />`:

```typescript
<FormField
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage /> {/* "Email is required" */}
    </FormItem>
  )}
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
// Schema
const categoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  type: z.enum(['INCOME', 'EXPENSE']),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color'),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

// Component
interface CategoryFormProps {
  defaultValues?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
}

function CategoryForm({ defaultValues, onSubmit, onCancel }: CategoryFormProps) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      type: 'EXPENSE',
      color: '#3b82f6',
      ...defaultValues,
    },
  });

  const handleSubmit = async (data: CategoryFormData) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```
