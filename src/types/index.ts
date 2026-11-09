// All TypeScript types (interfaces) used in the project live in this one file.

export type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

// ---------- Auth ----------
export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
}

// Only used by the mock auth service (a real backend never sends passwords back).
export interface StoredUser extends User {
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

// ---------- Restaurants & food ----------
export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  deliveryTime: number; // minutes
  priceForTwo: number; // rupees
  cuisines: string[];
  categoryIds: string[];
  offer?: string;
  isVegOnly: boolean;
}

// A choice such as "Large" or "Extra Cheese". "price" is the extra amount.
export interface Option {
  id: string;
  name: string;
  price: number;
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  menuCategory: string; // e.g. "Pizzas", "Drinks"
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  available: boolean;
  recommended: boolean;
  sizes?: Option[]; // choose one
  addOns?: Option[]; // choose many
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  couponCode: string;
  image: string;
}

// ---------- Coupons & cart ----------
export type CouponType = 'percent' | 'flat' | 'freeDelivery';

export interface Coupon {
  code: string;
  description: string;
  type: CouponType;
  value: number;
  minOrder: number;
  maxDiscount?: number;
}

export interface CartItem {
  cartId: string; // unique per food + size + add-ons
  foodId: string;
  restaurantId: string;
  name: string;
  image: string;
  isVeg: boolean;
  sizeName?: string;
  addOnNames: string[];
  unitPrice: number; // price of ONE item including size and add-ons
  quantity: number;
}

export interface PriceBreakdown {
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  tax: number;
  total: number;
}

// ---------- Address ----------
export interface Address {
  id: string;
  fullName: string;
  mobile: string;
  houseNumber: string;
  street: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  instructions: string;
  isDefault: boolean;
}

export type AddressFormValues = Omit<Address, 'id'>;

// ---------- Payment & orders ----------
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export interface PaymentRequest {
  method: PaymentMethod;
  amount: number;
  upiId?: string;
  cardNumber?: string;
}

export interface PaymentResult {
  transactionId: string;
}

export interface NewOrderInput {
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  address: Address;
  price: PriceBreakdown;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pay on Delivery';
}

export interface Order extends NewOrderInput {
  id: string;
  createdAt: number; // timestamp in milliseconds
  estimatedMinutes: number;
}
