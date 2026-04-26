<template>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('nav.leads') }}</h1>
          <p class="text-gray-600 mt-1">{{ t('crm.leadsDescription') }}</p>
        </div>
        <button
          @click="showModal = true"
          class="btn btn-primary flex items-center space-x-2"
        >
          <UserPlusIcon class="h-5 w-5" />
          <span>{{ t('crm.addLead') }}</span>
        </button>
      </div>
  
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatsCard
          :title="t('crm.totalLeads')"
          :value="stats.total"
          icon="users"
          color="blue"
        />
        <StatsCard
          :title="t('crm.newLeads')"
          :value="stats.new"
          icon="user-plus"
          color="green"
        />
        <StatsCard
          :title="t('crm.qualified')"
          :value="stats.qualified"
          icon="check-circle"
          color="purple"
        />
        <StatsCard
          :title="t('crm.converted')"
          :value="stats.converted"
          icon="arrow-trending-up"
          color="orange"
        />
        <StatsCard
          :title="t('crm.conversionRate')"
          :value="stats.conversionRate + '%'"
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
            <option value="">{{ t('crm.allStatuses') }}</option>
            <option value="new">{{ t('crm.new') }}</option>
            <option value="contacted">{{ t('crm.contacted') }}</option>
            <option value="qualified">{{ t('crm.qualified') }}</option>
            <option value="converted">{{ t('crm.converted') }}</option>
            <option value="lost">{{ t('crm.lost') }}</option>
          </select>
          
          <select v-model="filters.source" class="form-input">
            <option value="">{{ t('crm.allSources') }}</option>
            <option value="website">{{ t('crm.website') }}</option>
            <option value="referral">{{ t('crm.referral') }}</option>
            <option value="social">{{ t('crm.socialMedia') }}</option>
            <option value="event">{{ t('crm.event') }}</option>
          </select>
          
          <select v-model="filters.assignedTo" class="form-input">
            <option value="">{{ t('crm.allUsers') }}</option>
            <option value="user1">User 1</option>
            <option value="user2">User 2</option>
          </select>
        </div>
      </Card>
  
      <!-- View Toggle -->
      <div class="flex justify-between items-center">
        <div class="flex space-x-2">
          <button
            @click="viewMode = 'table'"
            class="btn btn-sm"
            :class="{ 'btn-primary': viewMode === 'table', 'btn-outline': viewMode !== 'table' }"
          >
            <TableCellsIcon class="h-4 w-4 mr-1" />
            {{ t('common.tableView') }}
          </button>
          
          <button
            @click="viewMode = 'kanban'"
            class="btn btn-sm"
            :class="{ 'btn-primary': viewMode === 'kanban', 'btn-outline': viewMode !== 'kanban' }"
          >
            <Squares2X2Icon class="h-4 w-4 mr-1" />
            {{ t('common.kanbanView') }}
          </button>
        </div>
      </div>
  
      <!-- Table View -->
      <Card v-if="viewMode === 'table'">
        <DataTable
          :columns="columns"
          :data="filteredLeads"
          :loading="loading"
          @view="handleView"
          @edit="handleEdit"
          @delete="handleDelete"
          @convert="handleConvert"
        />
      </Card>
  
      <!-- Kanban View -->
      <div v-else class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div v-for="stage in stages" :key="stage.key" class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-semibold mb-4 flex items-center justify-between">
            <span>{{ stage.label }}</span>
            <span class="badge badge-info">{{ getLeadsByStage(stage.key).length }}</span>
          </h3>
          
          <div class="space-y-3">
            <LeadCard
              v-for="lead in getLeadsByStage(stage.key)"
              :key="lead.id"
              :lead="lead"
              @click="handleView(lead)"
            />
          </div>
        </div>
      </div>
  
      <!-- Add/Edit Modal -->
      <Modal
        v-model="showModal"
        :title="editingLead ? t('crm.editLead') : t('crm.addLead')"
        size="large"
      >
        <LeadForm
          :lead="editingLead"
          @save="handleSave"
          @cancel="showModal = false"
        />
      </Modal>
  
      <!-- View Modal -->
      <Modal
        v-model="showViewModal"
        :title="t('crm.leadDetails')"
        size="xl"
      >
        <LeadDetails
          v-if="selectedLead"
          :lead="selectedLead"
          @close="showViewModal = false"
          @edit="handleEditFromView"
        />
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'vue-toastification'
  import {
    UserPlusIcon,
    TableCellsIcon,
    Squares2X2Icon
  } from '@heroicons/vue/24/outline'
  
  import Card from '@/components/common/Card.vue'
  import StatsCard from '@/components/common/StatsCard.vue'
  import DataTable from '@/components/common/DataTable.vue'
  import Modal from '@/components/common/Modal.vue'
  import LeadCard from '@/components/crm/LeadCard.vue'
  import LeadForm from '@/components/crm/LeadForm.vue'
  import LeadDetails from '@/components/crm/LeadDetails.vue'
  
  const { t } = useI18n()
  const toast = useToast()
  
  const loading = ref(false)
  const showModal = ref(false)
  const showViewModal = ref(false)
  const editingLead = ref(null)
  const selectedLead = ref(null)
  const viewMode = ref('table')
  
  const filters = ref({
    search: '',
    status: '',
    source: '',
    assignedTo: ''
  })
  
  const stats = ref({
    total: 156,
    new: 42,
    qualified: 35,
    converted: 28,
    conversionRate: 18
  })
  
  const stages = [
    { key: 'new', label: t('crm.new') },
    { key: 'contacted', label: t('crm.contacted') },
    { key: 'qualified', label: t('crm.qualified') },
    { key: 'converted', label: t('crm.converted') },
    { key: 'lost', label: t('crm.lost') }
  ]
  
  const leads = ref([])
  
  const columns = [
    { key: 'lead_number', label: t('crm.leadNumber'), sortable: true },
    { key: 'full_name', label: t('crm.name'), sortable: true },
    { key: 'company_name', label: t('crm.company') },
    { key: 'email', label: t('crm.email') },
    { key: 'phone', label: t('crm.phone') },
    { key: 'source', label: t('crm.source') },
    { key: 'lead_score', label: t('crm.score') },
    { key: 'status', label: t('common.status'), type: 'badge' },
    { key: 'assigned_to', label: t('crm.assignedTo') },
    { key: 'actions', label: t('common.actions'), type: 'actions' }
  ]
  
  const filteredLeads = computed(() => {
    let result = leads.value
  
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      result = result.filter(lead =>
        lead.full_name?.toLowerCase().includes(search) ||
        lead.company_name?.toLowerCase().includes(search) ||
        lead.email?.toLowerCase().includes(search) ||
        lead.phone?.toLowerCase().includes(search)
      )
    }
  
    if (filters.value.status) {
      result = result.filter(lead => lead.status === filters.value.status)
    }
  
    if (filters.value.source) {
      result = result.filter(lead => lead.source === filters.value.source)
    }
  
    if (filters.value.assignedTo) {
      result = result.filter(lead => lead.assigned_to === filters.value.assignedTo)
    }
  
    return result
  })
  
  const getLeadsByStage = (stage) => {
    return filteredLeads.value.filter(lead => lead.status === stage)
  }
  
  const fetchLeads = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      leads.value = [
        {
          id: 1,
          lead_number: 'LEAD-2024-001',
          full_name: 'Abdullah Al-Qarni',
          company_name: 'Tech Solutions Co.',
          email: 'abdullah@techsolutions.sa',
          phone: '+966501234567',
          source: 'website',
          lead_score: 85,
          status: 'new',
          assigned_to: 'Sales Team'
        },
        {
          id: 2,
          lead_number: 'LEAD-2024-002',
          full_name: 'Sara Al-Otaibi',
          company_name: 'Digital Marketing LLC',
          email: 'sara@digitalmarketing.sa',
          phone: '+966507654321',
          source: 'referral',
          lead_score: 72,
          status: 'contacted',
          assigned_to: 'Sales Team'
        },
        {
          id: 3,
          lead_number: 'LEAD-2024-003',
          full_name: 'Khalid Al-Rashid',
          company_name: 'Construction Group',
          email: 'khalid@construction.sa',
          phone: '+966501111222',
          source: 'social',
          lead_score: 90,
          status: 'qualified',
          assigned_to: 'Sales Manager'
        }
      ]
    } catch (error) {
      toast.error(t('common.errorFetchingData'))
    } finally {
      loading.value = false
    }
  }
  
  const handleView = (lead) => {
    selectedLead.value = lead
    showViewModal.value = true
  }
  
  const handleEdit = (lead) => {
    editingLead.value = { ...lead }
    showModal.value = true
  }
  
  const handleEditFromView = () => {
    editingLead.value = { ...selectedLead.value }
    showViewModal.value = false
    showModal.value = true
  }
  
  const handleDelete = async (lead) => {
    if (confirm(t('common.confirmDelete'))) {
      try {
        leads.value = leads.value.filter(l => l.id !== lead.id)
        toast.success(t('crm.leadDeleted'))
      } catch (error) {
        toast.error(t('common.errorDeleting'))
      }
    }
  }
  
  const handleConvert = async (lead) => {
    if (confirm(t('crm.confirmConvert'))) {
      try {
        lead.status = 'converted'
        toast.success(t('crm.leadConverted'))
      } catch (error) {
        toast.error(t('crm.conversionFailed'))
      }
    }
  }
  
  const handleSave = async (lead) => {
    try {
      if (editingLead.value) {
        const index = leads.value.findIndex(l => l.id === lead.id)
        leads.value[index] = lead
        toast.success(t('crm.leadUpdated'))
      } else {
        leads.value.push({ ...lead, id: Date.now() })
        toast.success(t('crm.leadCreated'))
      }
      
      showModal.value = false
      editingLead.value = null
    } catch (error) {
      toast.error(t('common.errorSaving'))
    }
  }
  
  onMounted(() => {
    fetchLeads()
  })
  </script>