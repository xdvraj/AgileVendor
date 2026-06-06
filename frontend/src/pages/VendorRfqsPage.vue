<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Vendor Portal"
      title="Assigned RFQs"
      description="A portal-ready view of sourcing events vendors would respond to, with due dates, requester ownership, and event value."
    />

    <AppCard title="Assigned RFQs" subtitle="Events currently visible to vendors" flush>
      <DataTable :columns="columns" :rows="rfqs" row-key="id">
        <template #cell-title="{ row }">
          <div>
            <RouterLink :to="`/rfqs/${row.id}`" class="font-semibold text-slate-900">{{ row.title }}</RouterLink>
            <p class="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{{ row.id }}</p>
          </div>
        </template>
        <template #cell-budget="{ row }">{{ formatCurrency(row.budget) }}</template>
        <template #cell-dueDate="{ row }">{{ formatDate(row.dueDate) }}</template>
        <template #cell-vendorIds="{ row }">{{ row.vendorIds.length }} invited</template>
        <template #cell-status="{ row }">
          <StatusBadge :label="row.status" />
        </template>
      </DataTable>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { rfqs } from '@/api/mockData';
import AppCard from '@/components/AppCard.vue';
import DataTable from '@/components/DataTable.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { formatCurrency, formatDate } from '@/utils/formatters';

const columns = [
  { key: 'title', label: 'RFQ' },
  { key: 'requester', label: 'Requester' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'vendorIds', label: 'Invited Suppliers' },
  { key: 'budget', label: 'Estimated Value' },
  { key: 'status', label: 'Status' }
];
</script>
