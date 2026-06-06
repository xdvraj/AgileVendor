<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(143,68,247,0.08),_transparent_24%),linear-gradient(180deg,_#fbf8ff_0%,_#f7f4fb_100%)]">
    <div class="mx-auto grid min-h-screen max-w-7xl gap-12 px-6 py-8 lg:grid-cols-[1fr_0.9fr] lg:px-10">
      <div class="flex flex-col justify-center">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">VendorBridge ERP</p>
          <h1 class="mt-4 max-w-xl text-4xl font-semibold leading-tight text-slate-950">
            Clean procurement workflows built for real daily operations.
          </h1>
          <p class="mt-5 max-w-2xl text-sm leading-7 text-slate-600">
            Centralize vendor onboarding, sourcing, approvals, and finance workflows in a single responsive workspace.
          </p>
        </div>

        <div class="mt-8 max-w-2xl border-t border-slate-200 pt-6">
          <div class="grid gap-4 sm:grid-cols-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Modules</p>
              <p class="mt-2 text-sm font-medium text-slate-900">Vendors, RFQs, approvals</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Finance</p>
              <p class="mt-2 text-sm font-medium text-slate-900">POs, invoices, reporting</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Use Case</p>
              <p class="mt-2 text-sm font-medium text-slate-900">Daily ERP operations</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center">
        <div class="w-full max-w-md">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>
