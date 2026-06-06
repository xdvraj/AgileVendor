<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Sourcing"
      title="Request for quotations"
      description="Manage open sourcing events, vendor participation, and evaluation progress in one place."
    >
      <template #actions>
        <button class="btn-secondary">Export queue</button>
        <RouterLink to="/rfqs/create" class="btn-primary">Create RFQ</RouterLink>
      </template>
    </PageHeader>

    <AppCard title="RFQ queue" subtitle="Active sourcing events and pipeline coverage" flush>
      <div class="grid gap-6 border-b border-slate-200 px-6 py-4 md:grid-cols-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Open</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ openCount }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Awaiting Quotes</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ awaitingCount }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Evaluation</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ evaluationCount }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Pipeline Budget</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ formatCurrency(totalBudget) }}</p>
        </div>
      </div>

      <DataTable :columns="columns" :rows="rfqs" row-key="id">
        <template #cell-title="{ row }">
          <div>
            <RouterLink :to="`/rfqs/${row.id}`" class="font-semibold text-slate-900">{{ row.title }}</RouterLink>
            <p class="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{{ row.id }}</p>
          </div>
        </template>
        <template #cell-status="{ row }">
          <StatusBadge :label="row.status" />
        </template>
        <template #cell-budget="{ row }">
          {{ formatCurrency(row.budget) }}
        </template>
        <template #cell-vendorIds="{ row }">
          {{ row.vendorIds.length }} vendors
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
import { RouterLink } from 'vue-router';
import { rfqs } from '@/api/mockData';
import AppCard from '@/components/AppCard.vue';
import DataTable from '@/components/DataTable.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { formatCurrency, formatDate } from '@/utils/formatters';

const columns = [
  { key: 'title', label: 'RFQ' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'vendorIds', label: 'Invited Vendors' },
  { key: 'budget', label: 'Budget' }
];

const openCount = computed(() => rfqs.filter((rfq) => rfq.status === 'Open').length);
const awaitingCount = computed(() => rfqs.filter((rfq) => rfq.status === 'Awaiting Quotes').length);
const evaluationCount = computed(() => rfqs.filter((rfq) => rfq.status === 'Evaluation').length);
const totalBudget = computed(() => rfqs.reduce((sum, rfq) => sum + rfq.budget, 0));
</script>
