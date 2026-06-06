<template>
  <div v-if="vendor" class="space-y-6">
    <PageHeader
      eyebrow="Vendor Profile"
      :title="vendor.name"
      :description="`${vendor.category} supplier based in ${vendor.location}. Performance score ${vendor.score} with ${vendor.onTimeRate} on-time delivery.`"
    >
      <template #actions>
        <RouterLink to="/vendors" class="btn-secondary">Back to vendors</RouterLink>
        <RouterLink to="/rfqs/create" class="btn-primary">Launch RFQ</RouterLink>
      </template>
    </PageHeader>

    <AppCard title="Vendor summary" subtitle="Commercial and performance snapshot">
      <div class="grid gap-6 md:grid-cols-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Status</p>
          <div class="mt-2"><StatusBadge :label="vendor.status" /></div>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Total Spend</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ formatCurrency(vendor.totalSpend) }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Open RFQs</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ vendor.pendingRfqs }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Score</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ vendor.score }}</p>
        </div>
      </div>
    </AppCard>

    <div class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <AppCard title="Company details" subtitle="Primary contact and operating information">
        <dl class="grid gap-x-8 gap-y-5 md:grid-cols-2">
          <div>
            <dt class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Primary Contact</dt>
            <dd class="mt-2 text-sm font-medium text-slate-900">{{ vendor.contactName }}</dd>
          </div>
          <div>
            <dt class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Email</dt>
            <dd class="mt-2 text-sm font-medium text-slate-900">{{ vendor.email }}</dd>
          </div>
          <div>
            <dt class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Phone</dt>
            <dd class="mt-2 text-sm font-medium text-slate-900">{{ vendor.phone }}</dd>
          </div>
          <div>
            <dt class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Last Updated</dt>
            <dd class="mt-2 text-sm font-medium text-slate-900">{{ formatDate(vendor.lastUpdated) }}</dd>
          </div>
        </dl>
      </AppCard>

      <AppCard title="Related RFQs" subtitle="Events currently involving this supplier" flush>
        <DataTable :columns="rfqColumns" :rows="relatedRfqs" row-key="id">
          <template #cell-title="{ row }">
            <RouterLink :to="`/rfqs/${row.id}`" class="font-semibold text-slate-900">{{ row.title }}</RouterLink>
          </template>
          <template #cell-status="{ row }">
            <StatusBadge :label="row.status" />
          </template>
          <template #cell-budget="{ row }">
            {{ formatCurrency(row.budget) }}
          </template>
          <template #cell-dueDate="{ row }">
            {{ formatDate(row.dueDate) }}
          </template>
        </DataTable>
      </AppCard>
    </div>
  </div>

  <EmptyState
    v-else
    kicker="Vendor not found"
    title="This supplier record is unavailable"
    description="The requested vendor ID does not exist in the mock dataset yet. Choose another vendor from the registry."
  >
    <RouterLink to="/vendors" class="btn-primary">Return to vendor list</RouterLink>
  </EmptyState>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { getVendorById, rfqs } from '@/api/mockData';
import AppCard from '@/components/AppCard.vue';
import DataTable from '@/components/DataTable.vue';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { formatCurrency, formatDate } from '@/utils/formatters';

const route = useRoute();
const vendor = computed(() => getVendorById(String(route.params.id)));
const relatedRfqs = computed(() => rfqs.filter((rfq) => rfq.vendorIds.includes(String(route.params.id))));

const rfqColumns = [
  { key: 'title', label: 'RFQ' },
  { key: 'status', label: 'Status' },
  { key: 'budget', label: 'Budget' },
  { key: 'dueDate', label: 'Due Date' }
];
</script>
