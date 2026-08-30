import { afterEach, describe, expect, it } from "vitest";
import type { RecurringTransaction } from "@/types";
import { buildUpdatePayload, getEditDefaultValues } from "./RecurringTransactionForm.utils";

// The API stores dates as UTC midnight of the intended civil day (see
// F6.md). `getEditDefaultValues` reads them back via `parseRecurringDate`,
// and `buildUpdatePayload`'s dirty-check re-derives the same instant via
// `toUTC`. These must stay inverses of each other, or an unedited edit-form
// submit will spuriously include fields that didn't change.
describe("buildUpdatePayload dirty-check round-trip", () => {
  const originalTZ = process.env.TZ;
  afterEach(() => {
    process.env.TZ = originalTZ;
  });

  const transaction: RecurringTransaction = {
    id: "1",
    title: "Rent",
    amount: 100,
    type: "EXPENSE",
    date: "2026-01-01T00:00:00.000Z",
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-06-15T00:00:00.000Z",
    isActive: true,
    nextOccurrence: "2026-02-01T00:00:00.000Z",
    categoryId: "c1",
    recurrenceFrequency: "MONTHLY",
  };

  it("omits endDate from the payload when the edit form is submitted unedited, west of UTC", () => {
    process.env.TZ = "America/Los_Angeles";
    const defaults = getEditDefaultValues(transaction);
    const payload = buildUpdatePayload(defaults, transaction);

    expect("endDate" in payload).toBe(false);
  });

  it("still detects an unrelated field change without spuriously touching endDate", () => {
    process.env.TZ = "America/Los_Angeles";
    const defaults = getEditDefaultValues(transaction);
    const payload = buildUpdatePayload({ ...defaults, title: "New rent" }, transaction);

    expect(payload.title).toBe("New rent");
    expect("endDate" in payload).toBe(false);
  });

  it("does detect a real end date change", () => {
    process.env.TZ = "America/Los_Angeles";
    const defaults = getEditDefaultValues(transaction);
    const payload = buildUpdatePayload(
      { ...defaults, endDate: new Date(2026, 6, 1) },
      transaction,
    );

    expect(payload.endDate).toBe("2026-07-01T00:00:00.000Z");
  });
});
