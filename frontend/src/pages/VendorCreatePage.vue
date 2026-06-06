<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Onboarding"
      title="Create vendor profile"
      description="Capture the essential commercial, operational, and compliance details needed to onboard a new supplier."
    >
      <template #actions>
        <RouterLink to="/vendors" class="btn-secondary">Back to vendors</RouterLink>
        <button class="btn-primary">Save draft</button>
      </template>
    </PageHeader>

    <div class="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
      <AppCard title="Core information" subtitle="Foundational identity and contact details">
        <form class="grid gap-4 md:grid-cols-2">
          <div class="md:col-span-2">
            <label class="mb-2 block text-sm font-medium text-slate-700">Vendor name</label>
            <input class="field" placeholder="Enter legal vendor name" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Category</label>
            <select class="field">
              <option>Raw Materials</option>
              <option>Packaging</option>
              <option>Logistics</option>
              <option>Office & Facilities</option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Qualification stage</label>
            <select class="field">
              <option>Pending</option>
              <option>Review</option>
              <option>Active</option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Primary contact</label>
            <input class="field" placeholder="Contact full name" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input class="field" type="email" placeholder="contact@vendor.example" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Phone</label>
            <input class="field" placeholder="+1 (000) 555-0100" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Location</label>
            <input class="field" placeholder="City, State" />
          </div>
          <div class="md:col-span-2">
            <label class="mb-2 block text-sm font-medium text-slate-700">Notes</label>
            <textarea class="field min-h-32" placeholder="Add onboarding remarks, scope, or review notes"></textarea>
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
import { RouterLink } from 'vue-router';
import AppCard from '@/components/AppCard.vue';
import PageHeader from '@/components/PageHeader.vue';
</script>
