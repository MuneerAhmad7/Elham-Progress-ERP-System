<template>
    <div class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div class="flex items-center space-x-3 rtl:space-x-reverse">
        <div
          class="h-2 w-2 rounded-full"
          :class="`bg-${event.color}-500`"
        ></div>
        <div>
          <p class="text-sm font-medium text-gray-900">{{ event.title }}</p>
          <p class="text-xs text-gray-500">{{ event.date }}</p>
        </div>
      </div>
      
      <span
        class="px-2 py-1 text-xs font-medium rounded-full"
        :class="`bg-${event.color}-100 text-${event.color}-800`"
      >
        {{ event.type }}
      </span>
    </div>
  </template>
  
  <script setup>
  defineProps({
    event: {
      type: Object,
      required: true
    }
  })
  </script>