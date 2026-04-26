<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="form-label">{{ t('crm.firstName') }} *</label>
          <input
            v-model="form.first_name"
            type="text"
            class="form-input"
            required
          />
        </div>
  
        <div>
          <label class="form-label">{{ t('crm.lastName') }} *</label>
          <input
            v-model="form.last_name"
            type="text"
            class="form-input"
            required
          />
        </div>
  
        <div>
          <label class="form-label">{{ t('crm.account') }} *</label>
          <select
            v-model="form.account_id"
            class="form-input"
            required
          >
            <option value="">{{ t('common.select') }}</option>
            <option v-for="account in accounts" :key="account.id" :value="account.id">
              {{ account.account_name }}
            </option>
          </select>
        </div>
  
        <div>
          <label class="form-label">{{ t('crm.jobTitle') }}</label>
          <input
            v-model="form.job_title"
            type="text"
            class="form-input"
          />
        </div>
  
        <div>
          <label class="form-label">{{ t('crm.department') }}</label>
          <input
            v-model="form.department"
            type="text"
            class="form-input"
          />
        </div>
  
        <div>
          <label class="form-label">{{ t('crm.email') }} *</label>
          <input
            v-model="form.email"
            type="email"
            class="form-input"
            required
          />
        </div>
  
        <div>
          <label class="form-label">{{ t('crm.phone') }}</label>
          <input
            v-model="form.phone"
            type="tel"
            class="form-input"
          />
        </div>
  
        <div>
          <label class="form-label">{{ t('crm.mobile') }}</label>
          <input
            v-model="form.mobile"
            type="tel"
            class="form-input"
          />
        </div>
  
        <div>
          <label class="form-label">{{ t('crm.contactType') }}</label>
          <select
            v-model="form.contact_type"
            class="form-input"
          >
            <option value="">{{ t('common.select') }}</option>
            <option value="decision_maker">{{ t('crm.decisionMaker') }}</option>
            <option value="influencer">{{ t('crm.influencer') }}</option>
            <option value="user">{{ t('crm.user') }}</option>
          </select>
        </div>
  
        <div class="flex items-center">
          <input
            v-model="form.is_primary"
            type="checkbox"
            class="h-4 w-4 text-blue-600 rounded"
          />
          <label class="ml-2 text-sm text-gray-900">
            {{ t('crm.primaryContact') }}
          </label>
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
          <span v-else>{{ contact ? t('common.update') : t('common.create') }}</span>
        </button>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref, reactive, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
  
  const { t } = useI18n()
  
  const props = defineProps({
    contact: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['save', 'cancel'])
  
  const loading = ref(false)
  const accounts = ref([])
  
  const form = reactive({
    first_name: '',
    last_name: '',
    account_id: '',
    job_title: '',
    department: '',
    email: '',
    phone: '',
    mobile: '',
    contact_type: '',
    is_primary: false
  })
  
  watch(() => props.contact, (newContact) => {
    if (newContact) {
      Object.assign(form, newContact)
    }
  }, { immediate: true })
  
  const handleSubmit = async () => {
    loading.value = true
  
    try {
      emit('save', { ...form })
    } catch (error) {
      console.error('Error saving contact:', error)
    } finally {
      loading.value = false
    }
  }
  </script>