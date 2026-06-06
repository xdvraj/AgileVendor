<template>
  <nav aria-label="Breadcrumb" class="border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-sm sm:px-6 lg:px-8">
    <ol class="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <li v-for="(item, index) in items" :key="`${item.label}-${index}`" class="flex items-center gap-2">
        <Icon v-if="index > 0" icon="solar:alt-arrow-right-outline" class="h-4 w-4 text-slate-400" />
        <RouterLink
          v-if="item.to && index < items.length - 1"
          :to="item.to"
          class="transition hover:text-brand-700"
        >
          {{ item.label }}
        </RouterLink>
        <span v-else class="font-medium text-slate-900">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { RouterLink, useRoute } from 'vue-router';

type BreadcrumbItem = {
  label: string;
  to?: string;
};

const route = useRoute();

const items = computed<BreadcrumbItem[]>(() => {
  const meta = route.meta as {
    title?: string;
    breadcrumb?: BreadcrumbItem[];
  };

  if (route.name === 'dashboard') {
    return [{ label: 'Dashboard' }];
  }

  const breadcrumb = meta.breadcrumb ?? [];
  return [{ label: 'Dashboard', to: '/dashboard' }, ...breadcrumb];
});
</script>
