<template>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('nav.leaves') }}</h1>
          <p class="text-gray-600 mt-1">{{ t('leaves.manageLeaves') }}</p>
        </div>
        <button
          @click="showModal = true"
          class="btn btn-primary"
        >
          {{ t('leaves.requestLeave') }}
        </button>
      </div>
  
      <!-- Leave Balance -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card v-for="leaveType in leaveBalance" :key="leaveType.type">
          <div class="text-center">
            <p class="text-sm text-gray-600">{{ leaveType.name }}</p>
            <p class="text-3xl font-bold text-blue-600">{{ leaveType.balance }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ t('leaves.daysRemaining') }}</p>
          </div>
        </Card>
      </div>
  
      <!-- Leave Requests -->
      <Card :title="t('leaves.myRequests')">
        <DataTable
          :columns="columns"
          :data="leaveRequests"
          :loading="loading"
          @view="handleView"
          @cancel="handleCancel"
        />
      </Card>
  
      <!-- Request Leave Modal -->
      <Modal
        v-model="showModal"
        :title="t('leaves.requestLeave')"
      >
        <LeaveRequestForm
          @save="handleSave"
          @cancel="showModal = false"
        />
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'vue-toastification'
  
  import Card from '@/components/common/Card.vue'
  import DataTable from '@/components/common/DataTable.vue'
  import Modal from '@/components/common/Modal.vue'
  import LeaveRequestForm from '@/components/hr/LeaveRequestForm.vue'
  
  const { t } = useI18n()
  const toast = useToast()
  
  const loading = ref(false)
  const showModal = ref(false)
  const leaveRequests = ref([])
  
  const leaveBalance = ref([
    { type: 'annual', name: t('leaves.annual'), balance: 22 },
    { type: 'sick', name: t('leaves.sick'), balance: 10 },
    { type: 'emergency', name: t('leaves.emergency'), balance: 3 },
    { type: 'unpaid', name: t('leaves.unpaid'), balance: 0 }
  ])
  
  const columns = [
    { key: 'leave_type', label: t('leaves.type') },
    { key: 'from_date', label: t('leaves.from') },
    { key: 'to_date', label: t('leaves.to') },
    { key: 'days', label: t('leaves.days') },
    { key: 'reason', label: t('leaves.reason') },
    { key: 'status', label: t('common.status'), type: 'badge' },
    { key: 'actions', label: t('common.actions'), type: 'actions' }
  ]
  
  const fetchLeaveRequests = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      leaveRequests.value = [
        {
          id: 1,
          leave_type: 'Annual Leave',
          from_date: '2024-02-01',
          to_date: '2024-02-05',
          days: 5,
          reason: 'Family vacation',
          status: 'approved'
        },
        {
          id: 2,
          leave_type: 'Sick Leave',
          from_date: '2024-01-20',
          to_date: '2024-01-21',
          days: 2,
          reason: 'Medical appointment',
          status: 'pending'
        }
      ]
    } catch (error) {
      toast.error(t('common.errorFetchingData'))
    } finally {
      loading.value = false
    }
  }
  
  const handleView = (request) => {
    console.log('View request:', request)
  }
  
  const handleCancel = async (request) => {
    if (confirm(t('leaves.confirmCancel'))) {
      try {
        leaveRequests.value = leaveRequests.value.filter(r => r.id !== request.id)
        toast.success(t('leaves.requestCancelled'))
      } catch (error) {
        toast.error(t('common.errorDeleting'))
      }
    }
  }
  
  const handleSave = async (request) => {
    try {
      leaveRequests.value.push({ ...request, id: Date.now(), status: 'pending' })
      toast.success(t('leaves.requestSubmitted'))
      showModal.value = false
    } catch (error) {
      toast.error(t('common.errorSaving'))
    }
  }
  
  onMounted(() => {
    fetchLeaveRequests()
  })
  </script>