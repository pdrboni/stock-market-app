import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface AuthState {
  loginSuccess: boolean;
}

const initialState: AuthState = {
  loginSuccess: false,
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
  },
});

export const { setLoginSuccess, setLoginFailure } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectLoginSuccess = (state: RootState) => state.auth.loginSuccess;

export default authSlice.reducer;
