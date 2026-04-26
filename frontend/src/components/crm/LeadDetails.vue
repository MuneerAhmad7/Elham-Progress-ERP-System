<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-bold">{{ lead.full_name || lead.company_name }}</h2>
          <p class="text-gray-600">{{ lead.company_name }}</p>
        </div>
        
        <div class="flex space-x-2">
          <button
            @click="$emit('edit')"
            class="btn btn-primary"
          >
            <PencilIcon class="h-4 w-4 mr-2" />
            {{ t('common.edit') }}
          </button>
          
          <button
            @click="convertLead"
            class="btn btn-success"
          >
            {{ t('crm.convert') }}
          </button>
        </div>
      </div>
  
      <!-- Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Contact Information -->
        <Card :title="t('crm.contactInformation')">
          <dl class="space-y-3">
            <div>
              <dt class="text-sm font-medium text-gray-500">{{ t('crm.email') }}</dt>
              <dd class="text-sm text-gray-900">{{ lead.email }}</dd>
            </div>
            
            <div>
              <dt class="text-sm font-medium text-gray-500">{{ t('crm.phone') }}</dt>
              <dd class="text-sm text-gray-900">{{ lead.phone }}</dd>
            </div>
            
            <div v-if="lead.mobile">
              <dt class="text-sm font-medium text-gray-500">{{ t('crm.mobile') }}</dt>
              <dd class="text-sm text-gray-900">{{ lead.mobile }}</dd>
            </div>
            
            <div v-if="lead.website">
              <dt class="text-sm font-medium text-gray-500">{{ t('crm.website') }}</dt>
              <dd class="text-sm text-blue-600">
                <a :href="lead.website" target="_blank">{{ lead.website }}</a>
              </dd>
            </div>
          </dl>
        </Card>
  
        <!-- Lead Details -->
        <Card :title="t('crm.leadDetails')">
          <dl class="space-y-3">
            <div>
              <dt class="text-sm font-medium text-gray-500">{{ t('crm.status') }}</dt>
              <dd>
                <span class="badge" :class="getStatusBadgeClass(lead.status)">
                  {{ lead.status }}
                </span>
              </dd>
            </div>
            
            <div>
              <dt class="text-sm font-medium text-gray-500">{{ t('crm.source') }}</dt>
              <dd class="text-sm text-gray-900">{{ lead.source }}</dd>
            </div>
            
            <div v-if="lead.industry">
              <dt class="text-sm font-medium text-gray-500">{{ t('crm.industry') }}</dt>
              <dd class="text-sm text-gray-900">{{ lead.industry }}</dd>
            </div>
            
            <div v-if="lead.lead_score">
              <dt class="text-sm font-medium text-gray-500">{{ t('crm.leadScore') }}</dt>
              <dd class="text-sm text-gray-900 flex items-center">
                <StarIcon class="h-4 w-4 text-yellow-400 mr-1" />
                {{ lead.lead_score }}
              </dd>
            </div>
            
            <div>
              <dt class="text-sm font-medium text-gray-500">{{ t('crm.assignedTo') }}</dt>
              <dd class="text-sm text-gray-900">{{ lead.assigned_to || t('common.unassigned') }}</dd>
            </div>
          </dl>
        </Card>
      </div>
  
      <!-- Address -->
      <Card v-if="lead.address" :title="t('crm.address')">
        <p class="text-sm text-gray-900">{{ formatAddress(lead) }}</p>
      </Card>
  
      <!-- Notes -->
      <Card v-if="lead.notes" :title="t('crm.notes')">
        <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ lead.notes }}</p>
      </Card>
  
      <!-- Activities Timeline -->
      <Card :title="t('crm.activities')">
        <div class="space-y-4">
          <div v-for="activity in activities" :key="activity.id" class="flex">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <component :is="getActivityIcon(activity.type)" class="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
              <p class="text-sm text-gray-600">{{ activity.description }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ activity.created_at }}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import {
    PencilIcon,
    StarIcon,
    PhoneIcon,
    EnvelopeIcon,
    CalendarIcon
  } from '@heroicons/vue/24/outline'
  import Card from '@/components/common/Card.vue'
  import { getStatusBadgeClass, formatAddress } from '@/utils/formatters'
  
  const { t } = useI18n()
  
  const props = defineProps({
    lead: {
      type: Object,
      required: true
    }
  })
  
  const emit = defineEmits(['close', 'edit'])
  
  const activities = ref([
    {
      id: 1,
      type: 'call',
      title: 'Phone call made',
      description: 'Discussed product features',
      created_at: '2 hours ago'
    },
    {
      id: 2,
      type: 'email',
      title: 'Email sent',
      description: 'Sent product brochure',
      created_at: '1 day ago'
    }
  ])
  
  const getActivityIcon = (type) => {
    const icons = {
      call: PhoneIcon,
      email: EnvelopeIcon,
      meeting: CalendarIcon
    }
    return icons[type] || CalendarIcon
  }
  
  const convertLead = () => {
    // Handle lead conversion
    console.log('Converting lead:', props.lead)
  }
  </script>