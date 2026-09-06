import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Category } from "@/types";
import { QuickCategorySelect } from "./QuickCategorySelect";

function makeCategory(id: string, name: string): Category {
  return { id, name, color: "#000000", type: "EXPENSE" };
}

function mockMatchMedia(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches,
    media: "",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList);
}

beforeAll(() => {
  // jsdom doesn't implement these, but Radix Select's trigger/item interactions
  // call them unconditionally.
  Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(false);
  Element.prototype.releasePointerCapture = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});

describe("QuickCategorySelect", () => {
  it("hides the 5th quick-pick card on a small screen, but keeps it selectable via Other", async () => {
    mockMatchMedia(false); // narrower than the `sm` (640px) breakpoint

    const categories = [
      makeCategory("1", "Food"),
      makeCategory("2", "Health"),
      makeCategory("3", "Household"),
      makeCategory("4", "Fun"),
      makeCategory("5", "Clothes"),
    ];

    const user = userEvent.setup();
    render(
      <QuickCategorySelect
        selectedCategory=""
        onSelect={vi.fn()}
        categories={categories}
      />,
    );

    // Only the first 4 resolved quick-pick categories render as visible cards.
    expect(screen.getByRole("button", { name: "Food" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Health" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Household" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fun" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Clothes" }),
    ).not.toBeInTheDocument();

    // The 5th category isn't dropped — it's still selectable from Other.
    await user.click(screen.getByRole("button", { name: "Other" }));
    await user.click(screen.getByRole("combobox"));

    expect(
      await screen.findByRole("option", { name: "Clothes" }),
    ).toBeInTheDocument();
  });

  it("renders all 5 quick-pick cards on a desktop-sized screen", () => {
    mockMatchMedia(true); // at or above the `sm` (640px) breakpoint

    const categories = [
      makeCategory("1", "Food"),
      makeCategory("2", "Health"),
      makeCategory("3", "Household"),
      makeCategory("4", "Fun"),
      makeCategory("5", "Clothes"),
    ];

    render(
      <QuickCategorySelect
        selectedCategory=""
        onSelect={vi.fn()}
        categories={categories}
      />,
    );

    expect(screen.getByRole("button", { name: "Food" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Health" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Household" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fun" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clothes" })).toBeInTheDocument();
  });

  it("shows an empty state and no cards when there are no categories", () => {
    mockMatchMedia(false);

    render(
      <QuickCategorySelect
        selectedCategory=""
        onSelect={vi.fn()}
        categories={[]}
      />,
    );

    expect(
      screen.getByText(/don't have any expense categories yet/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
