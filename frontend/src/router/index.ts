import { createRouter, createWebHistory } from 'vue-router';

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
          meta: { title: 'Sign In' }
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('@/pages/SignupPage.vue'),
          meta: { title: 'Create Account' }
        }
      ]
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
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
          meta: { title: 'Vendors' }
        },
        {
          path: 'vendors/create',
          name: 'vendor-create',
          component: () => import('@/pages/VendorCreatePage.vue'),
          meta: { title: 'Create Vendor' }
        },
        {
          path: 'vendors/:id',
          name: 'vendor-detail',
          component: () => import('@/pages/VendorDetailPage.vue'),
          meta: { title: 'Vendor Profile' }
        },
        {
          path: 'rfqs',
          name: 'rfqs',
          component: () => import('@/pages/RfqsPage.vue'),
          meta: { title: 'RFQs' }
        },
        {
          path: 'rfqs/create',
          name: 'rfq-create',
          component: () => import('@/pages/RfqCreatePage.vue'),
          meta: { title: 'Create RFQ' }
        },
        {
          path: 'rfqs/:id',
          name: 'rfq-detail',
          component: () => import('@/pages/RfqDetailPage.vue'),
          meta: { title: 'RFQ Detail' }
        },
        {
          path: 'rfqs/:id/compare',
          name: 'rfq-compare',
          component: () => import('@/pages/RfqComparePage.vue'),
          meta: { title: 'Compare Quotes' }
        },
        {
          path: 'vendor/rfqs',
          name: 'vendor-rfqs',
          component: () => import('@/pages/VendorRfqsPage.vue'),
          meta: { title: 'Vendor RFQs' }
        },
        {
          path: 'approvals',
          name: 'approvals',
          component: () => import('@/pages/ApprovalsPage.vue'),
          meta: { title: 'Approvals' }
        },
        {
          path: 'purchase-orders',
          name: 'purchase-orders',
          component: () => import('@/pages/PurchaseOrdersPage.vue'),
          meta: { title: 'Purchase Orders' }
        },
        {
          path: 'invoices',
          name: 'invoices',
          component: () => import('@/pages/InvoicesPage.vue'),
          meta: { title: 'Invoices' }
        },
        {
          path: 'activity-logs',
          name: 'activity-logs',
          component: () => import('@/pages/ActivityLogsPage.vue'),
          meta: { title: 'Activity Logs' }
        },
        {
          path: 'reports',
          name: 'reports',
          component: () => import('@/pages/ReportsPage.vue'),
          meta: { title: 'Reports' }
        }
      ]
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

router.afterEach((to) => {
  document.title = `${to.meta.title ?? 'VendorBridge'} | VendorBridge ERP`;
});

export default router;
