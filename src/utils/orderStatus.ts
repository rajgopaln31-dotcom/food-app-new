// The six order statuses, in order.
export const ORDER_STATUSES = [
  'Order Placed',
  'Order Confirmed',
  'Preparing',
  'Ready for Pickup',
  'On the Way',
  'Delivered',
] as const;

// This is SIMULATED (mock) tracking: there is no real backend, so the status
// moves forward by itself every STEP_SECONDS seconds after the order was placed.
// With a real backend you would call an API here instead.
export const STEP_SECONDS = 15;

export function getStatusIndex(createdAt: number, now: number = Date.now()): number {
  const secondsPassed = Math.floor((now - createdAt) / 1000);
  const index = Math.floor(secondsPassed / STEP_SECONDS);
  return Math.min(Math.max(index, 0), ORDER_STATUSES.length - 1);
}
