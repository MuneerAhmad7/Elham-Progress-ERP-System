<template>
    <div
      class="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-4 cursor-move hover:shadow-md transition-all"
      @click="$emit('click', opportunity)"
    >
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <h3 class="text-base font-semibold text-gray-900">
          {{ opportunity.opportunity_name }}
        </h3>
        
        <div
          class="px-2 py-1 rounded text-xs font-medium"
          :class="getPriorityClass(opportunity.probability)"
        >
          {{ opportunity.probability }}%
        </div>
      </div>
  
      <!-- Amount -->
      <div class="mb-3">
        <p class="text-2xl font-bold text-blue-600">
          {{ formatCurrency(opportunity.amount) }}
        </p>
        <p class="text-xs text-gray-500">
          {{ t('crm.expectedRevenue') }}: {{ formatCurrency(opportunity.expected_revenue) }}
        </p>
      </div>
  
      <!-- Account Info -->
      <div class="mb-3">
        <p class="text-sm text-gray-600">
          <BuildingOfficeIcon class="h-4 w-4 inline mr-1" />
          {{ opportunity.account_name }}
        </p>
        
        <p v-if="opportunity.contact_name" class="text-sm text-gray-600">
          <UserIcon class="h-4 w-4 inline mr-1" />
          {{ opportunity.contact_name }}
        </p>
      </div>
  
      <!-- Close Date -->
      <div class="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
        <div class="flex items-center">
          <CalendarIcon class="h-4 w-4 mr-1" />
          {{ formatDate(opportunity.expected_close_date) }}
        </div>
        
        <div>
          {{ opportunity.owner_name }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useI18n } from 'vue-i18n'
  import {
    BuildingOfficeIcon,
    UserIcon,
    CalendarIcon
  } from '@heroicons/vue/24/outline'
  import { formatCurrency, formatDate } from '@/utils/formatters'
  
  const { t } = useI18n()
  
  defineProps({
    opportunity: {
      type: Object,
      required: true
    }
  })
  
  defineEmits(['click'])
  
  const getPriorityClass = (probability) => {
    if (probability >= 75) return 'bg-green-100 text-green-800'
    if (probability >= 50) return 'bg-yellow-100 text-yellow-800'
    if (probability >= 25) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }
  </script>