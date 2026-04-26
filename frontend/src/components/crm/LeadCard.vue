<template>
    <div
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all"
      @click="$emit('click', lead)"
    >
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ lead.full_name || lead.company_name }}
          </h3>
          <p class="text-sm text-gray-600">{{ lead.company_name || lead.job_title }}</p>
        </div>
        
        <div class="flex flex-col items-end space-y-1">
          <span
            class="badge"
            :class="getStatusBadgeClass(lead.status)"
          >
            {{ t(`crm.${lead.status}`) }}
          </span>
          
          <div v-if="lead.lead_score" class="flex items-center">
            <StarIcon class="h-4 w-4 text-yellow-400 mr-1" />
            <span class="text-sm font-medium">{{ lead.lead_score }}</span>
          </div>
        </div>
      </div>
  
      <!-- Contact Info -->
      <div class="space-y-2 mb-3">
        <div v-if="lead.email" class="flex items-center text-sm text-gray-600">
          <EnvelopeIcon class="h-4 w-4 mr-2" />
          {{ lead.email }}
        </div>
        
        <div v-if="lead.phone" class="flex items-center text-sm text-gray-600">
          <PhoneIcon class="h-4 w-4 mr-2" />
          {{ lead.phone }}
        </div>
        
        <div v-if="lead.source" class="flex items-center text-sm text-gray-600">
          <TagIcon class="h-4 w-4 mr-2" />
          {{ lead.source }}
        </div>
      </div>
  
      <!-- Footer -->
      <div class="flex items-center justify-between pt-3 border-t">
        <div class="text-xs text-gray-500">
          {{ t('crm.assignedTo') }}: {{ lead.assigned_to || t('common.unassigned') }}
        </div>
        
        <div class="flex space-x-1">
          <button
            @click.stop="$emit('edit', lead)"
            class="p-1 hover:bg-gray-100 rounded"
            :title="t('common.edit')"
          >
            <PencilIcon class="h-4 w-4 text-gray-600" />
          </button>
          
          <button
            @click.stop="$emit('delete', lead)"
            class="p-1 hover:bg-red-50 rounded"
            :title="t('common.delete')"
          >
            <TrashIcon class="h-4 w-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useI18n } from 'vue-i18n'
  import {
    StarIcon,
    EnvelopeIcon,
    PhoneIcon,
    TagIcon,
    PencilIcon,
    TrashIcon
  } from '@heroicons/vue/24/outline'
  import { getStatusBadgeClass } from '@/utils/formatters'
  
  const { t } = useI18n()
  
  defineProps({
    lead: {
      type: Object,
      required: true
    }
  })
  
  defineEmits(['click', 'edit', 'delete'])
  </script>