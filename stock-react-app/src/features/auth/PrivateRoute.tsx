import { Navigate, Outlet } from 'react-router';

function getTokenFromCookies(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)tokenMoneyBuilder=([^;]+)/);
  return match ? match[1] : null;
}

export default function PrivateRoute() {
  const token = getTokenFromCookies();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
