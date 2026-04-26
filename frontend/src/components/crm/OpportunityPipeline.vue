<template>
    <div class="space-y-4">
      <!-- Pipeline Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow-sm p-4">
          <p class="text-sm text-gray-600">{{ t('crm.totalOpportunities') }}</p>
          <p class="text-2xl font-bold">{{ totalOpportunities }}</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-4">
          <p class="text-sm text-gray-600">{{ t('crm.pipelineValue') }}</p>
          <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(pipelineValue) }}</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-4">
          <p class="text-sm text-gray-600">{{ t('crm.avgDealSize') }}</p>
          <p class="text-2xl font-bold">{{ formatCurrency(avgDealSize) }}</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-4">
          <p class="text-sm text-gray-600">{{ t('crm.winRate') }}</p>
          <p class="text-2xl font-bold text-green-600">{{ winRate }}%</p>
        </div>
      </div>
  
      <!-- Pipeline Chart -->
      <Card :title="t('crm.pipelineByStage')">
        <apexchart
          type="bar"
          height="300"
          :options="chartOptions"
          :series="chartSeries"
        />
      </Card>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Card from '@/components/common/Card.vue'
  import { formatCurrency } from '@/utils/formatters'
  
  const { t } = useI18n()
  
  const props = defineProps({
    opportunities: {
      type: Array,
      default: () => []
    }
  })
  
  const totalOpportunities = computed(() => props.opportunities.length)
  
  const pipelineValue = computed(() => {
    return props.opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0)
  })
  
  const avgDealSize = computed(() => {
    return totalOpportunities.value > 0 ? pipelineValue.value / totalOpportunities.value : 0
  })
  
  const winRate = computed(() => {
    const won = props.opportunities.filter(o => o.status === 'won').length
    return totalOpportunities.value > 0 ? Math.round((won / totalOpportunities.value) * 100) : 0
  })
  
  const chartSeries = computed(() => {
    const stages = ['Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost']
    const data = stages.map(stage => {
      return props.opportunities.filter(o => 
        o.stage?.toLowerCase() === stage.toLowerCase()
      ).length
    })
    
    return [{
      name: t('crm.opportunities'),
      data
    }]
  })
  
  const chartOptions = ref({
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    colors: ['#3b82f6'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost']
    }
  })
  </script>