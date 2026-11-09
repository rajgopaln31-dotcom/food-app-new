import type { NewOrderInput, Order } from '../types';
import { delay } from '../utils/helpers';

// MOCK order API: creates an order and gives it an id.
// A real backend would save the order in a database and return it.
export async function createOrderRequest(input: NewOrderInput): Promise<Order> {
  await delay(800);
  const randomPart = Math.floor(10000000 + Math.random() * 90000000);
  return {
    ...input,
    id: `FD${randomPart}`,
    createdAt: Date.now(),
    estimatedMinutes: 35,
  };
}
