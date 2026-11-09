import { configureStore } from '@reduxjs/toolkit';
import { saveToStorage, STORAGE_KEYS } from '../utils/storage';
import addressReducer from './addressSlice';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import favouriteReducer from './favouriteSlice';
import orderReducer from './orderSlice';
import restaurantReducer from './restaurantSlice';

// The Redux store holds the shared state of the whole app.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurant: restaurantReducer,
    cart: cartReducer,
    address: addressReducer,
    order: orderReducer,
    favourite: favouriteReducer,
  },
});

// Every time the state changes, save the important parts in localStorage (persistence).
store.subscribe(() => {
  const state = store.getState();
  saveToStorage(STORAGE_KEYS.user, state.auth.user);
  saveToStorage(STORAGE_KEYS.cart, state.cart);
  saveToStorage(STORAGE_KEYS.address, state.address);
  saveToStorage(STORAGE_KEYS.favourites, state.favourite.restaurantIds);
  saveToStorage(STORAGE_KEYS.orders, state.order.orders);
});

// Types used by the typed hooks in hooks.ts
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
