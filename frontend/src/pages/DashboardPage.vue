<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Dashboard"
      title="VendorBridge command center"
      description="Track sourcing momentum, vendor operations, approvals, and spend from one focused procurement workspace."
    >
      <template #actions>
        <RouterLink to="/rfqs/create" class="btn-primary">Create RFQ</RouterLink>
      </template>
    </PageHeader>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="card in analyticsCards"
        :key="card.label"
        class="panel overflow-hidden"
      >
        <div class="flex items-start justify-between gap-4 px-6 py-5">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {{ card.label }}
            </p>
            <p class="mt-3 text-3xl font-semibold text-slate-950">
              {{ card.value }}
            </p>
            <p class="mt-2 text-sm leading-6 text-slate-500">
              {{ card.description }}
            </p>
          </div>

          <div :class="card.iconShellClass" class="flex h-12 w-12 items-center justify-center rounded-2xl">
            <Icon :icon="card.icon" class="h-6 w-6" />
          </div>
        </div>
      </article>
    </section>

    <AppCard
      title="Quick actions"
      subtitle="Jump straight into the most common procurement workflows"
    >
      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <RouterLink
          v-for="action in quickActions"
          :key="action.label"
          :to="action.to"
          class="group rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-white"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-slate-900">{{ action.label }}</p>
              <p class="mt-1 text-sm text-slate-500">{{ action.description }}</p>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm ring-1 ring-slate-200 transition group-hover:bg-brand-50">
              <Icon :icon="action.icon" class="h-5 w-5" />
            </div>
          </div>
        </RouterLink>
      </div>
    </AppCard>

    <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <AppCard title="Recent activity" subtitle="Live workflow signals across sourcing, approvals, and billing">
        <div class="space-y-4">
          <div
            v-for="item in recentActivity"
            :key="item.id"
            class="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4"
          >
            <div :class="item.iconShellClass" class="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
              <Icon :icon="item.icon" class="h-5 w-5" />
            </div>

            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <p class="text-sm font-semibold text-slate-900">{{ item.title }}</p>
                <span class="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {{ item.tag }}
                </span>
              </div>
              <p class="mt-1 text-sm leading-6 text-slate-600">{{ item.description }}</p>
              <p class="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                {{ item.time }}
              </p>
            </div>
          </div>
        </div>
      </AppCard>

      <div class="space-y-6">
        <AppCard title="Recent purchase orders" subtitle="Latest PO movement requiring follow-through">
          <div class="space-y-4">
            <div
              v-for="purchaseOrder in recentPurchaseOrders"
              :key="purchaseOrder.id"
              class="rounded-2xl border border-slate-200 px-4 py-4"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-semibold text-slate-900">{{ purchaseOrder.id }}</p>
                  <p class="mt-1 text-sm text-slate-600">{{ purchaseOrder.vendorName }}</p>
                </div>
                <StatusBadge :label="purchaseOrder.status" />
              </div>
              <div class="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                <span>{{ purchaseOrder.owner }}</span>
                <span>{{ formatDate(purchaseOrder.deliveryDate) }}</span>
              </div>
              <p class="mt-3 text-lg font-semibold text-slate-950">{{ formatCurrency(purchaseOrder.total) }}</p>
            </div>
          </div>
        </AppCard>

        <AppCard title="Recent invoices" subtitle="Invoices that recently entered the procurement workflow">
          <div class="space-y-4">
            <div
              v-for="invoice in recentInvoices"
              :key="invoice.id"
              class="rounded-2xl border border-slate-200 px-4 py-4"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-semibold text-slate-900">{{ invoice.id }}</p>
                  <p class="mt-1 text-sm text-slate-600">{{ invoice.vendorName }}</p>
                </div>
                <StatusBadge :label="invoice.status" />
              </div>
              <div class="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                <span>{{ invoice.poNumber }}</span>
                <span>{{ formatDate(invoice.dueDate) }}</span>
              </div>
              <p class="mt-3 text-lg font-semibold text-slate-950">{{ formatCurrency(invoice.amount) }}</p>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { RouterLink } from 'vue-router';
import { approvals, invoices, purchaseOrders, rfqs } from '@/api/mockData';
import { fetchVendors } from '@/api/vendors';
import AppCard from '@/components/AppCard.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import type { Vendor } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';

const vendors = ref<Vendor[]>([]);

onMounted(async () => {
  try {
    vendors.value = await fetchVendors();
  } catch {
    vendors.value = [];
  }
});

