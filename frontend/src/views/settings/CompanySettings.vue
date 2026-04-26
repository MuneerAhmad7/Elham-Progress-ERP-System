<template>
    <div class="p-6 max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Company Settings</h1>
      <div class="card bg-base-100 shadow-md p-6">
        <form @submit.prevent="handleSave">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Company Name</label>
            <input v-model="form.companyName" type="text" class="input input-bordered w-full" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Address</label>
            <textarea v-model="form.address" class="textarea textarea-bordered w-full"></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Phone</label>
            <input v-model="form.phone" type="text" class="input input-bordered w-full" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Email</label>
            <input v-model="form.email" type="email" class="input input-bordered w-full" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Website</label>
            <input v-model="form.website" type="text" class="input input-bordered w-full" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Tax Number</label>
            <input v-model="form.taxNumber" type="text" class="input input-bordered w-full" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Currency</label>
            <select v-model="form.currency" class="select select-bordered w-full">
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="SAR">SAR - Saudi Riyal</option>
              <option value="AED">AED - UAE Dirham</option>
            </select>
          </div>
          <div class="flex justify-end">
            <button type="submit" class="btn btn-primary">Save Settings</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const form = ref({
    companyName: 'My Company LLC',
    address: '123 Business Street, City, Country',
    phone: '+1234567890',
    email: 'info@company.com',
    website: 'www.company.com',
    taxNumber: 'TAX-123456',
    currency: 'USD'
  })
  
  const handleSave = () => {
    alert('Company settings saved successfully!')
  }
  </script>