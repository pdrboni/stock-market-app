import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface UIState {
  selectedStock: string | null;
  orderModalOpen: boolean;
  uiLoading: boolean;
}

const initialState: UIState = {
  selectedStock: '',
  orderModalOpen: false,
  uiLoading: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSelectedStock: (state, action: PayloadAction<string | null>) => {
      // essa função define qual ação está selecionada
    },
    setUiLoading: (state) => {
      state.uiLoading = !state.uiLoading;
    },
    setOrderModalOpen: (state) => {
      state.orderModalOpen = !state.orderModalOpen;
    },
  },
});

export const { setSelectedStock, setUiLoading, setOrderModalOpen } =
  uiSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSelectedStock = (state: RootState) => state.ui.selectedStock;
export const selectOrderModalOpen = (state: RootState) =>
  state.ui.orderModalOpen;
export const selectUiLoading = (state: RootState) => state.ui.uiLoading;

export default uiSlice.reducer;
