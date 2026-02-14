import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorBoundary from "@/components/ErrorBoundary";

// Simple throwing component
const Boom = () => {
  throw new Error("boom");
};

// Mock window.location.reload
const originalLocation = window.location;

describe("ErrorBoundary", () => {
  beforeEach(() => {
    // @ts-expect-error override for test
    delete window.location;
    // @ts-expect-error override for test
    window.location = { ...originalLocation, reload: vi.fn() };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it("renders fallback when child throws and reloads on Try again", async () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );

    expect(
      await screen.findByText(/cosmic pothole|wobbly|page tripped/i),
    ).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /try again/i });
    await userEvent.click(button);

    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });
});
