<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Workflow"
      title="Approvals queue"
      description="Balance procurement and finance decisions with a clear view of what needs review, what is approved, and what is escalating."
    />

    <AppCard title="Approval workload" subtitle="Current requests by queue stage and priority" flush>
      <div class="grid gap-6 border-b border-slate-200 px-6 py-4 md:grid-cols-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Queued</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ queued }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">In Review</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ inReview }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Approved</p>
          <p class="mt-2 text-2xl font-semibold text-slate-950">{{ approved }}</p>
        </div>
      </div>

      <DataTable :columns="columns" :rows="approvals" row-key="id">
        <template #cell-subject="{ row }">
          <div>
            <p class="font-semibold text-slate-900">{{ row.subject }}</p>
            <p class="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{{ row.id }}</p>
          </div>
        </template>
        <template #cell-priority="{ row }">
          <StatusBadge :label="row.priority" />
        </template>
        <template #cell-status="{ row }">
          <StatusBadge :label="row.status" />
        </template>
      </DataTable>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { approvals } from '@/api/mockData';
import AppCard from '@/components/AppCard.vue';
import DataTable from '@/components/DataTable.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusBadge from '@/components/StatusBadge.vue';

const columns = [
  { key: 'subject', label: 'Request' },
  { key: 'type', label: 'Type' },
  { key: 'requester', label: 'Requester' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status' }
];

const queued = computed(() => approvals.filter((approval) => approval.status === 'Queued').length);
const inReview = computed(() => approvals.filter((approval) => approval.status === 'In Review').length);
const approved = computed(() => approvals.filter((approval) => approval.status === 'Approved').length);
</script>
