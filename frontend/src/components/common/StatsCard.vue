<template>
    <div class="card bg-base-100 shadow-md p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">{{ title }}</p>
          <p class="text-2xl font-bold mt-1">{{ value }}</p>
          <p v-if="subtitle" class="text-xs text-gray-400 mt-1">{{ subtitle }}</p>
        </div>
        <div v-if="icon" class="text-4xl text-primary">
          {{ icon }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  })
  </script>