<template>
  <div class="panel px-6 py-8">
    <p class="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">{{ kicker }}</p>
    <h3 class="mt-3 text-xl font-semibold text-slate-900">{{ title }}</h3>
    <p class="mt-2 max-w-xl text-sm leading-6 text-slate-600">{{ description }}</p>
    <div v-if="$slots.default" class="mt-5">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  kicker: string;
  title: string;
  description: string;
}>();
</script>
