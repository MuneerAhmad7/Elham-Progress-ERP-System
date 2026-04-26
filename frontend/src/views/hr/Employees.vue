<template>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('nav.employees') }}</h1>
          <p class="text-gray-600 mt-1">{{ t('hr.employeesDescription') }}</p>
        </div>
        <button
          @click="showModal = true"
          class="btn btn-primary flex items-center space-x-2"
        >
          <UserPlusIcon class="h-5 w-5" />
          <span>{{ t('hr.addEmployee') }}</span>
        </button>
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
          
          <select v-model="filters.branch" class="form-input">
            <option value="">{{ t('hr.allBranches') }}</option>
            <option value="branch1">Branch 1</option>
            <option value="branch2">Branch 2</option>
          </select>
          
          <select v-model="filters.department" class="form-input">
            <option value="">{{ t('hr.allDepartments') }}</option>
            <option value="it">IT</option>
            <option value="hr">HR</option>
            <option value="finance">Finance</option>
          </select>
          
          <select v-model="filters.status" class="form-input">
            <option value="">{{ t('hr.allStatuses') }}</option>
            <option value="active">{{ t('common.active') }}</option>
            <option value="inactive">{{ t('common.inactive') }}</option>
          </select>
        </div>
      </Card>
  
      <!-- Employees Table -->
      <Card>
        <DataTable
          :columns="columns"
          :data="filteredEmployees"
          :loading="loading"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </Card>
  
      <!-- Add/Edit Modal -->
      <Modal
        v-model="showModal"
        :title="editingEmployee ? t('hr.editEmployee') : t('hr.addEmployee')"
        size="large"
      >
        <EmployeeForm
          :employee="editingEmployee"
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
  import { UserPlusIcon } from '@heroicons/vue/24/outline'
  
  import Card from '@/components/common/Card.vue'
  import DataTable from '@/components/common/DataTable.vue'
  import Modal from '@/components/common/Modal.vue'
  import EmployeeForm from '@/components/hr/EmployeeForm.vue'
  
  const { t } = useI18n()
  const toast = useToast()
  
  const loading = ref(false)
  const showModal = ref(false)
  const editingEmployee = ref(null)
  
  const filters = ref({
    search: '',
    branch: '',
    department: '',
    status: ''
  })
  
  const employees = ref([])
  
  const columns = [
    { key: 'employee_number', label: t('hr.employeeNumber'), sortable: true },
    { key: 'full_name', label: t('hr.fullName'), sortable: true },
    { key: 'email', label: t('hr.email') },
    { key: 'department', label: t('hr.department'), sortable: true },
    { key: 'job_position', label: t('hr.jobPosition') },
    { key: 'status', label: t('common.status'), type: 'badge' },
    { key: 'actions', label: t('common.actions'), type: 'actions' }
  ]
  
  const filteredEmployees = computed(() => {
    let result = employees.value
  
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      result = result.filter(emp => 
        emp.full_name.toLowerCase().includes(search) ||
        emp.employee_number.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search)
      )
    }
  
    if (filters.value.branch) {
      result = result.filter(emp => emp.branch === filters.value.branch)
    }
  
    if (filters.value.department) {
      result = result.filter(emp => emp.department === filters.value.department)
    }
  
    if (filters.value.status) {
      result = result.filter(emp => emp.status === filters.value.status)
    }
  
    return result
  })
  
  const fetchEmployees = async () => {
    loading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      employees.value = [
        {
          id: 1,
          employee_number: 'EMP001',
          full_name: 'Ahmed Al-Malik',
          email: 'ahmed@company.com',
          department: 'IT',
          job_position: 'Software Engineer',
          branch: 'branch1',
          status: 'active'
        },
        {
          id: 2,
          employee_number: 'EMP002',
          full_name: 'Fatima Al-Salem',
          email: 'fatima@company.com',
          department: 'HR',
          job_position: 'HR Manager',
          branch: 'branch1',
          status: 'active'
        },
        {
          id: 3,
          employee_number: 'EMP003',
          full_name: 'Mohammed Al-Rashid',
          email: 'mohammed@company.com',
          department: 'Finance',
          job_position: 'Accountant',
          branch: 'branch2',
          status: 'active'
        }
      ]
    } catch (error) {
      toast.error(t('common.errorFetchingData'))
    } finally {
      loading.value = false
    }
  }
  
  const handleEdit = (employee) => {
    editingEmployee.value = { ...employee }
    showModal.value = true
  }
  
  const handleDelete = async (employee) => {
    if (confirm(t('common.confirmDelete'))) {
      try {
        // API call to delete
        employees.value = employees.value.filter(e => e.id !== employee.id)
        toast.success(t('hr.employeeDeleted'))
      } catch (error) {
        toast.error(t('common.errorDeleting'))
      }
    }
  }
  
  const handleSave = async (employee) => {
    try {
      if (editingEmployee.value) {
        // Update
        const index = employees.value.findIndex(e => e.id === employee.id)
        employees.value[index] = employee
        toast.success(t('hr.employeeUpdated'))
      } else {
        // Create
        employees.value.push({ ...employee, id: Date.now() })
        toast.success(t('hr.employeeCreated'))
      }
      
      showModal.value = false
      editingEmployee.value = null
    } catch (error) {
      toast.error(t('common.errorSaving'))
    }
  }
  
  onMounted(() => {
    fetchEmployees()
  })
  </script>