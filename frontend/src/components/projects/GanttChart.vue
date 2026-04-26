<template>
    <div class="gantt-chart">
      <!-- Header Controls -->
      <div class="mb-4 flex justify-between items-center">
        <div class="flex space-x-2">
          <button
            v-for="view in views"
            :key="view"
            @click="currentView = view"
            class="btn btn-sm"
            :class="currentView === view ? 'btn-primary' : 'btn-outline'"
          >
            {{ t(`projects.${view}`) }}
          </button>
        </div>
        
        <div class="flex space-x-2">
          <button @click="zoomIn" class="btn btn-sm btn-outline">
            <PlusIcon class="h-4 w-4" />
          </button>
          <button @click="zoomOut" class="btn btn-sm btn-outline">
            <MinusIcon class="h-4 w-4" />
          </button>
          <button @click="fitToScreen" class="btn btn-sm btn-outline">
            {{ t('projects.fitToScreen') }}
          </button>
        </div>
      </div>
  
      <!-- Gantt Container -->
      <div class="gantt-container bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="flex">
          <!-- Left Panel - Task Names -->
          <div class="gantt-left-panel w-80 border-r border-gray-200 overflow-y-auto">
            <div class="sticky top-0 bg-gray-50 border-b border-gray-200 p-3 font-semibold">
              {{ t('projects.taskName') }}
            </div>
            <div
              v-for="task in tasks"
              :key="task.id"
              class="gantt-task-row p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              :style="{ paddingLeft: (task.level * 20 + 12) + 'px' }"
              @click="selectTask(task)"
            >
              <div class="flex items-center">
                <ChevronRightIcon
                  v-if="task.children && task.children.length > 0"
                  class="h-4 w-4 mr-2 text-gray-400"
                />
                <span class="text-sm" :class="{ 'font-semibold': task.is_milestone }">
                  {{ task.name }}
                </span>
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ task.duration }} {{ t('projects.days') }}
              </div>
            </div>
          </div>
  
          <!-- Right Panel - Timeline -->
          <div class="gantt-timeline flex-1 overflow-x-auto" ref="timelineContainer">
            <!-- Timeline Header -->
            <div class="sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
              <div class="flex" :style="{ width: timelineWidth + 'px' }">
                <div
                  v-for="period in timelinePeriods"
                  :key="period.key"
                  class="gantt-period-cell border-r border-gray-200 text-center py-2 text-xs"
                  :style="{ width: periodWidth + 'px' }"
                >
                  <div class="font-semibold">{{ period.label }}</div>
                  <div class="text-gray-500">{{ period.subLabel }}</div>
                </div>
              </div>
            </div>
  
            <!-- Task Bars -->
            <div class="relative" :style="{ width: timelineWidth + 'px', height: (tasks.length * 48) + 'px' }">
              <!-- Grid Lines -->
              <div
                v-for="period in timelinePeriods"
                :key="'grid-' + period.key"
                class="absolute top-0 bottom-0 border-r border-gray-100"
                :style="{ left: (period.index * periodWidth) + 'px' }"
              ></div>
  
              <!-- Today Line -->
              <div
                class="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
                :style="{ left: todayPosition + 'px' }"
              >
                <div class="absolute -top-1 -left-8 text-xs text-red-500 font-medium">
                  {{ t('projects.today') }}
                </div>
              </div>
  
              <!-- Task Bars -->
              <div
                v-for="(task, index) in tasks"
                :key="task.id"
                class="absolute"
                :style="{
                  top: (index * 48 + 12) + 'px',
                  left: getTaskLeft(task) + 'px',
                  width: getTaskWidth(task) + 'px'
                }"
              >
                <div
                  class="gantt-bar rounded px-2 py-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                  :class="getTaskBarClass(task)"
                  :style="{ width: '100%' }"
                  @click="selectTask(task)"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-white font-medium truncate">
                      {{ task.name }}
                    </span>
                    <span class="text-xs text-white ml-2">
                      {{ task.progress }}%
                    </span>
                  </div>
                  
                  <!-- Progress Bar -->
                  <div class="mt-1 h-1 bg-white bg-opacity-30 rounded">
                    <div
                      class="h-full bg-white rounded"
                      :style="{ width: task.progress + '%' }"
                    ></div>
                  </div>
                </div>
  
                <!-- Dependencies Lines -->
                <svg
                  v-if="task.dependencies"
                  class="absolute top-0 left-0 pointer-events-none"
                  style="overflow: visible;"
                >
                  <line
                    v-for="dep in task.dependencies"
                    :key="dep"
                    :x1="0"
                    :y1="12"
                    :x2="-20"
                    :y2="12"
                    stroke="#94a3b8"
                    stroke-width="2"
                    stroke-dasharray="5,5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Task Details Modal -->
      <Modal v-model="showTaskDetails" :title="selectedTask?.name" size="large">
        <div v-if="selectedTask" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">{{ t('projects.startDate') }}</p>
              <p class="font-medium">{{ formatDate(selectedTask.start_date) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">{{ t('projects.endDate') }}</p>
              <p class="font-medium">{{ formatDate(selectedTask.end_date) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">{{ t('projects.duration') }}</p>
              <p class="font-medium">{{ selectedTask.duration }} {{ t('projects.days') }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">{{ t('projects.progress') }}</p>
              <p class="font-medium">{{ selectedTask.progress }}%</p>
            </div>
          </div>
          
          <div>
            <p class="text-sm text-gray-600 mb-1">{{ t('projects.assignedTo') }}</p>
            <p class="font-medium">{{ selectedTask.assigned_to || '-' }}</p>
          </div>
          
          <div v-if="selectedTask.description">
            <p class="text-sm text-gray-600 mb-1">{{ t('projects.description') }}</p>
            <p>{{ selectedTask.description }}</p>
          </div>
        </div>
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import {
    ChevronRightIcon,
    PlusIcon,
    MinusIcon
  } from '@heroicons/vue/24/outline'
  import { format, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, eachMonthOfInterval } from 'date-fns'
  import Modal from '@/components/common/Modal.vue'
  import { formatDate } from '@/utils/formatters'
  
  const { t } = useI18n()
  
  const props = defineProps({
    tasks: {
      type: Array,
      required: true
    },
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: true
    }
  })
  
  const currentView = ref('month')
  const views = ['day', 'week', 'month']
  const zoomLevel = ref(1)
  const timelineContainer = ref(null)
  const showTaskDetails = ref(false)
  const selectedTask = ref(null)
  
  const periodWidth = computed(() => {
    const baseWidth = {
      day: 40,
      week: 100,
      month: 150
    }
    return baseWidth[currentView.value] * zoomLevel.value
  })
  
  const projectStart = computed(() => new Date(props.startDate))
  const projectEnd = computed(() => new Date(props.endDate))
  
  const timelinePeriods = computed(() => {
    const periods = []
    
    if (currentView.value === 'month') {
      const months = eachMonthOfInterval({
        start: projectStart.value,
        end: projectEnd.value
      })
      
      months.forEach((month, index) => {
        periods.push({
          key: format(month, 'yyyy-MM'),
          label: format(month, 'MMM yyyy'),
          subLabel: '',
          index
        })
      })
    } else if (currentView.value === 'day') {
      const days = eachDayOfInterval({
        start: projectStart.value,
        end: projectEnd.value
      })
      
      days.forEach((day, index) => {
        periods.push({
          key: format(day, 'yyyy-MM-dd'),
          label: format(day, 'dd'),
          subLabel: format(day, 'MMM'),
          index
        })
      })
    }
    
    return periods
  })
  
  const timelineWidth = computed(() => {
    return timelinePeriods.value.length * periodWidth.value
  })
  
  const todayPosition = computed(() => {
    const today = new Date()
    const daysSinceStart = differenceInDays(today, projectStart.value)
    return (daysSinceStart / totalProjectDays.value) * timelineWidth.value
  })
  
  const totalProjectDays = computed(() => {
    return differenceInDays(projectEnd.value, projectStart.value)
  })
  
  const getTaskLeft = (task) => {
    const taskStart = new Date(task.start_date)
    const daysSinceStart = differenceInDays(taskStart, projectStart.value)
    return (daysSinceStart / totalProjectDays.value) * timelineWidth.value
  }
  
  const getTaskWidth = (task) => {
    const taskStart = new Date(task.start_date)
    const taskEnd = new Date(task.end_date)
    const duration = differenceInDays(taskEnd, taskStart)
    return (duration / totalProjectDays.value) * timelineWidth.value
  }
  
  const getTaskBarClass = (task) => {
    if (task.is_milestone) return 'bg-purple-500'
    if (task.progress === 100) return 'bg-green-500'
    if (task.progress > 50) return 'bg-blue-500'
    if (task.progress > 0) return 'bg-yellow-500'
    return 'bg-gray-400'
  }
  
  const selectTask = (task) => {
    selectedTask.value = task
    showTaskDetails.value = true
  }
  
  const zoomIn = () => {
    if (zoomLevel.value < 3) {
      zoomLevel.value += 0.25
    }
  }
  
  const zoomOut = () => {
    if (zoomLevel.value > 0.5) {
      zoomLevel.value -= 0.25
    }
  }
  
  const fitToScreen = () => {
    zoomLevel.value = 1
  }
  
  onMounted(() => {
    // Auto-scroll to today
    if (timelineContainer.value) {
      timelineContainer.value.scrollLeft = todayPosition.value - 200
    }
  })
  </script>
  
  <style scoped>
  .gantt-container {
    max-height: 600px;
    overflow: auto;
  }
  
  .gantt-left-panel {
    max-height: 600px;
  }
  
  .gantt-timeline {
    max-height: 600px;
  }
  
  .gantt-task-row {
    height: 48px;
  }
  
  .gantt-bar {
    height: 24px;
    min-width: 20px;
  }
  
  .gantt-period-cell {
    min-width: 60px;
  }
  
  /* Scrollbar styling */
  .gantt-timeline::-webkit-scrollbar {
    height: 8px;
  }
  
  .gantt-timeline::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  .gantt-timeline::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  </style>