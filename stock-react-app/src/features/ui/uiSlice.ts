import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface UIState {
  orderModalOpen: boolean;
  uiLoading: boolean;
}

const initialState: UIState = {
  orderModalOpen: false,
  uiLoading: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUiLoading: (state) => {
      state.uiLoading = !state.uiLoading;
    },
    setOrderModalOpen: (state) => {
      state.orderModalOpen = !state.orderModalOpen;
    },
  },
});

export const { setUiLoading, setOrderModalOpen } = uiSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectOrderModalOpen = (state: RootState) =>
  state.ui.orderModalOpen;
export const selectUiLoading = (state: RootState) => state.ui.uiLoading;

export default uiSlice.reducer;
