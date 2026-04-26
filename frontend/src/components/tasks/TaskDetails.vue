<template>
    <div class="space-y-6">
      <!-- Task Header -->
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-bold">{{ task.title }}</h2>
          <p class="text-gray-600">{{ task.task_number }}</p>
        </div>
        
        <div class="flex space-x-2">
          <span
            class="badge"
            :class="getPriorityBadgeClass(task.priority)"
          >
            {{ task.priority }}
          </span>
          
          <span
            class="badge"
            :class="getStatusBadgeClass(task.status)"
          >
            {{ task.status }}
          </span>
        </div>
      </div>
  
      <!-- Progress Bar -->
      <div>
        <div class="flex justify-between text-sm mb-1">
          <span>{{ t('tasks.progress') }}</span>
          <span>{{ task.progress_percent }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div
            class="h-3 rounded-full"
            :class="getProgressColor(task.progress_percent)"
            :style="{ width: task.progress_percent + '%' }"
          ></div>
        </div>
      </div>
  
      <!-- Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Left Column -->
        <div class="space-y-4">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ t('tasks.project') }}</p>
            <p class="text-gray-900">{{ task.project_name || '-' }}</p>
          </div>
          
          <div>
            <p class="text-sm font-medium text-gray-500">{{ t('tasks.assignedTo') }}</p>
            <p class="text-gray-900">{{ task.assigned_to_name || t('common.unassigned') }}</p>
          </div>
          
          <div>
            <p class="text-sm font-medium text-gray-500">{{ t('tasks.createdBy') }}</p>
            <p class="text-gray-900">{{ task.created_by_name }}</p>
          </div>
          
          <div>
            <p class="text-sm font-medium text-gray-500">{{ t('tasks.createdAt') }}</p>
            <p class="text-gray-900">{{ formatDateTime(task.created_at) }}</p>
          </div>
        </div>
  
        <!-- Right Column -->
        <div class="space-y-4">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ t('tasks.startDate') }}</p>
            <p class="text-gray-900">{{ formatDate(task.start_date) || '-' }}</p>
          </div>
          
          <div>
            <p class="text-sm font-medium text-gray-500">{{ t('tasks.dueDate') }}</p>
            <p class="text-gray-900" :class="{ 'text-red-600': isOverdue }">
              {{ formatDate(task.due_date) || '-' }}
            </p>
          </div>
          
          <div>
            <p class="text-sm font-medium text-gray-500">{{ t('tasks.completedDate') }}</p>
            <p class="text-gray-900">{{ formatDate(task.completed_date) || '-' }}</p>
          </div>
          
          <div>
            <p class="text-sm font-medium text-gray-500">{{ t('tasks.estimatedHours') }}</p>
            <p class="text-gray-900">{{ task.estimated_hours || '-' }} {{ t('tasks.hours') }}</p>
          </div>
          
          <div>
            <p class="text-sm font-medium text-gray-500">{{ t('tasks.actualHours') }}</p>
            <p class="text-gray-900">{{ task.actual_hours || '-' }} {{ t('tasks.hours') }}</p>
          </div>
          
          <div>
            <p class="text-sm font-medium text-gray-500">{{ t('tasks.billable') }}</p>
            <p class="text-gray-900">
              {{ task.is_billable ? t('common.yes') : t('common.no') }}
            </p>
          </div>
        </div>
      </div>
  
      <!-- Description -->
      <div v-if="task.description">
        <h3 class="text-lg font-semibold mb-2">{{ t('tasks.description') }}</h3>
        <p class="text-gray-900 whitespace-pre-wrap">{{ task.description }}</p>
      </div>
  
      <!-- Tags -->
      <div v-if="task.tags && task.tags.length > 0">
        <h3 class="text-lg font-semibold mb-2">{{ t('tasks.tags') }}</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in task.tags"
            :key="tag"
            class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
          >
            {{ tag }}
          </span>
        </div>
      </div>
  
      <!-- Comments Section -->
      <div>
        <h3 class="text-lg font-semibold mb-2">{{ t('tasks.comments') }}</h3>
        
        <div class="space-y-3 mb-4">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="bg-gray-50 p-3 rounded"
          >
            <div class="flex justify-between items-start">
              <p class="text-sm font-medium">{{ comment.user_name }}</p>
              <p class="text-xs text-gray-500">{{ formatDateTime(comment.created_at) }}</p>
            </div>
            <p class="text-sm mt-1">{{ comment.comment_text }}</p>
          </div>
          
          <p v-if="comments.length === 0" class="text-sm text-gray-500">
            {{ t('tasks.noComments') }}
          </p>
        </div>
        
        <!-- Add Comment -->
        <div class="flex space-x-2">
          <input
            v-model="newComment"
            type="text"
            class="form-input flex-1"
            :placeholder="t('tasks.addComment')"
            @keyup.enter="addComment"
          />
          <button
            @click="addComment"
            class="btn btn-primary"
          >
            {{ t('common.send') }}
          </button>
        </div>
      </div>
  
      <!-- Time Logs -->
      <div>
        <h3 class="text-lg font-semibold mb-2">{{ t('tasks.timeLogs') }}</h3>
        
        <div class="space-y-2">
          <div
            v-for="log in timeLogs"
            :key="log.id"
            class="flex justify-between items-center bg-gray-50 p-3 rounded"
          >
            <div>
              <p class="text-sm font-medium">{{ log.user_name }}</p>
              <p class="text-xs text-gray-600">
                {{ formatDateTime(log.start_time) }} - 
                {{ log.end_time ? formatDateTime(log.end_time) : t('tasks.running') }}
              </p>
            </div>
            <div class="text-sm font-medium">
              {{ log.hours || '...' }} {{ t('tasks.hours') }}
            </div>
          </div>
          
          <p v-if="timeLogs.length === 0" class="text-sm text-gray-500">
            {{ t('tasks.noTimeLogs') }}
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useTasksStore } from '@/store/modules/tasks'
  import {
    PencilIcon,
    CalendarIcon,
    UserIcon
  } from '@heroicons/vue/24/outline'
  import { formatDate, formatDateTime, getStatusBadgeClass } from '@/utils/formatters'
  
  const { t } = useI18n()
  const tasksStore = useTasksStore()
  
  const props = defineProps({
    task: {
      type: Object,
      required: true
    }
  })
  
  const emit = defineEmits(['close', 'edit'])
  
  const comments = ref([])
  const attachments = ref([])
  const timeLogs = ref([])
  const newComment = ref('')
  
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
  
  const addComment = async () => {
    if (!newComment.value.trim()) return
    
    try {
      await tasksStore.addComment(props.task.id, {
        comment_text: newComment.value
      })
      newComment.value = ''
      await fetchComments()
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }
  
  const fetchComments = async () => {
    comments.value = await tasksStore.fetchComments(props.task.id)
  }
  
  const fetchAttachments = async () => {
    attachments.value = await tasksStore.fetchAttachments(props.task.id)
  }
  
  const fetchTimeLogs = async () => {
    timeLogs.value = await tasksStore.fetchTimeLogs(props.task.id)
  }
  
  onMounted(async () => {
    await Promise.all([
      fetchComments(),
      fetchAttachments(),
      fetchTimeLogs()
    ])
  })
  </script>