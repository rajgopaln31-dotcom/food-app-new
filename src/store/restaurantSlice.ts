import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchRestaurantData } from '../services/restaurantService';
import type { Category, FoodItem, LoadStatus, Restaurant } from '../types';
import type { RootState } from './index';

interface RestaurantState {
  categories: Category[];
  restaurants: Restaurant[];
  foodItems: FoodItem[];
  status: LoadStatus;
  error: string | null;
}

const initialState: RestaurantState = {
  categories: [],
  restaurants: [],
  foodItems: [],
  status: 'idle',
  error: null,
};

export const loadRestaurantData = createAsyncThunk('restaurant/load', async () =>
  fetchRestaurantData(),
);

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadRestaurantData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadRestaurantData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload.categories;
        state.restaurants = action.payload.restaurants;
        state.foodItems = action.payload.foodItems;
      })
      .addCase(loadRestaurantData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Could not load restaurants';
      });
  },
});

// ---------- Selectors: small functions that read data from the store ----------
export const selectCategories = (state: RootState) => state.restaurant.categories;
export const selectRestaurants = (state: RootState) => state.restaurant.restaurants;
export const selectFoodItems = (state: RootState) => state.restaurant.foodItems;
export const selectRestaurantStatus = (state: RootState) => state.restaurant.status;
export const selectRestaurantError = (state: RootState) => state.restaurant.error;

export default restaurantSlice.reducer;
