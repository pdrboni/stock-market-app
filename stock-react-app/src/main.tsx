import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './features/login/Home.tsx';
import Login from './features/login/Login.tsx';
import Dashboard from './features/dashboard/Dashboard.tsx';
import MyStocks from './features/stocks/MyStocks.tsx';
import Portfolio from './features/portfolio/Portfolio.tsx';
import Book from './features/book/Book.tsx';
import User from './features/user/User.tsx';
import PrivateRoute from './features/auth/PrivateRoute.tsx';
import { Provider } from 'react-redux';
import { store } from './store.ts';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="book" element={<Book />} />
          <Route path="user" element={<User />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>,
);
