<template>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('nav.payroll') }}</h1>
          <p class="text-gray-600 mt-1">{{ t('payroll.managePayroll') }}</p>
        </div>
        <button
          @click="processPayroll"
          class="btn btn-primary"
        >
          {{ t('payroll.processPayroll') }}
        </button>
      </div>
  
      <!-- Payroll Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          :title="t('payroll.totalPayroll')"
          :value="formatCurrency(stats.totalPayroll)"
          icon="currency-dollar"
          color="blue"
        />
        
        <StatsCard
          :title="t('payroll.processed')"
          :value="stats.processed"
          icon="check-circle"
          color="green"
        />
        
        <StatsCard
          :title="t('payroll.pending')"
          :value="stats.pending"
          icon="clock"
          color="orange"
        />
        
        <StatsCard
          :title="t('payroll.employees')"
          :value="stats.employees"
          icon="users"
          color="purple"
        />
      </div>
  
      <!-- Period Selection -->
      <Card>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select v-model="selectedPeriod" class="form-input">
            <option value="">{{ t('payroll.selectPeriod') }}</option>
            <option v-for="period in periods" :key="period.id" :value="period.id">
              {{ period.name }}
            </option>
          </select>
          
          <button @click="fetchPayroll" class="btn btn-secondary">
            {{ t('common.filter') }}
          </button>
          
          <button @click="exportPayroll" class="btn btn-outline">
            {{ t('common.export') }}
          </button>
        </div>
      </Card>
  
      <!-- Payroll Table -->
      <Card :title="t('payroll.payrollDetails')">
        <DataTable
          :columns="columns"
          :data="payrollData"
          :loading="loading"
          @view="handleView"
        />
      </Card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'vue-toastification'
  
  import Card from '@/components/common/Card.vue'
  import StatsCard from '@/components/common/StatsCard.vue'
  import DataTable from '@/components/common/DataTable.vue'
  
  const { t } = useI18n()
  const toast = useToast()
  
  const loading = ref(false)
  const selectedPeriod = ref('')
  const payrollData = ref([])
  
  const stats = ref({
    totalPayroll: 1250000,
    processed: 180,
    pending: 15,
    employees: 195
  })
  
  const periods = ref([
    { id: 1, name: 'January 2024' },
    { id: 2, name: 'December 2023' },
    { id: 3, name: 'November 2023' }
  ])
  
  const columns = [
    { key: 'employee_number', label: t('hr.employeeNumber') },
    { key: 'full_name', label: t('hr.fullName') },
    { key: 'basic_salary', label: t('payroll.basicSalary'), type: 'currency' },
    { key: 'allowances', label: t('payroll.allowances'), type: 'currency' },
    { key: 'deductions', label: t('payroll.deductions'), type: 'currency' },
    { key: 'net_salary', label: t('payroll.netSalary'), type: 'currency' },
    { key: 'status', label: t('common.status'), type: 'badge' },
    { key: 'actions', label: t('common.actions'), type: 'actions' }
  ]
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR'
    }).format(value)
  }
  
  const fetchPayroll = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      payrollData.value = [
        {
          id: 1,
          employee_number: 'EMP001',
          full_name: 'Ahmed Al-Malik',
          basic_salary: 8000,
          allowances: 2000,
          deductions: 800,
          net_salary: 9200,
          status: 'processed'
        },
        {
          id: 2,
          employee_number: 'EMP002',
          full_name: 'Fatima Al-Salem',
          basic_salary: 10000,
          allowances: 2500,
          deductions: 1000,
          net_salary: 11500,
          status: 'pending'
        }
      ]
    } catch (error) {
      toast.error(t('common.errorFetchingData'))
    } finally {
      loading.value = false
    }
  }
  
  const processPayroll = async () => {
    try {
      toast.success(t('payroll.processingStarted'))
    } catch (error) {
      toast.error(t('payroll.processingFailed'))
    }
  }
  
  const exportPayroll = () => {
    toast.info(t('common.exportingData'))
  }
  
  const handleView = (payroll) => {
    console.log('View payroll:', payroll)
  }
  
  onMounted(() => {
    fetchPayroll()
  })
  </script>