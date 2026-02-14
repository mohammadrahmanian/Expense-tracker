import { normalizeAmount } from "@/lib/amount-utils";
import { RecurringTransaction } from "@/types";
import { toast } from "sonner";
import {
  RecurringTransactionCreateFormData,
  RecurringTransactionEditFormData,
} from "./RecurringTransactionForm.types";

export function validateAmount(amount: string): {
  valid: boolean;
  numericAmount: number;
} {
  if (!amount) {
    toast.error("Please enter an amount");
    return { valid: false, numericAmount: 0 };
  }

  const normalizedAmount = normalizeAmount(amount.trim());
  const numericAmount = parseFloat(normalizedAmount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    toast.error("Please enter a valid amount");
    return { valid: false, numericAmount: 0 };
  }

  return { valid: true, numericAmount };
}

export function getEditDefaultValues(
  transaction: RecurringTransaction,
): RecurringTransactionEditFormData {
  return {
    title: transaction.title,
    type: transaction.type,
    categoryId: transaction.categoryId,
    endDate: transaction.endDate ? new Date(transaction.endDate) : null,
    description: transaction.description || "",
  };
}

export function getCreateDefaultValues(): RecurringTransactionCreateFormData {
  return {
    title: "",
    type: "EXPENSE",
    categoryId: "",
    recurrenceFrequency: "MONTHLY",
    startDate: new Date(),
    endDate: null,
    description: "",
  };
}

function toUTC(date: Date): Date {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
}

export function buildCreatePayload(
  data: RecurringTransactionCreateFormData,
  numericAmount: number,
) {
  return {
    title: data.title,
    amount: numericAmount,
    type: data.type,
    categoryId: data.categoryId,
    startDate: toUTC(data.startDate).toISOString(),
    endDate: data.endDate ? toUTC(data.endDate).toISOString() : undefined,
    description: data.description || undefined,
    recurrenceFrequency: data.recurrenceFrequency,
  };
}

export function buildUpdatePayload(
  data: RecurringTransactionEditFormData,
  numericAmount: number,
  transaction: RecurringTransaction,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

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
  const newEndDate = data.endDate ? data.endDate.getTime() : null;

  if (currentEndDate !== newEndDate) {
    payload.endDate = data.endDate ? data.endDate.toISOString() : null;
  }

  return payload;
}

type CreateSubmitHandlerDeps = {
  amount: string;
  createMutate: (data: any, options: { onSuccess: () => void }) => void;
  onSuccess: () => void;
};

export function createCreateSubmitHandler(deps: CreateSubmitHandlerDeps) {
  return (data: RecurringTransactionCreateFormData) => {
    const { valid, numericAmount } = validateAmount(deps.amount);
    if (!valid) return;

    deps.createMutate(buildCreatePayload(data, numericAmount), {
      onSuccess: deps.onSuccess,
    });
  };
}

type EditSubmitHandlerDeps = {
  amount: string;
  transaction: RecurringTransaction;
  updateMutate: (
    data: { id: string; updates: Record<string, unknown> },
    options: { onSuccess: () => void },
  ) => void;
  onSuccess: () => void;
};

export function createEditSubmitHandler(deps: EditSubmitHandlerDeps) {
  return (data: RecurringTransactionEditFormData) => {
    const { valid, numericAmount } = validateAmount(deps.amount);
    if (!valid) return;

    if (data.endDate) {
      const startDate = new Date(deps.transaction.startDate);
      if (data.endDate <= startDate) {
        toast.error("End date must be after start date");
        return;
      }
    }

    const payload = buildUpdatePayload(data, numericAmount, deps.transaction);
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
