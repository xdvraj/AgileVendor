<template>
  <span :class="badgeClass" class="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
}>();

const badgeClass = computed(() => {
  const palette: Record<string, string> = {
    Active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    Pending: 'border-amber-200 bg-amber-50 text-amber-700',
    Review: 'border-rose-200 bg-rose-50 text-rose-700',
    Open: 'border-sky-200 bg-sky-50 text-sky-700',
    'Awaiting Quotes': 'border-indigo-200 bg-indigo-50 text-indigo-700',
    Evaluation: 'border-violet-200 bg-violet-50 text-violet-700',
    Awarded: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    Queued: 'border-amber-200 bg-amber-50 text-amber-700',
    'In Review': 'border-sky-200 bg-sky-50 text-sky-700',
    Approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    Draft: 'border-slate-200 bg-slate-50 text-slate-700',
    Released: 'border-sky-200 bg-sky-50 text-sky-700',
    'Partially Received': 'border-indigo-200 bg-indigo-50 text-indigo-700',
    Completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    Current: 'border-sky-200 bg-sky-50 text-sky-700',
    'Due Soon': 'border-amber-200 bg-amber-50 text-amber-700',
    Overdue: 'border-rose-200 bg-rose-50 text-rose-700',
    Paid: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    Low: 'border-slate-200 bg-slate-50 text-slate-700',
    Medium: 'border-amber-200 bg-amber-50 text-amber-700',
    High: 'border-rose-200 bg-rose-50 text-rose-700'
  };

  return palette[props.label] ?? 'border-slate-200 bg-slate-50 text-slate-700';
});
</script>
