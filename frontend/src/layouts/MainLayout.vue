<template>
  <div class="min-h-screen bg-surface">
    <div class="mx-auto min-h-screen max-w-[1600px] lg:flex">
      <aside class="w-full shrink-0 border-b border-slate-200 bg-white lg:w-72 lg:border-b-0 lg:border-r">
        <div class="p-6">
          <div class="mb-8 flex items-center gap-4">
            <div class="rounded-lg bg-brand-600 px-3 py-2 text-sm font-bold text-white">VB</div>
            <div>
              <p class="text-base font-semibold text-slate-950">VendorBridge</p>
              <p class="text-xs uppercase tracking-[0.18em] text-slate-400">ERP Workspace</p>
            </div>
          </div>

          <nav class="space-y-1">
            <RouterLink
              v-for="item in primaryNav"
              :key="item.to"
              :to="item.to"
              class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-brand-700"
              active-class="bg-brand-50 text-brand-700"
            >
              <span class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-[11px] font-semibold text-slate-500">
                {{ item.icon }}
              </span>
              {{ item.label }}
            </RouterLink>
          </nav>

          <div class="mt-8">
            <p class="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
            <nav class="space-y-1">
              <RouterLink
                v-for="item in secondaryNav"
                :key="item.to"
                :to="item.to"
                class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-brand-700"
                active-class="bg-brand-50 text-brand-700"
              >
                <span class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-[11px] font-semibold text-slate-500">
                  {{ item.icon }}
                </span>
                {{ item.label }}
              </RouterLink>
            </nav>
          </div>
        </div>
      </aside>

      <main class="min-w-0 flex-1">
        <div class="border-b border-slate-200 bg-white">
          <div class="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between lg:px-8">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
              <h2 class="mt-1 text-xl font-semibold text-slate-950">{{ route.meta.title }}</h2>
            </div>
            <div class="flex items-center gap-3 text-sm text-slate-600">
              <span class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 font-semibold text-white">R</span>
              <div>
                <p class="font-medium text-slate-900">Rajput</p>
                <p class="text-xs text-slate-500">Procurement Admin</p>
              </div>
            </div>
          </div>
        </div>

        <div class="px-4 py-6 lg:px-8">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { primaryNav, secondaryNav } from '@/utils/navigation';

const route = useRoute();
</script>
