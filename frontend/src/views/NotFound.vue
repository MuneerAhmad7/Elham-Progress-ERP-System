<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="text-center">
        <h1 class="text-9xl font-bold text-gray-800">404</h1>
        <p class="text-2xl font-semibold text-gray-600 mt-4">
          {{ t('errors.pageNotFound') }}
        </p>
        <p class="text-gray-500 mt-2">
          {{ t('errors.pageNotFoundDescription') }}
        </p>
        <router-link
          to="/"
          class="mt-6 inline-block btn btn-primary"
        >
          {{ t('errors.backToHome') }}
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useI18n } from 'vue-i18n'
  
  const { t } = useI18n()
  </script>