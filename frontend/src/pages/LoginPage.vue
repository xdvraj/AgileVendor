<template>
  <div class="panel p-8">
    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Welcome back</p>
    <h2 class="mt-3 text-2xl font-semibold text-slate-950">Sign in to VendorBridge</h2>
    <p class="mt-2 text-sm leading-6 text-slate-600">
      Choose your workspace role, then sign in with your backend account to enter the ERP workspace.
    </p>

    <form class="mt-8 space-y-5" @submit.prevent="submitLogin">
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">Role</label>
        <select v-model="form.role" class="field">
          <option value="">Select role</option>
          <option v-for="role in authRoles" :key="role" :value="role">{{ role }}</option>
        </select>
        <p v-if="errors.role" class="mt-2 text-sm text-rose-600">{{ errors.role }}</p>
        <p v-else class="mt-2 text-xs leading-5 text-slate-500">
          Your selected role must match the role assigned to this account.
        </p>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
        <input
          v-model.trim="form.email"
          class="field"
          type="email"
          :placeholder="authPlaceholders.email"
        />
        <p v-if="errors.email" class="mt-2 text-sm text-rose-600">{{ errors.email }}</p>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">Password</label>
        <input
          v-model="form.password"
          class="field"
          type="password"
          :placeholder="authPlaceholders.password"
        />
        <p v-if="errors.password" class="mt-2 text-sm text-rose-600">{{ errors.password }}</p>
      </div>

      <div v-if="errors.form" class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
        {{ errors.form }}
      </div>

      <button class="btn-primary w-full" type="submit" :disabled="submitting">
        {{ submitting ? 'Signing in...' : 'Login' }}
      </button>
    </form>

    <div class="mt-6 flex items-center justify-between gap-4 text-sm">
      <RouterLink :to="authRoutes.forgotPassword" class="font-medium text-brand-700">Forgot password?</RouterLink>
      <p class="text-slate-500">
        New here?
        <RouterLink :to="authRoutes.signup" class="font-semibold text-brand-700">Sign up</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { authMessages, authPlaceholders, authRoles, authRoutes, authValidation, type AuthRole } from '@/config/auth';
import { login } from '@/state/auth';
import { getErrorMessage } from '@/utils/http';

const router = useRouter();
const submitting = ref(false);

const form = reactive({
  role: '' as '' | AuthRole,
  email: '',
  password: ''
});

const errors = reactive({
  role: '',
  email: '',
  password: '',
  form: ''
});

const validate = () => {
  errors.role = '';
  errors.email = '';
  errors.password = '';
  errors.form = '';

  if (!form.role) {
    errors.role = 'Please select a role.';
  }

  if (!form.email) {
    errors.email = 'Email is required.';
  } else if (!authValidation.emailPattern.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!form.password) {
    errors.password = 'Password is required.';
  } else if (form.password.length < authValidation.minPasswordLength) {
    errors.password = `Password must be at least ${authValidation.minPasswordLength} characters.`;
  }

  return !errors.role && !errors.email && !errors.password;
};

const submitLogin = async () => {
  if (!validate()) {
    errors.form = authMessages.invalidForm;
    return;
  }

  submitting.value = true;

  try {
    if (!form.role) {
      errors.form = 'Please select a role.';
      return;
    }

    await login({
      role: form.role,
      email: form.email,
      password: form.password
    });

    await router.push(authRoutes.dashboard);
  } catch (error) {
    errors.form = getErrorMessage(error, 'Unable to sign in right now.');
  } finally {
    submitting.value = false;
  }
};
</script>
