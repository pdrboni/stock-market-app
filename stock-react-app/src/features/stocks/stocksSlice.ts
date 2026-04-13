import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Stock } from '../../utils/stocks';

interface StocksState {
  stocks: Stock[];
  pinnedStocks: Stock[];
  loading: boolean;
  error: string | null;
  selectedStock?: Stock;
}

const initialState: StocksState = {
  stocks: [],
  pinnedStocks: [],
  loading: false,
  error: 'Error',
  selectedStock: undefined,
};

export const stocksSlice = createSlice({
  name: 'stocks',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setStocks: (state) => {
      //aqui vai a chamada da API para listar as ações
    },
    updateStockPrice: (state) => {
      //aqui vai a chamada da API para atualizar as ações
    },
    setLoading: (state) => {
      state.loading = !state.loading;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setPinnedStocks: (state, action: PayloadAction<Stock[]>) => {
      state.pinnedStocks = action.payload;
    },
    setSelectedStock: (state, action: PayloadAction<Stock>) => {
      state.selectedStock = action.payload;
    },
  },
});

export const {
  setStocks,
  updateStockPrice,
  setLoading,
  setError,
  setPinnedStocks,
  setSelectedStock,
} = stocksSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectStocks = (state: RootState) => state.stocks.stocks;
export const selectStocksLoading = (state: RootState) => state.stocks.loading;
export const selectStocksError = (state: RootState) => state.stocks.error;
export const selectPinnedStocks = (state: RootState) =>
  state.stocks.pinnedStocks;
export const selectSelectedStock = (state: RootState) =>
  state.stocks.selectedStock;

export default stocksSlice.reducer;
