import type { PaymentRequest, PaymentResult } from '../types';
import { generateId } from '../utils/helpers';

// MOCK payment gateway. No real money is used and no card data leaves the browser.
// Demo rules to test the failure screen:
//   - a card number ending with 0000 is declined
//   - a UPI id starting with "fail" is declined

export class PaymentCancelledError extends Error {
  constructor() {
    super('Payment was cancelled');
    this.name = 'PaymentCancelledError';
  }
}

export function processPayment(request: PaymentRequest, signal: AbortSignal): Promise<PaymentResult> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const cardDeclined = request.method === 'card' && (request.cardNumber ?? '').replace(/\s/g, '').endsWith('0000');
      const upiDeclined = request.method === 'upi' && (request.upiId ?? '').toLowerCase().startsWith('fail');
      if (cardDeclined || upiDeclined) {
        reject(new Error('Payment failed: the bank declined the transaction. Please try again.'));
        return;
      }
      resolve({ transactionId: `TXN${generateId()}` });
    }, 2500);

    // The user pressed "Cancel payment" while we were waiting.
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new PaymentCancelledError());
    });
  });
}
