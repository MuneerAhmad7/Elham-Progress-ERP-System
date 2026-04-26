<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information -->
      <div>
        <h3 class="text-lg font-semibold mb-4">{{ t('hr.basicInformation') }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">{{ t('hr.employeeNumber') }} *</label>
            <input
              v-model="form.employee_number"
              type="text"
              class="form-input"
              :class="{ 'border-red-500': errors.employee_number }"
              required
            />
            <p v-if="errors.employee_number" class="form-error">{{ errors.employee_number }}</p>
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.firstName') }} *</label>
            <input
              v-model="form.first_name"
              type="text"
              class="form-input"
              :class="{ 'border-red-500': errors.first_name }"
              required
            />
            <p v-if="errors.first_name" class="form-error">{{ errors.first_name }}</p>
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.middleName') }}</label>
            <input
              v-model="form.middle_name"
              type="text"
              class="form-input"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.lastName') }} *</label>
            <input
              v-model="form.last_name"
              type="text"
              class="form-input"
              :class="{ 'border-red-500': errors.last_name }"
              required
            />
            <p v-if="errors.last_name" class="form-error">{{ errors.last_name }}</p>
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.firstNameAr') }}</label>
            <input
              v-model="form.first_name_ar"
              type="text"
              class="form-input"
              dir="rtl"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.lastNameAr') }}</label>
            <input
              v-model="form.last_name_ar"
              type="text"
              class="form-input"
              dir="rtl"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.email') }} *</label>
            <input
              v-model="form.email"
              type="email"
              class="form-input"
              :class="{ 'border-red-500': errors.email }"
              required
            />
            <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.phone') }} *</label>
            <input
              v-model="form.phone"
              type="tel"
              class="form-input"
              :class="{ 'border-red-500': errors.phone }"
              placeholder="+966501234567"
              required
            />
            <p v-if="errors.phone" class="form-error">{{ errors.phone }}</p>
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.mobile') }}</label>
            <input
              v-model="form.mobile"
              type="tel"
              class="form-input"
              placeholder="+966507654321"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.nationality') }} *</label>
            <select
              v-model="form.nationality"
              class="form-input"
              required
            >
              <option value="">{{ t('common.select') }}</option>
              <option v-for="nat in nationalities" :key="nat" :value="nat">
                {{ nat }}
              </option>
            </select>
          </div>
        </div>
      </div>
  
      <!-- Identity Information -->
      <div>
        <h3 class="text-lg font-semibold mb-4">{{ t('hr.identityInformation') }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">{{ t('hr.nationalId') }}</label>
            <input
              v-model="form.national_id"
              type="text"
              class="form-input"
              maxlength="10"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.iqamaNumber') }}</label>
            <input
              v-model="form.iqama_number"
              type="text"
              class="form-input"
              maxlength="10"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.iqamaExpiry') }}</label>
            <input
              v-model="form.iqama_expiry_date"
              type="date"
              class="form-input"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.passportNumber') }}</label>
            <input
              v-model="form.passport_number"
              type="text"
              class="form-input"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.passportExpiry') }}</label>
            <input
              v-model="form.passport_expiry_date"
              type="date"
              class="form-input"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.borderNumber') }}</label>
            <input
              v-model="form.border_number"
              type="text"
              class="form-input"
            />
          </div>
        </div>
      </div>
  
      <!-- Employment Information -->
      <div>
        <h3 class="text-lg font-semibold mb-4">{{ t('hr.employmentInformation') }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">{{ t('hr.company') }} *</label>
            <select
              v-model="form.company_id"
              class="form-input"
              required
            >
              <option value="">{{ t('common.select') }}</option>
              <option v-for="company in companies" :key="company.id" :value="company.id">
                {{ company.name }}
              </option>
            </select>
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.branch') }} *</label>
            <select
              v-model="form.branch_id"
              class="form-input"
              required
            >
              <option value="">{{ t('common.select') }}</option>
              <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                {{ branch.name }}
              </option>
            </select>
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.department') }} *</label>
            <select
              v-model="form.department_id"
              class="form-input"
              required
            >
              <option value="">{{ t('common.select') }}</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.jobPosition') }} *</label>
            <select
              v-model="form.job_position_id"
              class="form-input"
              required
            >
              <option value="">{{ t('common.select') }}</option>
              <option v-for="pos in jobPositions" :key="pos.id" :value="pos.id">
                {{ pos.title }}
              </option>
            </select>
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.hireDate') }} *</label>
            <input
              v-model="form.hire_date"
              type="date"
              class="form-input"
              required
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.employmentType') }} *</label>
            <select
              v-model="form.employment_type"
              class="form-input"
              required
            >
              <option value="">{{ t('common.select') }}</option>
              <option value="full_time">{{ t('hr.fullTime') }}</option>
              <option value="part_time">{{ t('hr.partTime') }}</option>
              <option value="contract">{{ t('hr.contract') }}</option>
              <option value="temporary">{{ t('hr.temporary') }}</option>
            </select>
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.basicSalary') }} *</label>
            <input
              v-model.number="form.basic_salary"
              type="number"
              step="0.01"
              class="form-input"
              required
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.manager') }}</label>
            <select
              v-model="form.manager_id"
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
  
      <!-- Banking Information -->
      <div>
        <h3 class="text-lg font-semibold mb-4">{{ t('hr.bankingInformation') }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">{{ t('hr.bankName') }}</label>
            <input
              v-model="form.bank_name"
              type="text"
              class="form-input"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.bankAccountNumber') }}</label>
            <input
              v-model="form.bank_account_number"
              type="text"
              class="form-input"
            />
          </div>
  
          <div class="md:col-span-2">
            <label class="form-label">{{ t('hr.iban') }}</label>
            <input
              v-model="form.iban"
              type="text"
              class="form-input"
              placeholder="SA00 0000 0000 0000 0000 0000"
              maxlength="28"
            />
          </div>
        </div>
      </div>
  
      <!-- Emergency Contact -->
      <div>
        <h3 class="text-lg font-semibold mb-4">{{ t('hr.emergencyContact') }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">{{ t('hr.contactName') }}</label>
            <input
              v-model="form.emergency_contact_name"
              type="text"
              class="form-input"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('hr.contactPhone') }}</label>
            <input
              v-model="form.emergency_contact_phone"
              type="tel"
              class="form-input"
            />
          </div>
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
          <span v-else>{{ employee ? t('common.update') : t('common.create') }}</span>
        </button>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref, reactive, watch, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { NATIONALITIES, SAUDI_CITIES } from '@/utils/constants'
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
  
  const { t } = useI18n()
  
  const props = defineProps({
    employee: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['save', 'cancel'])
  
  const loading = ref(false)
  const errors = ref({})
  
  const nationalities = NATIONALITIES
  const companies = ref([])
  const branches = ref([])
  const departments = ref([])
  const jobPositions = ref([])
  const employees = ref([])
  
  const form = reactive({
    employee_number: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    first_name_ar: '',
    middle_name_ar: '',
    last_name_ar: '',
    email: '',
    phone: '',
    mobile: '',
    nationality: '',
    national_id: '',
    iqama_number: '',
    iqama_expiry_date: '',
    passport_number: '',
    passport_expiry_date: '',
    border_number: '',
    company_id: '',
    branch_id: '',
    department_id: '',
    job_position_id: '',
    hire_date: '',
    employment_type: '',
    basic_salary: 0,
    manager_id: '',
    bank_name: '',
    bank_account_number: '',
    iban: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  })
  
  // Watch for employee prop changes
  watch(() => props.employee, (newEmployee) => {
    if (newEmployee) {
      Object.assign(form, newEmployee)
    }
  }, { immediate: true })
  
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
  
  const fetchFormData = async () => {
    // Fetch companies, branches, departments, etc.
    // This would be API calls in real implementation
    companies.value = [
      { id: 1, name: 'Main Company' }
    ]
    
    branches.value = [
      { id: 1, name: 'Riyadh Branch' },
      { id: 2, name: 'Jeddah Branch' }
    ]
    
    departments.value = [
      { id: 1, name: 'IT' },
      { id: 2, name: 'HR' },
      { id: 3, name: 'Finance' }
    ]
    
    jobPositions.value = [
      { id: 1, title: 'Software Engineer' },
      { id: 2, title: 'HR Manager' },
      { id: 3, title: 'Accountant' }
    ]
  }
  
  onMounted(() => {
    fetchFormData()
  })
  </script>