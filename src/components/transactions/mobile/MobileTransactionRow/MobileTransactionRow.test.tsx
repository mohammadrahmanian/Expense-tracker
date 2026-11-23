import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Category, Transaction } from "@/types";
import { MobileTransactionRow } from "./MobileTransactionRow";

const transaction: Transaction = {
  id: "tx-1",
  title: "Coffee",
  amount: 4.5,
  type: "EXPENSE",
  date: new Date("2026-01-15"),
  categoryId: "cat-1",
  userId: "user-1",
  createdAt: new Date("2026-01-15"),
  updatedAt: new Date("2026-01-15"),
};

const category: Category = {
  id: "cat-1",
  name: "Food",
  color: "#000000",
  type: "EXPENSE",
};

const renderRow = (isOpen = false) => {
  const handlers = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onOpenChange: vi.fn(),
  };
  render(
    <MobileTransactionRow
      transaction={transaction}
      category={category}
      formatAmount={(amount) => amount.toFixed(2)}
      isOpen={isOpen}
      {...handlers}
    />,
  );
  return handlers;
};

describe("MobileTransactionRow", () => {
  it("calls onEdit with the transaction when Edit is clicked", async () => {
    const { onEdit, onDelete } = renderRow(true);

    await userEvent.click(
      screen.getByRole("button", { name: "Edit transaction" }),
    );

    expect(onEdit).toHaveBeenCalledWith(transaction);
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("calls onDelete with the transaction id when Delete is clicked", async () => {
    const { onEdit, onDelete } = renderRow(true);

    await userEvent.click(
      screen.getByRole("button", { name: "Delete transaction" }),
    );

    expect(onDelete).toHaveBeenCalledWith("tx-1");
    expect(onEdit).not.toHaveBeenCalled();
  });

  it("does not call onEdit when the row content is clicked", async () => {
    const { onEdit, onOpenChange } = renderRow();

    await userEvent.click(screen.getByText("Coffee"));

    expect(onEdit).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("closes the open row when the row content is clicked", async () => {
    const { onEdit, onOpenChange } = renderRow(true);

    await userEvent.click(screen.getByText("Coffee"));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onEdit).not.toHaveBeenCalled();
  });

  it("opens the row when an action button receives focus", async () => {
    const { onOpenChange } = renderRow();

    await userEvent.tab();

    expect(
      screen.getByRole("button", { name: "Edit transaction" }),
    ).toHaveFocus();
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});
