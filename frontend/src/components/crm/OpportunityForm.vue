<template>
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">{{ opportunity ? 'Edit Opportunity' : 'New Opportunity' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Title</label>
          <input v-model="form.title" type="text" class="input input-bordered w-full" required />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Value</label>
          <input v-model="form.value" type="number" class="input input-bordered w-full" required />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Status</label>
          <select v-model="form.status" class="select select-bordered w-full">
            <option value="open">Open</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea v-model="form.description" class="textarea textarea-bordered w-full"></textarea>
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
    opportunity: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['save', 'close'])
  
  const form = ref({
    title: '',
    value: '',
    status: 'open',
    description: ''
  })
  
  watch(() => props.opportunity, (val) => {
    if (val) {
      form.value = { ...val }
    }
  }, { immediate: true })
  
  const handleSubmit = () => {
    emit('save', { ...form.value })
  }
  </script>