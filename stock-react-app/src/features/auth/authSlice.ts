import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export interface User {
  id: string;
  email: string;
  name: string;
  color?: string;
  birth?: string;
  available_cash?: number;
}

export interface AuthState {
  loginSuccess: boolean;
  user: User;
}

const initialState: AuthState = {
  loginSuccess: false,
  user: {
    id: '',
    email: '',
    name: '',
    available_cash: 0,
  },
};

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLoginSuccess: (state) => {
      state.loginSuccess = true;
    },
    setLoginFailure: (state) => {
      state.loginSuccess = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setLoginSuccess, setLoginFailure, setUser } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectLoginSuccess = (state: RootState) => state.auth.loginSuccess;
export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
