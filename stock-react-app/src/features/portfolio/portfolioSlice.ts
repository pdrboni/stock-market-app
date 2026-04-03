import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface Position {
  symbol: string;
  quantity: number;
  avgPrice: number;
}

interface PortfolioState {
  balance: number;
  positions: Position[];
}

const initialState: PortfolioState = {
  positions: [],
  balance: 0,
};

export const portfolioSlice = createSlice({
  name: 'portfolio',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    buyStock: (state) => {
      // essa função atualiza o portfólio após a ordem de compra ser execuatada pelo backend
    },
    sellStock: (state) => {
      // essa função atualiza o portfólio após a ordem de venda ser execuatada pelo backend
    },
    depositMoney: (state) => {
      // aqui vai a chamada da API para atualizar o valor na carteira do usuário.
    },
  },
});

export const { buyStock, sellStock, depositMoney } = portfolioSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPositions = (state: RootState) => state.portfolio.positions;
export const selectBalance = (state: RootState) => state.portfolio.balance;

export default portfolioSlice.reducer;
