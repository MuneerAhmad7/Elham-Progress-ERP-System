<template>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('nav.projects') }}</h1>
          <p class="text-gray-600 mt-1">{{ t('projects.projectsDescription') }}</p>
        </div>
        <button
          @click="showModal = true"
          class="btn btn-primary"
        >
          {{ t('projects.newProject') }}
        </button>
      </div>
  
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatsCard
          :title="t('projects.totalProjects')"
          :value="stats.total"
          icon="briefcase"
          color="blue"
        />
        <StatsCard
          :title="t('projects.inProgress')"
          :value="stats.inProgress"
          icon="clock"
          color="orange"
        />
        <StatsCard
          :title="t('projects.completed')"
          :value="stats.completed"
          icon="check-circle"
          color="green"
        />
        <StatsCard
          :title="t('projects.totalValue')"
          :value="formatCurrency(stats.totalValue)"
          icon="currency-dollar"
          color="purple"
        />
        <StatsCard
          :title="t('projects.onTime')"
          :value="stats.onTime + '%'"
          icon="chart-bar"
          color="blue"
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
          
          <select v-model="filters.status" class="form-input">
            <option value="">{{ t('projects.allStatuses') }}</option>
            <option value="planning">{{ t('projects.planning') }}</option>
            <option value="in_progress">{{ t('projects.inProgress') }}</option>
            <option value="on_hold">{{ t('projects.onHold') }}</option>
            <option value="completed">{{ t('projects.completed') }}</option>
          </select>
          
          <select v-model="filters.client" class="form-input">
            <option value="">{{ t('projects.allClients') }}</option>
          </select>
          
          <select v-model="filters.projectManager" class="form-input">
            <option value="">{{ t('projects.allManagers') }}</option>
          </select>
        </div>
      </Card>
  
      <!-- View Toggle -->
      <div class="flex space-x-2">
        <button
          @click="viewMode = 'grid'"
          class="btn btn-sm"
          :class="{ 'btn-primary': viewMode === 'grid', 'btn-outline': viewMode !== 'grid' }"
        >
          <Squares2X2Icon class="h-4 w-4 mr-1" />
          {{ t('common.gridView') }}
        </button>
        
        <button
          @click="viewMode = 'table'"
          class="btn btn-sm"
          :class="{ 'btn-primary': viewMode === 'table', 'btn-outline': viewMode !== 'table' }"
        >
          <TableCellsIcon class="h-4 w-4 mr-1" />
          {{ t('common.tableView') }}
        </button>
      </div>
  
      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
          @view="handleView"
          @edit="handleEdit"
        />
      </div>
  
      <!-- Table View -->
      <Card v-else>
        <DataTable
          :columns="columns"
          :data="filteredProjects"
          :loading="loading"
          @view="handleView"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </Card>
  
      <!-- Add/Edit Modal -->
      <Modal
        v-model="showModal"
        :title="editingProject ? t('projects.editProject') : t('projects.newProject')"
        size="xl"
      >
        <ProjectForm
          :project="editingProject"
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
  import { useRouter } from 'vue-router'
  import {
    Squares2X2Icon,
    TableCellsIcon
  } from '@heroicons/vue/24/outline'
  
  import Card from '@/components/common/Card.vue'
  import StatsCard from '@/components/common/StatsCard.vue'
  import DataTable from '@/components/common/DataTable.vue'
  import Modal from '@/components/common/Modal.vue'
  import ProjectCard from '@/components/projects/ProjectCard.vue'
  import ProjectForm from '@/components/projects/ProjectForm.vue'
  
  const { t } = useI18n()
  const toast = useToast()
  const router = useRouter()
  
  const loading = ref(false)
  const showModal = ref(false)
  const editingProject = ref(null)
  const viewMode = ref('grid')
  
  const filters = ref({
    search: '',
    status: '',
    client: '',
    projectManager: ''
  })
  
  const stats = ref({
    total: 24,
    inProgress: 12,
    completed: 8,
    totalValue: 45000000,
    onTime: 85
  })
  
  const projects = ref([])
  
  const columns = [
    { key: 'project_code', label: t('projects.projectCode'), sortable: true },
    { key: 'project_name', label: t('projects.projectName'), sortable: true },
    { key: 'client_name', label: t('projects.client') },
    { key: 'contract_value', label: t('projects.value'), type: 'currency' },
    { key: 'start_date', label: t('projects.startDate'), sortable: true },
    { key: 'end_date', label: t('projects.endDate') },
    { key: 'progress', label: t('projects.progress') },
    { key: 'status', label: t('common.status'), type: 'badge' },
    { key: 'actions', label: t('common.actions'), type: 'actions' }
  ]
  
  const filteredProjects = computed(() => {
    let result = projects.value
  
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      result = result.filter(project =>
        project.project_code?.toLowerCase().includes(search) ||
        project.project_name?.toLowerCase().includes(search) ||
        project.client_name?.toLowerCase().includes(search)
      )
    }
  
    if (filters.value.status) {
      result = result.filter(project => project.status === filters.value.status)
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
  
  const fetchProjects = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      projects.value = [
        {
          id: 1,
          project_code: 'PRJ-2024-001',
          project_name: 'King Abdullah Tower Construction',
          client_name: 'Royal Developments',
          contract_value: 25000000,
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          progress: 35,
          status: 'in_progress',
          project_manager: 'Ahmed Al-Rashid'
        },
        {
          id: 2,
          project_code: 'PRJ-2024-002',
          project_name: 'Commercial Complex Phase 2',
          client_name: 'Al-Otaibi Group',
          contract_value: 18000000,
          start_date: '2024-02-01',
          end_date: '2024-11-30',
          progress: 20,
          status: 'in_progress',
          project_manager: 'Khalid Al-Malik'
        },
        {
          id: 3,
          project_code: 'PRJ-2023-015',
          project_name: 'Residential Compound',
          client_name: 'Saudi Housing',
          contract_value: 12000000,
          start_date: '2023-06-01',
          end_date: '2023-12-31',
          progress: 100,
          status: 'completed',
          project_manager: 'Mohammed Al-Salem'
        }
      ]
    } catch (error) {
      toast.error(t('common.errorFetchingData'))
    } finally {
      loading.value = false
    }
  }
  
  const handleView = (project) => {
    router.push({ name: 'ProjectDetails', params: { id: project.id } })
  }
  
  const handleEdit = (project) => {
    editingProject.value = { ...project }
    showModal.value = true
  }
  
  const handleDelete = async (project) => {
    if (confirm(t('common.confirmDelete'))) {
      try {
        projects.value = projects.value.filter(p => p.id !== project.id)
        toast.success(t('projects.projectDeleted'))
      } catch (error) {
        toast.error(t('common.errorDeleting'))
      }
    }
  }
  
  const handleSave = async (project) => {
    try {
      if (editingProject.value) {
        const index = projects.value.findIndex(p => p.id === project.id)
        projects.value[index] = project
        toast.success(t('projects.projectUpdated'))
      } else {
        projects.value.push({ ...project, id: Date.now() })
        toast.success(t('projects.projectCreated'))
      }
      
      showModal.value = false
      editingProject.value = null
    } catch (error) {
      toast.error(t('common.errorSaving'))
    }
  }
  
  onMounted(() => {
    fetchProjects()
  })
  </script>