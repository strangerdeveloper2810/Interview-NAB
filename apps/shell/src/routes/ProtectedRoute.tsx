import { type FC, type JSX } from 'react';
import { Navigate, useLocation } from 'react-router';
import { type Permission, hasPermission } from '@nab/shared-types';
import { RoutesApp } from '../constants/route';

interface IProtectedRoute {
  children: JSX.Element;
  requiredPermission?: Permission;
}

const ProtectedRoute: FC<IProtectedRoute> = ({
  children,
  requiredPermission,
}) => {
  const location = useLocation();

  // TODO: replace with useAuth() once authStore is ready
  const isAuthenticated = false;
  const isLoading = false;
  const userRole = '';

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={RoutesApp.LOGIN}
        state={{ returnUrl: location.pathname }}
        replace
      />
    );
  }

  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    return <Navigate to={RoutesApp.HOME} replace />;
  }

  return children;
};

export default ProtectedRoute;
