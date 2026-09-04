import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@/test/test-utils";
import { OAuthConsentCard } from "./OAuthConsentCard";

const baseProps = {
  clientName: "Claude.ai",
  scope: null,
  isSubmitting: false,
  pendingAction: null as "approve" | "deny" | null,
  onApprove: vi.fn(),
  onDeny: vi.fn(),
};

describe("OAuthConsentCard", () => {
  it("shows the client name prominently", () => {
    render(<OAuthConsentCard {...baseProps} />);
    expect(screen.getAllByText("Claude.ai").length).toBeGreaterThan(0);
  });

  it("falls back to a default access summary when scope is null", () => {
    render(<OAuthConsentCard {...baseProps} />);
    expect(
      screen.getByText(
        "read your transactions, categories, budgets and log new transactions",
      ),
    ).toBeInTheDocument();
  });

  it("renders the provided scope when present", () => {
    render(<OAuthConsentCard {...baseProps} scope="read your budgets only" />);
    expect(screen.getByText("read your budgets only")).toBeInTheDocument();
  });

  it("fires onApprove and onDeny on click", () => {
    const onApprove = vi.fn();
    const onDeny = vi.fn();
    render(
      <OAuthConsentCard {...baseProps} onApprove={onApprove} onDeny={onDeny} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /approve/i }));
    fireEvent.click(screen.getByRole("button", { name: /deny/i }));
    expect(onApprove).toHaveBeenCalledTimes(1);
    expect(onDeny).toHaveBeenCalledTimes(1);
  });

  it("disables both buttons while submitting", () => {
    render(
      <OAuthConsentCard
        {...baseProps}
        isSubmitting
        pendingAction="approve"
      />,
    );
    expect(screen.getByRole("button", { name: /approve/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /deny/i })).toBeDisabled();
  });
});
