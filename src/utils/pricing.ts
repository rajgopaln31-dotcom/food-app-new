import type { CartItem, Coupon, PriceBreakdown } from '../types';
import { roundMoney } from './helpers';

// Business rules for prices. Change the numbers here to change the whole app.
export const DELIVERY_FEE = 40;
export const FREE_DELIVERY_ABOVE = 500;
export const TAX_RATE = 0.05; // 5% GST
export const MAX_QUANTITY = 10;

export const COUPONS: Coupon[] = [
  {
    code: 'WELCOME50',
    description: '50% off up to ₹100 on orders above ₹199',
    type: 'percent',
    value: 50,
    minOrder: 199,
    maxDiscount: 100,
  },
  {
    code: 'SAVE50',
    description: 'Flat ₹50 off on orders above ₹399',
    type: 'flat',
    value: 50,
    minOrder: 399,
  },
  {
    code: 'FREEDEL',
    description: 'Free delivery on orders above ₹299',
    type: 'freeDelivery',
    value: 0,
    minOrder: 299,
  },
];

export const findCoupon = (code: string | null): Coupon | undefined =>
  code ? COUPONS.find((coupon) => coupon.code === code.trim().toUpperCase()) : undefined;

// Money taken off by a coupon (0 if the order is too small for the coupon).
export function getCouponDiscount(coupon: Coupon | undefined, subtotal: number): number {
  if (!coupon || subtotal < coupon.minOrder) return 0;
  if (coupon.type === 'percent') {
    const amount = (subtotal * coupon.value) / 100;
    return roundMoney(Math.min(amount, coupon.maxDiscount ?? amount));
  }
  if (coupon.type === 'flat') return coupon.value;
  return 0;
}

// Calculates subtotal, discount, delivery, tax and the final total.
export function calculateTotals(items: CartItem[], couponCode: string | null): PriceBreakdown {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const coupon = findCoupon(couponCode);
  const discount = getCouponDiscount(coupon, subtotal);

  const freeByCoupon = coupon?.type === 'freeDelivery' && subtotal >= coupon.minOrder;
  const isFree = subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE || freeByCoupon;
  const deliveryCharge = isFree ? 0 : DELIVERY_FEE;

  const tax = roundMoney((subtotal - discount) * TAX_RATE);
  const total = roundMoney(subtotal - discount + deliveryCharge + tax);

  return { subtotal, discount, deliveryCharge, tax, total };
}
