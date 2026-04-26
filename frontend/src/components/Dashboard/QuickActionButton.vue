<template>
    <button
      @click="$emit('click')"
      class="flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
    >
      <component :is="iconComponent" class="h-8 w-8 text-blue-600 mb-2" />
      <span class="text-sm font-medium text-gray-700 text-center">{{ label }}</span>
    </button>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import {
    UserPlusIcon,
    DocumentPlusIcon,
    ClipboardDocumentListIcon,
    FolderPlusIcon
  } from '@heroicons/vue/24/outline'
  
  const props = defineProps({
    icon: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  })
  
  defineEmits(['click'])
  
  const iconMap = {
    'user-plus': UserPlusIcon,
    'document-plus': DocumentPlusIcon,
    'clipboard-list': ClipboardDocumentListIcon,
    'folder-plus': FolderPlusIcon
  }
  
  const iconComponent = computed(() => iconMap[props.icon])
  </script>