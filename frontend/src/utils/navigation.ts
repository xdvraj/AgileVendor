import type { NavItem } from '@/types';

export const primaryNav: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: 'DB' },
  { label: 'Vendors', to: '/vendors', icon: 'VN' },
  { label: 'RFQs', to: '/rfqs', icon: 'RQ' },
  { label: 'Approvals', to: '/approvals', icon: 'AP' },
  { label: 'Purchase Orders', to: '/purchase-orders', icon: 'PO' },
  { label: 'Invoices', to: '/invoices', icon: 'IN' }
];

export const secondaryNav: NavItem[] = [
  { label: 'Vendor RFQs', to: '/vendor/rfqs', icon: 'VP' },
  { label: 'Activity Logs', to: '/activity-logs', icon: 'LG' },
  { label: 'Reports', to: '/reports', icon: 'RP' }
];
