<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Sourcing Launch"
      title="Create RFQ"
      description="Draft a sourcing event with scope, dates, invited suppliers, and commercial guardrails."
    >
      <template #actions>
        <RouterLink to="/rfqs" class="btn-secondary">Back to RFQs</RouterLink>
        <button class="btn-primary">Save RFQ</button>
      </template>
    </PageHeader>

    <div class="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <AppCard title="Event details" subtitle="Basic sourcing information">
        <form class="grid gap-4 md:grid-cols-2">
          <div class="md:col-span-2">
            <label class="mb-2 block text-sm font-medium text-slate-700">RFQ title</label>
            <input class="field" placeholder="Describe the sourcing initiative" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Category</label>
            <select class="field">
              <option>Packaging</option>
              <option>Raw Materials</option>
              <option>Warehousing</option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Budget target</label>
            <input class="field" type="number" placeholder="125000" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Issue date</label>
            <input class="field" type="date" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Due date</label>
            <input class="field" type="date" />
          </div>
          <div class="md:col-span-2">
            <label class="mb-2 block text-sm font-medium text-slate-700">Scope summary</label>
            <textarea class="field min-h-32" placeholder="Outline specifications, delivery expectations, and evaluation notes"></textarea>
          </div>
        </form>
      </AppCard>

      <div class="space-y-6">
        <AppCard title="Invite vendors" subtitle="Suggested supplier pool for this event">
          <div class="divide-y divide-slate-200">
            <label v-for="vendor in vendors" :key="vendor.id" class="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <input type="checkbox" class="mt-1 rounded border-slate-300 text-brand-600" />
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
import { RouterLink } from 'vue-router';
import { vendors } from '@/api/mockData';
import AppCard from '@/components/AppCard.vue';
import PageHeader from '@/components/PageHeader.vue';
</script>
