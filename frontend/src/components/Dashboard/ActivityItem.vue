<template>
    <div class="flex items-start space-x-3 rtl:space-x-reverse">
      <div
        class="flex items-center justify-center h-8 w-8 rounded-full flex-shrink-0"
        :class="bgColor"
      >
        <component :is="iconComponent" class="h-4 w-4" :class="textColor" />
      </div>
      
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
        <p class="text-sm text-gray-500">{{ activity.description }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import {
    UserPlusIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    FlagIcon
  } from '@heroicons/vue/24/outline'
  
  const props = defineProps({
    activity: {
      type: Object,
      required: true
    }
  })
  
  const iconMap = {
    'user-plus': UserPlusIcon,
    'document-text': DocumentTextIcon,
    'check-circle': CheckCircleIcon,
    'flag': FlagIcon
  }
  
  const colorMap = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' }
  }
  
  const iconComponent = computed(() => iconMap[props.activity.icon])
  const bgColor = computed(() => colorMap[props.activity.color]?.bg || 'bg-gray-100')
  const textColor = computed(() => colorMap[props.activity.color]?.text || 'text-gray-600')
  </script>