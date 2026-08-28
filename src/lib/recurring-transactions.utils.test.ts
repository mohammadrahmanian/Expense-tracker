import { describe, expect, it } from "vitest";
import {
  countOccurrencesUntil,
  formatNextRunRelative,
  getNextOccurrences,
} from "./recurring-transactions.utils";

describe("getNextOccurrences", () => {
  const from = new Date(2026, 0, 1); // 2026-01-01, a Thursday

  it("formats weekday, monthShort, dayOfMonth, and relativeLabel per the documented contract", () => {
    const result = getNextOccurrences({
      startDate: from,
      frequency: "DAILY",
      fromDate: from,
    });

    expect(result[0].weekday).toBe("Thursday");
    expect(result[0].monthShort).toBe("JAN");
    expect(result[0].dayOfMonth).toBe("01");
    expect(result[0].relativeLabel).toBe(
      formatNextRunRelative(result[0].date.toISOString(), from),
    );
    expect(result[0].relativeLabel).toBe("Today");

    // Index 1 isn't asserted against a literal like "Tomorrow": date-fns's
    // isTomorrow/isYesterday (used inside formatNextRunRelative) compare
    // against the real system clock regardless of the `now` argument, so
    // only the "same style as formatNextRunRelative" contract is stable here.
    expect(result[1].relativeLabel).toBe(
      formatNextRunRelative(result[1].date.toISOString(), from),
    );
  });

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

  it("returns an empty list instead of throwing for an invalid start date", () => {
    const result = getNextOccurrences({
      startDate: new Date("not-a-date"),
      frequency: "MONTHLY",
      fromDate: from,
    });

    expect(result).toEqual([]);
  });
});

describe("countOccurrencesUntil", () => {
  it("counts monthly occurrences from start through until, inclusive", () => {
    const count = countOccurrencesUntil({
      startDate: new Date(2026, 0, 1),
      frequency: "MONTHLY",
      until: new Date(2026, 2, 1), // 2026-03-01
    });

    expect(count).toBe(3); // Jan 1, Feb 1, Mar 1
  });

  it("does not drift for a Jan 31 start date", () => {
    const count = countOccurrencesUntil({
      startDate: new Date(2026, 0, 31), // Jan 31, 2026
      frequency: "MONTHLY",
      until: new Date(2026, 3, 1), // 2026-04-01
    });

    // Jan 31, Feb 28 (clamped), Mar 31 (back to the original day, not drifted) = 3
    expect(count).toBe(3);
  });

  it("returns 0 when until is before startDate", () => {
    const count = countOccurrencesUntil({
      startDate: new Date(2026, 5, 1),
      frequency: "MONTHLY",
      until: new Date(2026, 0, 1),
    });

    expect(count).toBe(0);
  });

  it("stops counting at endDate even when until is later", () => {
    const count = countOccurrencesUntil({
      startDate: new Date(2026, 0, 1),
      frequency: "MONTHLY",
      endDate: new Date(2026, 1, 15), // Feb 15, 2026
      until: new Date(2026, 3, 1), // 2026-04-01
    });

    // Jan 1, Feb 1 count; Mar 1 is after the Feb 15 endDate
    expect(count).toBe(2);
  });

  it("counts today's occurrence even when startDate's time-of-day is later than until's", () => {
    const until = new Date(2026, 0, 15, 10, 0); // Jan 15, 2026, 10:00
    const count = countOccurrencesUntil({
      startDate: new Date(2026, 0, 15, 15, 0), // same calendar day, 15:00
      frequency: "DAILY",
      until,
    });

    expect(count).toBe(1);
  });
});
