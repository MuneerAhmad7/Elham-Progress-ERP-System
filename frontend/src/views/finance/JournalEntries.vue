<template>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('nav.journal') }}</h1>
          <p class="text-gray-600 mt-1">{{ t('finance.journalDescription') }}</p>
        </div>
        <button
          @click="showModal = true"
          class="btn btn-primary"
        >
          {{ t('finance.newEntry') }}
        </button>
      </div>
  
      <!-- Filters -->
      <Card>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            v-model="filters.entryNumber"
            type="text"
            :placeholder="t('finance.entryNumber')"
            class="form-input"
          />
          
          <input
            v-model="filters.dateFrom"
            type="date"
            class="form-input"
          />
          
          <input
            v-model="filters.dateTo"
            type="date"
            class="form-input"
          />
          
          <select v-model="filters.status" class="form-input">
            <option value="">{{ t('finance.allStatuses') }}</option>
            <option value="draft">{{ t('finance.draft') }}</option>
            <option value="posted">{{ t('finance.posted') }}</option>
          </select>
        </div>
      </Card>
  
      <!-- Journal Entries Table -->
      <Card>
        <DataTable
          :columns="columns"
          :data="journalEntries"
          :loading="loading"
          @view="handleView"
          @edit="handleEdit"
          @delete="handleDelete"
          @post="handlePost"
        />
      </Card>
  
      <!-- Modal -->
      <Modal
        v-model="showModal"
        :title="t('finance.newEntry')"
        size="xl"
      >
        <JournalEntryForm
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
  import JournalEntryForm from '@/components/finance/JournalEntryForm.vue'
  
  const { t } = useI18n()
  const toast = useToast()
  
  const loading = ref(false)
  const showModal = ref(false)
  const journalEntries = ref([])
  
  const filters = ref({
    entryNumber: '',
    dateFrom: '',
    dateTo: '',
    status: ''
  })
  
  const columns = [
    { key: 'entry_number', label: t('finance.entryNumber'), sortable: true },
    { key: 'entry_date', label: t('finance.date'), sortable: true },
    { key: 'description', label: t('finance.description') },
    { key: 'total_debit', label: t('finance.debit'), type: 'currency' },
    { key: 'total_credit', label: t('finance.credit'), type: 'currency' },
    { key: 'status', label: t('common.status'), type: 'badge' },
    { key: 'actions', label: t('common.actions'), type: 'actions' }
  ]
  
  const fetchJournalEntries = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      journalEntries.value = [
        {
          id: 1,
          entry_number: 'JE-2024-001',
          entry_date: '2024-01-15',
          description: 'January salary payment',
          total_debit: 500000,
          total_credit: 500000,
          status: 'posted'
        },
        {
          id: 2,
          entry_number: 'JE-2024-002',
          entry_date: '2024-01-16',
          description: 'Office rent payment',
          total_debit: 50000,
          total_credit: 50000,
          status: 'draft'
        }
      ]
    } catch (error) {
      toast.error(t('common.errorFetchingData'))
    } finally {
      loading.value = false
    }
  }
  
  const handleView = (entry) => {
    console.log('View entry:', entry)
  }
  
  const handleEdit = (entry) => {
    console.log('Edit entry:', entry)
  }
  
  const handleDelete = async (entry) => {
    if (confirm(t('common.confirmDelete'))) {
      try {
        journalEntries.value = journalEntries.value.filter(e => e.id !== entry.id)
        toast.success(t('finance.entryDeleted'))
      } catch (error) {
        toast.error(t('common.errorDeleting'))
      }
    }
  }
  
  const handlePost = async (entry) => {
    try {
      entry.status = 'posted'
      toast.success(t('finance.entryPosted'))
    } catch (error) {
      toast.error(t('finance.postingFailed'))
    }
  }
  
  const handleSave = async (entry) => {
    try {
      journalEntries.value.push({ ...entry, id: Date.now() })
      toast.success(t('finance.entryCreated'))
      showModal.value = false
    } catch (error) {
      toast.error(t('common.errorSaving'))
    }
  }
  
  onMounted(() => {
    fetchJournalEntries()
  })
  </script>