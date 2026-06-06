<template>
  <header class="bg-white">
    <div class="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3">
        <button
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 lg:hidden"
          type="button"
          aria-label="Open sidebar"
          @click="$emit('toggleSidebar')"
        >
          <Icon icon="solar:hamburger-menu-outline" class="h-5 w-5" />
        </button>

        <img
          src="@/assets/agile-vendor-symbol.png"
          alt="Agile Vendor symbol"
          class="hidden h-11 w-auto max-w-[140px] object-contain sm:block"
        />
      </div>

      <div ref="menuRef" class="relative">
        <button
          class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-slate-300 hover:bg-slate-50"
          type="button"
          aria-label="Open profile menu"
          @click="toggleMenu"
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-sm font-semibold text-white">
            {{ initials }}
          </div>

          <div class="hidden min-w-0 sm:block">
            <p class="truncate text-sm font-medium text-slate-900">{{ userName }}</p>
            <p class="mt-0.5 truncate text-xs text-slate-500">{{ userRole }}</p>
          </div>

          <Icon
            icon="solar:alt-arrow-down-outline"
            class="h-4 w-4 text-slate-500 transition"
            :class="{ 'rotate-180': isMenuOpen }"
          />
        </button>

        <div
          v-if="isMenuOpen"
          class="absolute right-0 z-20 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
        >
          <div class="rounded-xl bg-slate-50 px-3 py-3">
            <p class="truncate text-sm font-semibold text-slate-900">{{ userName }}</p>
            <p class="mt-1 truncate text-xs text-slate-500">{{ userRole }}</p>
          </div>

          <button
            class="mt-2 flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
            type="button"
            @click="handleLogout"
          >
            <span>Logout</span>
            <Icon icon="solar:logout-2-outline" class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  userName: string;
  userRole: string;
}>();

const emit = defineEmits<{
  toggleSidebar: [];
  logout: [];
}>();

const isMenuOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);

const initials = computed(() =>
  props.userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'U'
);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleLogout = () => {
  isMenuOpen.value = false;
  emit('logout');
};

const handleDocumentClick = (event: MouseEvent) => {
  if (!menuRef.value) {
    return;
  }

  const target = event.target;
  if (target instanceof Node && !menuRef.value.contains(target)) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick);
});
</script>
