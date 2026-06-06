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
      </div>

      <div class="flex items-center gap-3">
        <img
          src="@/assets/agile-vendor-logo.png"
          alt="Agile Vendor logo"
          class="hidden h-30 w-auto max-w-[220px] object-contain sm:block"
        />

        <div ref="profileRef" class="relative">
          <button
            class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-white transition hover:bg-brand-800"
            type="button"
            aria-label="Open profile details"
            @click="toggleProfile"
          >
            <Icon icon="solar:user-bold-duotone" class="h-5 w-5" />
          </button>

          <div
            v-if="isProfileOpen"
            class="absolute right-0 z-20 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
          >
            <div class="rounded-xl bg-slate-50 px-3 py-3">
              <p class="truncate text-sm font-semibold text-slate-900">{{ userName }}</p>
              <p class="mt-1 truncate text-xs text-slate-500">{{ userRole }}</p>
            </div>
          </div>
        </div>

        <div class="flex items-center rounded-2xl bg-white px-1 py-1">
          <button
            class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
            type="button"
            @click="$emit('logout')"
          >
            <Icon icon="solar:logout-2-outline" class="h-4 w-4" />
            <span class="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Icon } from '@iconify/vue';

defineProps<{
  userName: string;
  userRole: string;
}>();

defineEmits<{
  toggleSidebar: [];
  logout: [];
}>();

const isProfileOpen = ref(false);
const profileRef = ref<HTMLElement | null>(null);

const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value;
};

const handleDocumentClick = (event: MouseEvent) => {
  if (!profileRef.value) {
    return;
  }

  const target = event.target;
  if (target instanceof Node && !profileRef.value.contains(target)) {
    isProfileOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick);
});
</script>
