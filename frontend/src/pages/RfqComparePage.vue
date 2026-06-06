<template>
  <div v-if="rfq" class="space-y-6">
    <PageHeader
      eyebrow="Bid Comparison"
      :title="`Compare quotes for ${rfq.id}`"
      description="Review price, lead time, score, and payment terms side by side before awarding the event."
    >
      <template #actions>
        <RouterLink :to="`/rfqs/${rfq.id}`" class="btn-secondary">Back to RFQ</RouterLink>
        <button class="btn-primary">Recommend award</button>
      </template>
    </PageHeader>

    <AppCard title="Quote matrix" subtitle="Commercial responses for this sourcing event" flush>
      <div class="grid gap-6 border-b border-slate-200 px-6 py-4 md:grid-cols-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Best Price</p>
          <p class="mt-2 text-sm font-semibold text-slate-900">{{ vendorName(bestPrice.vendorId) }}</p>
          <p class="mt-1 text-sm text-slate-600">{{ formatCurrency(bestPrice.price) }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Best Score</p>
          <p class="mt-2 text-sm font-semibold text-slate-900">{{ vendorName(bestScore.vendorId) }}</p>
          <p class="mt-1 text-sm text-slate-600">Score {{ bestScore.score }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Fastest Lead Time</p>
          <p class="mt-2 text-sm font-semibold text-slate-900">{{ vendorName(fastestLead.vendorId) }}</p>
          <p class="mt-1 text-sm text-slate-600">{{ fastestLead.leadTimeDays }} days</p>
        </div>
      </div>

      <DataTable :columns="columns" :rows="comparisonRows" row-key="vendorId">
        <template #cell-vendorId="{ row }">
          <RouterLink :to="`/vendors/${row.vendorId}`" class="font-semibold text-slate-900">
            {{ vendorName(row.vendorId) }}
          </RouterLink>
        </template>
        <template #cell-price="{ row }">{{ formatCurrency(row.price) }}</template>
        <template #cell-score="{ row }">
          <span class="font-semibold text-slate-900">{{ row.score }}</span>
        </template>
      </DataTable>
    </AppCard>
  </div>

  <EmptyState
    v-else
    kicker="Comparison unavailable"
    title="There is no RFQ to compare here"
    description="The quote comparison view needs a valid RFQ ID from the mock dataset."
  >
    <RouterLink to="/rfqs" class="btn-primary">Return to RFQs</RouterLink>
  </EmptyState>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { getRfqById, rfqQuotes, vendors } from '@/api/mockData';
import AppCard from '@/components/AppCard.vue';
import DataTable from '@/components/DataTable.vue';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import { formatCurrency } from '@/utils/formatters';

const route = useRoute();
const rfq = computed(() => getRfqById(String(route.params.id)));
const comparisonRows = computed(() => (rfq.value ? rfqQuotes[rfq.value.id] ?? [] : []));

const columns = [
  { key: 'vendorId', label: 'Vendor' },
  { key: 'price', label: 'Quoted Price' },
  { key: 'leadTimeDays', label: 'Lead Time' },
  { key: 'score', label: 'Score' },
  { key: 'terms', label: 'Terms' }
];

const fallbackRow = { vendorId: '-', price: 0, leadTimeDays: 0, score: 0, terms: '-' };
const bestPrice = computed(() =>
  comparisonRows.value.reduce((best, row) => (row.price < best.price ? row : best), comparisonRows.value[0] ?? fallbackRow)
);
const bestScore = computed(() =>
  comparisonRows.value.reduce((best, row) => (row.score > best.score ? row : best), comparisonRows.value[0] ?? fallbackRow)
);
const fastestLead = computed(() =>
  comparisonRows.value.reduce(
    (best, row) => (row.leadTimeDays < best.leadTimeDays ? row : best),
    comparisonRows.value[0] ?? fallbackRow
  )
);

const vendorName = (vendorId: string) => vendors.find((vendor) => vendor.id === vendorId)?.name ?? vendorId;
</script>
