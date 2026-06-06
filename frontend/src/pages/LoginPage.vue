<template>
  <div class="panel p-8">
    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Welcome back</p>
    <h2 class="mt-3 text-2xl font-semibold text-slate-950">Sign in to VendorBridge</h2>
    <p class="mt-2 text-sm leading-6 text-slate-600">
      Use the mock sign-in flow to explore the procurement workspace.
    </p>

    <form class="mt-8 space-y-4">
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">Work email</label>
        <input class="field" type="email" placeholder="you@vendorbridge.example" />
      </div>
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">Password</label>
        <input class="field" type="password" placeholder="Enter your password" />
      </div>

      <div class="flex items-center justify-between text-sm">
        <label class="flex items-center gap-2 text-slate-500">
          <input type="checkbox" class="rounded border-slate-300 text-brand-600" />
          Remember me
        </label>
        <a href="#" class="font-medium text-brand-700">Forgot password?</a>
      </div>

      <RouterLink to="/dashboard" class="btn-primary w-full">Enter workspace</RouterLink>
    </form>

    <p class="mt-6 text-sm text-slate-500">
      Need an account?
      <RouterLink to="/signup" class="font-semibold text-brand-700">Create one</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
