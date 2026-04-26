<template>
    <div class="p-6 max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">My Profile</h1>
      <div class="card bg-base-100 shadow-md p-6">
        <div class="flex items-center gap-6 mb-6">
          <div class="avatar placeholder">
            <div class="bg-primary text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold">
              {{ form.name?.charAt(0) }}
            </div>
          </div>
          <div>
            <h2 class="text-xl font-semibold">{{ form.name }}</h2>
            <p class="text-gray-500">{{ form.email }}</p>
          </div>
        </div>
        <form @submit.prevent="handleSave">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Full Name</label>
            <input v-model="form.name" type="text" class="input input-bordered w-full" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Email</label>
            <input v-model="form.email" type="email" class="input input-bordered w-full" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Phone</label>
            <input v-model="form.phone" type="text" class="input input-bordered w-full" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">New Password</label>
            <input v-model="form.password" type="password" class="input input-bordered w-full" placeholder="Leave blank to keep current" />
          </div>
          <div class="flex justify-end">
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const form = ref({
    name: 'Admin User',
    email: 'admin@erp.com',
    phone: '+1234567890',
    password: ''
  })
  
  const handleSave = () => {
    alert('Profile saved successfully!')
  }
  </script>