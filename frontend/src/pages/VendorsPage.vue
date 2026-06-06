<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Vendor Master"
      title="Supplier portfolio"
      description="Track onboarding status, performance signals, and spend coverage across your active vendor base."
    >
      <template #actions>
        <button class="btn-secondary">Import list</button>
        <RouterLink to="/vendors/create" class="btn-primary">Create vendor</RouterLink>
      </template>
    </PageHeader>

    <AppCard title="Vendor registry" subtitle="Core supplier records and commercial coverage" flush>
      <div class="grid gap-6 border-b border-slate-200 px-6 py-4 md:grid-cols-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Active Vendors</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ activeVendors }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Needs Attention</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ pendingVendors }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Covered Spend</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ formatCurrency(totalSpend) }}</p>
        </div>
      </div>

      <div v-if="loading" class="px-6 py-8 text-sm text-slate-500">Loading vendors from the backend...</div>
      <div v-else-if="errorMessage" class="px-6 py-8 text-sm text-rose-600">{{ errorMessage }}</div>
      <div v-else-if="!vendors.length" class="px-6 py-8 text-sm text-slate-500">No vendors found yet.</div>
      <DataTable v-else :columns="columns" :rows="vendors" row-key="id">
        <template #cell-name="{ row }">
          <div>
            <RouterLink :to="`/vendors/${row.id}`" class="font-semibold text-slate-900">{{ row.name }}</RouterLink>
            <p class="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{{ row.id }}</p>
          </div>
        </template>
        <template #cell-status="{ row }">
          <StatusBadge :label="row.status" />
        </template>
        <template #cell-score="{ row }">
          <span class="font-semibold text-slate-900">{{ row.score }}</span>
        </template>
        <template #cell-totalSpend="{ row }">
          {{ formatCurrency(row.totalSpend) }}
        </template>
      </DataTable>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { fetchVendors } from '@/api/vendors';
import AppCard from '@/components/AppCard.vue';
import DataTable from '@/components/DataTable.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import type { Vendor } from '@/types';
import { getErrorMessage } from '@/utils/http';
import { formatCurrency } from '@/utils/formatters';

const vendors = ref<Vendor[]>([]);
const loading = ref(true);
const errorMessage = ref('');

const columns = [
  { key: 'name', label: 'Vendor' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status' },
  { key: 'contactName', label: 'Primary Contact' },
  { key: 'location', label: 'Location' },
  { key: 'score', label: 'Score' },
  { key: 'totalSpend', label: 'Spend' }
];

const activeVendors = computed(() => vendors.value.filter((vendor) => vendor.status === 'Active').length);
const pendingVendors = computed(() => vendors.value.filter((vendor) => vendor.status !== 'Active').length);
const totalSpend = computed(() => vendors.value.reduce((sum, vendor) => sum + vendor.totalSpend, 0));

const loadVendors = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    vendors.value = await fetchVendors();
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'Unable to load vendors.');
  } finally {
    loading.value = false;
  }
};

onMounted(loadVendors);
</script>
