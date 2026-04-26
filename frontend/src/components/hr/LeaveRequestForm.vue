<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="form-label">{{ t('leaves.leaveType') }} *</label>
        <select
          v-model="form.leave_type_id"
          class="form-input"
          :class="{ 'border-red-500': errors.leave_type_id }"
          required
          @change="handleLeaveTypeChange"
        >
          <option value="">{{ t('common.select') }}</option>
          <option
            v-for="type in leaveTypes"
            :key="type.id"
            :value="type.id"
          >
            {{ type.name }} ({{ type.balance }} {{ t('leaves.daysAvailable') }})
          </option>
        </select>
        <p v-if="errors.leave_type_id" class="form-error">{{ errors.leave_type_id }}</p>
      </div>
  
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="form-label">{{ t('leaves.fromDate') }} *</label>
          <input
            v-model="form.from_date"
            type="date"
            class="form-input"
            :class="{ 'border-red-500': errors.from_date }"
            required
            @change="calculateDays"
          />
          <p v-if="errors.from_date" class="form-error">{{ errors.from_date }}</p>
        </div>
  
        <div>
          <label class="form-label">{{ t('leaves.toDate') }} *</label>
          <input
            v-model="form.to_date"
            type="date"
            class="form-input"
            :class="{ 'border-red-500': errors.to_date }"
            required
            @change="calculateDays"
          />
          <p v-if="errors.to_date" class="form-error">{{ errors.to_date }}</p>
        </div>
      </div>
  
      <div v-if="totalDays > 0" class="bg-blue-50 p-3 rounded">
        <p class="text-sm text-blue-800">
          {{ t('leaves.totalDays') }}: <strong>{{ totalDays }}</strong>
        </p>
        <p v-if="selectedLeaveType" class="text-sm text-blue-800">
          {{ t('leaves.remainingBalance') }}: 
          <strong>{{ selectedLeaveType.balance - totalDays }}</strong>
        </p>
      </div>
  
      <div>
        <label class="form-label">{{ t('leaves.reason') }} *</label>
        <textarea
          v-model="form.reason"
          class="form-input"
          :class="{ 'border-red-500': errors.reason }"
          rows="4"
          required
        ></textarea>
        <p v-if="errors.reason" class="form-error">{{ errors.reason }}</p>
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
          :disabled="loading || totalDays <= 0"
        >
          <LoadingSpinner v-if="loading" size="20px" />
          <span v-else>{{ t('leaves.submit') }}</span>
        </button>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref, reactive, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { differenceInDays } from 'date-fns'
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
  
  const { t } = useI18n()
  
  const emit = defineEmits(['save', 'cancel'])
  
  const loading = ref(false)
  const errors = ref({})
  const totalDays = ref(0)
  
  const leaveTypes = ref([
    { id: 1, name: 'Annual Leave', balance: 22 },
    { id: 2, name: 'Sick Leave', balance: 10 },
    { id: 3, name: 'Emergency Leave', balance: 3 }
  ])
  
  const form = reactive({
    leave_type_id: '',
    from_date: '',
    to_date: '',
    reason: ''
  })
  
  const selectedLeaveType = computed(() => {
    return leaveTypes.value.find(t => t.id === form.leave_type_id)
  })
  
  const handleLeaveTypeChange = () => {
    calculateDays()
  }
  
  const calculateDays = () => {
    if (form.from_date && form.to_date) {
      const from = new Date(form.from_date)
      const to = new Date(form.to_date)
      
      if (to >= from) {
        totalDays.value = differenceInDays(to, from) + 1
      } else {
        totalDays.value = 0
        errors.value.to_date = t('leaves.endDateMustBeAfterStart')
      }
    }
  }
  
  const handleSubmit = async () => {
    loading.value = true
    errors.value = {}
  
    // Validation
    if (!form.leave_type_id) {
      errors.value.leave_type_id = t('leaves.selectLeaveType')
      loading.value = false
      return
    }
  
    if (totalDays.value > selectedLeaveType.value?.balance) {
      errors.value.leave_type_id = t('leaves.insufficientBalance')
      loading.value = false
      return
    }
  
    try {
      emit('save', { ...form, total_days: totalDays.value })
    } catch (error) {
      if (error.response?.data?.errors) {
        errors.value = error.response.data.errors
      }
    } finally {
      loading.value = false
    }
  }
  </script>