<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information -->
      <div>
        <h3 class="text-lg font-semibold mb-4">{{ t('projects.basicInformation') }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">{{ t('projects.projectCode') }} *</label>
            <input
              v-model="form.project_code"
              type="text"
              class="form-input"
              :class="{ 'border-red-500': errors.project_code }"
              required
            />
            <p v-if="errors.project_code" class="form-error">{{ errors.project_code }}</p>
          </div>
  
          <div>
            <label class="form-label">{{ t('projects.projectName') }} *</label>
            <input
              v-model="form.project_name"
              type="text"
              class="form-input"
              :class="{ 'border-red-500': errors.project_name }"
              required
            />
            <p v-if="errors.project_name" class="form-error">{{ errors.project_name }}</p>
          </div>
  
          <div>
            <label class="form-label">{{ t('projects.projectNameAr') }}</label>
            <input
              v-model="form.project_name_ar"
              type="text"
              class="form-input"
              dir="rtl"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('projects.client') }} *</label>
            <select
              v-model="form.client_id"
              class="form-input"
              required
            >
              <option value="">{{ t('common.select') }}</option>
              <option v-for="client in customers" :key="client.id" :value="client.id">
                {{ client.customer_name }}
              </option>
            </select>
          </div>
  
          <div>
            <label class="form-label">{{ t('projects.projectType') }}</label>
            <select
              v-model="form.project_type"
              class="form-input"
            >
              <option value="construction">{{ t('projects.construction') }}</option>
              <option value="maintenance">{{ t('projects.maintenance') }}</option>
              <option value="consulting">{{ t('projects.consulting') }}</option>
            </select>
          </div>
  
          <div>
            <label class="form-label">{{ t('projects.projectManager') }}</label>
            <select
              v-model="form.project_manager_id"
              class="form-input"
            >
              <option value="">{{ t('common.select') }}</option>
              <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                {{ emp.full_name }}
              </option>
            </select>
          </div>
        </div>
      </div>
  
      <!-- Dates & Budget -->
      <div>
        <h3 class="text-lg font-semibold mb-4">{{ t('projects.scheduleBudget') }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">{{ t('projects.startDate') }} *</label>
            <input
              v-model="form.start_date"
              type="date"
              class="form-input"
              required
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('projects.endDate') }}</label>
            <input
              v-model="form.end_date"
              type="date"
              class="form-input"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('projects.contractValue') }}</label>
            <input
              v-model.number="form.contract_value"
              type="number"
              step="0.01"
              class="form-input"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('projects.budgetedCost') }}</label>
            <input
              v-model.number="form.budgeted_cost"
              type="number"
              step="0.01"
              class="form-input"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('projects.location') }}</label>
            <input
              v-model="form.project_location"
              type="text"
              class="form-input"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('projects.city') }}</label>
            <select
              v-model="form.city"
              class="form-input"
            >
              <option value="">{{ t('common.select') }}</option>
              <option v-for="city in cities" :key="city" :value="city">
                {{ city }}
              </option>
            </select>
          </div>
        </div>
      </div>
  
      <!-- Notes -->
      <div>
        <label class="form-label">{{ t('projects.notes') }}</label>
        <textarea
          v-model="form.notes"
          class="form-input"
          rows="4"
        ></textarea>
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
          <span v-else>{{ project ? t('common.update') : t('common.create') }}</span>
        </button>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref, reactive, watch, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useCrmStore } from '@/store/modules/crm'
  import { useHrStore } from '@/store/modules/hr'
  import { SAUDI_CITIES } from '@/utils/constants'
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
  
  const { t } = useI18n()
  const crmStore = useCrmStore()
  const hrStore = useHrStore()
  
  const props = defineProps({
    project: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['save', 'cancel'])
  
  const loading = ref(false)
  const errors = ref({})
  const cities = SAUDI_CITIES
  const customers = ref([])
  const employees = ref([])
  
  const form = reactive({
    project_code: '',
    project_name: '',
    project_name_ar: '',
    client_id: '',
    project_type: 'construction',
    project_manager_id: '',
    start_date: '',
    end_date: '',
    contract_value: 0,
    budgeted_cost: 0,
    project_location: '',
    city: '',
    notes: ''
  })
  
  watch(() => props.project, (newProject) => {
    if (newProject) {
      Object.assign(form, newProject)
    } else {
      // Reset form
      Object.assign(form, {
        project_code: '',
        project_name: '',
        project_name_ar: '',
        client_id: '',
        project_type: 'construction',
        project_manager_id: '',
        start_date: '',
        end_date: '',
        contract_value: 0,
        budgeted_cost: 0,
        project_location: '',
        city: '',
        notes: ''
      })
    }
  }, { immediate: true })
  
  const fetchData = async () => {
    await Promise.all([
      crmStore.fetchAccounts(),
      hrStore.fetchEmployees()
    ])
    
    customers.value = crmStore.accounts.filter(a => a.account_type === 'customer')
    employees.value = hrStore.employees
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
  
  onMounted(() => {
    fetchData()
  })
  </script>