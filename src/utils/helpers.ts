// Small general purpose helper functions.

// Wait for some milliseconds. Used by the mock services to imitate a slow network.
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Make a (practically) unique id.
export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// 249 -> "₹249", 249.5 -> "₹249.50"
export const formatPrice = (amount: number): string =>
  Number.isInteger(amount) ? `₹${amount}` : `₹${amount.toFixed(2)}`;

// Round to 2 decimal places (avoids 0.1 + 0.2 style problems).
export const roundMoney = (amount: number): number => Math.round(amount * 100) / 100;

// Safely get a readable message from anything that was thrown (Error, Redux error object, ...).
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return 'Something went wrong. Please try again.';
}
