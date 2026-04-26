<template>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-3">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <img
              :src="employee.photo_url || '/default-avatar.png'"
              :alt="employee.full_name"
              class="h-12 w-12 rounded-full object-cover"
            />
          </div>
          
          <!-- Info -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ employee.full_name }}
            </h3>
            <p class="text-sm text-gray-600">{{ employee.job_position }}</p>
            <p class="text-xs text-gray-500">{{ employee.employee_number }}</p>
          </div>
        </div>
        
        <!-- Status Badge -->
        <span
          class="badge"
          :class="getStatusBadgeClass(employee.employment_status)"
        >
          {{ employee.employment_status }}
        </span>
      </div>
  
      <!-- Details -->
      <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p class="text-gray-500">{{ t('hr.department') }}</p>
          <p class="font-medium">{{ employee.department || '-' }}</p>
        </div>
        
        <div>
          <p class="text-gray-500">{{ t('hr.branch') }}</p>
          <p class="font-medium">{{ employee.branch || '-' }}</p>
        </div>
        
        <div>
          <p class="text-gray-500">{{ t('hr.email') }}</p>
          <p class="font-medium text-blue-600">{{ employee.email || '-' }}</p>
        </div>
        
        <div>
          <p class="text-gray-500">{{ t('hr.phone') }}</p>
          <p class="font-medium">{{ employee.phone || '-' }}</p>
        </div>
      </div>
  
      <!-- Actions -->
      <div class="mt-4 flex justify-end space-x-2 pt-3 border-t">
        <button
          @click="$emit('view', employee)"
          class="btn btn-sm btn-outline"
          :title="t('common.view')"
        >
          <EyeIcon class="h-4 w-4" />
        </button>
        
        <button
          @click="$emit('edit', employee)"
          class="btn btn-sm btn-outline"
          :title="t('common.edit')"
        >
          <PencilIcon class="h-4 w-4" />
        </button>
        
        <button
          @click="$emit('delete', employee)"
          class="btn btn-sm btn-outline text-red-600 hover:bg-red-50"
          :title="t('common.delete')"
        >
          <TrashIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useI18n } from 'vue-i18n'
  import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
  import { getStatusBadgeClass } from '@/utils/formatters'
  
  const { t } = useI18n()
  
  defineProps({
    employee: {
      type: Object,
      required: true
    }
  })
  
  defineEmits(['view', 'edit', 'delete'])
  </script>