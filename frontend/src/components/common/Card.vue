<template>
    <div class="bg-white rounded-lg shadow-md overflow-hidden" :class="cardClass">
      <div v-if="title || $slots.header" class="px-6 py-4 border-b border-gray-200">
        <slot name="header">
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        </slot>
      </div>
      
      <div class="p-6">
        <slot></slot>
      </div>
      
      <div v-if="$slots.footer" class="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <slot name="footer"></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: {
      type: String,
      default: ''
    },
    cardClass: {
      type: String,
      default: ''
    }
  })
  </script>