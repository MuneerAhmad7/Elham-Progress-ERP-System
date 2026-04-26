<template>
    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ t('nav.reports') }}</h1>
        <p class="text-gray-600 mt-1">{{ t('finance.reportsDescription') }}</p>
      </div>
  
      <!-- Report Selection -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          v-for="report in reports"
          :key="report.id"
          class="cursor-pointer hover:shadow-lg transition-shadow"
          @click="generateReport(report)"
        >
          <div class="text-center">
            <component :is="report.icon" class="h-12 w-12 mx-auto text-blue-600 mb-3" />
            <h3 class="font-semibold text-lg">{{ report.name }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ report.description }}</p>
          </div>
        </Card>
      </div>
  
      <!-- Report Output -->
      <Card v-if="selectedReport" :title="selectedReport.name">
        <div class="mb-4 flex justify-between items-center">
          <div class="flex space-x-2">
            <input
              v-model="reportParams.dateFrom"
              type="date"
              class="form-input"
            />
            <input
              v-model="reportParams.dateTo"
              type="date"
              class="form-input"
            />
            <button @click="refreshReport" class="btn btn-primary">
              {{ t('common.refresh') }}
            </button>
          </div>
          
          <div class="flex space-x-2">
            <button @click="exportPDF" class="btn btn-outline">
              {{ t('common.exportPDF') }}
            </button>
            <button @click="exportExcel" class="btn btn-outline">
              {{ t('common.exportExcel') }}
            </button>
          </div>
        </div>
  
        <LoadingSpinner v-if="loading" />
        
        <div v-else>
          <!-- Report content will go here -->
          <pre class="bg-gray-50 p-4 rounded">{{ reportData }}</pre>
        </div>
      </Card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'vue-toastification'
  import {
    DocumentTextIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    ClipboardDocumentListIcon,
    CalculatorIcon,
    BanknotesIcon
  } from '@heroicons/vue/24/outline'
  
  import Card from '@/components/common/Card.vue'
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
  
  const { t } = useI18n()
  const toast = useToast()
  
  const loading = ref(false)
  const selectedReport = ref(null)
  const reportData = ref(null)
  
  const reportParams = ref({
    dateFrom: '',
    dateTo: ''
  })
  
  const reports = [
    {
      id: 1,
      name: t('finance.trialBalance'),
      description: t('finance.trialBalanceDesc'),
      icon: CalculatorIcon
    },
    {
      id: 2,
      name: t('finance.balanceSheet'),
      description: t('finance.balanceSheetDesc'),
      icon: DocumentTextIcon
    },
    {
      id: 3,
      name: t('finance.incomeStatement'),
      description: t('finance.incomeStatementDesc'),
      icon: ChartBarIcon
    },
    {
      id: 4,
      name: t('finance.cashFlow'),
      description: t('finance.cashFlowDesc'),
      icon: CurrencyDollarIcon
    },
    {
      id: 5,
      name: t('finance.agedReceivables'),
      description: t('finance.agedReceivablesDesc'),
      icon: ClipboardDocumentListIcon
    },
    {
      id: 6,
      name: t('finance.agedPayables'),
      description: t('finance.agedPayablesDesc'),
      icon: BanknotesIcon
    }
  ]
  
  const generateReport = async (report) => {
    selectedReport.value = report
    loading.value = true
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      reportData.value = {
        report: report.name,
        generated_at: new Date().toISOString(),
        data: 'Sample report data will be displayed here'
      }
    } catch (error) {
      toast.error(t('common.errorFetchingData'))
    } finally {
      loading.value = false
    }
  }
  
  const refreshReport = () => {
    if (selectedReport.value) {
      generateReport(selectedReport.value)
    }
  }
  
  const exportPDF = () => {
    toast.success(t('common.exportingPDF'))
  }
  
  const exportExcel = () => {
    toast.success(t('common.exportingExcel'))
  }
  </script>