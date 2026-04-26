<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Lead Information -->
      <div>
        <h3 class="text-lg font-semibold mb-4">{{ t('crm.leadInformation') }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">{{ t('crm.firstName') }}</label>
            <input
              v-model="form.first_name"
              type="text"
              class="form-input"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('crm.lastName') }}</label>
            <input
              v-model="form.last_name"
              type="text"
              class="form-input"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('crm.companyName') }} *</label>
            <input
              v-model="form.company_name"
              type="text"
              class="form-input"
              required
            />
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
            <label class="form-label">{{ t('crm.email') }} *</label>
            <input
              v-model="form.email"
              type="email"
              class="form-input"
              required
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('crm.phone') }} *</label>
            <input
              v-model="form.phone"
              type="tel"
              class="form-input"
              required
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
            <label class="form-label">{{ t('crm.website') }}</label>
            <input
              v-model="form.website"
              type="url"
              class="form-input"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('crm.leadSource') }} *</label>
            <select
              v-model="form.lead_source_id"
              class="form-input"
              required
            >
              <option value="">{{ t('common.select') }}</option>
              <option v-for="source in sources" :key="source.id" :value="source.id">
                {{ source.name }}
              </option>
            </select>
          </div>
  
          <div>
            <label class="form-label">{{ t('crm.industry') }}</label>
            <select
              v-model="form.industry"
              class="form-input"
            >
              <option value="">{{ t('common.select') }}</option>
              <option v-for="ind in industries" :key="ind" :value="ind">
                {{ ind }}
              </option>
            </select>
          </div>
  
          <div>
            <label class="form-label">{{ t('crm.territory') }}</label>
            <select
              v-model="form.territory"
              class="form-input"
            >
              <option value="">{{ t('common.select') }}</option>
              <option v-for="ter in territories" :key="ter" :value="ter">
                {{ ter }}
              </option>
            </select>
          </div>
  
          <div>
            <label class="form-label">{{ t('crm.leadScore') }}</label>
            <input
              v-model.number="form.lead_score"
              type="number"
              min="0"
              max="100"
              class="form-input"
            />
          </div>
        </div>
      </div>
  
      <!-- Address -->
      <div>
        <h3 class="text-lg font-semibold mb-4">{{ t('crm.address') }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="form-label">{{ t('crm.street') }}</label>
            <input
              v-model="form.address"
              type="text"
              class="form-input"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('crm.city') }}</label>
            <input
              v-model="form.city"
              type="text"
              class="form-input"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('crm.country') }}</label>
            <input
              v-model="form.country"
              type="text"
              class="form-input"
              value="Saudi Arabia"
            />
          </div>
        </div>
      </div>
  
      <!-- Notes -->
      <div>
        <label class="form-label">{{ t('crm.notes') }}</label>
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
          <span v-else>{{ lead ? t('common.update') : t('common.create') }}</span>
        </button>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref, reactive, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { INDUSTRIES, SAUDI_CITIES } from '@/utils/constants'
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
  
  const { t } = useI18n()
  
  const props = defineProps({
    lead: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['save', 'cancel'])
  
  const loading = ref(false)
  
  const sources = ref([
    { id: 1, name: 'Website' },
    { id: 2, name: 'Referral' },
    { id: 3, name: 'Social Media' },
    { id: 4, name: 'Event' }
  ])
  
  const industries = INDUSTRIES
  const territories = SAUDI_CITIES
  
  const form = reactive({
    first_name: '',
    last_name: '',
    company_name: '',
    job_title: '',
    email: '',
    phone: '',
    mobile: '',
    website: '',
    lead_source_id: '',
    industry: '',
    territory: '',
    lead_score: 0,
    address: '',
    city: '',
    country: 'Saudi Arabia',
    notes: ''
  })
  
  watch(() => props.lead, (newLead) => {
    if (newLead) {
      Object.assign(form, newLead)
    }
  }, { immediate: true })
  
  const handleSubmit = async () => {
    loading.value = true
  
    try {
      emit('save', { ...form })
    } catch (error) {
      console.error('Error saving lead:', error)
    } finally {
      loading.value = false
    }
  }
  </script>