import { useMemo } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategories } from "@/hooks/queries/useCategories";
import { useCreateRecurringTransaction } from "@/hooks/mutations/useCreateRecurringTransaction";
import { useUpdateRecurringTransaction } from "@/hooks/mutations/useUpdateRecurringTransaction";
import {
  recurringTransactionCreateSchema,
  makeRecurringTransactionEditSchema,
  type RecurringTransactionFormProps,
  type RecurringTransactionFormValues,
} from "./RecurringTransactionForm.types";
import {
  getCreateDefaultValues,
  getEditDefaultValues,
  createCreateSubmitHandler,
  createEditSubmitHandler,
} from "./RecurringTransactionForm.utils";

export function useRecurringTransactionForm(props: RecurringTransactionFormProps) {
  const isEditing = props.mode === "edit";

  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCategories();
  const createMutation = useCreateRecurringTransaction();
  const updateMutation = useUpdateRecurringTransaction();

  const schema = useMemo(
    () =>
      isEditing
        ? makeRecurringTransactionEditSchema(props.transaction.startDate)
        : recurringTransactionCreateSchema,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isEditing, isEditing ? props.transaction.startDate : undefined],
  );

  const form = useForm<RecurringTransactionFormValues>({
    // The create/edit schemas validate different field sets (see types file); a single
    // controlled cast bridges the resolver's narrower inferred type to the RHF form's
    // superset type so the rest of the form gets fully typed `watch`/`setValue` calls.
    resolver: zodResolver(schema) as unknown as Resolver<RecurringTransactionFormValues>,
    defaultValues: isEditing
      ? getEditDefaultValues(props.transaction)
      : getCreateDefaultValues(),
    mode: "onChange",
  });

  const onSubmit = isEditing
    ? createEditSubmitHandler({
        transaction: props.transaction,
        updateMutate: updateMutation.mutate,
        onSuccess: props.onSuccess,
      })
    : createCreateSubmitHandler({
        createMutate: createMutation.mutate,
        onSuccess: props.onSuccess,
      });

  const watchedType = useWatch({ control: form.control, name: "type" });
  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === watchedType),
    [categories, watchedType],
  );

  return {
    form,
    onSubmit,
    categories,
    filteredCategories,
    isCategoriesLoading,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
