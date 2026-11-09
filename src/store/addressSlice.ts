import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { LOCATIONS } from '../data/mockData';
import type { Address } from '../types';
import { loadFromStorage, STORAGE_KEYS } from '../utils/storage';
import type { RootState } from './index';

interface AddressState {
  addresses: Address[];
  selectedAddressId: string | null;
  deliveryLocation: string; // city shown in the header
}

const initialState: AddressState = loadFromStorage<AddressState>(STORAGE_KEYS.address, {
  addresses: [],
  selectedAddressId: null,
  deliveryLocation: LOCATIONS[0],
});

// Only one address may be the default.
function makeOnlyOneDefault(addresses: Address[], defaultId: string) {
  addresses.forEach((address) => {
    address.isDefault = address.id === defaultId;
  });
}

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    addAddress(state, action: PayloadAction<Address>) {
      const isFirst = state.addresses.length === 0;
      state.addresses.push({ ...action.payload, isDefault: action.payload.isDefault || isFirst });
      if (action.payload.isDefault || isFirst) makeOnlyOneDefault(state.addresses, action.payload.id);
      state.selectedAddressId = action.payload.id; // select the new address
    },
    updateAddress(state, action: PayloadAction<Address>) {
      const index = state.addresses.findIndex((address) => address.id === action.payload.id);
      if (index === -1) return;
      state.addresses[index] = action.payload;
      if (action.payload.isDefault) makeOnlyOneDefault(state.addresses, action.payload.id);
    },
    deleteAddress(state, action: PayloadAction<string>) {
      const deleted = state.addresses.find((address) => address.id === action.payload);
      state.addresses = state.addresses.filter((address) => address.id !== action.payload);
      // If we deleted the default address, make the first remaining one the default.
      if (deleted?.isDefault && state.addresses.length > 0) state.addresses[0].isDefault = true;
      if (state.selectedAddressId === action.payload) {
        const fallback = state.addresses.find((address) => address.isDefault) ?? state.addresses[0];
        state.selectedAddressId = fallback ? fallback.id : null;
      }
    },
    selectAddress(state, action: PayloadAction<string>) {
      state.selectedAddressId = action.payload;
    },
    setDefaultAddress(state, action: PayloadAction<string>) {
      makeOnlyOneDefault(state.addresses, action.payload);
    },
    setDeliveryLocation(state, action: PayloadAction<string>) {
      state.deliveryLocation = action.payload;
    },
  },
});

export const {
  addAddress,
  updateAddress,
  deleteAddress,
  selectAddress,
  setDefaultAddress,
  setDeliveryLocation,
} = addressSlice.actions;

// ---------- Selectors ----------
export const selectAddresses = (state: RootState) => state.address.addresses;
export const selectSelectedAddressId = (state: RootState) => state.address.selectedAddressId;
export const selectDeliveryLocation = (state: RootState) => state.address.deliveryLocation;
export const selectSelectedAddress = (state: RootState): Address | undefined =>
  state.address.addresses.find((address) => address.id === state.address.selectedAddressId);

export default addressSlice.reducer;
