<template>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('nav.opportunities') }}</h1>
          <p class="text-gray-600 mt-1">{{ t('crm.opportunitiesDescription') }}</p>
        </div>
        <button
          @click="showModal = true"
          class="btn btn-primary"
        >
          {{ t('crm.addOpportunity') }}
        </button>
      </div>
  
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          :title="t('crm.totalOpportunities')"
          :value="stats.total"
          icon="briefcase"
          color="blue"
        />
        <StatsCard
          :title="t('crm.pipelineValue')"
          :value="formatCurrency(stats.pipelineValue)"
          icon="currency-dollar"
          color="green"
        />
        <StatsCard
          :title="t('crm.expectedRevenue')"
          :value="formatCurrency(stats.expectedRevenue)"
          icon="chart-bar"
          color="purple"
        />
        <StatsCard
          :title="t('crm.winRate')"
          :value="stats.winRate + '%'"
          icon="trophy"
          color="orange"
        />
      </div>
  
      <!-- Pipeline View -->
      <Card :title="t('crm.salesPipeline')">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div
            v-for="stage in stages"
            :key="stage.key"
            class="bg-gray-50 rounded-lg p-4"
          >
            <h3 class="font-semibold mb-2 flex items-center justify-between">
              <span>{{ stage.label }}</span>
              <span class="badge badge-info">
                {{ getOpportunitiesByStage(stage.key).length }}
              </span>
            </h3>
            
            <p class="text-sm text-gray-600 mb-4">
              {{ formatCurrency(getStageTotalValue(stage.key)) }}
            </p>
            
            <div class="space-y-3">
              <OpportunityCard
                v-for="opportunity in getOpportunitiesByStage(stage.key)"
                :key="opportunity.id"
                :opportunity="opportunity"
                @click="handleView(opportunity)"
              />
            </div>
          </div>
        </div>
      </Card>
  
      <!-- Add/Edit Modal -->
      <Modal
        v-model="showModal"
        :title="editingOpportunity ? t('crm.editOpportunity') : t('crm.addOpportunity')"
        size="large"
      >
        <OpportunityForm
          :opportunity="editingOpportunity"
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
  import Modal from '@/components/common/Modal.vue'
  import OpportunityCard from '@/components/crm/OpportunityCard.vue'
  import OpportunityForm from '@/components/crm/OpportunityForm.vue'
  
  const { t } = useI18n()
  const toast = useToast()
  
  const loading = ref(false)
  const showModal = ref(false)
  const editingOpportunity = ref(null)
  
  const stats = ref({
    total: 45,
    pipelineValue: 8900000,
    expectedRevenue: 4450000,
    winRate: 35
  })
  
  const stages = [
    { key: 'qualification', label: t('crm.qualification') },
    { key: 'proposal', label: t('crm.proposal') },
    { key: 'negotiation', label: t('crm.negotiation') },
    { key: 'won', label: t('crm.won') },
    { key: 'lost', label: t('crm.lost') }
  ]
  
  const opportunities = ref([])
  
  const getOpportunitiesByStage = (stage) => {
    return opportunities.value.filter(opp => opp.stage === stage)
  }
  
  const getStageTotalValue = (stage) => {
    return getOpportunitiesByStage(stage).reduce((sum, opp) => sum + opp.amount, 0)
  }
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(value)
  }
  
  const fetchOpportunities = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      opportunities.value = [
        {
          id: 1,
          opportunity_number: 'OPP-2024-001',
          opportunity_name: 'ERP System Implementation',
          account_name: 'Saudi Tech Solutions',
          amount: 500000,
          probability: 70,
          expected_close_date: '2024-03-15',
          stage: 'qualification'
        },
        {
          id: 2,
          opportunity_number: 'OPP-2024-002',
          opportunity_name: 'Construction Management Software',
          account_name: 'Al-Bina Construction',
          amount: 800000,
          probability: 60,
          expected_close_date: '2024-04-20',
          stage: 'proposal'
        },
        {
          id: 3,
          opportunity_number: 'OPP-2024-003',
          opportunity_name: 'CRM Integration Project',
          account_name: 'Digital Marketing LLC',
          amount: 300000,
          probability: 80,
          expected_close_date: '2024-02-28',
          stage: 'negotiation'
        }
      ]
    } catch (error) {
      toast.error(t('common.errorFetchingData'))
    } finally {
      loading.value = false
    }
  }
  
  const handleView = (opportunity) => {
    console.log('View opportunity:', opportunity)
  }
  
  const handleSave = async (opportunity) => {
    try {
      if (editingOpportunity.value) {
        const index = opportunities.value.findIndex(o => o.id === opportunity.id)
        opportunities.value[index] = opportunity
        toast.success(t('crm.opportunityUpdated'))
      } else {
        opportunities.value.push({ ...opportunity, id: Date.now() })
        toast.success(t('crm.opportunityCreated'))
      }
      
      showModal.value = false
      editingOpportunity.value = null
    } catch (error) {
      toast.error(t('common.errorSaving'))
    }
  }
  
  onMounted(() => {
    fetchOpportunities()
  })
  </script>