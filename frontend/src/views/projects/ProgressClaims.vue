<template>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('projects.progressClaims') }}</h1>
          <p class="text-gray-600 mt-1">{{ t('projects.claimsDescription') }}</p>
        </div>
        <button
          @click="showModal = true"
          class="btn btn-primary"
        >
          {{ t('projects.newClaim') }}
        </button>
      </div>
  
      <!-- Claims Table -->
      <Card>
        <DataTable
          :columns="columns"
          :data="claims"
          :loading="loading"
          @view="handleView"
          @edit="handleEdit"
          @approve="handleApprove"
        />
      </Card>
  
      <!-- Modal -->
      <Modal
        v-model="showModal"
        :title="t('projects.newClaim')"
        size="xl"
      >
        <ClaimForm
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
  import ClaimForm from '@/components/projects/ClaimForm.vue'
  
  const { t } = useI18n()
  const toast = useToast()
  
  const loading = ref(false)
  const showModal = ref(false)
  const claims = ref([])
  
  const columns = [
    { key: 'claim_number', label: t('projects.claimNumber'), sortable: true },
    { key: 'project_name', label: t('projects.project') },
    { key: 'claim_period', label: t('projects.period') },
    { key: 'claim_date', label: t('projects.date'), sortable: true },
    { key: 'claim_amount', label: t('projects.amount'), type: 'currency' },
    { key: 'progress_percent', label: t('projects.progress') },
    { key: 'status', label: t('common.status'), type: 'badge' },
    { key: 'actions', label: t('common.actions'), type: 'actions' }
  ]
  
  const fetchClaims = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      claims.value = [
        {
          id: 1,
          claim_number: 'IPC-001',
          project_name: 'King Abdullah Tower',
          claim_period: 'January 2024',
          claim_date: '2024-01-31',
          claim_amount: 2500000,
          progress_percent: 10,
          status: 'approved'
        },
        {
          id: 2,
          claim_number: 'IPC-002',
          project_name: 'Commercial Complex',
          claim_period: 'January 2024',
          claim_date: '2024-01-31',
          claim_amount: 1800000,
          progress_percent: 15,
          status: 'pending'
        }
      ]
    } catch (error) {
      toast.error(t('common.errorFetchingData'))
    } finally {
      loading.value = false
    }
  }
  
  const handleView = (claim) => {
    console.log('View claim:', claim)
  }
  
  const handleEdit = (claim) => {
    console.log('Edit claim:', claim)
  }
  
  const handleApprove = async (claim) => {
    try {
      claim.status = 'approved'
      toast.success(t('projects.claimApproved'))
    } catch (error) {
      toast.error(t('common.errorSaving'))
    }
  }
  
  const handleSave = async (claim) => {
    try {
      claims.value.push({ ...claim, id: Date.now() })
      toast.success(t('projects.claimCreated'))
      showModal.value = false
    } catch (error) {
      toast.error(t('common.errorSaving'))
    }
  }
  
  onMounted(() => {
    fetchClaims()
  })
  </script>