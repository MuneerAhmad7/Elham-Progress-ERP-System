<template>
    <div class="bg-white rounded-lg p-4">
      <!-- Calendar Header -->
      <div class="flex items-center justify-between mb-4">
        <button
          @click="previousMonth"
          class="p-2 hover:bg-gray-100 rounded"
        >
          <ChevronLeftIcon class="h-5 w-5" />
        </button>
        
        <h3 class="text-lg font-semibold">
          {{ currentMonthYear }}
        </h3>
        
        <button
          @click="nextMonth"
          class="p-2 hover:bg-gray-100 rounded"
        >
          <ChevronRightIcon class="h-5 w-5" />
        </button>
      </div>
  
      <!-- Calendar Grid -->
      <div class="grid grid-cols-7 gap-1">
        <!-- Weekday Headers -->
        <div
          v-for="day in weekDays"
          :key="day"
          class="text-center text-sm font-medium text-gray-600 py-2"
        >
          {{ day }}
        </div>
  
        <!-- Calendar Days -->
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="aspect-square border rounded p-1 text-center cursor-pointer hover:bg-gray-50"
          :class="getDayClass(day)"
          @click="selectDate(day)"
        >
          <div class="text-sm font-medium">{{ day.date }}</div>
          <div v-if="day.status" class="mt-1">
            <span
              class="inline-block w-2 h-2 rounded-full"
              :class="getStatusColor(day.status)"
            ></span>
          </div>
        </div>
      </div>
  
      <!-- Legend -->
      <div class="flex flex-wrap gap-4 mt-4 text-sm">
        <div class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          {{ t('attendance.present') }}
        </div>
        <div class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          {{ t('attendance.absent') }}
        </div>
        <div class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
          {{ t('attendance.late') }}
        </div>
        <div class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          {{ t('attendance.onLeave') }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns'
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
  
  const { t } = useI18n()
  
  const props = defineProps({
    attendanceData: {
      type: Array,
      default: () => []
    }
  })
  
  const emit = defineEmits(['date-selected'])
  
  const currentDate = ref(new Date())
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  const currentMonthYear = computed(() => {
    return format(currentDate.value, 'MMMM yyyy')
  })
  
  const calendarDays = computed(() => {
    const start = startOfMonth(currentDate.value)
    const end = endOfMonth(currentDate.value)
    const days = eachDayOfInterval({ start, end })
    
    const firstDayOfWeek = getDay(start)
    const emptyDays = Array(firstDayOfWeek).fill(null)
    
    const calendarData = days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd')
      const attendance = props.attendanceData.find(a => a.attendance_date === dateStr)
      
      return {
        date: format(day, 'd'),
        fullDate: dateStr,
        status: attendance?.status || null,
        isToday: format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
      }
    })
    
    return [...emptyDays, ...calendarData]
  })
  
  const previousMonth = () => {
    currentDate.value = subMonths(currentDate.value, 1)
  }
  
  const nextMonth = () => {
    currentDate.value = addMonths(currentDate.value, 1)
  }
  
  const selectDate = (day) => {
    if (day) {
      emit('date-selected', day.fullDate)
    }
  }
  
  const getDayClass = (day) => {
    if (!day) return 'invisible'
    
    const classes = []
    
    if (day.isToday) {
      classes.push('border-blue-500', 'border-2')
    }
    
    return classes.join(' ')
  }
  
  const getStatusColor = (status) => {
    const colors = {
      present: 'bg-green-500',
      absent: 'bg-red-500',
      late: 'bg-orange-500',
      on_leave: 'bg-blue-500',
      weekend: 'bg-gray-300',
      holiday: 'bg-purple-500'
    }
    
    return colors[status] || 'bg-gray-300'
  }
  </script>