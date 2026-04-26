<template>
    <div>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Team Members</h3>
        <button class="btn btn-sm btn-primary">Add Member</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(member, index) in members" :key="index" class="card bg-base-100 shadow p-4 flex flex-row items-center gap-4">
          <div class="avatar placeholder">
            <div class="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
              {{ member.name?.charAt(0) }}
            </div>
          </div>
          <div>
            <p class="font-semibold">{{ member.name }}</p>
            <p class="text-sm text-gray-500">{{ member.role }}</p>
            <p class="text-xs text-gray-400">{{ member.email }}</p>
          </div>
        </div>
        <div v-if="!members || members.length === 0" class="col-span-2 text-center text-gray-400 py-4">
          No team members assigned
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    members: {
      type: Array,
      default: () => []
    }
  })
  </script>