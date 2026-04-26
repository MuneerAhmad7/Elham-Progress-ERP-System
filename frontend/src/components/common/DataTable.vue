<template>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              :class="{ 'cursor-pointer hover:bg-gray-100': column.sortable }"
              @click="column.sortable && handleSort(column.key)"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.label }}</span>
                <ChevronUpDownIcon
                  v-if="column.sortable"
                  class="h-4 w-4"
                />
              </div>
            </th>
          </tr>
        </thead>
        
        <tbody v-if="!loading" class="bg-white divide-y divide-gray-200">
          <tr
            v-for="row in paginatedData"
            :key="row.id"
            class="hover:bg-gray-50"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-sm"
            >
              <!-- Badge Type -->
              <span
                v-if="column.type === 'badge'"
                class="badge"
                :class="getBadgeClass(row[column.key])"
              >
                {{ row[column.key] }}
              </span>
              
              <!-- Currency Type -->
              <span v-else-if="column.type === 'currency'">
                {{ formatCurrency(row[column.key]) }}
              </span>
              
              <!-- Actions Type -->
              <div v-else-if="column.type === 'actions'" class="flex space-x-2">
                <button
                  v-if="!hideActions.includes('view')"
                  @click="$emit('view', row)"
                  class="text-blue-600 hover:text-blue-900"
                  :title="t('common.view')"
                >
                  <EyeIcon class="h-5 w-5" />
                </button>
                
                <button
                  v-if="!hideActions.includes('edit')"
                  @click="$emit('edit', row)"
                  class="text-green-600 hover:text-green-900"
                  :title="t('common.edit')"
                >
                  <PencilIcon class="h-5 w-5" />
                </button>
                
                <button
                  v-if="!hideActions.includes('delete')"
                  @click="$emit('delete', row)"
                  class="text-red-600 hover:text-red-900"
                  :title="t('common.delete')"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
              
              <!-- Default -->
              <span v-else>{{ row[column.key] }}</span>
            </td>
          </tr>
          
          <tr v-if="paginatedData.length === 0">
            <td :colspan="columns.length" class="px-6 py-8 text-center text-gray-500">
              {{ t('common.noData') }}
            </td>
          </tr>
        </tbody>
        
        <tbody v-else>
          <tr>
            <td :colspan="columns.length" class="px-6 py-8">
              <LoadingSpinner />
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Pagination -->
      <div
        v-if="paginatedData.length > 0"
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      >
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="btn btn-sm"
          >
            {{ t('common.previous') }}
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="btn btn-sm"
          >
            {{ t('common.next') }}
          </button>
        </div>
        
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              {{ t('common.showing') }}
              <span class="font-medium">{{ startIndex + 1 }}</span>
              {{ t('common.to') }}
              <span class="font-medium">{{ endIndex }}</span>
              {{ t('common.of') }}
              <span class="font-medium">{{ data.length }}</span>
              {{ t('common.results') }}
            </p>
          </div>
          
          <div class="flex space-x-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="btn btn-sm"
            >
              {{ t('common.previous') }}
            </button>
            
            <span class="px-3 py-1 text-sm">
              {{ currentPage }} / {{ totalPages }}
            </span>
            
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="btn btn-sm"
            >
              {{ t('common.next') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import {
    ChevronUpDownIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon
  } from '@heroicons/vue/24/outline'
  import LoadingSpinner from './LoadingSpinner.vue'
  
  const props = defineProps({
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    perPage: {
      type: Number,
      default: 10
    },
    hideActions: {
      type: Array,
      default: () => []
    }
  })
  
  defineEmits(['view', 'edit', 'delete'])
  
  const { t } = useI18n()
  
  const currentPage = ref(1)
  const sortKey = ref('')
  const sortOrder = ref('asc')
  
  const totalPages = computed(() => Math.ceil(props.data.length / props.perPage))
  const startIndex = computed(() => (currentPage.value - 1) * props.perPage)
  const endIndex = computed(() => Math.min(startIndex.value + props.perPage, props.data.length))
  
  const paginatedData = computed(() => {
    return props.data.slice(startIndex.value, endIndex.value)
  })
  
  const handleSort = (key) => {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortOrder.value = 'asc'
    }
  }
  
  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR'
    }).format(value || 0)
  }
  
  const getBadgeClass = (status) => {
    const statusMap = {
      active: 'badge-success',
      inactive: 'badge-danger',
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger',
      draft: 'badge-info',
      posted: 'badge-success',
      paid: 'badge-success',
      unpaid: 'badge-warning',
      overdue: 'badge-danger',
      present: 'badge-success',
      absent: 'badge-danger',
      late: 'badge-warning',
      processed: 'badge-success'
    }
    
    return statusMap[status?.toLowerCase()] || 'badge-info'
  }
  </script>