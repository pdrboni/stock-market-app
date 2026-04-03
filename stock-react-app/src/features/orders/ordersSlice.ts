import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

type OrderType = 'buy' | 'sell';

interface Order {
  id: string;
  symbol: string;
  type: OrderType;
  quantity: number;
  price: number;
  status: 'pending' | 'executed' | 'cancelled';
}

interface OrdersState {
  orders: Order[];
}
const initialState: OrdersState = {
  orders: [],
};

export const ordersSlice = createSlice({
  name: 'orders',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    createOrder: (state) => {
      //aqui vai a chamada da API para criar a ordem de compra ou venda
    },
    executeOrder: (state) => {
      //aqui vai a chamada da API para executar a ordem de compra ou venda
    },
    cancelOrder: (state) => {
      //aqui vai a chamada da API para cancelar a ordem de compra ou venda
    },
  },
});

export const { createOrder, executeOrder, cancelOrder } = ordersSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectOrders = (state: RootState) => state.orders.orders;

export default ordersSlice.reducer;
