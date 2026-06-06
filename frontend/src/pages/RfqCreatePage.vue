<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Sourcing Launch"
      title="Create RFQ"
      description="Draft a sourcing event with scope, dates, invited suppliers, and commercial guardrails."
    >
      <template #actions>
        <RouterLink to="/rfqs" class="btn-secondary">Back to RFQs</RouterLink>
        <button class="btn-primary" type="submit" form="rfq-create-form" :disabled="submitting">
          {{ submitting ? 'Saving...' : 'Save RFQ' }}
        </button>
      </template>
    </PageHeader>

    <div class="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <AppCard title="Event details" subtitle="Basic sourcing information">
        <form id="rfq-create-form" class="grid gap-4 md:grid-cols-2" @submit.prevent="submitRfq">
          <div class="md:col-span-2">
            <label class="mb-2 block text-sm font-medium text-slate-700">RFQ title</label>
            <input v-model.trim="form.title" class="field" placeholder="Describe the sourcing initiative" />
            <p v-if="errors.title" class="mt-2 text-sm text-rose-600">{{ errors.title }}</p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Category</label>
            <select v-model="form.category" class="field">
              <option value="">Select category</option>
              <option>Packaging</option>
              <option>Raw Materials</option>
              <option>Warehousing</option>
            </select>
            <p v-if="errors.category" class="mt-2 text-sm text-rose-600">{{ errors.category }}</p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Budget target</label>
            <input v-model.number="form.budget" class="field" type="number" min="0" placeholder="125000" />
            <p v-if="errors.budget" class="mt-2 text-sm text-rose-600">{{ errors.budget }}</p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Issue date</label>
            <input v-model="form.issueDate" class="field" type="date" />
            <p v-if="errors.issueDate" class="mt-2 text-sm text-rose-600">{{ errors.issueDate }}</p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Due date</label>
            <input v-model="form.dueDate" class="field" type="date" />
            <p v-if="errors.dueDate" class="mt-2 text-sm text-rose-600">{{ errors.dueDate }}</p>
          </div>
          <div class="md:col-span-2">
            <label class="mb-2 block text-sm font-medium text-slate-700">Scope summary</label>
            <textarea
              v-model.trim="form.scopeSummary"
              class="field min-h-32"
              placeholder="Outline specifications, delivery expectations, and evaluation notes"
            ></textarea>
            <p v-if="errors.scopeSummary" class="mt-2 text-sm text-rose-600">{{ errors.scopeSummary }}</p>
          </div>

          <div v-if="errors.form" class="md:col-span-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {{ errors.form }}
          </div>
        </form>
      </AppCard>

      <div class="space-y-6">
        <AppCard title="Invite vendors" subtitle="Suggested supplier pool for this event">
          <p v-if="loadingVendors" class="text-sm text-slate-500">Loading vendors from the backend...</p>
          <p v-else-if="vendorError" class="text-sm text-rose-600">{{ vendorError }}</p>
          <p v-else-if="!vendors.length" class="text-sm text-slate-500">No vendors available yet. Create one first.</p>
          <div v-else class="divide-y divide-slate-200">
            <label v-for="vendor in vendors" :key="vendor.id" class="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <input v-model="form.assignedVendorIds" :value="vendor.id" type="checkbox" class="mt-1 rounded border-slate-300 text-brand-600" />
              <div>
                <p class="text-sm font-medium text-slate-900">{{ vendor.name }}</p>
                <p class="mt-1 text-sm text-slate-500">{{ vendor.category }} | {{ vendor.location }}</p>
              </div>
            </label>
          </div>
        </AppCard>

        <AppCard title="Evaluation criteria" subtitle="Suggested scoring focus">
          <ul class="space-y-3 text-sm text-slate-600">
            <li class="border-b border-slate-200 pb-3">Commercial competitiveness</li>
            <li class="border-b border-slate-200 pb-3">Lead time and fulfillment reliability</li>
            <li>Quality and compliance alignment</li>
          </ul>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { createRfq } from '@/api/rfqs';
import { fetchVendors } from '@/api/vendors';
import AppCard from '@/components/AppCard.vue';
import PageHeader from '@/components/PageHeader.vue';
import type { Vendor } from '@/types';
import { getErrorMessage } from '@/utils/http';

const router = useRouter();
const vendors = ref<Vendor[]>([]);
const loadingVendors = ref(true);
const vendorError = ref('');
const submitting = ref(false);

const today = new Date().toISOString().slice(0, 10);

const form = reactive({
  title: '',
  category: '',
  budget: 0,
  issueDate: today,
  dueDate: '',
  scopeSummary: '',
  assignedVendorIds: [] as string[]
});

const errors = reactive({
  title: '',
  category: '',
  budget: '',
  issueDate: '',
  dueDate: '',
  scopeSummary: '',
  form: ''
});

const validate = () => {
  errors.title = '';
  errors.category = '';
  errors.budget = '';
  errors.issueDate = '';
  errors.dueDate = '';
  errors.scopeSummary = '';
  errors.form = '';

  if (!form.title) {
    errors.title = 'RFQ title is required.';
  }

  if (!form.category) {
    errors.category = 'Category is required.';
  }

  if (form.budget < 0) {
    errors.budget = 'Budget target cannot be negative.';
  }

  if (!form.issueDate) {
    errors.issueDate = 'Issue date is required.';
  }

  if (!form.dueDate) {
    errors.dueDate = 'Due date is required.';
  } else if (form.issueDate && form.dueDate < form.issueDate) {
    errors.dueDate = 'Due date must be on or after the issue date.';
  }

  if (!form.scopeSummary) {
    errors.scopeSummary = 'Scope summary is required.';
  }

  return !errors.title && !errors.category && !errors.budget && !errors.issueDate && !errors.dueDate && !errors.scopeSummary;
};

const submitRfq = async () => {
  if (!validate()) {
    errors.form = 'Please correct the highlighted fields.';
    return;
  }

  submitting.value = true;

  try {
    const rfq = await createRfq({
      title: form.title,
      category: form.category,
      budget: form.budget,
      issueDate: form.issueDate,
      dueDate: form.dueDate,
      scopeSummary: form.scopeSummary,
      assignedVendorIds: form.assignedVendorIds
    });

    await router.push(`/rfqs/${rfq.backendId ?? rfq.id}`);
  } catch (error) {
    errors.form = getErrorMessage(error, 'Unable to save this RFQ right now.');
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  try {
    vendors.value = await fetchVendors();
  } catch (error) {
    vendorError.value = getErrorMessage(error, 'Unable to load vendors.');
  } finally {
    loadingVendors.value = false;
  }
});
</script>
