<template>
  <div class="table-shell">
    <div class="overflow-x-auto">
      <table class="min-w-full text-left">
        <thead class="bg-slate-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="border-b border-slate-200 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr
            v-for="(row, rowIndex) in rows"
            :key="getRowKey(row, rowIndex)"
            class="border-b border-slate-200 last:border-b-0 hover:bg-brand-50/40"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 align-top text-sm text-slate-700"
            >
              <slot :name="`cell-${column.key}`" :row="row">
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
type Column = {
  key: string;
  label: string;
};

const props = defineProps<{
  columns: Column[];
  rows: any[];
  rowKey?: string;
}>();

const getRowKey = (row: any, index: number) =>
  props.rowKey && row[props.rowKey] ? String(row[props.rowKey]) : `${index}`;
</script>
