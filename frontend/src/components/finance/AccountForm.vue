<template>
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">{{ account ? 'Edit Account' : 'New Account' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Account Name</label>
          <input v-model="form.name" type="text" class="input input-bordered w-full" required />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Account Code</label>
          <input v-model="form.code" type="text" class="input input-bordered w-full" required />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Type</label>
          <select v-model="form.type" class="select select-bordered w-full">
            <option value="asset">Asset</option>
            <option value="liability">Liability</option>
            <option value="equity">Equity</option>
            <option value="revenue">Revenue</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Balance</label>
          <input v-model="form.balance" type="number" class="input input-bordered w-full" />
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
    account: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['save', 'close'])
  
  const form = ref({
    name: '',
    code: '',
    type: 'asset',
    balance: 0
  })
  
  watch(() => props.account, (val) => {
    if (val) {
      form.value = { ...val }
    }
  }, { immediate: true })
  
  const handleSubmit = () => {
    emit('save', { ...form.value })
  }
  </script>