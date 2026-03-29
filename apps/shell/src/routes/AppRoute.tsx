import { Suspense, lazy, type FC, type JSX } from 'react';
import { useRoutes, Navigate, type RouteObject } from 'react-router';
import { PERMISSIONS } from '@nab/shared-types';
import { HomeLayout, AuthLayout } from '../layouts';
import { RoutesApp } from '../constants/route';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import { RemoteErrorBoundary } from '../components/RemoteErrorBoundary';

// Lazy load pages

// Auth
const LoginLazy = lazy(() => import('../pages/Auth/Login'));
const RegisterLazy = lazy(() => import('../pages/Auth/Register'));

// App (local)
const HomeLazy = lazy(() => import('../pages/Home'));
const ProfileLazy = lazy(() => import('../pages/Profile'));

// Remote modules (Module Federation)
const DashboardLazy = lazy(() => import('dashboard/DashboardPage'));
const AccountsLazy = lazy(() => import('accounts/AccountsPage'));
const AccountDetailLazy = lazy(() => import('accounts/AccountDetailPage'));
const TransferLazy = lazy(() => import('transfer/TransferPage'));

// Admin (Remote module)
const AdminUsersLazy = lazy(() => import('admin/AdminUsersPage'));
const AdminDashboardLazy = lazy(() => import('admin/AdminDashboardPage'));

const routes: RouteObject[] = [
  // Public - Auth routes (redirect to dashboard if already logged in)
  {
    element: (
      <GuestRoute>
        <AuthLayout />
      </GuestRoute>
    ),
    children: [
      { path: RoutesApp.LOGIN, element: <LoginLazy /> },
      { path: RoutesApp.REGISTER, element: <RegisterLazy /> },
    ],
  },

  // Protected - User routes
  {
    element: (
      <ProtectedRoute allowedRoles={['user']}>
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
      <ProtectedRoute allowedRoles={['admin']}>
        <HomeLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: RoutesApp.ADMIN_DASHBOARD, element: <AdminDashboardLazy /> },
      { path: RoutesApp.ADMIN_USERS, element: <AdminUsersLazy /> },
    ],
  },

  // Catch all
  { path: '*', element: <Navigate to={RoutesApp.HOME} replace /> },
];

const AppRoute: FC = (): JSX.Element => {
  const element = useRoutes(routes);

  return (
    <RemoteErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>
    </RemoteErrorBoundary>
  );
};

export default AppRoute;
