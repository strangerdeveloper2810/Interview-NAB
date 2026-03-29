import { type FC, type JSX } from 'react';
import { Navigate } from 'react-router';
import { RoutesApp } from '../constants/route';
import useAuthStore from '../stores/authStore';

interface IGuestRoute {
  children: JSX.Element;
}

const GuestRoute: FC<IGuestRoute> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={RoutesApp.DASHBOARD} replace />;
  }

  return children;
};

export default GuestRoute;
