<template>
    <div
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-move hover:shadow-md transition-shadow"
      draggable="true"
      @dragstart="onDragStart"
    >
      <!-- Header -->
      <div class="flex justify-between items-start mb-2">
        <h4 class="text-sm font-semibold text-gray-900 line-clamp-2">
          {{ task.title }}
        </h4>
        
        <span
          class="badge text-xs"
          :class="getPriorityBadgeClass(task.priority)"
        >
          {{ task.priority }}
        </span>
      </div>
  
      <!-- Description -->
      <p v-if="task.description" class="text-xs text-gray-600 mb-3 line-clamp-2">
        {{ task.description }}
      </p>
  
      <!-- Tags -->
      <div v-if="task.tags && task.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
        <span
          v-for="tag in task.tags"
          :key="tag"
          class="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
        >
          {{ tag }}
        </span>
      </div>
  
      <!-- Footer -->
      <div class="flex items-center justify-between text-xs text-gray-500">
        <div class="flex items-center">
          <UserIcon class="h-3 w-3 mr-1" />
          <span>{{ task.assigned_to_name || t('common.unassigned') }}</span>
        </div>
        
        <div v-if="task.due_date" class="flex items-center">
          <CalendarIcon class="h-3 w-3 mr-1" />
          <span :class="{ 'text-red-600 font-medium': isOverdue }">
            {{ formatDate(task.due_date) }}
          </span>
        </div>
      </div>
  
      <!-- Progress -->
      <div v-if="task.progress_percent > 0" class="mt-3">
        <div class="w-full bg-gray-200 rounded-full h-1.5">
          <div
            class="h-1.5 rounded-full"
            :class="getProgressColor(task.progress_percent)"
            :style="{ width: task.progress_percent + '%' }"
          ></div>
        </div>
      </div>
  
      <!-- Actions -->
      <div class="mt-3 flex justify-end space-x-1">
        <button
          @click.stop="$emit('view', task)"
          class="p-1 hover:bg-gray-100 rounded"
          :title="t('common.view')"
        >
          <EyeIcon class="h-4 w-4 text-gray-600" />
        </button>
        
        <button
          @click.stop="$emit('edit', task)"
          class="p-1 hover:bg-gray-100 rounded"
          :title="t('common.edit')"
        >
          <PencilIcon class="h-4 w-4 text-gray-600" />
        </button>
        
        <button
          @click.stop="$emit('delete', task)"
          class="p-1 hover:bg-red-50 rounded"
          :title="t('common.delete')"
        >
          <TrashIcon class="h-4 w-4 text-red-600" />
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import {
    UserIcon,
    CalendarIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon
  } from '@heroicons/vue/24/outline'
  import { formatDate, getPriorityBadgeClass } from '@/utils/formatters'
  
  const { t } = useI18n()
  
  const props = defineProps({
    task: {
      type: Object,
      required: true
    }
  })
  
  defineEmits(['view', 'edit', 'delete'])
  
  const isOverdue = computed(() => {
    if (!props.task.due_date) return false
    const today = new Date().toISOString().split('T')[0]
    return props.task.due_date < today && props.task.status !== 'done'
  })
  
  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    if (progress >= 25) return 'bg-orange-500'
    return 'bg-red-500'
  }
  
  const onDragStart = (event) => {
    event.dataTransfer.setData('taskId', props.task.id)
    event.dataTransfer.effectAllowed = 'move'
  }
  </script>