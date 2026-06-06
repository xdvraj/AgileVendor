<template>
  <section class="panel">
    <div
      v-if="title || subtitle"
      class="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 px-6 py-4"
    >
      <div>
        <h3 v-if="title" class="text-base font-semibold text-slate-900">{{ title }}</h3>
        <p v-if="subtitle" class="mt-1 text-sm text-slate-500">{{ subtitle }}</p>
      </div>
      <slot name="actions" />
    </div>
    <div :class="flush ? '' : 'px-6 py-5'">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
  title?: string;
  subtitle?: string;
  flush?: boolean;
  }>(),
  {
    flush: false
  }
);
</script>
