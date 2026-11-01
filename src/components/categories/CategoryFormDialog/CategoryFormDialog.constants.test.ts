import { describe, expect, it } from "vitest";
import {
  FALLBACK_CATEGORY_ICON,
  ICON_BY_NAME,
  getCategoryIcon,
} from "./CategoryFormDialog.constants";

describe("getCategoryIcon", () => {
  it("returns the icon for a known icon name", () => {
    expect(getCategoryIcon("heart")).toBe(ICON_BY_NAME.heart);
  });

  it("returns the neutral fallback for a missing or unknown icon name", () => {
    expect(getCategoryIcon(undefined)).toBe(FALLBACK_CATEGORY_ICON);
    expect(getCategoryIcon(null)).toBe(FALLBACK_CATEGORY_ICON);
    expect(getCategoryIcon("not-an-icon")).toBe(FALLBACK_CATEGORY_ICON);
  });
});
