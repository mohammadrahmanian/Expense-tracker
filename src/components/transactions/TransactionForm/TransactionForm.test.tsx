import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders, userEvent } from "@/test/test-utils";
import { TransactionForm } from "./TransactionForm";
import { Transaction } from "@/types";

vi.mock("@/components/ui/responsive-dialog", () => ({
  ResponsiveDialogHeader: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props}>{children}</div>
  ),
  ResponsiveDialogTitle: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props}>{children}</h2>
  ),
  ResponsiveDialogFooter: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props}>{children}</div>
  ),
}));

vi.mock("@/components/shared/CategorySelect", () => ({
  CategorySelect: ({
    value,
    onChange,
    categories,
    error,
  }: {
    value: string;
    onChange: (v: string) => void;
    categories: { id: string; name: string }[];
    error?: string;
  }) => (
    <div>
      <label htmlFor="category-select">Category</label>
      <select
        id="category-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {error && <p>{error}</p>}
    </div>
  ),
}));

vi.mock("@/components/shared/TypeSelect", () => ({
  TypeSelect: ({
    value,
    onChange,
    error,
  }: {
    value: string;
    onChange: (v: string) => void;
    error?: string;
  }) => (
    <div>
      <label htmlFor="type-select">Type</label>
      <select
        id="type-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="EXPENSE">Expense</option>
        <option value="INCOME">Income</option>
      </select>
      {error && <p>{error}</p>}
    </div>
  ),
}));

vi.mock("@/components/shared/DateSelect", () => ({
  DateSelect: ({
    value,
    onChange,
  }: {
    value: Date;
    onChange: (d: Date) => void;
  }) => (
    <input
      aria-label="Date"
      type="date"
      value={value.toISOString().slice(0, 10)}
      onChange={(e) => onChange(new Date(e.target.value))}
    />
  ),
}));

const mockCategories = [
  { id: "cat-1", name: "Groceries", color: "#FF6B6B", type: "EXPENSE" as const },
  { id: "cat-2", name: "Salary", color: "#4ECDC4", type: "INCOME" as const },
];

const createMutate = vi.fn();
const updateMutate = vi.fn();

vi.mock("@/hooks/queries/useCategories", () => ({
  useCategories: vi.fn(() => ({
    data: mockCategories,
    isLoading: false,
    isError: false,
  })),
}));

vi.mock("@/hooks/mutations/useCreateTransaction", () => ({
  useCreateTransaction: vi.fn(() => ({
    mutate: createMutate,
    isPending: false,
  })),
}));

vi.mock("@/hooks/mutations/useUpdateTransaction", () => ({
  useUpdateTransaction: vi.fn(() => ({
    mutate: updateMutate,
    isPending: false,
  })),
}));

import { useCategories } from "@/hooks/queries/useCategories";

const mockTransaction: Transaction = {
  id: "txn-1",
  title: "Weekly Groceries",
  amount: 50.25,
  type: "EXPENSE",
  date: new Date("2026-01-15"),
  categoryId: "cat-1",
  userId: "user-1",
  isRecurring: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const defaultProps = {
  onSuccess: vi.fn(),
  onCancel: vi.fn(),
};

describe("TransactionForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Radix Switch uses ResizeObserver which is lost after vi.restoreAllMocks()
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.mocked(useCategories).mockReturnValue({
      data: mockCategories,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useCategories>);
    createMutate.mockReset();
    updateMutate.mockReset();
    defaultProps.onSuccess.mockReset();
    defaultProps.onCancel.mockReset();
  });

  describe("Add Mode", () => {
    it("renders add mode heading and button", () => {
      renderWithProviders(<TransactionForm {...defaultProps} />);

      expect(screen.getByText("Add New Transaction")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /add transaction/i }),
      ).toBeInTheDocument();
    });

    it("shows validation errors on empty submit", async () => {
      renderWithProviders(<TransactionForm {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /add transaction/i }));

      expect(await screen.findByText("Title is required")).toBeInTheDocument();
      expect(screen.getByText("Amount is required")).toBeInTheDocument();
      expect(screen.getByText("Category is required")).toBeInTheDocument();
    });

    it("shows amount validation error for invalid input", async () => {
      renderWithProviders(<TransactionForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/title/i), "Test");
      await user.type(screen.getByLabelText(/amount/i), "abc");
      await user.selectOptions(screen.getByLabelText(/category/i), "cat-1");
      await user.click(screen.getByRole("button", { name: /add transaction/i }));

      expect(
        await screen.findByText(/please enter a valid amount/i),
      ).toBeInTheDocument();
    });

    it("calls createTransaction.mutate on valid submit", async () => {
      renderWithProviders(<TransactionForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/title/i), "Coffee");
      await user.type(screen.getByLabelText(/amount/i), "4.50");
      await user.selectOptions(screen.getByLabelText(/category/i), "cat-1");
      await user.click(screen.getByRole("button", { name: /add transaction/i }));

      await waitFor(() => {
        expect(createMutate).toHaveBeenCalledTimes(1);
      });

      const callArgs = createMutate.mock.calls[0][0];
      expect(callArgs).toMatchObject({
        title: "Coffee",
        amount: 4.5,
        type: "EXPENSE",
        categoryId: "cat-1",
      });
      expect(updateMutate).not.toHaveBeenCalled();
    });

    it("cancel button calls onCancel", async () => {
      renderWithProviders(<TransactionForm {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /cancel/i }));

      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edit Mode", () => {
    it("renders edit mode heading and button", () => {
      renderWithProviders(
        <TransactionForm {...defaultProps} transaction={mockTransaction} />,
      );

      expect(screen.getByText("Edit Transaction")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /update transaction/i }),
      ).toBeInTheDocument();
    });

    it("pre-populates form with transaction data", () => {
      renderWithProviders(
        <TransactionForm {...defaultProps} transaction={mockTransaction} />,
      );

      expect(screen.getByLabelText(/title/i)).toHaveValue("Weekly Groceries");
      expect(screen.getByLabelText(/amount/i)).toHaveValue("50.25");
    });

    it("calls updateTransaction.mutate on valid submit", async () => {
      renderWithProviders(
        <TransactionForm {...defaultProps} transaction={mockTransaction} />,
      );

      const titleInput = screen.getByLabelText(/title/i);
      await user.clear(titleInput);
      await user.type(titleInput, "Updated Groceries");
      await user.click(screen.getByRole("button", { name: /update transaction/i }));

      await waitFor(() => {
        expect(updateMutate).toHaveBeenCalledTimes(1);
      });

      const callArgs = updateMutate.mock.calls[0][0];
      expect(callArgs.id).toBe("txn-1");
      expect(callArgs.updates).toMatchObject({
        title: "Updated Groceries",
        amount: 50.25,
        type: "EXPENSE",
        categoryId: "cat-1",
      });
      expect(createMutate).not.toHaveBeenCalled();
    });
  });

  describe("Categories Error State", () => {
    it("shows error fallback when categories fail to load", () => {
      vi.mocked(useCategories).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      } as unknown as ReturnType<typeof useCategories>);

      renderWithProviders(<TransactionForm {...defaultProps} />);

      expect(screen.getByText("Failed to Load Categories")).toBeInTheDocument();
      expect(screen.queryByLabelText(/title/i)).not.toBeInTheDocument();
    });
  });
});
