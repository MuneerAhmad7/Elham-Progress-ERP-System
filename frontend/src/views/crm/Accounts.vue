<template>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('nav.crmAccounts') }}</h1>
          <p class="text-gray-600 mt-1">{{ t('crm.accountsDescription') }}</p>
        </div>
        <button
          @click="showModal = true"
          class="btn btn-primary"
        >
          {{ t('crm.addAccount') }}
        </button>
      </div>
  
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          :title="t('crm.totalAccounts')"
          :value="stats.total"
          icon="building-office"
          color="blue"
        />
        <StatsCard
          :title="t('crm.activeAccounts')"
          :value="stats.active"
          icon="check-circle"
          color="green"
        />
        <StatsCard
          :title="t('crm.potentialRevenue')"
          :value="formatCurrency(stats.revenue)"
          icon="currency-dollar"
          color="purple"
        />
        <StatsCard
          :title="t('crm.avgDealSize')"
          :value="formatCurrency(stats.avgDealSize)"
          icon="chart-bar"
          color="orange"
        />
      </div>
  
      <!-- Filters -->
      <Card>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            v-model="filters.search"
            type="text"
            :placeholder="t('common.search')"
            class="form-input"
          />
          
          <select v-model="filters.accountType" class="form-input">
            <option value="">{{ t('crm.allTypes') }}</option>
            <option value="customer">{{ t('crm.customer') }}</option>
            <option value="prospect">{{ t('crm.prospect') }}</option>
            <option value="partner">{{ t('crm.partner') }}</option>
          </select>
          
          <select v-model="filters.industry" class="form-input">
            <option value="">{{ t('crm.allIndustries') }}</option>
            <option value="technology">{{ t('crm.technology') }}</option>
            <option value="construction">{{ t('crm.construction') }}</option>
            <option value="retail">{{ t('crm.retail') }}</option>
          </select>
          
          <select v-model="filters.territory" class="form-input">
            <option value="">{{ t('crm.allTerritories') }}</option>
            <option value="riyadh">{{ t('crm.riyadh') }}</option>
            <option value="jeddah">{{ t('crm.jeddah') }}</option>
            <option value="dammam">{{ t('crm.dammam') }}</option>
          </select>
        </div>
      </Card>
  
      <!-- Accounts Table -->
      <Card>
        <DataTable
          :columns="columns"
          :data="filteredAccounts"
          :loading="loading"
          @view="handleView"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </Card>
  
      <!-- Add/Edit Modal -->
      <Modal
        v-model="showModal"
        :title="editingAccount ? t('crm.editAccount') : t('crm.addAccount')"
        size="large"
      >
        <AccountForm
          :account="editingAccount"
          @save="handleSave"
          @cancel="showModal = false"
        />
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'vue-toastification'
  
  import Card from '@/components/common/Card.vue'
  import StatsCard from '@/components/common/StatsCard.vue'
  import DataTable from '@/components/common/DataTable.vue'
  import Modal from '@/components/common/Modal.vue'
  import AccountForm from '@/components/crm/AccountForm.vue'
  
  const { t } = useI18n()
  const toast = useToast()
  
  const loading = ref(false)
  const showModal = ref(false)
  const editingAccount = ref(null)
  
  const filters = ref({
    search: '',
    accountType: '',
    industry: '',
    territory: ''
  })
  
  const stats = ref({
    total: 89,
    active: 67,
    revenue: 5600000,
    avgDealSize: 83582
  })
  
  const accounts = ref([])
  
  const columns = [
    { key: 'account_number', label: t('crm.accountNumber'), sortable: true },
    { key: 'account_name', label: t('crm.accountName'), sortable: true },
    { key: 'account_type', label: t('crm.type') },
    { key: 'industry', label: t('crm.industry') },
    { key: 'territory', label: t('crm.territory') },
    { key: 'phone', label: t('crm.phone') },
    { key: 'email', label: t('crm.email') },
    { key: 'annual_revenue', label: t('crm.revenue'), type: 'currency' },
    { key: 'actions', label: t('common.actions'), type: 'actions' }
  ]
  
  const filteredAccounts = computed(() => {
    let result = accounts.value
  
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      result = result.filter(account =>
        account.account_name?.toLowerCase().includes(search) ||
        account.email?.toLowerCase().includes(search) ||
        account.phone?.toLowerCase().includes(search)
      )
    }
  
    if (filters.value.accountType) {
      result = result.filter(account => account.account_type === filters.value.accountType)
    }
  
    if (filters.value.industry) {
      result = result.filter(account => account.industry === filters.value.industry)
    }
  
    if (filters.value.territory) {
      result = result.filter(account => account.territory === filters.value.territory)
    }
  
    return result
  })
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(value)
  }
  
  const fetchAccounts = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      accounts.value = [
        {
          id: 1,
          account_number: 'ACC-2024-001',
          account_name: 'Saudi Tech Solutions',
          account_type: 'customer',
          industry: 'technology',
          territory: 'riyadh',
          phone: '+966112345678',
          email: 'info@sauditech.sa',
          annual_revenue: 5000000
        },
        {
          id: 2,
          account_number: 'ACC-2024-002',
          account_name: 'Al-Bina Construction',
          account_type: 'prospect',
          industry: 'construction',
          territory: 'jeddah',
          phone: '+966126543210',
          email: 'contact@albina.sa',
          annual_revenue: 12000000
        }
      ]
    } catch (error) {
      toast.error(t('common.errorFetchingData'))
    } finally {
      loading.value = false
    }
  }
  
  const handleView = (account) => {
    console.log('View account:', account)
  }
  
  const handleEdit = (account) => {
    editingAccount.value = { ...account }
    showModal.value = true
  }
  
  const handleDelete = async (account) => {
    if (confirm(t('common.confirmDelete'))) {
      try {
        accounts.value = accounts.value.filter(a => a.id !== account.id)
        toast.success(t('crm.accountDeleted'))
      } catch (error) {
        toast.error(t('common.errorDeleting'))
      }
    }
  }
  
  const handleSave = async (account) => {
    try {
      if (editingAccount.value) {
        const index = accounts.value.findIndex(a => a.id === account.id)
        accounts.value[index] = account
        toast.success(t('crm.accountUpdated'))
      } else {
        accounts.value.push({ ...account, id: Date.now() })
        toast.success(t('crm.accountCreated'))
      }
      
      showModal.value = false
      editingAccount.value = null
    } catch (error) {
      toast.error(t('common.errorSaving'))
    }
  }
  
  onMounted(() => {
    fetchAccounts()
  })
  </script>