import { type FC, type JSX } from 'react';
import { Navigate, useLocation } from 'react-router';
import { type Permission, type UserRole, hasPermission } from '@nab/shared-types';
import { RoutesApp } from '../constants/route';
import useAuthStore from '../stores/authStore';

interface IProtectedRoute {
  children: JSX.Element;
  requiredPermission?: Permission;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: FC<IProtectedRoute> = ({
  children,
  requiredPermission,
  allowedRoles,
}) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const userRole = user?.role || '';

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

  // Role-based access
  if (allowedRoles && !allowedRoles.includes(userRole as UserRole)) {
    const redirectTo = userRole === 'admin' ? RoutesApp.ADMIN_DASHBOARD : RoutesApp.DASHBOARD;
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    return <Navigate to={RoutesApp.HOME} replace />;
  }

  return children;
};

export default ProtectedRoute;