const totalVendors = computed(() => vendors.value.length);
const activeRfqs = computed(() => rfqs.filter((rfq) => rfq.status !== 'Awarded').length);
const pendingApprovals = computed(() => approvals.filter((approval) => approval.status !== 'Approved').length);
const recentPurchaseOrders = computed(() => purchaseOrders.slice(0, 3));
const recentInvoices = computed(() => invoices.slice(0, 3));
const totalProcurementSpend = computed(() => vendors.value.reduce((sum, vendor) => sum + vendor.totalSpend, 0));

const analyticsCards = computed(() => [
  {
    label: 'Total Vendors',
    value: `${totalVendors.value}`,
    description: 'Suppliers currently tracked across sourcing and onboarding.',
    icon: 'solar:buildings-2-outline',
    iconShellClass: 'bg-sky-50 text-sky-700'
  },
  {
    label: 'Active RFQs',
    value: `${activeRfqs.value}`,
    description: 'Open sourcing events currently moving through quotation and evaluation.',
    icon: 'solar:document-add-outline',
    iconShellClass: 'bg-indigo-50 text-indigo-700'
  },
  {
    label: 'Pending Approvals',
    value: `${pendingApprovals.value}`,
    description: 'Approvals waiting for procurement, finance, or stakeholder action.',
    icon: 'solar:clipboard-check-outline',
    iconShellClass: 'bg-amber-50 text-amber-700'
  },
  {
    label: 'Recent Purchase Orders',
    value: `${recentPurchaseOrders.value.length}`,
    description: 'Latest purchase orders released or drafted in the current pipeline.',
    icon: 'solar:cart-large-2-outline',
    iconShellClass: 'bg-emerald-50 text-emerald-700'
  },
  {
    label: 'Recent Invoices',
    value: `${recentInvoices.value.length}`,
    description: 'New invoice entries now flowing through payment and reconciliation.',
    icon: 'solar:bill-list-outline',
    iconShellClass: 'bg-rose-50 text-rose-700'
  },
  {
    label: 'Total Procurement Spend',
    value: formatCurrency(totalProcurementSpend.value),
    description: 'Aggregate supplier spend across the current vendor portfolio.',
    icon: 'solar:wallet-money-outline',
    iconShellClass: 'bg-brand-50 text-brand-700'
  }
]);

const quickActions = [
  {
    label: 'Create RFQ',
    description: 'Launch a new request for quotation.',
    to: '/rfqs/create',
    icon: 'solar:add-circle-outline'
  },
  {
    label: 'Add Vendor',
    description: 'Register a supplier profile.',
    to: '/vendors/create',
    icon: 'solar:user-plus-outline'
  },
  {
    label: 'View Approvals',
    description: 'Review pending approval tasks.',
    to: '/approvals',
    icon: 'solar:checklist-minimalistic-outline'
  },
  {
    label: 'View Reports',
    description: 'Open analytics and reporting.',
    to: '/reports',
    icon: 'solar:chart-square-outline'
  }
];

const recentActivity = [
  {
    id: 'dashboard-activity-rfq',
    title: 'RFQ created',
    description: 'Bulk corrugated packaging refresh was opened for vendor participation.',
    time: '5 min ago',
    tag: 'Sourcing',
    icon: 'solar:file-text-outline',
    iconShellClass: 'bg-sky-50 text-sky-700'
  },
  {
    id: 'dashboard-activity-quote',
    title: 'Vendor quotation submitted',
    description: 'Northwind Industrial submitted pricing and delivery terms for RFQ-3003.',
    time: '18 min ago',
    tag: 'Vendor',
    icon: 'solar:chat-round-money-outline',
    iconShellClass: 'bg-emerald-50 text-emerald-700'
  },
  {
    id: 'dashboard-activity-approval',
    title: 'Approval pending',
    description: 'Award recommendation for RFQ-3003 is waiting on final approval review.',
    time: '32 min ago',
    tag: 'Approval',
    icon: 'solar:clock-circle-outline',
    iconShellClass: 'bg-amber-50 text-amber-700'
  },
  {
    id: 'dashboard-activity-po',
    title: 'Purchase order generated',
    description: 'PO-7102 was released to Northwind Industrial for execution.',
    time: '1 hour ago',
    tag: 'PO',
    icon: 'solar:cart-large-2-outline',
    iconShellClass: 'bg-indigo-50 text-indigo-700'
  },
  {
    id: 'dashboard-activity-invoice',
    title: 'Invoice sent',
    description: 'INV-4409 was issued and entered the invoice review queue.',
    time: '2 hours ago',
    tag: 'Invoice',
    icon: 'solar:bill-check-outline',
    iconShellClass: 'bg-rose-50 text-rose-700'
  }
];
</script>
