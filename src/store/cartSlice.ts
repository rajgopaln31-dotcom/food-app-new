import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../types';
import { MAX_QUANTITY, calculateTotals } from '../utils/pricing';
import { loadFromStorage, STORAGE_KEYS } from '../utils/storage';
import type { RootState } from './index';

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  couponCode: string | null;
}

const emptyCart: CartState = { items: [], restaurantId: null, restaurantName: null, couponCode: null };

// The cart is loaded from localStorage so it is still there after a refresh.
const initialState: CartState = loadFromStorage<CartState>(STORAGE_KEYS.cart, emptyCart);

interface AddItemPayload {
  restaurantName: string;
  item: CartItem;
}

// If the last item was removed, forget the restaurant and coupon too.
function resetIfEmpty(state: CartState) {
  if (state.items.length === 0) {
    state.restaurantId = null;
    state.restaurantName = null;
    state.couponCode = null;
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<AddItemPayload>) {
      const { item, restaurantName } = action.payload;
      state.restaurantId = item.restaurantId;
      state.restaurantName = restaurantName;
      const existing = state.items.find((cartItem) => cartItem.cartId === item.cartId);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + item.quantity, MAX_QUANTITY);
      } else {
        state.items.push(item);
      }
    },
    // Used when the user agrees to throw away a cart from another restaurant.
    replaceCart(state, action: PayloadAction<AddItemPayload>) {
      state.items = [action.payload.item];
      state.restaurantId = action.payload.item.restaurantId;
      state.restaurantName = action.payload.restaurantName;
      state.couponCode = null;
    },
    increaseQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find((cartItem) => cartItem.cartId === action.payload);
      if (item && item.quantity < MAX_QUANTITY) item.quantity += 1;
    },
    decreaseQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find((cartItem) => cartItem.cartId === action.payload);
      if (!item) return;
      item.quantity -= 1;
      if (item.quantity <= 0) {
        state.items = state.items.filter((cartItem) => cartItem.cartId !== action.payload);
      }
      resetIfEmpty(state);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((cartItem) => cartItem.cartId !== action.payload);
      resetIfEmpty(state);
    },
    applyCoupon(state, action: PayloadAction<string>) {
      state.couponCode = action.payload;
    },
    removeCoupon(state) {
      state.couponCode = null;
    },
    clearCart() {
      return emptyCart;
    },
  },
});

export const {
  addItem,
  replaceCart,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  applyCoupon,
  removeCoupon,
  clearCart,
} = cartSlice.actions;

// ---------- Selectors ----------
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartRestaurantId = (state: RootState) => state.cart.restaurantId;
export const selectCartRestaurantName = (state: RootState) => state.cart.restaurantName;
export const selectCouponCode = (state: RootState) => state.cart.couponCode;

// Total number of items (shown on the cart icon badge).
export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
);

// Subtotal, discount, delivery, tax and total. Recalculated only when the cart changes.
export const selectPriceBreakdown = createSelector(
  [selectCartItems, selectCouponCode],
  (items, couponCode) => calculateTotals(items, couponCode),
);

export default cartSlice.reducer;
