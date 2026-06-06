<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Sourcing"
      title="Request for quotations"
      description="Manage open sourcing events, vendor participation, and evaluation progress in one place."
    >
      <template #actions>
        <button class="btn-secondary" type="button" @click="exportQueue">Export queue</button>
        <RouterLink to="/rfqs/create" class="btn-primary">Create RFQ</RouterLink>
      </template>
    </PageHeader>

    <AppCard title="RFQ queue" subtitle="Active sourcing events and pipeline coverage" flush>
      <div v-if="errorMessage" class="border-b border-rose-200 bg-rose-50 px-6 py-3 text-sm text-rose-700">
        {{ errorMessage }}
      </div>
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

      <DataTable :columns="columns" :rows="rfqRows" row-key="id">
        <template #cell-title="{ row }">
          <div>
            <RouterLink :to="rfqRoute(row)" class="font-semibold text-slate-900">{{ row.title }}</RouterLink>
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
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { fetchRfqs } from '@/api/rfqs';
import { rfqs as mockRfqs } from '@/api/mockData';
import AppCard from '@/components/AppCard.vue';
import DataTable from '@/components/DataTable.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import type { Rfq } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/http';

const columns = [
  { key: 'title', label: 'RFQ' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'vendorIds', label: 'Invited Vendors' },
  { key: 'budget', label: 'Budget' }
];

const backendRfqs = ref<Rfq[]>([]);
const errorMessage = ref('');

const rfqRows = computed(() => {
  const backendIds = new Set(backendRfqs.value.map((rfq) => rfq.id));
  return [...backendRfqs.value, ...mockRfqs.filter((rfq) => !backendIds.has(rfq.id))];
});

const openCount = computed(() => rfqRows.value.filter((rfq) => rfq.status === 'Open').length);
const awaitingCount = computed(() => rfqRows.value.filter((rfq) => rfq.status === 'Awaiting Quotes').length);
const evaluationCount = computed(() => rfqRows.value.filter((rfq) => rfq.status === 'Evaluation').length);
const totalBudget = computed(() => rfqRows.value.reduce((sum, rfq) => sum + rfq.budget, 0));

const rfqRoute = (rfq: Rfq) => `/rfqs/${rfq.backendId ?? rfq.id}`;

const exportQueue = () => {
  const rows = rfqRows.value.map((rfq) => ({
    id: rfq.id,
    title: rfq.title,
    category: rfq.category,
    status: rfq.status,
    dueDate: rfq.dueDate,
    invitedVendors: rfq.vendorIds.length,
    budget: rfq.budget
  }));

  const header = ['ID', 'Title', 'Category', 'Status', 'Due Date', 'Invited Vendors', 'Budget'];
  const body = rows.map((row) =>
    [row.id, row.title, row.category, row.status, row.dueDate, String(row.invitedVendors), String(row.budget)]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(',')
  );

  const blob = new Blob([[header.join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'rfq-queue.csv';
  link.click();
  URL.revokeObjectURL(url);
};

onMounted(async () => {
  try {
    backendRfqs.value = await fetchRfqs();
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'Unable to load backend RFQs.');
  }
});
</script>
