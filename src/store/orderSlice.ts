import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createOrderRequest } from '../services/orderService';
import type { LoadStatus, NewOrderInput, Order } from '../types';
import { loadFromStorage, STORAGE_KEYS } from '../utils/storage';
import type { RootState } from './index';

interface OrderState {
  orders: Order[]; // order history (newest first)
  status: LoadStatus;
  error: string | null;
}

const initialState: OrderState = {
  orders: loadFromStorage<Order[]>(STORAGE_KEYS.orders, []),
  status: 'idle',
  error: null,
};

// Creates the order. The Payment page only shows "success" after this finishes.
export const placeOrder = createAsyncThunk('order/place', async (input: NewOrderInput) =>
  createOrderRequest(input),
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders.unshift(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Could not place the order';
      });
  },
});

export const selectOrders = (state: RootState) => state.order.orders;
export const selectOrderById = (id: string | undefined) => (state: RootState) =>
  state.order.orders.find((order) => order.id === id);

export default orderSlice.reducer;
