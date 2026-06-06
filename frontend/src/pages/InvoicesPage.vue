<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Finance"
      title="Invoices"
      description="Track vendor invoices, aging, and PO matching readiness across the payable pipeline."
    />

    <AppCard title="Invoice monitor" subtitle="Accounts payable status and due-date coverage" flush>
      <div class="grid gap-6 border-b border-slate-200 px-6 py-4 md:grid-cols-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Current</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ current }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Due Soon</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ dueSoon }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Overdue</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ overdue }}</p>
        </div>
      </div>

      <DataTable :columns="columns" :rows="invoices" row-key="id">
        <template #cell-id="{ row }">
          <p class="font-semibold text-slate-900">{{ row.id }}</p>
        </template>
        <template #cell-amount="{ row }">
          {{ formatCurrency(row.amount) }}
        </template>
        <template #cell-status="{ row }">
          <StatusBadge :label="row.status" />
        </template>
        <template #cell-dueDate="{ row }">
          {{ formatDate(row.dueDate) }}
        </template>
      </DataTable>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { invoices } from '@/api/mockData';
import AppCard from '@/components/AppCard.vue';
import DataTable from '@/components/DataTable.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { formatCurrency, formatDate } from '@/utils/formatters';

const columns = [
  { key: 'id', label: 'Invoice' },
  { key: 'vendorName', label: 'Vendor' },
  { key: 'poNumber', label: 'PO Number' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount' }
];

const current = computed(() => invoices.filter((invoice) => invoice.status === 'Current').length);
const dueSoon = computed(() => invoices.filter((invoice) => invoice.status === 'Due Soon').length);
const overdue = computed(() => invoices.filter((invoice) => invoice.status === 'Overdue').length);
</script>
