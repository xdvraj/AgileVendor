<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Execution"
      title="Purchase orders"
      description="Follow PO release, receipt progress, and owner accountability from draft through completion."
    />

    <AppCard title="PO register" subtitle="Current orders across release and fulfillment stages" flush>
      <div class="grid gap-6 border-b border-slate-200 px-6 py-4 md:grid-cols-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Released</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ releasedCount }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">In Progress</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ inProgressCount }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Total Value</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ formatCurrency(totalValue) }}</p>
        </div>
      </div>

      <DataTable :columns="columns" :rows="purchaseOrders" row-key="id">
        <template #cell-id="{ row }">
          <p class="font-semibold text-slate-900">{{ row.id }}</p>
        </template>
        <template #cell-total="{ row }">
          {{ formatCurrency(row.total) }}
        </template>
        <template #cell-status="{ row }">
          <StatusBadge :label="row.status" />
        </template>
        <template #cell-deliveryDate="{ row }">
          {{ formatDate(row.deliveryDate) }}
        </template>
      </DataTable>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { purchaseOrders } from '@/api/mockData';
import AppCard from '@/components/AppCard.vue';
import DataTable from '@/components/DataTable.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { formatCurrency, formatDate } from '@/utils/formatters';

const columns = [
  { key: 'id', label: 'PO Number' },
  { key: 'vendorName', label: 'Vendor' },
  { key: 'owner', label: 'Owner' },
  { key: 'deliveryDate', label: 'Delivery Date' },
  { key: 'status', label: 'Status' },
  { key: 'total', label: 'Total' }
];

const releasedCount = computed(() => purchaseOrders.filter((order) => order.status === 'Released').length);
const inProgressCount = computed(() =>
  purchaseOrders.filter((order) => order.status === 'Partially Received').length
);
const totalValue = computed(() => purchaseOrders.reduce((sum, order) => sum + order.total, 0));
</script>
