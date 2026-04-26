<template>
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <p class="text-sm text-gray-500">
            &copy; {{ currentYear }} {{ $t('app.name') }}. All rights reserved.
          </p>
          <p class="text-sm text-gray-500">
            Version {{ appVersion }}
          </p>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const currentYear = computed(() => new Date().getFullYear())
  const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0'
  </script>