<template>
    <div class="flex items-center justify-center" :class="containerClass">
      <div class="spinner" :style="{ width: size, height: size }"></div>
      <p v-if="text" class="ml-3 text-gray-600">{{ text }}</p>
    </div>
  </template>
  
  <script setup>
  defineProps({
    size: {
      type: String,
      default: '40px'
    },
    text: {
      type: String,
      default: ''
    },
    containerClass: {
      type: String,
      default: 'p-8'
    }
  })
  </script>