import { Category } from "@/types";

export const EXPENSE_QUICK_PICK_NAMES = [
  "Food",
  "Health",
  "Household",
  "Fun",
  "Clothes",
] as const;

export function resolveQuickPickCategories(
  categories: Category[],
  targetNames: readonly string[],
): Category[] {
  const usedIds = new Set<string>();
  const matchedByIndex = new Map<number, Category>();

  // Pass 1: exact case-insensitive name match per target name, in order.
  // Seed `usedIds` from every pass-1 match before doing any fallback fills.
  targetNames.forEach((targetName, index) => {
    const match = categories.find(
      (cat) => cat.name.toLowerCase() === targetName.toLowerCase(),
    );
    if (match) {
      matchedByIndex.set(index, match);
      usedIds.add(match.id);
    }
  });

  // Pass 2: fill any unmatched slot, in order, with the next category (in
  // original array order) that hasn't already been used.
  let fallbackCursor = 0;
  const result: Category[] = [];
  targetNames.forEach((_, index) => {
    const matched = matchedByIndex.get(index);
    if (matched) {
      result.push(matched);
      return;
    }

    while (fallbackCursor < categories.length) {
      const candidate = categories[fallbackCursor];
      fallbackCursor += 1;
      if (!usedIds.has(candidate.id)) {
        usedIds.add(candidate.id);
        result.push(candidate);
        return;
      }
    }
    // Not enough categories to fill this slot — drop it.
  });

  return result;
}
