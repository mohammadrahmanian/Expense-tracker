import { parseAmount } from "@/lib/amount-utils";
import { parseRecurringDate } from "@/lib/recurring-transactions.utils";
import { RecurringTransaction } from "@/types";
import { startOfDay } from "date-fns";
import { toast } from "sonner";
import { RecurringTransactionFormValues } from "./RecurringTransactionForm.types";

export function getEditDefaultValues(
  transaction: RecurringTransaction,
): RecurringTransactionFormValues {
  return {
    title: transaction.title,
    type: transaction.type,
    categoryId: transaction.categoryId,
    amount: transaction.amount.toString(),
    hasEndDate: !!transaction.endDate,
    endDate: transaction.endDate
      ? parseRecurringDate(transaction.endDate)
      : null,
    description: transaction.description || "",
    recurrenceFrequency: transaction.recurrenceFrequency,
    startDate: parseRecurringDate(transaction.startDate),
  };
}

export function getCreateDefaultValues(): RecurringTransactionFormValues {
  return {
    title: "",
    type: "EXPENSE",
    categoryId: "",
    amount: "",
    hasEndDate: false,
    endDate: null,
    description: "",
    recurrenceFrequency: "MONTHLY",
    startDate: startOfDay(new Date()),
  };
}

function toUTC(date: Date): Date {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
}

export function buildCreatePayload(data: RecurringTransactionFormValues) {
  const numericAmount = parseAmount(data.amount) ?? 0;
  return {
    title: data.title,
    amount: numericAmount,
    type: data.type,
    categoryId: data.categoryId,
    startDate: toUTC(data.startDate).toISOString(),
    endDate:
      data.hasEndDate && data.endDate
        ? toUTC(data.endDate).toISOString()
        : undefined,
    description: data.description || undefined,
    recurrenceFrequency: data.recurrenceFrequency,
  };
}

export function buildUpdatePayload(
  data: RecurringTransactionFormValues,
  transaction: RecurringTransaction,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  const numericAmount = parseAmount(data.amount) ?? 0;

  if (data.title !== transaction.title) {
    payload.title = data.title;
  }

  if (numericAmount !== transaction.amount) {
    payload.amount = numericAmount;
  }

  if (data.type !== transaction.type) {
    payload.type = data.type;
  }

  if (data.categoryId !== transaction.categoryId) {
    payload.categoryId = data.categoryId;
  }

  if (data.description !== transaction.description) {
    payload.description = data.description || undefined;
  }

  const currentEndDate = transaction.endDate
    ? new Date(transaction.endDate).getTime()
    : null;
  const newEndDate =
    data.hasEndDate && data.endDate ? toUTC(data.endDate).getTime() : null;

  if (currentEndDate !== newEndDate) {
    payload.endDate =
      data.hasEndDate && data.endDate
        ? toUTC(data.endDate).toISOString()
        : null;
  }

  return payload;
}

type CreateSubmitHandlerDeps = {
  createMutate: (data: any, options: { onSuccess: () => void }) => void;
  onSuccess: () => void;
};

export function createCreateSubmitHandler(deps: CreateSubmitHandlerDeps) {
  return (data: RecurringTransactionFormValues) => {
    deps.createMutate(buildCreatePayload(data), {
      onSuccess: deps.onSuccess,
    });
  };
}

type EditSubmitHandlerDeps = {
  transaction: RecurringTransaction;
  updateMutate: (
    data: { id: string; updates: Record<string, unknown> },
    options: { onSuccess: () => void },
  ) => void;
  onSuccess: () => void;
};

export function createEditSubmitHandler(deps: EditSubmitHandlerDeps) {
  return (data: RecurringTransactionFormValues) => {
    const payload = buildUpdatePayload(data, deps.transaction);
    if (Object.keys(payload).length === 0) {
      toast.info("No changes to save");
      return;
    }

    deps.updateMutate(
      { id: deps.transaction.id, updates: payload },
      { onSuccess: deps.onSuccess },
    );
  };
}
