import type { NavItem } from '@/types';

export const primaryNav: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: 'solar:widget-5-bold-duotone' },
  { label: 'Vendors', to: '/vendors', icon: 'solar:users-group-rounded-bold-duotone' },
  { label: 'RFQs', to: '/rfqs', icon: 'solar:document-text-bold-duotone' },
  { label: 'Vendor Portal', to: '/vendor/rfqs', icon: 'solar:shop-2-bold-duotone', exact: true },
  { label: 'Approvals', to: '/approvals', icon: 'solar:clipboard-check-bold-duotone' },
  { label: 'Purchase Orders', to: '/purchase-orders', icon: 'solar:bag-smile-bold-duotone' },
  { label: 'Invoices', to: '/invoices', icon: 'solar:bill-list-bold-duotone' },
  { label: 'Activity Logs', to: '/activity-logs', icon: 'solar:history-bold-duotone' },
  { label: 'Reports', to: '/reports', icon: 'solar:chart-square-bold-duotone' }
];
