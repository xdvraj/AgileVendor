<template>
  <div>
    <transition name="sidebar-overlay">
      <button
        v-if="open"
        class="fixed inset-0 z-30 bg-slate-950/35 lg:hidden"
        type="button"
        aria-label="Close sidebar"
        @click="$emit('close')"
      />
    </transition>

    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-[292px] border-r border-slate-200 bg-white shadow-[0_12px_40px_-24px_rgba(15,23,42,0.25)] transition-transform duration-200 ease-out lg:sticky lg:top-0 lg:h-screen lg:self-start lg:translate-x-0 lg:shadow-none',
        open ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex h-full flex-col">
        <div class="border-b border-slate-200 px-6 py-7">
          <div class="flex justify-start">
            <img
              src="@/assets/agile-vendor-symbol.png"
              alt="Agile Vendor symbol"
              class="h-16 w-auto max-w-[132px] object-contain"
            />
          </div>
        </div>

        <nav class="flex-1 overflow-y-auto px-4 py-5">
          <ul class="space-y-1">
            <li v-for="item in navigationItems" :key="item.to">
              <RouterLink v-if="item.isAvailable" custom :to="item.to" v-slot="{ href, navigate, isActive }">
                <a
                  :href="href"
                  :class="linkClasses(item, isActive)"
                  :aria-current="item.exact ? (isActive ? 'page' : undefined) : route.path.startsWith(item.to) ? 'page' : undefined"
                  @click="
                    navigate();
                    $emit('close');
                  "
                >
                  <span :class="iconClasses(item, isActive)" class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition">
                    <Icon :icon="item.icon" class="h-[18px] w-[18px]" />
                  </span>
                  <span class="truncate">{{ item.label }}</span>
                </a>
              </RouterLink>
              <div
                v-else
                class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400"
                aria-disabled="true"
              >
                <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                  <Icon :icon="item.icon" class="h-[18px] w-[18px]" />
                </span>
                <span class="truncate">{{ item.label }}</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';
import type { NavItem } from '@/types';
import { primaryNav } from '@/utils/navigation';

defineProps<{
  open: boolean;
}>();

defineEmits<{
  close: [];
}>();

const route = useRoute();
const router = useRouter();

const navigationItems = computed(() =>
  primaryNav.map((item) => ({
    ...item,
    isAvailable: router.resolve(item.to).matched.length > 0
  }))
);

const linkClasses = (item: NavItem, isActive: boolean) => {
  const matches = item.exact ? isActive : route.path.startsWith(item.to);

  return [
    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
    matches
      ? 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100'
      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
  ];
};

const iconClasses = (item: NavItem, isActive: boolean) => {
  const matches = item.exact ? isActive : route.path.startsWith(item.to);

  return matches
    ? 'bg-white text-brand-700 shadow-sm ring-1 ring-slate-200'
    : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-700';
};
</script>

<style scoped>
.sidebar-overlay-enter-active,
.sidebar-overlay-leave-active {
  transition: opacity 0.2s ease;
}

.sidebar-overlay-enter-from,
.sidebar-overlay-leave-to {
  opacity: 0;
}
</style>
