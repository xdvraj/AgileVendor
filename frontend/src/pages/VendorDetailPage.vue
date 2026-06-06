<template>
  <div v-if="loading" class="space-y-6">
    <AppCard title="Vendor profile" subtitle="Loading supplier details">
      <p class="text-sm text-slate-500">Fetching the latest vendor record from the backend...</p>
    </AppCard>
  </div>

  <div v-else-if="vendor" class="space-y-6">
    <PageHeader
      eyebrow="Vendor Profile"
      :title="vendor.name"
      :description="`${vendor.category} supplier based in ${vendor.location}. Performance score ${vendor.score}.`"
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
          <div>
            <dt class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">GST Number</dt>
            <dd class="mt-2 text-sm font-medium text-slate-900">{{ vendor.gstNumber || 'Not provided' }}</dd>
          </div>
          <div>
            <dt class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Address</dt>
            <dd class="mt-2 text-sm font-medium text-slate-900">{{ vendor.address || vendor.location }}</dd>
          </div>
        </dl>
      </AppCard>

      <AppCard title="Related RFQs" subtitle="Events currently involving this supplier" flush>
        <div class="px-6 py-8 text-sm text-slate-500">
          RFQ data is still using mock records and is not yet linked to this backend vendor profile.
        </div>
      </AppCard>
    </div>
  </div>

  <EmptyState
    v-else
    kicker="Vendor unavailable"
    title="This supplier record is unavailable"
    :description="errorMessage || 'The requested vendor record could not be loaded. Choose another vendor from the registry.'"
  >
    <RouterLink to="/vendors" class="btn-primary">Return to vendor list</RouterLink>
  </EmptyState>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { fetchVendorById } from '@/api/vendors';
import AppCard from '@/components/AppCard.vue';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import type { Vendor } from '@/types';
import { getErrorMessage } from '@/utils/http';
import { formatCurrency, formatDate } from '@/utils/formatters';

const route = useRoute();
const vendor = ref<Vendor | null>(null);
const loading = ref(true);
const errorMessage = ref('');

const loadVendor = async (vendorId: string) => {
  loading.value = true;
  errorMessage.value = '';

  try {
    vendor.value = await fetchVendorById(vendorId);
  } catch (error) {
    vendor.value = null;
    errorMessage.value = getErrorMessage(error, 'Unable to load this vendor.');
  } finally {
    loading.value = false;
  }
};

watch(
  () => String(route.params.id),
  (vendorId) => {
    if (vendorId) {
      loadVendor(vendorId);
    }
  },
  { immediate: true }
);
</script>
