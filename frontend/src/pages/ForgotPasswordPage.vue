<template>
  <div class="panel p-8">
    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Password reset</p>
    <h2 class="mt-3 text-2xl font-semibold text-slate-950">Reset your password</h2>
    <p class="mt-2 text-sm leading-6 text-slate-600">
      Enter your email address and we will simulate sending a reset link.
    </p>

    <form class="mt-8 space-y-5" @submit.prevent="submitReset">
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
        <input
          v-model.trim="email"
          class="field"
          type="email"
          :placeholder="authPlaceholders.email"
        />
        <p v-if="error" class="mt-2 text-sm text-rose-600">{{ error }}</p>
      </div>

      <div
        v-if="successMessage"
        class="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
      >
        {{ successMessage }}
      </div>

      <button class="btn-primary w-full" type="submit">Send reset link</button>
    </form>

    <p class="mt-6 text-sm text-slate-500">
      Back to
      <RouterLink :to="authRoutes.login" class="font-semibold text-brand-700">Sign in</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { authMessages, authPlaceholders, authRoutes, authValidation } from '@/config/auth';

const email = ref('');
const error = ref('');
const successMessage = ref('');

const submitReset = () => {
  error.value = '';
  successMessage.value = '';

  if (!email.value) {
    error.value = 'Email is required.';
    return;
  }

  if (!authValidation.emailPattern.test(email.value)) {
    error.value = 'Enter a valid email address.';
    return;
  }

  successMessage.value = authMessages.resetSent;
};
</script>
