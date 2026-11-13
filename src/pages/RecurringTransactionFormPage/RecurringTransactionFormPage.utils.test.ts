import { describe, expect, it } from "vitest";
import { getRecurringFormReturnTo } from "./RecurringTransactionFormPage.utils";

describe("getRecurringFormReturnTo", () => {
  const LIST = "/recurring-transactions";

  it("returns the list when Edit was opened from the list", () => {
    expect(getRecurringFormReturnTo(LIST, "abc")).toBe(LIST);
    // Create mode has no edit id, but the list is still a valid origin.
    expect(getRecurringFormReturnTo(LIST, undefined)).toBe(LIST);
  });

  it("returns the detail path when it matches the record being edited", () => {
    expect(getRecurringFormReturnTo(`${LIST}/abc`, "abc")).toBe(`${LIST}/abc`);
  });

  it("falls back to the list for any other origin", () => {
    // Detail path for a different record.
    expect(getRecurringFormReturnTo(`${LIST}/other`, "abc")).toBe(LIST);
    // Detail origin in create mode (no edit id).
    expect(getRecurringFormReturnTo(`${LIST}/abc`, undefined)).toBe(LIST);
    // External URL.
    expect(getRecurringFormReturnTo("https://evil.example.com", "abc")).toBe(
      LIST,
    );
    // Protocol-relative URL.
    expect(getRecurringFormReturnTo("//evil.example.com", "abc")).toBe(LIST);
    // Another app path.
    expect(getRecurringFormReturnTo("/transactions", "abc")).toBe(LIST);
    // Nested path under the edited record.
    expect(getRecurringFormReturnTo(`${LIST}/abc/edit`, "abc")).toBe(LIST);
    // Missing or non-string state.
    expect(getRecurringFormReturnTo(undefined, "abc")).toBe(LIST);
    expect(getRecurringFormReturnTo(null, "abc")).toBe(LIST);
    expect(getRecurringFormReturnTo({ from: LIST }, "abc")).toBe(LIST);
  });
});
