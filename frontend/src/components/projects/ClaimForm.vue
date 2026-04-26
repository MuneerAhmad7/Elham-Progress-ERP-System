<template>
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">{{ claim ? 'Edit Claim' : 'New Progress Claim' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Claim Title</label>
          <input v-model="form.title" type="text" class="input input-bordered w-full" required />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Amount</label>
          <input v-model="form.amount" type="number" class="input input-bordered w-full" required />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Period</label>
          <input v-model="form.period" type="text" class="input input-bordered w-full" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Status</label>
          <select v-model="form.status" class="select select-bordered w-full">
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div class="flex gap-2 justify-end">
          <button type="button" class="btn btn-ghost" @click="$emit('close')">Cancel</button>
          <button type="submit" class="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    claim: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['save', 'close'])
  
  const form = ref({
    title: '',
    amount: '',
    period: '',
    status: 'draft'
  })
  
  watch(() => props.claim, (val) => {
    if (val) form.value = { ...val }
  }, { immediate: true })
  
  const handleSubmit = () => {
    emit('save', { ...form.value })
  }
  </script>