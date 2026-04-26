<template>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('nav.invoices') }}</h1>
          <p class="text-gray-600 mt-1">{{ t('finance.invoicesDescription') }}</p>
        </div>
        <button
          @click="showModal = true"
          class="btn btn-primary"
        >
          {{ t('finance.newInvoice') }}
        </button>
      </div>
  
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          :title="t('finance.totalInvoiced')"
          :value="formatCurrency(stats.totalInvoiced)"
          icon="document-text"
          color="blue"
        />
        
        <StatsCard
          :title="t('finance.paid')"
          :value="formatCurrency(stats.paid)"
          icon="check-circle"
          color="green"
        />
        
        <StatsCard
          :title="t('finance.outstanding')"
          :value="formatCurrency(stats.outstanding)"
          icon="clock"
          color="orange"
        />
        
        <StatsCard
          :title="t('finance.overdue')"
          :value="formatCurrency(stats.overdue)"
          icon="exclamation-circle"
          color="red"
        />
      </div>
  
      <!-- Invoices Table -->
      <Card>
        <DataTable
          :columns="columns"
          :data="invoices"
          :loading="loading"
          @view="handleView"
          @edit="handleEdit"
          @delete="handleDelete"
          @print="handlePrint"
          @send="handleSend"
        />
      </Card>
  
      <!-- Modal -->
      <Modal
        v-model="showModal"
        :title="t('finance.newInvoice')"
        size="xl"
      >
        <InvoiceForm
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
  import StatsCard from '@/components/common/StatsCard.vue'
  import DataTable from '@/components/common/DataTable.vue'
  import Modal from '@/components/common/Modal.vue'
  import InvoiceForm from '@/components/finance/InvoiceForm.vue'
  
  const { t } = useI18n()
  const toast = useToast()
  
  const loading = ref(false)
  const showModal = ref(false)
  const invoices = ref([])
  
  const stats = ref({
    totalInvoiced: 2500000,
    paid: 1800000,
    outstanding: 500000,
    overdue: 200000
  })
  
  const columns = [
    { key: 'invoice_number', label: t('finance.invoiceNumber'), sortable: true },
    { key: 'customer_name', label: t('finance.customer'), sortable: true },
    { key: 'invoice_date', label: t('finance.date'), sortable: true },
    { key: 'due_date', label: t('finance.dueDate') },
    { key: 'total_amount', label: t('finance.amount'), type: 'currency' },
    { key: 'status', label: t('common.status'), type: 'badge' },
    { key: 'actions', label: t('common.actions'), type: 'actions' }
  ]
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR'
    }).format(value)
  }
  
  const fetchInvoices = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      invoices.value = [
        {
          id: 1,
          invoice_number: 'INV-2024-001',
          customer_name: 'ABC Company',
          invoice_date: '2024-01-15',
          due_date: '2024-02-15',
          total_amount: 50000,
          status: 'paid'
        },
        {
          id: 2,
          invoice_number: 'INV-2024-002',
          customer_name: 'XYZ Corporation',
          invoice_date: '2024-01-16',
          due_date: '2024-02-16',
          total_amount: 75000,
          status: 'unpaid'
        }
      ]
    } catch (error) {
      toast.error(t('common.errorFetchingData'))
    } finally {
      loading.value = false
    }
  }
  
  const handleView = (invoice) => {
    console.log('View invoice:', invoice)
  }
  
  const handleEdit = (invoice) => {
    console.log('Edit invoice:', invoice)
  }
  
  const handleDelete = async (invoice) => {
    if (confirm(t('common.confirmDelete'))) {
      try {
        invoices.value = invoices.value.filter(i => i.id !== invoice.id)
        toast.success(t('finance.invoiceDeleted'))
      } catch (error) {
        toast.error(t('common.errorDeleting'))
      }
    }
  }
  
  const handlePrint = (invoice) => {
    toast.info(t('finance.printingInvoice'))
  }
  
  const handleSend = (invoice) => {
    toast.success(t('finance.invoiceSent'))
  }
  
  const handleSave = async (invoice) => {
    try {
      invoices.value.push({ ...invoice, id: Date.now() })
      toast.success(t('finance.invoiceCreated'))
      showModal.value = false
    } catch (error) {
      toast.error(t('common.errorSaving'))
    }
  }
  
  onMounted(() => {
    fetchInvoices()
  })
  </script>