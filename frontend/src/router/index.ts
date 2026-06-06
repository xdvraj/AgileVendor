import { createRouter, createWebHistory } from 'vue-router';
import { authRoutes } from '@/config/auth';
import { authState, ensureAuthLoaded } from '@/state/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/pages/LoginPage.vue'),
          meta: { title: 'Sign In', guestOnly: true }
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('@/pages/SignupPage.vue'),
          meta: { title: 'Create Account', guestOnly: true }
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: () => import('@/pages/ForgotPasswordPage.vue'),
          meta: { title: 'Reset Password', guestOnly: true }
        }
      ]
    },
    {
      path: '/',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/pages/DashboardPage.vue'),
          meta: { title: 'Dashboard' }
        },
        {
          path: 'vendors',
          name: 'vendors',
          component: () => import('@/pages/VendorsPage.vue'),
          meta: {
            title: 'Vendors',
            breadcrumb: [{ label: 'Vendors' }]
          }
        },
        {
          path: 'vendors/create',
          name: 'vendor-create',
          component: () => import('@/pages/VendorCreatePage.vue'),
          meta: {
            title: 'Create Vendor',
            breadcrumb: [
              { label: 'Vendors', to: '/vendors' },
              { label: 'Create Vendor' }
            ]
          }
        },
        {
          path: 'vendors/:id',
          name: 'vendor-detail',
          component: () => import('@/pages/VendorDetailPage.vue'),
          meta: {
            title: 'Vendor Profile',
            breadcrumb: [
              { label: 'Vendors', to: '/vendors' },
              { label: 'Vendor Profile' }
            ]
          }
        },
        {
          path: 'rfqs',
          name: 'rfqs',
          component: () => import('@/pages/RfqsPage.vue'),
          meta: {
            title: 'RFQs',
            breadcrumb: [{ label: 'RFQs' }]
          }
        },
        {
          path: 'rfqs/create',
          name: 'rfq-create',
          component: () => import('@/pages/RfqCreatePage.vue'),
          meta: {
            title: 'Create RFQ',
            breadcrumb: [
              { label: 'RFQs', to: '/rfqs' },
              { label: 'Create RFQ' }
            ]
          }
        },
        {
          path: 'rfqs/:id',
          name: 'rfq-detail',
          component: () => import('@/pages/RfqDetailPage.vue'),
          meta: {
            title: 'RFQ Detail',
            breadcrumb: [
              { label: 'RFQs', to: '/rfqs' },
              { label: 'RFQ Detail' }
            ]
          }
        },
        {
          path: 'rfqs/:id/compare',
          name: 'rfq-compare',
          component: () => import('@/pages/RfqComparePage.vue'),
          meta: {
            title: 'Compare Quotes',
            breadcrumb: [
              { label: 'RFQs', to: '/rfqs' },
              { label: 'RFQ Detail' },
              { label: 'Compare Quotes' }
            ]
          }
        },
        {
          path: 'vendor/rfqs',
          name: 'vendor-rfqs',
          component: () => import('@/pages/VendorRfqsPage.vue'),
          meta: {
            title: 'Vendor RFQs',
            breadcrumb: [{ label: 'Vendor RFQs' }]
          }
        },
        {
          path: 'approvals',
          name: 'approvals',
          component: () => import('@/pages/ApprovalsPage.vue'),
          meta: {
            title: 'Approvals',
            breadcrumb: [{ label: 'Approvals' }]
          }
        },
        {
          path: 'purchase-orders',
          name: 'purchase-orders',
          component: () => import('@/pages/PurchaseOrdersPage.vue'),
          meta: {
            title: 'Purchase Orders',
            breadcrumb: [{ label: 'Purchase Orders' }]
          }
        },
        {
          path: 'invoices',
          name: 'invoices',
          component: () => import('@/pages/InvoicesPage.vue'),
          meta: {
            title: 'Invoices',
            breadcrumb: [{ label: 'Invoices' }]
          }
        },
        {
          path: 'activity-logs',
          name: 'activity-logs',
          component: () => import('@/pages/ActivityLogsPage.vue'),
          meta: {
            title: 'Activity Logs',
            breadcrumb: [{ label: 'Activity Logs' }]
          }
        },
        {
          path: 'reports',
          name: 'reports',
          component: () => import('@/pages/ReportsPage.vue'),
          meta: {
            title: 'Reports',
            breadcrumb: [{ label: 'Reports' }]
          }
        }
      ]
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach(async (to) => {
  await ensureAuthLoaded();

  if (to.meta.requiresAuth && !authState.user) {
    return authRoutes.login;
  }

  if (to.meta.guestOnly && authState.user) {
    return authRoutes.dashboard;
  }
});

router.afterEach((to) => {
  document.title = `${to.meta.title ?? 'VendorBridge'} | VendorBridge ERP`;
});

export default router;
