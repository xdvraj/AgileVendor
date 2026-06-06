export const authRoutes = {
  login: '/login',
  signup: '/signup',
  forgotPassword: '/forgot-password',
  dashboard: '/dashboard'
} as const;

export const authRoles = ['Admin', 'Procurement Officer', 'Vendor', 'Approver'] as const;

export type AuthRole = (typeof authRoles)[number];
export type BackendAuthRole = 'admin' | 'procurement_officer' | 'vendor' | 'approver';

const backendRoleByLabel: Record<AuthRole, BackendAuthRole> = {
  Admin: 'admin',
  'Procurement Officer': 'procurement_officer',
  Vendor: 'vendor',
  Approver: 'approver'
};

const labelByBackendRole: Record<BackendAuthRole, AuthRole> = {
  admin: 'Admin',
  procurement_officer: 'Procurement Officer',
  vendor: 'Vendor',
  approver: 'Approver'
};

export const authValidation = {
  minPasswordLength: 6,
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
} as const;

export const authPlaceholders = {
  email: 'you@vendorbridge.example',
  password: 'Enter your password',
  createPassword: 'Create a password',
  confirmPassword: 'Re-enter your password',
  fullName: 'Enter your full name'
} as const;

export const authMessages = {
  invalidForm: 'Please correct the highlighted fields.',
  resetSent: 'Mock reset link sent. Please check your email inbox.'
} as const;

export const toBackendAuthRole = (role: AuthRole) => backendRoleByLabel[role];

export const fromBackendAuthRole = (role: BackendAuthRole) => labelByBackendRole[role];
