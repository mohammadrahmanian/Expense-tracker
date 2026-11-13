import { startOfDay } from "date-fns";
import { afterEach, describe, expect, it } from "vitest";
import {
  countOccurrencesUntil,
  formatNextRunRelative,
  getNextOccurrences,
  getRecurringStatus,
  parseRecurringDate,
} from "./recurring-transactions.utils";
import type { RecurringTransaction } from "@/types";

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
    expect(result[0].relativeLabel).toBe("Today");
    expect(result[1].relativeLabel).toBe("Tomorrow");
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

  it("keeps the first occurrence on the correct calendar day when startDate carries a time-of-day and fromDate is midnight of the same day", () => {
    const startDate = new Date(2026, 0, 15, 12, 0); // Jan 15, 2026, noon
    const fromDate = startOfDay(startDate); // Jan 15, 2026, 00:00 — same calendar day

    const result = getNextOccurrences({
      startDate,
      frequency: "DAILY",
      fromDate,
    });

    expect(result[0].monthShort).toBe("JAN");
    expect(result[0].dayOfMonth).toBe("15");
    expect(result[0].date.toDateString()).toBe(startDate.toDateString());
  });
});

describe("formatNextRunRelative", () => {
  const now = new Date(2026, 0, 15); // 2026-01-15

  it("labels today/tomorrow/yesterday relative to the given `now`, not the real clock", () => {
    expect(formatNextRunRelative(new Date(2026, 0, 15), now)).toBe("Today");
    expect(formatNextRunRelative(new Date(2026, 0, 16), now)).toBe("Tomorrow");
    expect(formatNextRunRelative(new Date(2026, 0, 14), now)).toBe("Yesterday");
  });

  it("falls back to a distance string computed against `now` for farther dates", () => {
    expect(formatNextRunRelative(new Date(2026, 0, 18), now)).toBe("in 3 days");
    expect(formatNextRunRelative(new Date(2026, 0, 10), now)).toBe("5 days ago");
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

// The API stores startDate/endDate/nextOccurrence as UTC midnight of the
// intended civil day (see F6.md). `parseRecurringDate` must reconstruct
// that day as LOCAL components regardless of which side of UTC the viewer
// is on — tested in both directions since a sign error in the offset math
// would only show up on one side.
describe("parseRecurringDate", () => {
  const originalTZ = process.env.TZ;
  afterEach(() => {
    process.env.TZ = originalTZ;
  });

  it("reconstructs the UTC calendar day as local components west of UTC (America/Los_Angeles)", () => {
    process.env.TZ = "America/Los_Angeles";
    const d = parseRecurringDate("2026-01-15T00:00:00.000Z");
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 0, 15]);
  });

  it("reconstructs the UTC calendar day as local components east of UTC (Asia/Tokyo)", () => {
    process.env.TZ = "Asia/Tokyo";
    const d = parseRecurringDate("2026-01-15T00:00:00.000Z");
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 0, 15]);
  });

  it("does not skip the January monthly run for a west-of-UTC viewer (regression: F6-counter.md)", () => {
    process.env.TZ = "America/Los_Angeles";
    const startDate = parseRecurringDate("2026-01-15T00:00:00.000Z");
    const fromDate = new Date(2026, 0, 15); // "today" for this viewer, local
    const result = getNextOccurrences({
      startDate,
      frequency: "MONTHLY",
      fromDate,
    });
    expect(result[0].monthShort).toBe("JAN");
    expect(result[0].dayOfMonth).toBe("15");
  });
});

describe("getRecurringStatus", () => {
  const originalTZ = process.env.TZ;
  afterEach(() => {
    process.env.TZ = originalTZ;
  });

  const baseTransaction: RecurringTransaction = {
    id: "1",
    title: "Rent",
    amount: 100,
    type: "EXPENSE",
    date: "2026-01-01T00:00:00.000Z",
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-01-15T00:00:00.000Z",
    isActive: true,
    nextOccurrence: "2026-02-01T00:00:00.000Z",
    categoryId: "c1",
    recurrenceFrequency: "MONTHLY",
  };

  it("is not ended while still within the stored end date's civil day, west of UTC", () => {
    process.env.TZ = "America/Los_Angeles";
    // Real "now" during the 15th, local — the raw (unfixed) endDate would
    // read back as the 14th and falsely report "ended" a day early.
    const now = new Date(2026, 0, 15, 18, 0);
    expect(getRecurringStatus(baseTransaction, now)).toBe("active");
  });

  it("is ended the day after the stored end date's civil day, west of UTC", () => {
    process.env.TZ = "America/Los_Angeles";
    const now = new Date(2026, 0, 16, 1, 0);
    expect(getRecurringStatus(baseTransaction, now)).toBe("ended");
  });
});
