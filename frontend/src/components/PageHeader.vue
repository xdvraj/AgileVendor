<template>
  <div class="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-end md:justify-between">
    <div>
      <p v-if="eyebrow" class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
        {{ eyebrow }}
      </p>
      <h1 class="mt-2 text-2xl font-semibold text-slate-950">{{ title }}</h1>
      <p v-if="description" class="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        {{ description }}
      </p>
    </div>
    <div class="flex flex-wrap gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow?: string;
  title: string;
  description?: string;
}>();
</script>
