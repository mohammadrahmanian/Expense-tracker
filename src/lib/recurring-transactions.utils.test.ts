import { describe, expect, it } from "vitest";
import { getNextOccurrences } from "./recurring-transactions.utils";

describe("getNextOccurrences", () => {
  const from = new Date(2026, 0, 1); // 2026-01-01

  it("returns daily occurrences", () => {
    const result = getNextOccurrences({
      startDate: from,
      frequency: "DAILY",
      fromDate: from,
    });

    expect(result.map((o) => o.date.toISOString())).toEqual([
      new Date(2026, 0, 1).toISOString(),
      new Date(2026, 0, 2).toISOString(),
      new Date(2026, 0, 3).toISOString(),
    ]);
  });

  it("returns weekly occurrences", () => {
    const result = getNextOccurrences({
      startDate: from,
      frequency: "WEEKLY",
      fromDate: from,
    });

    expect(result.map((o) => o.date.toISOString())).toEqual([
      new Date(2026, 0, 1).toISOString(),
      new Date(2026, 0, 8).toISOString(),
      new Date(2026, 0, 15).toISOString(),
    ]);
  });

  it("returns monthly occurrences without day-of-month drift", () => {
    const start = new Date(2026, 0, 31); // Jan 31, 2026
    const result = getNextOccurrences({
      startDate: start,
      frequency: "MONTHLY",
      fromDate: start,
    });

    // Feb has no 31st, so it clamps to the 28th — but March (31 days) must
    // land back on the 31st, computed from the original start date rather
    // than drifting from February's clamped value (which would give the 28th).
    expect(result.map((o) => o.monthShort)).toEqual(["JAN", "FEB", "MAR"]);
    expect(result[2].dayOfMonth).toBe("31");
  });

  it("returns yearly occurrences", () => {
    const result = getNextOccurrences({
      startDate: from,
      frequency: "YEARLY",
      fromDate: from,
    });

    expect(result.map((o) => o.date.getFullYear())).toEqual([2026, 2027, 2028]);
  });

  it("stops at the end date", () => {
    const result = getNextOccurrences({
      startDate: from,
      frequency: "DAILY",
      fromDate: from,
      endDate: new Date(2026, 0, 2),
    });

    expect(result).toHaveLength(2);
  });

  it("skips ahead to fromDate when the start date is in the past", () => {
    const start = new Date(2020, 0, 1);
    const today = new Date(2026, 0, 1);
    const result = getNextOccurrences({
      startDate: start,
      frequency: "YEARLY",
      fromDate: today,
    });

    expect(result[0].date.getFullYear()).toBe(2026);
  });
});
