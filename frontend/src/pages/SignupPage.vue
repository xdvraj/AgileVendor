<template>
  <div class="panel p-8">
    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">New workspace</p>
    <h2 class="mt-3 text-2xl font-semibold text-slate-950">Create your account</h2>
    <p class="mt-2 text-sm leading-6 text-slate-600">
      Set up your procurement profile to start managing vendors, RFQs, and finance workflows.
    </p>

    <form class="mt-8 space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">First name</label>
          <input class="field" type="text" placeholder="Raj" />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">Last name</label>
          <input class="field" type="text" placeholder="Patel" />
        </div>
      </div>
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">Company email</label>
        <input class="field" type="email" placeholder="ops@vendorbridge.example" />
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">Role</label>
          <select class="field">
            <option>Procurement Admin</option>
            <option>Vendor Manager</option>
            <option>Finance Reviewer</option>
          </select>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">Team</label>
          <select class="field">
            <option>Procurement</option>
            <option>Operations</option>
            <option>Finance</option>
          </select>
        </div>
      </div>
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">Password</label>
        <input class="field" type="password" placeholder="Create a secure password" />
      </div>

      <RouterLink to="/dashboard" class="btn-primary w-full">Launch workspace</RouterLink>
    </form>

    <p class="mt-6 text-sm text-slate-500">
      Already have an account?
      <RouterLink to="/login" class="font-semibold text-brand-700">Sign in</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
