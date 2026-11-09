import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { forgotPasswordRequest, loginRequest, registerRequest } from '../services/authService';
import type { LoadStatus, RegisterInput, User } from '../types';
import { loadFromStorage, STORAGE_KEYS } from '../utils/storage';

interface AuthState {
  user: User | null;
  status: LoadStatus;
  error: string | null;
}

const initialState: AuthState = {
  user: loadFromStorage<User | null>(STORAGE_KEYS.user, null),
  status: 'idle',
  error: null,
};

// "Thunks" are async actions. Each one has three states: pending, fulfilled, rejected.
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { identifier: string; password: string }) =>
    loginRequest(credentials.identifier, credentials.password),
);

export const registerUser = createAsyncThunk('auth/register', async (input: RegisterInput) =>
  registerRequest(input),
);

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email: string) =>
  forgotPasswordRequest(email),
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded'; // user must log in after registering
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Registration failed';
      })
      .addCase(forgotPassword.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
