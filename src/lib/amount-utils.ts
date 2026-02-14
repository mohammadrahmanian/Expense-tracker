import { ChangeEvent } from "react";

/**
 * Creates an amount change handler that validates input to allow only valid amount formats
 * @param setAmount - State setter function for the amount value
 * @returns Change event handler for amount input fields
 */
export const createAmountChangeHandler = (
  setAmount: (value: string) => void,
) => {
  return (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow digits, whitespace, and at most one comma or period as decimal separator
    if (/^\s*\d*[,.]?\d*\s*$/.test(value)) {
      setAmount(value);
    }
  };
};

/**
 * Normalizes amount string by replacing comma with period for decimal separator
 * @param value - The amount string to normalize
 * @returns Normalized amount string with period as decimal separator
 */
export const normalizeAmount = (value: string): string => {
  // Replace comma with period for decimal separator
  return value.replace(",", ".");
};

/**
 * Parses and validates an amount string, returning a number or null if invalid
 * @param value - The amount string to parse
 * @returns Parsed number or null if invalid
 */
export const parseAmount = (value: string): number | null => {
  const normalized = normalizeAmount(value.trim());
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? null : parsed;
};
