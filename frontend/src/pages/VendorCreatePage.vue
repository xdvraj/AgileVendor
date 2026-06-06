<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Onboarding"
      title="Create vendor profile"
      description="Capture the essential commercial, operational, and compliance details needed to onboard a new supplier."
    >
      <template #actions>
        <RouterLink to="/vendors" class="btn-secondary">Back to vendors</RouterLink>
        <button class="btn-primary" type="submit" form="vendor-create-form" :disabled="submitting">
          {{ submitting ? 'Saving...' : 'Save vendor' }}
        </button>
      </template>
    </PageHeader>

    <div class="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
      <AppCard title="Core information" subtitle="Foundational identity and contact details">
        <form id="vendor-create-form" class="grid gap-4 md:grid-cols-2" @submit.prevent="submitVendor">
          <div class="md:col-span-2">
            <label class="mb-2 block text-sm font-medium text-slate-700">Vendor name</label>
            <input v-model.trim="form.name" class="field" placeholder="Enter legal vendor name" />
            <p v-if="errors.name" class="mt-2 text-sm text-rose-600">{{ errors.name }}</p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Category</label>
            <select v-model="form.category" class="field">
              <option value="">Select category</option>
              <option>Raw Materials</option>
              <option>Packaging</option>
              <option>Logistics</option>
              <option>Office & Facilities</option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Vendor status</label>
            <select v-model="form.status" class="field">
              <option>Active</option>
              <option>Inactive</option>
              <option>Blacklisted</option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Primary contact</label>
            <input v-model.trim="form.contactName" class="field" placeholder="Contact full name" />
            <p v-if="errors.contactName" class="mt-2 text-sm text-rose-600">{{ errors.contactName }}</p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input v-model.trim="form.email" class="field" type="email" placeholder="contact@vendor.example" />
            <p v-if="errors.email" class="mt-2 text-sm text-rose-600">{{ errors.email }}</p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Phone</label>
            <input v-model.trim="form.phone" class="field" placeholder="+1 (000) 555-0100" />
            <p v-if="errors.phone" class="mt-2 text-sm text-rose-600">{{ errors.phone }}</p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">GST number</label>
            <input v-model.trim="form.gstNumber" class="field" placeholder="Optional GST / tax identifier" />
          </div>
          <div class="md:col-span-2">
            <label class="mb-2 block text-sm font-medium text-slate-700">Address / location</label>
            <textarea
              v-model.trim="form.location"
              class="field min-h-32"
              placeholder="Add the vendor address or operating location"
            ></textarea>
          </div>

          <div v-if="errors.form" class="md:col-span-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {{ errors.form }}
          </div>
        </form>
      </AppCard>

      <AppCard title="Onboarding checklist" subtitle="Suggested milestones after profile creation">
        <ul class="space-y-3 text-sm text-slate-600">
          <li class="border-b border-slate-200 pb-3">Tax and legal documents collected</li>
          <li class="border-b border-slate-200 pb-3">Banking and payment details validated</li>
          <li class="border-b border-slate-200 pb-3">Quality and risk review completed</li>
          <li>Preferred RFQ categories assigned</li>
        </ul>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
import { createVendor } from '@/api/vendors';
import AppCard from '@/components/AppCard.vue';
import PageHeader from '@/components/PageHeader.vue';
import type { VendorStatus } from '@/types';
import { getErrorMessage } from '@/utils/http';

const router = useRouter();
const submitting = ref(false);

const form = reactive({
  name: '',
  category: '',
  status: 'Active' as VendorStatus,
  contactName: '',
  email: '',
  phone: '',
  location: '',
  gstNumber: ''
});

const errors = reactive({
  name: '',
  contactName: '',
  email: '',
  phone: '',
  form: ''
});

const validate = () => {
  errors.name = '';
  errors.contactName = '';
  errors.email = '';
  errors.phone = '';
  errors.form = '';

  if (!form.name) {
    errors.name = 'Vendor name is required.';
  }

  if (!form.contactName) {
    errors.contactName = 'Primary contact is required.';
  }

  if (!form.email) {
    errors.email = 'Email is required.';
  }

  if (!form.phone) {
    errors.phone = 'Phone is required.';
  }

  return !errors.name && !errors.contactName && !errors.email && !errors.phone;
};

const submitVendor = async () => {
  if (!validate()) {
    errors.form = 'Please correct the highlighted fields.';
    return;
  }

  submitting.value = true;

  try {
    const vendor = await createVendor({
      name: form.name,
      category: form.category,
      status: form.status,
      contactName: form.contactName,
      email: form.email,
      phone: form.phone,
      location: form.location,
      gstNumber: form.gstNumber
    });

    await router.push(`/vendors/${vendor.id}`);
  } catch (error) {
    errors.form = getErrorMessage(error, 'Unable to create this vendor right now.');
  } finally {
    submitting.value = false;
  }
};
</script>
