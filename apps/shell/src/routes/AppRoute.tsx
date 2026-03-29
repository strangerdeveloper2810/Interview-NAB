import { Suspense, lazy, type FC, type JSX } from 'react';
import { useRoutes, Navigate, type RouteObject } from 'react-router';
import { PERMISSIONS } from '@nab/shared-types';
import { HomeLayout, AuthLayout } from '../layouts';
import { RoutesApp } from '../constants/route';
import ProtectedRoute from './ProtectedRoute';

// Lazy load pages

// Auth
const LoginLazy = lazy(() => import('../pages/Auth/Login'));
const RegisterLazy = lazy(() => import('../pages/Auth/Register'));

// App
const HomeLazy = lazy(() => import('../pages/Home'));
const DashboardLazy = lazy(() => import('../pages/Dashboard'));
const AccountsLazy = lazy(() => import('../pages/Accounts'));
const AccountDetailLazy = lazy(() => import('../pages/AccountDetail'));
const TransferLazy = lazy(() => import('../pages/Transfer'));
const ProfileLazy = lazy(() => import('../pages/Profile'));

// Admin
const AdminUsersLazy = lazy(() => import('../pages/Admin/Users'));

const routes: RouteObject[] = [
  // Public - Auth routes
  {
    element: <AuthLayout />,
    children: [
      { path: RoutesApp.LOGIN, element: <LoginLazy /> },
      { path: RoutesApp.REGISTER, element: <RegisterLazy /> },
    ],
  },

  // Protected - App routes
  {
    element: (
      <ProtectedRoute>
        <HomeLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: RoutesApp.HOME, element: <HomeLazy /> },
      { path: RoutesApp.DASHBOARD, element: <DashboardLazy /> },
      { path: RoutesApp.ACCOUNTS, element: <AccountsLazy /> },
      { path: RoutesApp.ACCOUNT_DETAIL, element: <AccountDetailLazy /> },
      { path: RoutesApp.TRANSFER, element: <TransferLazy /> },
      { path: RoutesApp.PROFILE, element: <ProfileLazy /> },
    ],
  },

  // Admin routes
  {
    element: (
      <ProtectedRoute requiredPermission={PERMISSIONS.USERS_VIEW}>
        <HomeLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: RoutesApp.ADMIN_USERS, element: <AdminUsersLazy /> },
    ],
  },

  // Catch all
  { path: '*', element: <Navigate to={RoutesApp.HOME} replace /> },
];

const AppRoute: FC = (): JSX.Element => {
  const element = useRoutes(routes);

  return <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>;
};

export default AppRoute;
