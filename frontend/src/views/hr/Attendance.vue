<template>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('nav.attendance') }}</h1>
          <p class="text-gray-600 mt-1">{{ currentDate }}</p>
        </div>
        <div class="flex space-x-2">
          <button @click="checkIn" class="btn btn-success">
            <ClockIcon class="h-5 w-5 mr-2" />
            {{ t('attendance.checkIn') }}
          </button>
          <button @click="checkOut" class="btn btn-danger">
            <ClockIcon class="h-5 w-5 mr-2" />
            {{ t('attendance.checkOut') }}
          </button>
        </div>
      </div>
  
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div class="text-center">
            <p class="text-sm text-gray-600">{{ t('attendance.present') }}</p>
            <p class="text-3xl font-bold text-green-600">{{ stats.present }}</p>
          </div>
        </Card>
        
        <Card>
          <div class="text-center">
            <p class="text-sm text-gray-600">{{ t('attendance.absent') }}</p>
            <p class="text-3xl font-bold text-red-600">{{ stats.absent }}</p>
          </div>
        </Card>
        
        <Card>
          <div class="text-center">
            <p class="text-sm text-gray-600">{{ t('attendance.late') }}</p>
            <p class="text-3xl font-bold text-orange-600">{{ stats.late }}</p>
          </div>
        </Card>
        
        <Card>
          <div class="text-center">
            <p class="text-sm text-gray-600">{{ t('attendance.onLeave') }}</p>
            <p class="text-3xl font-bold text-blue-600">{{ stats.onLeave }}</p>
          </div>
        </Card>
      </div>
  
      <!-- Calendar View -->
      <Card :title="t('attendance.calendar')">
        <AttendanceCalendar
          :attendance-data="attendanceData"
          @date-selected="handleDateSelected"
        />
      </Card>
  
      <!-- Attendance List -->
      <Card :title="t('attendance.todayAttendance')">
        <DataTable
          :columns="columns"
          :data="todayAttendance"
          :loading="loading"
        />
      </Card>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'vue-toastification'
  import { format } from 'date-fns'
  import { ClockIcon } from '@heroicons/vue/24/outline'
  
  import Card from '@/components/common/Card.vue'
  import DataTable from '@/components/common/DataTable.vue'
  import AttendanceCalendar from '@/components/hr/AttendanceCalendar.vue'
  
  const { t } = useI18n()
  const toast = useToast()
  
  const loading = ref(false)
  const attendanceData = ref([])
  const todayAttendance = ref([])
  
  const stats = ref({
    present: 0,
    absent: 0,
    late: 0,
    onLeave: 0
  })
  
  const currentDate = computed(() => format(new Date(), 'EEEE, MMMM dd, yyyy'))
  
  const columns = [
    { key: 'employee_number', label: t('hr.employeeNumber') },
    { key: 'full_name', label: t('hr.fullName') },
    { key: 'check_in', label: t('attendance.checkIn') },
    { key: 'check_out', label: t('attendance.checkOut') },
    { key: 'working_hours', label: t('attendance.workingHours') },
    { key: 'status', label: t('common.status'), type: 'badge' }
  ]
  
  const checkIn = async () => {
    try {
      // API call
      toast.success(t('attendance.checkInSuccess'))
    } catch (error) {
      toast.error(t('attendance.checkInFailed'))
    }
  }
  
  const checkOut = async () => {
    try {
      // API call
      toast.success(t('attendance.checkOutSuccess'))
    } catch (error) {
      toast.error(t('attendance.checkOutFailed'))
    }
  }
  
  const handleDateSelected = (date) => {
    console.log('Selected date:', date)
  }
  
  const fetchAttendance = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      stats.value = {
        present: 180,
        absent: 15,
        late: 8,
        onLeave: 12
      }
      
      todayAttendance.value = [
        {
          id: 1,
          employee_number: 'EMP001',
          full_name: 'Ahmed Al-Malik',
          check_in: '08:00 AM',
          check_out: '05:00 PM',
          working_hours: '9.0',
          status: 'present'
        },
        {
          id: 2,
          employee_number: 'EMP002',
          full_name: 'Fatima Al-Salem',
          check_in: '08:15 AM',
          check_out: '-',
          working_hours: '-',
          status: 'late'
        }
      ]
    } catch (error) {
      toast.error(t('common.errorFetchingData'))
    } finally {
      loading.value = false
    }
  }
  
  onMounted(() => {
    fetchAttendance()
  })
  </script>