<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Overview"
      title="Procurement overview"
      description="Review current sourcing activity, pending decisions, and recent operational movement from one clean workspace."
    >
      <template #actions>
        <RouterLink to="/rfqs/create" class="btn-secondary">Create RFQ</RouterLink>
        <RouterLink to="/vendors/create" class="btn-primary">Add vendor</RouterLink>
      </template>
    </PageHeader>

    <AppCard title="Operations summary" subtitle="Current procurement coverage across vendors, sourcing, and approvals">
      <div class="grid gap-6 md:grid-cols-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Managed Spend</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ formatCurrency(totalSpend) }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Open RFQs</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ rfqs.length }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Pending Approvals</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ queueCount }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Vendor SLA</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">94%</p>
        </div>
      </div>
    </AppCard>

    <AppCard title="Open sourcing work" subtitle="RFQs currently active in the pipeline" flush>
      <DataTable :columns="rfqColumns" :rows="rfqs" row-key="id">
        <template #cell-title="{ row }">
          <div>
            <RouterLink :to="`/rfqs/${row.id}`" class="font-semibold text-slate-900">{{ row.title }}</RouterLink>
            <p class="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{{ row.id }}</p>
          </div>
        </template>
        <template #cell-dueDate="{ row }">{{ formatDate(row.dueDate) }}</template>
        <template #cell-vendorIds="{ row }">{{ row.vendorIds.length }} vendors</template>
        <template #cell-budget="{ row }">{{ formatCurrency(row.budget) }}</template>
        <template #cell-status="{ row }">
          <StatusBadge :label="row.status" />
        </template>
      </DataTable>
    </AppCard>

    <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <AppCard title="Pending decisions" subtitle="Approvals and invoices that need attention">
        <div class="grid gap-6 lg:grid-cols-2">
          <div>
            <p class="mb-3 text-sm font-semibold text-slate-900">Approvals</p>
            <div class="divide-y divide-slate-200">
              <div v-for="approval in pendingApprovals" :key="approval.id" class="py-3 first:pt-0 last:pb-0">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="text-sm font-medium text-slate-900">{{ approval.subject }}</p>
                    <p class="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
                      {{ approval.type }} | {{ approval.requester }}
                    </p>
                  </div>
                  <StatusBadge :label="approval.status" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <p class="mb-3 text-sm font-semibold text-slate-900">Invoices</p>
            <div class="divide-y divide-slate-200">
              <div v-for="invoice in attentionInvoices" :key="invoice.id" class="py-3 first:pt-0 last:pb-0">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="text-sm font-medium text-slate-900">{{ invoice.vendorName }}</p>
                    <p class="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
                      {{ invoice.id }} | due {{ formatDate(invoice.dueDate) }}
                    </p>
                  </div>
                  <div class="text-right">
                    <StatusBadge :label="invoice.status" />
                    <p class="mt-2 text-sm font-medium text-slate-900">{{ formatCurrency(invoice.amount) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard title="Recent activity" subtitle="Latest workflow and vendor actions">
        <div class="divide-y divide-slate-200">
          <div v-for="item in activityLogs" :key="item.id" class="py-3 first:pt-0 last:pb-0">
            <p class="text-sm text-slate-700">
              <span class="font-medium text-slate-900">{{ item.actor }}</span>
              {{ item.action }}
              <span class="font-medium text-slate-900">{{ item.target }}</span>
            </p>
            <p class="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
              {{ item.channel }} | {{ item.timestamp.slice(0, 10) }}
            </p>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { activityLogs, approvals, invoices, rfqs, vendors } from '@/api/mockData';
import AppCard from '@/components/AppCard.vue';
import DataTable from '@/components/DataTable.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { formatCurrency, formatDate } from '@/utils/formatters';

const totalSpend = vendors.reduce((sum, vendor) => sum + vendor.totalSpend, 0);
const queueCount = approvals.filter((approval) => approval.status !== 'Approved').length;
const pendingApprovals = approvals.filter((approval) => approval.status !== 'Approved');
const attentionInvoices = invoices.filter((invoice) => invoice.status !== 'Current');

const rfqColumns = computed(() => [
  { key: 'title', label: 'RFQ' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'vendorIds', label: 'Vendors' },
  { key: 'budget', label: 'Budget' },
  { key: 'status', label: 'Status' }
]);
</script>
