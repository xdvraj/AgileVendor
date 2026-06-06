<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Traceability"
      title="Activity logs"
      description="Capture who changed what, where it happened, and when across vendor, sourcing, and workflow operations."
    />

    <AppCard title="Recent events" subtitle="Procurement audit trail" flush>
      <DataTable :columns="columns" :rows="activityLogs" row-key="id">
        <template #cell-actor="{ row }">
          <span class="font-medium text-slate-900">{{ row.actor }}</span>
        </template>
        <template #cell-action="{ row }">
          <span class="text-slate-700">{{ row.action }} {{ row.target }}</span>
        </template>
        <template #cell-timestamp="{ row }">
          {{ row.timestamp.replace('T', ' ').replace('Z', ' UTC') }}
        </template>
      </DataTable>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { activityLogs } from '@/api/mockData';
import AppCard from '@/components/AppCard.vue';
import DataTable from '@/components/DataTable.vue';
import PageHeader from '@/components/PageHeader.vue';

const columns = [
  { key: 'actor', label: 'Actor' },
  { key: 'action', label: 'Action' },
  { key: 'channel', label: 'Channel' },
  { key: 'timestamp', label: 'Timestamp' }
];
</script>
