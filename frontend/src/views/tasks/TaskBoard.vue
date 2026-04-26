<template>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('nav.taskBoard') }}</h1>
          <p class="text-gray-600 mt-1">{{ t('tasks.boardDescription') }}</p>
        </div>
        <div class="flex space-x-2">
          <button
            @click="showModal = true"
            class="btn btn-primary"
          >
            {{ t('tasks.newTask') }}
          </button>
          
          <button
            @click="$router.push({ name: 'Tasks' })"
            class="btn btn-outline"
          >
            <TableCellsIcon class="h-4 w-4 mr-2" />
            {{ t('common.listView') }}
          </button>
        </div>
      </div>
  
      <!-- Kanban Board -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          v-for="stage in stages"
          :key="stage.key"
          class="bg-gray-50 rounded-lg p-4 min-h-[600px]"
        >
          <h3 class="font-semibold mb-4 flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: stage.color }"
              ></div>
              <span>{{ stage.label }}</span>
            </div>
            <span class="badge badge-info">
              {{ getTasksByStage(stage.key).length }}
            </span>
          </h3>
          
          <draggable
            :list="getTasksByStage(stage.key)"
            :group="{ name: 'tasks' }"
            @change="handleTaskMove"
            item-key="id"
            class="space-y-3 min-h-[500px]"
          >
            <template #item="{ element }">
              <TaskCard
                :task="element"
                @click="handleView(element)"
                @edit="handleEdit(element)"
                @delete="handleDelete(element)"
              />
            </template>
          </draggable>
        </div>
      </div>
  
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
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'vue-toastification'
  import draggable from 'vuedraggable'
  import { TableCellsIcon } from '@heroicons/vue/24/outline'
  
  import Modal from '@/components/common/Modal.vue'
  import TaskCard from '@/components/tasks/TaskCard.vue'
  import TaskForm from '@/components/tasks/TaskForm.vue'
  import TaskDetails from '@/components/tasks/TaskDetails.vue'
  
  const { t } = useI18n()
  const toast = useToast()
  
  const showModal = ref(false)
  const showViewModal = ref(false)
  const editingTask = ref(null)
  const selectedTask = ref(null)
  
  const stages = [
    { key: 'todo', label: t('tasks.todo'), color: '#808080' },
    { key: 'in_progress', label: t('tasks.inProgress'), color: '#3b82f6' },
    { key: 'review', label: t('tasks.review'), color: '#f59e0b' },
    { key: 'done', label: t('tasks.done'), color: '#10b981' }
  ]
  
  const tasks = ref([])
  
  const getTasksByStage = (stage) => {
    return tasks.value.filter(task => task.status === stage)
  }
  
  const handleTaskMove = (event) => {
    if (event.added) {
      const task = event.added.element
      console.log('Task moved:', task)
      toast.success(t('tasks.taskMoved'))
    }
  }
  
  const fetchTasks = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      tasks.value = [
        {
          id: 1,
          task_number: 'TASK-001',
          title: 'Update project documentation',
          description: 'Review and update all project documentation',
          project_name: 'King Abdullah Tower',
          assigned_to: 'Ahmed Al-Malik',
          priority: 'high',
          due_date: '2024-02-15',
          status: 'in_progress',
          tags: ['documentation', 'urgent']
        },
        {
          id: 2,
          task_number: 'TASK-002',
          title: 'Review BOQ for Phase 2',
          description: 'Complete review of Bill of Quantities',
          project_name: 'Commercial Complex',
          assigned_to: 'Sara Al-Otaibi',
          priority: 'medium',
          due_date: '2024-02-20',
          status: 'todo',
          tags: ['review', 'boq']
        },
        {
          id: 3,
          task_number: 'TASK-003',
          title: 'Prepare progress report',
          description: 'Monthly progress report for client',
          project_name: 'Residential Compound',
          assigned_to: 'Khalid Al-Rashid',
          priority: 'urgent',
          due_date: '2024-02-10',
          status: 'review',
          tags: ['report', 'client']
        },
        {
          id: 4,
          task_number: 'TASK-004',
          title: 'Site inspection completed',
          description: 'Weekly site inspection and safety check',
          project_name: 'King Abdullah Tower',
          assigned_to: 'Mohammed Al-Salem',
          priority: 'low',
          due_date: '2024-02-05',
          status: 'done',
          tags: ['inspection', 'safety']
        }
      ]
    } catch (error) {
      toast.error(t('common.errorFetchingData'))
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
  
  const handleSave = async (task) => {
    try {
      if (editingTask.value) {
        const index = tasks.value.findIndex(t => t.id === task.id)
        tasks.value[index] = task
        toast.success(t('tasks.taskUpdated'))
      } else {
        tasks.value.push({ ...task, id: Date.now(), status: 'todo' })
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