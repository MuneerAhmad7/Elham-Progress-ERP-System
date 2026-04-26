<template>
    <div v-if="project" class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <div class="flex items-center space-x-3">
            <button
              @click="$router.back()"
              class="btn btn-outline btn-sm"
            >
              <ArrowLeftIcon class="h-4 w-4" />
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ project.project_name }}</h1>
              <p class="text-gray-600 mt-1">{{ project.project_code }}</p>
            </div>
          </div>
        </div>
        
        <div class="flex space-x-2">
          <button @click="editProject" class="btn btn-primary">
            <PencilIcon class="h-4 w-4 mr-2" />
            {{ t('common.edit') }}
          </button>
          
          <button @click="viewFinancials" class="btn btn-secondary">
            <CurrencyDollarIcon class="h-4 w-4 mr-2" />
            {{ t('projects.financials') }}
          </button>
        </div>
      </div>
  
      <!-- Project Info Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          :title="t('projects.contractValue')"
          :value="formatCurrency(project.contract_value)"
          icon="currency-dollar"
          color="blue"
        />
        
        <StatsCard
          :title="t('projects.actualCost')"
          :value="formatCurrency(project.actual_cost)"
          icon="chart-bar"
          color="orange"
        />
        
        <StatsCard
          :title="t('projects.progress')"
          :value="project.progress + '%'"
          icon="chart-pie"
          color="green"
        />
        
        <StatsCard
          :title="t('projects.daysRemaining')"
          :value="calculateDaysRemaining(project.end_date)"
          icon="calendar"
          color="purple"
        />
      </div>
  
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="py-4 px-1 border-b-2 font-medium text-sm"
            :class="activeTab === tab.key
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>
  
      <!-- Tab Content -->
      <div>
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card :title="t('projects.projectInfo')">
            <dl class="space-y-3">
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-500">{{ t('projects.client') }}</dt>
                <dd class="text-sm text-gray-900">{{ project.client_name }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-500">{{ t('projects.projectManager') }}</dt>
                <dd class="text-sm text-gray-900">{{ project.project_manager }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-500">{{ t('projects.startDate') }}</dt>
                <dd class="text-sm text-gray-900">{{ formatDate(project.start_date) }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-500">{{ t('projects.endDate') }}</dt>
                <dd class="text-sm text-gray-900">{{ formatDate(project.end_date) }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-500">{{ t('common.status') }}</dt>
                <dd>
                  <span class="badge" :class="getBadgeClass(project.status)">
                    {{ project.status }}
                  </span>
                </dd>
              </div>
            </dl>
          </Card>
  
          <Card :title="t('projects.progressChart')">
            <apexchart
              type="radialBar"
              height="250"
              :options="progressChartOptions"
              :series="[project.progress]"
            />
          </Card>
        </div>
  
        <!-- BOQ Tab -->
        <div v-if="activeTab === 'boq'">
          <Card :title="t('projects.billOfQuantities')">
            <BOQTable :project-id="project.id" />
          </Card>
        </div>
  
        <!-- Progress Tab -->
        <div v-if="activeTab === 'progress'">
          <Card :title="t('projects.progressTracking')">
            <ProgressTable :project-id="project.id" />
          </Card>
        </div>
  
        <!-- Documents Tab -->
        <div v-if="activeTab === 'documents'">
          <Card :title="t('projects.documents')">
            <DocumentsList :project-id="project.id" />
          </Card>
        </div>
  
        <!-- Team Tab -->
        <div v-if="activeTab === 'team'">
          <Card :title="t('projects.projectTeam')">
            <TeamList :project-id="project.id" />
          </Card>
        </div>
      </div>
    </div>
    
    <LoadingSpinner v-else fullscreen />
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { format } from 'date-fns'
  import {
    ArrowLeftIcon,
    PencilIcon,
    CurrencyDollarIcon
  } from '@heroicons/vue/24/outline'
  
  import Card from '@/components/common/Card.vue'
  import StatsCard from '@/components/common/StatsCard.vue'
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
  import BOQTable from '@/components/projects/BOQTable.vue'
  import ProgressTable from '@/components/projects/ProgressTable.vue'
  import DocumentsList from '@/components/projects/DocumentsList.vue'
  import TeamList from '@/components/projects/TeamList.vue'
  
  const route = useRoute()
  const { t } = useI18n()
  
  const project = ref(null)
  const activeTab = ref('overview')
  
  const tabs = [
    { key: 'overview', label: t('projects.overview') },
    { key: 'boq', label: t('projects.boq') },
    { key: 'progress', label: t('projects.progress') },
    { key: 'documents', label: t('projects.documents') },
    { key: 'team', label: t('projects.team') }
  ]
  
  const progressChartOptions = ref({
    chart: {
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '70%'
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            fontSize: '30px',
            formatter: (val) => val + '%'
          }
        }
      }
    },
    colors: ['#10b981']
  })
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(value)
  }
  
  const formatDate = (date) => {
    return format(new Date(date), 'MMM dd, yyyy')
  }
  
  const calculateDaysRemaining = (endDate) => {
    const today = new Date()
    const end = new Date(endDate)
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }
  
  const getBadgeClass = (status) => {
    const map = {
      planning: 'badge-info',
      in_progress: 'badge-warning',
      completed: 'badge-success',
      on_hold: 'badge-danger'
    }
    return map[status] || 'badge-info'
  }
  
  const fetchProject = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      project.value = {
        id: route.params.id,
        project_code: 'PRJ-2024-001',
        project_name: 'King Abdullah Tower Construction',
        client_name: 'Royal Developments',
        contract_value: 25000000,
        actual_cost: 8750000,
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        progress: 35,
        status: 'in_progress',
        project_manager: 'Ahmed Al-Rashid'
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    }
  }
  
  const editProject = () => {
    console.log('Edit project')
  }
  
  const viewFinancials = () => {
    console.log('View financials')
  }
  
  onMounted(() => {
    fetchProject()
  })
  </script>