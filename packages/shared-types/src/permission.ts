export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard:view',

  // Accounts
  ACCOUNTS_VIEW_OWN: 'accounts:view_own',
  ACCOUNTS_VIEW_ALL: 'accounts:view_all',

  // Transactions
  TRANSACTIONS_VIEW_OWN: 'transactions:view_own',
  TRANSACTIONS_VIEW_ALL: 'transactions:view_all',

  // Transfer
  TRANSFER_CREATE: 'transfer:create',

  // Profile
  PROFILE_VIEW: 'profile:view',
  PROFILE_EDIT: 'profile:edit',

  // Admin
  USERS_VIEW: 'users:view',
  USERS_MANAGE: 'users:manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  user: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.ACCOUNTS_VIEW_OWN,
    PERMISSIONS.TRANSACTIONS_VIEW_OWN,
    PERMISSIONS.TRANSFER_CREATE,
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_EDIT,
  ],
  admin: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.ACCOUNTS_VIEW_OWN,
    PERMISSIONS.ACCOUNTS_VIEW_ALL,
    PERMISSIONS.TRANSACTIONS_VIEW_OWN,
    PERMISSIONS.TRANSACTIONS_VIEW_ALL,
    PERMISSIONS.TRANSFER_CREATE,
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_EDIT,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_MANAGE,
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: string, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Get all permissions for a role
 */
export function getPermissions(role: string): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
