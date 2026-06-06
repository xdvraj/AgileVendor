<template>
  <div class="panel p-8">
    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Create account</p>
    <h2 class="mt-3 text-2xl font-semibold text-slate-950">Set up your VendorBridge access</h2>
    <p class="mt-2 text-sm leading-6 text-slate-600">
      Create a real backend account for the ERP workspace.
    </p>

    <form class="mt-8 space-y-5" @submit.prevent="submitSignup">
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">Full name</label>
        <input
          v-model.trim="form.fullName"
          class="field"
          type="text"
          :placeholder="authPlaceholders.fullName"
        />
        <p v-if="errors.fullName" class="mt-2 text-sm text-rose-600">{{ errors.fullName }}</p>
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
          :placeholder="authPlaceholders.createPassword"
        />
        <p v-if="errors.password" class="mt-2 text-sm text-rose-600">{{ errors.password }}</p>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">Confirm password</label>
        <input
          v-model="form.confirmPassword"
          class="field"
          type="password"
          :placeholder="authPlaceholders.confirmPassword"
        />
        <p v-if="errors.confirmPassword" class="mt-2 text-sm text-rose-600">{{ errors.confirmPassword }}</p>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">Role</label>
        <select v-model="form.role" class="field">
          <option value="">Select role</option>
          <option v-for="role in authRoles" :key="role" :value="role">{{ role }}</option>
        </select>
        <p v-if="errors.role" class="mt-2 text-sm text-rose-600">{{ errors.role }}</p>
      </div>

      <div v-if="errors.form" class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
        {{ errors.form }}
      </div>

      <button class="btn-primary w-full" type="submit" :disabled="submitting">
        {{ submitting ? 'Creating account...' : 'Sign up' }}
      </button>
    </form>

    <p class="mt-6 text-sm text-slate-500">
      Already have an account?
      <RouterLink :to="authRoutes.login" class="font-semibold text-brand-700">Sign in</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { authMessages, authPlaceholders, authRoles, authRoutes, authValidation, type AuthRole } from '@/config/auth';
import { signup } from '@/state/auth';
import { getErrorMessage } from '@/utils/http';

const router = useRouter();
const submitting = ref(false);

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '' as '' | AuthRole
});

const errors = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  form: ''
});

const validate = () => {
  errors.fullName = '';
  errors.email = '';
  errors.password = '';
  errors.confirmPassword = '';
  errors.role = '';
  errors.form = '';

  if (!form.fullName) {
    errors.fullName = 'Full name is required.';
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

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (!form.role) {
    errors.role = 'Please select a role.';
  }

  return (
    !errors.fullName &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword &&
    !errors.role
  );
};

const submitSignup = async () => {
  if (!validate()) {
    errors.form = authMessages.invalidForm;
    return;
  }

  if (!form.role) {
    errors.form = 'Please select a role.';
    return;
  }

  submitting.value = true;

  try {
    await signup({
      name: form.fullName,
      email: form.email,
      password: form.password,
      role: form.role
    });

    await router.push(authRoutes.dashboard);
  } catch (error) {
    errors.form = getErrorMessage(error, 'Unable to create your account right now.');
  } finally {
    submitting.value = false;
  }
};
</script>
