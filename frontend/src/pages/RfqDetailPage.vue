<template>
  <div v-if="rfq" class="space-y-6">
    <PageHeader
      eyebrow="RFQ Detail"
      :title="rfq.title"
      :description="`${rfq.category} sourcing event managed by ${rfq.requester}. ${rfq.vendorIds.length} invited vendors and ${rfq.itemCount} line items.`"
    >
      <template #actions>
        <RouterLink to="/rfqs" class="btn-secondary">Back to RFQs</RouterLink>
        <RouterLink :to="`/rfqs/${rfq.id}/compare`" class="btn-primary">Compare quotes</RouterLink>
      </template>
    </PageHeader>

    <AppCard title="RFQ summary" subtitle="Core event information and commercial scope">
      <div class="grid gap-6 md:grid-cols-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Status</p>
          <div class="mt-2"><StatusBadge :label="rfq.status" /></div>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Budget</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ formatCurrency(rfq.budget) }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Issue Date</p>
          <p class="mt-2 text-sm font-medium text-slate-900">{{ formatDate(rfq.issueDate) }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Due Date</p>
          <p class="mt-2 text-sm font-medium text-slate-900">{{ formatDate(rfq.dueDate) }}</p>
        </div>
      </div>
    </AppCard>

    <div class="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <AppCard title="Vendor participation" subtitle="Suppliers currently attached to this event" flush>
        <DataTable :columns="vendorColumns" :rows="invitedVendors" row-key="id">
          <template #cell-name="{ row }">
            <RouterLink :to="`/vendors/${row.id}`" class="font-semibold text-slate-900">{{ row.name }}</RouterLink>
          </template>
          <template #cell-status="{ row }">
            <StatusBadge :label="row.status" />
          </template>
        </DataTable>
      </AppCard>

      <AppCard title="Quote summary" subtitle="Commercial responses received for this event" flush>
        <DataTable :columns="quoteColumns" :rows="quotes" row-key="vendorId">
          <template #cell-vendorId="{ row }">
            <span class="font-semibold text-slate-900">{{ vendorName(row.vendorId) }}</span>
          </template>
          <template #cell-price="{ row }">{{ formatCurrency(row.price) }}</template>
        </DataTable>
      </AppCard>
    </div>
  </div>

  <EmptyState
    v-else
    kicker="RFQ not found"
    title="This sourcing event is unavailable"
    description="The requested RFQ ID is not present in the mock data. Return to the RFQ list to continue."
  >
    <RouterLink to="/rfqs" class="btn-primary">Return to RFQ list</RouterLink>
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
import StatusBadge from '@/components/StatusBadge.vue';
import { formatCurrency, formatDate } from '@/utils/formatters';

const route = useRoute();
const rfq = computed(() => getRfqById(String(route.params.id)));
const quotes = computed(() => (rfq.value ? rfqQuotes[rfq.value.id] ?? [] : []));
const invitedVendors = computed(() =>
  vendors.filter((vendor) => rfq.value?.vendorIds.includes(vendor.id))
);

const vendorColumns = [
  { key: 'name', label: 'Vendor' },
  { key: 'contactName', label: 'Primary Contact' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' }
];

const quoteColumns = [
  { key: 'vendorId', label: 'Vendor' },
  { key: 'price', label: 'Quoted Price' },
  { key: 'leadTimeDays', label: 'Lead Time' },
  { key: 'score', label: 'Score' },
  { key: 'terms', label: 'Terms' }
];

const vendorName = (vendorId: string) => vendors.find((vendor) => vendor.id === vendorId)?.name ?? vendorId;
</script>
