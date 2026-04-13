import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice.ts';
import stocksReducer from './features/stocks/stocksSlice.ts';
import uiReducer from './features/ui/uiSlice.ts';
import ordersReducer from './features/orders/ordersSlice.ts';
//import portfolioReducer from './features/portfolio/portfolioSlice.ts';
import authReducer from './features/auth/authSlice.ts';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    orders: ordersReducer,
    ui: uiReducer,
    stocks: stocksReducer,
    auth: authReducer,
  },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
