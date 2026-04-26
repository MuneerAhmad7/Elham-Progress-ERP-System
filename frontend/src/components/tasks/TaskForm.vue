<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information -->
      <div>
        <h3 class="text-lg font-semibold mb-4">{{ t('tasks.basicInformation') }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="form-label">{{ t('tasks.title') }} *</label>
            <input
              v-model="form.title"
              type="text"
              class="form-input"
              :class="{ 'border-red-500': errors.title }"
              required
            />
            <p v-if="errors.title" class="form-error">{{ errors.title }}</p>
          </div>
  
          <div class="md:col-span-2">
            <label class="form-label">{{ t('tasks.description') }}</label>
            <textarea
              v-model="form.description"
              class="form-input"
              rows="4"
            ></textarea>
          </div>
  
          <div>
            <label class="form-label">{{ t('tasks.project') }}</label>
            <select
              v-model="form.project_id"
              class="form-input"
            >
              <option value="">{{ t('common.select') }}</option>
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.project_name }}
              </option>
            </select>
          </div>
  
          <div>
            <label class="form-label">{{ t('tasks.assignedTo') }}</label>
            <select
              v-model="form.assigned_to"
              class="form-input"
            >
              <option value="">{{ t('common.unassigned') }}</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.full_name }}
              </option>
            </select>
          </div>
  
          <div>
            <label class="form-label">{{ t('tasks.priority') }}</label>
            <select
              v-model="form.priority"
              class="form-input"
            >
              <option value="low">{{ t('tasks.low') }}</option>
              <option value="medium">{{ t('tasks.medium') }}</option>
              <option value="high">{{ t('tasks.high') }}</option>
              <option value="urgent">{{ t('tasks.urgent') }}</option>
            </select>
          </div>
  
          <div>
            <label class="form-label">{{ t('tasks.status') }}</label>
            <select
              v-model="form.status"
              class="form-input"
            >
              <option value="todo">{{ t('tasks.todo') }}</option>
              <option value="in_progress">{{ t('tasks.inProgress') }}</option>
              <option value="review">{{ t('tasks.review') }}</option>
              <option value="done">{{ t('tasks.done') }}</option>
            </select>
          </div>
  
          <div>
            <label class="form-label">{{ t('tasks.startDate') }}</label>
            <input
              v-model="form.start_date"
              type="date"
              class="form-input"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('tasks.dueDate') }} *</label>
            <input
              v-model="form.due_date"
              type="date"
              class="form-input"
              :class="{ 'border-red-500': errors.due_date }"
              required
            />
            <p v-if="errors.due_date" class="form-error">{{ errors.due_date }}</p>
          </div>
  
          <div>
            <label class="form-label">{{ t('tasks.estimatedHours') }}</label>
            <input
              v-model.number="form.estimated_hours"
              type="number"
              step="0.5"
              class="form-input"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('tasks.actualHours') }}</label>
            <input
              v-model.number="form.actual_hours"
              type="number"
              step="0.5"
              class="form-input"
            />
          </div>
  
          <div class="flex items-center">
            <input
              v-model="form.is_billable"
              type="checkbox"
              class="h-4 w-4 text-blue-600 rounded"
            />
            <label class="ml-2 text-sm text-gray-700">
              {{ t('tasks.billable') }}
            </label>
          </div>
        </div>
      </div>
  
      <!-- Tags -->
      <div>
        <label class="form-label">{{ t('tasks.tags') }}</label>
        <div class="flex flex-wrap gap-2 mb-2">
          <span
            v-for="(tag, index) in form.tags"
            :key="index"
            class="badge badge-info flex items-center"
          >
            {{ tag }}
            <button
              type="button"
              @click="removeTag(index)"
              class="ml-1 hover:text-red-600"
            >
              <XMarkIcon class="h-3 w-3" />
            </button>
          </span>
        </div>
        <div class="flex space-x-2">
          <input
            v-model="newTag"
            type="text"
            class="form-input flex-1"
            :placeholder="t('tasks.addTag')"
            @keyup.enter="addTag"
          />
          <button
            type="button"
            @click="addTag"
            class="btn btn-outline"
          >
            {{ t('common.add') }}
          </button>
        </div>
      </div>
  
      <!-- Form Actions -->
      <div class="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          @click="$emit('cancel')"
          class="btn btn-outline"
        >
          {{ t('common.cancel') }}
        </button>
        
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="loading"
        >
          <LoadingSpinner v-if="loading" size="20px" />
          <span v-else>{{ task ? t('common.update') : t('common.create') }}</span>
        </button>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref, reactive, watch, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useProjectsStore } from '@/store/modules/projects'
  import { useAuthStore } from '@/store/modules/auth'
  import { XMarkIcon } from '@heroicons/vue/24/outline'
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
  
  const { t } = useI18n()
  const projectsStore = useProjectsStore()
  const authStore = useAuthStore()
  
  const props = defineProps({
    task: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['save', 'cancel'])
  
  const loading = ref(false)
  const errors = ref({})
  const newTag = ref('')
  
  const projects = ref([])
  const users = ref([])
  
  const form = reactive({
    title: '',
    description: '',
    project_id: '',
    assigned_to: '',
    priority: 'medium',
    status: 'todo',
    start_date: '',
    due_date: '',
    estimated_hours: 0,
    actual_hours: 0,
    is_billable: false,
    tags: []
  })
  
  watch(() => props.task, (newTask) => {
    if (newTask) {
      Object.assign(form, {
        ...newTask,
        tags: newTask.tags || []
      })
    }
  }, { immediate: true })
  
  const addTag = () => {
    if (newTag.value.trim() && !form.tags.includes(newTag.value.trim())) {
      form.tags.push(newTag.value.trim())
      newTag.value = ''
    }
  }
  
  const removeTag = (index) => {
    form.tags.splice(index, 1)
  }
  
  const handleSubmit = async () => {
    loading.value = true
    errors.value = {}
  
    try {
      emit('save', { ...form })
    } catch (error) {
      if (error.response?.data?.errors) {
        errors.value = error.response.data.errors
      }
    } finally {
      loading.value = false
    }
  }
  
  onMounted(async () => {
    projects.value = await projectsStore.fetchProjects()
    users.value = authStore.user ? [authStore.user] : []
  })
  </script>