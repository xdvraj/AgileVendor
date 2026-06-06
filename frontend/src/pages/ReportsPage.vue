<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Analytics"
      title="Reports"
      description="Review reporting assets for spend, supplier risk, and operational performance."
    >
      <template #actions>
        <button class="btn-secondary">Schedule export</button>
        <button class="btn-primary">Create report</button>
      </template>
    </PageHeader>

    <AppCard title="Report catalog" subtitle="Available reporting assets and ownership" flush>
      <DataTable :columns="columns" :rows="reports" row-key="id">
        <template #cell-name="{ row }">
          <div>
            <p class="font-semibold text-slate-900">{{ row.name }}</p>
            <p class="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{{ row.id }}</p>
          </div>
        </template>
        <template #cell-description="{ row }">
          <p class="max-w-xl text-sm text-slate-600">{{ row.description }}</p>
        </template>
        <template #cell-updatedAt="{ row }">
          {{ formatDate(row.updatedAt) }}
        </template>
      </DataTable>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { reports } from '@/api/mockData';
import AppCard from '@/components/AppCard.vue';
import DataTable from '@/components/DataTable.vue';
import PageHeader from '@/components/PageHeader.vue';
import { formatDate } from '@/utils/formatters';

const columns = [
  { key: 'name', label: 'Report' },
  { key: 'type', label: 'Type' },
  { key: 'owner', label: 'Owner' },
  { key: 'description', label: 'Description' },
  { key: 'updatedAt', label: 'Updated' }
];
</script>
