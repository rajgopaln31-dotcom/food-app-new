import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { loadFromStorage, STORAGE_KEYS } from '../utils/storage';
import type { RootState } from './index';

interface FavouriteState {
  restaurantIds: string[];
}

const initialState: FavouriteState = {
  restaurantIds: loadFromStorage<string[]>(STORAGE_KEYS.favourites, []),
};

const favouriteSlice = createSlice({
  name: 'favourite',
  initialState,
  reducers: {
    // Add the restaurant if it is not a favourite yet, otherwise remove it.
    toggleFavourite(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.restaurantIds = state.restaurantIds.includes(id)
        ? state.restaurantIds.filter((savedId) => savedId !== id)
        : [...state.restaurantIds, id];
    },
  },
});

export const { toggleFavourite } = favouriteSlice.actions;
export const selectFavouriteIds = (state: RootState) => state.favourite.restaurantIds;

export default favouriteSlice.reducer;
