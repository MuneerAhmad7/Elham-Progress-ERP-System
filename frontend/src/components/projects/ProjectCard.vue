<template>
    <div
      class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      @click="$emit('view', project)"
    >
      <!-- Header with Status -->
      <div class="p-4 border-b" :class="getHeaderColor(project.status)">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ project.project_name }}
            </h3>
            <p class="text-sm text-gray-600">{{ project.project_code }}</p>
          </div>
          
          <span
            class="badge"
            :class="getStatusBadgeClass(project.status)"
          >
            {{ t(`projects.${project.status}`) }}
          </span>
        </div>
      </div>
  
      <!-- Project Info -->
      <div class="p-4">
        <div class="space-y-3">
          <!-- Client -->
          <div class="flex items-center text-sm">
            <BuildingOfficeIcon class="h-4 w-4 text-gray-400 mr-2" />
            <span class="text-gray-600">{{ t('projects.client') }}:</span>
            <span class="ml-auto font-medium">{{ project.client_name }}</span>
          </div>
  
          <!-- Contract Value -->
          <div class="flex items-center text-sm">
            <CurrencyDollarIcon class="h-4 w-4 text-gray-400 mr-2" />
            <span class="text-gray-600">{{ t('projects.value') }}:</span>
            <span class="ml-auto font-medium text-blue-600">
              {{ formatCurrency(project.contract_value) }}
            </span>
          </div>
  
          <!-- Progress Bar -->
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span class="text-gray-600">{{ t('projects.progress') }}</span>
              <span class="font-medium">{{ project.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all"
                :class="getProgressColor(project.progress)"
                :style="{ width: project.progress + '%' }"
              ></div>
            </div>
          </div>
  
          <!-- Dates -->
          <div class="flex items-center text-sm">
            <CalendarIcon class="h-4 w-4 text-gray-400 mr-2" />
            <span class="text-gray-600">
              {{ formatDate(project.start_date) }} - {{ formatDate(project.end_date) }}
            </span>
          </div>
  
          <!-- Project Manager -->
          <div class="flex items-center text-sm">
            <UserIcon class="h-4 w-4 text-gray-400 mr-2" />
            <span class="text-gray-600">{{ t('projects.projectManager') }}:</span>
            <span class="ml-auto">{{ project.project_manager }}</span>
          </div>
        </div>
      </div>
  
      <!-- Actions -->
      <div class="px-4 py-3 bg-gray-50 flex justify-end space-x-2">
        <button
          @click.stop="$emit('edit', project)"
          class="btn btn-sm btn-outline"
          :title="t('common.edit')"
        >
          <PencilIcon class="h-4 w-4" />
        </button>
        
        <button
          @click.stop="viewFinancials(project)"
          class="btn btn-sm btn-outline"
          :title="t('projects.financials')"
        >
          <ChartBarIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useI18n } from 'vue-i18n'
  import {
    BuildingOfficeIcon,
    CurrencyDollarIcon,
    CalendarIcon,
    UserIcon,
    PencilIcon,
    ChartBarIcon
  } from '@heroicons/vue/24/outline'
  import { formatCurrency, formatDate, getStatusBadgeClass } from '@/utils/formatters'
  
  const { t } = useI18n()
  
  defineProps({
    project: {
      type: Object,
      required: true
    }
  })
  
  defineEmits(['view', 'edit'])
  
  const getHeaderColor = (status) => {
    const colors = {
      planning: 'bg-blue-50',
      in_progress: 'bg-yellow-50',
      on_hold: 'bg-red-50',
      completed: 'bg-green-50'
    }
    return colors[status] || 'bg-gray-50'
  }
  
  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    if (progress >= 25) return 'bg-orange-500'
    return 'bg-red-500'
  }
  
  const viewFinancials = (project) => {
    console.log('View financials:', project)
  }
  </script>