<template>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('nav.tasks') }}</h1>
          <p class="text-gray-600 mt-1">{{ t('tasks.tasksDescription') }}</p>
        </div>
        <button
          @click="showModal = true"
          class="btn btn-primary"
        >
          {{ t('tasks.newTask') }}
        </button>
      </div>
  
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatsCard
          :title="t('tasks.total')"
          :value="stats.total"
          icon="clipboard-list"
          color="blue"
        />
        <StatsCard
          :title="t('tasks.todo')"
          :value="stats.todo"
          icon="clock"
          color="gray"
        />
        <StatsCard
          :title="t('tasks.inProgress')"
          :value="stats.inProgress"
          icon="arrow-path"
          color="orange"
        />
        <StatsCard
          :title="t('tasks.completed')"
          :value="stats.completed"
          icon="check-circle"
          color="green"
        />
        <StatsCard
          :title="t('tasks.overdue')"
          :value="stats.overdue"
          icon="exclamation-circle"
          color="red"
        />
      </div>
  
      <!-- Filters -->
      <Card>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            v-model="filters.search"
            type="text"
            :placeholder="t('common.search')"
            class="form-input"
          />
          
          <select v-model="filters.status" class="form-input">
            <option value="">{{ t('tasks.allStatuses') }}</option>
            <option value="todo">{{ t('tasks.todo') }}</option>
            <option value="in_progress">{{ t('tasks.inProgress') }}</option>
            <option value="review">{{ t('tasks.review') }}</option>
            <option value="done">{{ t('tasks.done') }}</option>
          </select>
          
          <select v-model="filters.priority" class="form-input">
            <option value="">{{ t('tasks.allPriorities') }}</option>
            <option value="low">{{ t('tasks.low') }}</option>
            <option value="medium">{{ t('tasks.medium') }}</option>
            <option value="high">{{ t('tasks.high') }}</option>
            <option value="urgent">{{ t('tasks.urgent') }}</option>
          </select>
          
          <select v-model="filters.assignedTo" class="form-input">
            <option value="">{{ t('tasks.allUsers') }}</option>
            <option value="me">{{ t('tasks.myTasks') }}</option>
          </select>
          
          <select v-model="filters.project" class="form-input">
            <option value="">{{ t('tasks.allProjects') }}</option>
          </select>
        </div>
      </Card>
  
      <!-- Tasks Table -->
      <Card>
        <DataTable
          :columns="columns"
          :data="filteredTasks"
          :loading="loading"
          @view="handleView"
          @edit="handleEdit"
          @delete="handleDelete"
          @complete="handleComplete"
        />
      </Card>
  
      <!-- Add/Edit Modal -->
      <Modal
        v-model="showModal"
        :title="editingTask ? t('tasks.editTask') : t('tasks.newTask')"
        size="large"
      >
        <TaskForm
          :task="editingTask"
          @save="handleSave"
          @cancel="showModal = false"
        />
      </Modal>
  
      <!-- View Modal -->
      <Modal
        v-model="showViewModal"
        :title="t('tasks.taskDetails')"
        size="xl"
      >
        <TaskDetails
          v-if="selectedTask"
          :task="selectedTask"
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
  
  import Card from '@/components/common/Card.vue'
  import StatsCard from '@/components/common/StatsCard.vue'
  import DataTable from '@/components/common/DataTable.vue'
  import Modal from '@/components/common/Modal.vue'
  import TaskForm from '@/components/tasks/TaskForm.vue'
  import TaskDetails from '@/components/tasks/TaskDetails.vue'
  
  const { t } = useI18n()
  const toast = useToast()
  
  const loading = ref(false)
  const showModal = ref(false)
  const showViewModal = ref(false)
  const editingTask = ref(null)
  const selectedTask = ref(null)
  
  const filters = ref({
    search: '',
    status: '',
    priority: '',
    assignedTo: '',
    project: ''
  })
  
  const stats = ref({
    total: 67,
    todo: 18,
    inProgress: 25,
    completed: 20,
    overdue: 4
  })
  
  const tasks = ref([])
  
  const columns = [
    { key: 'task_number', label: t('tasks.taskNumber'), sortable: true },
    { key: 'title', label: t('tasks.title'), sortable: true },
    { key: 'project_name', label: t('tasks.project') },
    { key: 'assigned_to', label: t('tasks.assignedTo') },
    { key: 'priority', label: t('tasks.priority'), type: 'badge' },
    { key: 'due_date', label: t('tasks.dueDate'), sortable: true },
    { key: 'status', label: t('common.status'), type: 'badge' },
    { key: 'actions', label: t('common.actions'), type: 'actions' }
  ]
  
  const filteredTasks = computed(() => {
    let result = tasks.value
  
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      result = result.filter(task =>
        task.title?.toLowerCase().includes(search) ||
        task.task_number?.toLowerCase().includes(search)
      )
    }
  
    if (filters.value.status) {
      result = result.filter(task => task.status === filters.value.status)
    }
  
    if (filters.value.priority) {
      result = result.filter(task => task.priority === filters.value.priority)
    }
  
    return result
  })
  
  const fetchTasks = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      tasks.value = [
        {
          id: 1,
          task_number: 'TASK-001',
          title: 'Update project documentation',
          project_name: 'King Abdullah Tower',
          assigned_to: 'Ahmed Al-Malik',
          priority: 'high',
          due_date: '2024-02-15',
          status: 'in_progress'
        },
        {
          id: 2,
          task_number: 'TASK-002',
          title: 'Review BOQ for Phase 2',
          project_name: 'Commercial Complex',
          assigned_to: 'Sara Al-Otaibi',
          priority: 'medium',
          due_date: '2024-02-20',
          status: 'todo'
        },
        {
          id: 3,
          task_number: 'TASK-003',
          title: 'Prepare progress report',
          project_name: 'Residential Compound',
          assigned_to: 'Khalid Al-Rashid',
          priority: 'urgent',
          due_date: '2024-02-10',
          status: 'review'
        }
      ]
    } catch (error) {
      toast.error(t('common.errorFetchingData'))
    } finally {
      loading.value = false
    }
  }
  
  const handleView = (task) => {
    selectedTask.value = task
    showViewModal.value = true
  }
  
  const handleEdit = (task) => {
    editingTask.value = { ...task }
    showModal.value = true
  }
  
  const handleEditFromView = () => {
    editingTask.value = { ...selectedTask.value }
    showViewModal.value = false
    showModal.value = true
  }
  
  const handleDelete = async (task) => {
    if (confirm(t('common.confirmDelete'))) {
      try {
        tasks.value = tasks.value.filter(t => t.id !== task.id)
        toast.success(t('tasks.taskDeleted'))
      } catch (error) {
        toast.error(t('common.errorDeleting'))
      }
    }
  }
  
  const handleComplete = async (task) => {
    try {
      task.status = 'done'
      toast.success(t('tasks.taskCompleted'))
    } catch (error) {
      toast.error(t('common.errorSaving'))
    }
  }
  
  const handleSave = async (task) => {
    try {
      if (editingTask.value) {
        const index = tasks.value.findIndex(t => t.id === task.id)
        tasks.value[index] = task
        toast.success(t('tasks.taskUpdated'))
      } else {
        tasks.value.push({ ...task, id: Date.now() })
        toast.success(t('tasks.taskCreated'))
      }
      
      showModal.value = false
      editingTask.value = null
    } catch (error) {
      toast.error(t('common.errorSaving'))
    }
  }
  
  onMounted(() => {
    fetchTasks()
  })
  </script>