<template>
  <div class="min-h-screen bg-surface">
    <div class="min-h-screen lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />

      <div class="min-w-0">
        <Topbar
          :user-name="userName"
          :user-role="userRole"
          @toggle-sidebar="sidebarOpen = true"
          @logout="handleLogout"
        />

        <main class="px-4 py-6 sm:px-6 lg:px-8">
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';
import Topbar from '@/components/Topbar.vue';
import { logout, authState } from '@/state/auth';
import { authRoutes } from '@/config/auth';

const sidebarOpen = ref(false);
const router = useRouter();

const userName = computed(() => authState.user?.name || 'Workspace User');
const userRole = computed(() => authState.user?.role || 'User');

const handleLogout = async () => {
  await logout();
  await router.push(authRoutes.login);
};
</script>
