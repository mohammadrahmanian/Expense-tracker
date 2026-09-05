import { describe, expect, it } from "vitest";
import { resolveQuickPickCategories } from "./QuickCategorySelect.utils";
import { Category } from "@/types";

function makeCategory(id: string, name: string): Category {
  return { id, name, color: "#000000", type: "EXPENSE" };
}

describe("resolveQuickPickCategories", () => {
  it("returns all target names matched to real categories in order", () => {
    const categories = [
      makeCategory("1", "Food"),
      makeCategory("2", "Health"),
      makeCategory("3", "Household"),
    ];
    const result = resolveQuickPickCategories(categories, [
      "Food",
      "Health",
      "Household",
    ]);
    expect(result.map((c) => c.id)).toEqual(["1", "2", "3"]);
  });

  it("fills a missing name with the next unused category in order", () => {
    const categories = [
      makeCategory("1", "Health"),
      makeCategory("2", "Groceries"),
    ];
    const result = resolveQuickPickCategories(categories, ["Food", "Health"]);
    // "Food" has no match, so it falls back to the first unused category
    // in array order. "Health" is reserved by its name match, so the
    // fallback must skip it and land on "Groceries".
    expect(result.map((c) => c.id)).toEqual(["2", "1"]);
  });

  it("never reuses a category already assigned to another slot", () => {
    const categories = [makeCategory("1", "Food"), makeCategory("2", "Fun")];
    const result = resolveQuickPickCategories(categories, [
      "Food",
      "Health",
      "Fun",
    ]);
    // "Food" and "Fun" match by name; "Health" has no match and no
    // remaining unused category to fall back to, so its slot is dropped.
    expect(result.map((c) => c.id)).toEqual(["1", "2"]);
  });

  it("handles the two-pass discriminating case: name-match reservations win over array order", () => {
    const categories = [
      makeCategory("1", "Health"),
      makeCategory("2", "Groceries"),
    ];
    const result = resolveQuickPickCategories(categories, ["Food", "Health"]);
    expect(result.map((c) => c.name)).toEqual(["Groceries", "Health"]);
  });

  it("returns a shorter array when there are fewer categories than target names", () => {
    const categories = [makeCategory("1", "Food")];
    const result = resolveQuickPickCategories(categories, [
      "Food",
      "Health",
      "Household",
    ]);
    expect(result.map((c) => c.id)).toEqual(["1"]);
  });

  it("returns an empty array when there are no categories", () => {
    const result = resolveQuickPickCategories(
      [],
      ["Food", "Health", "Household"],
    );
    expect(result).toEqual([]);
  });
});
