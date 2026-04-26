<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Account Information -->
      <div>
        <h3 class="text-lg font-semibold mb-4">{{ t('crm.accountInformation') }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">{{ t('crm.accountName') }} *</label>
            <input
              v-model="form.account_name"
              type="text"
              class="form-input"
              required
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('crm.accountNameAr') }}</label>
            <input
              v-model="form.account_name_ar"
              type="text"
              class="form-input"
              dir="rtl"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('crm.accountType') }} *</label>
            <select
              v-model="form.account_type"
              class="form-input"
              required
            >
              <option value="">{{ t('common.select') }}</option>
              <option value="customer">{{ t('crm.customer') }}</option>
              <option value="prospect">{{ t('crm.prospect') }}</option>
              <option value="partner">{{ t('crm.partner') }}</option>
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
            <label class="form-label">{{ t('crm.vatNumber') }}</label>
            <input
              v-model="form.vat_number"
              type="text"
              class="form-input"
              maxlength="15"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('crm.crNumber') }}</label>
            <input
              v-model="form.cr_number"
              type="text"
              class="form-input"
              maxlength="10"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('crm.email') }}</label>
            <input
              v-model="form.email"
              type="email"
              class="form-input"
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
            <label class="form-label">{{ t('crm.website') }}</label>
            <input
              v-model="form.website"
              type="url"
              class="form-input"
            />
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
            <label class="form-label">{{ t('crm.annualRevenue') }}</label>
            <input
              v-model.number="form.annual_revenue"
              type="number"
              step="0.01"
              class="form-input"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('crm.numberOfEmployees') }}</label>
            <input
              v-model.number="form.number_of_employees"
              type="number"
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
            <label class="form-label">{{ t('crm.billingAddress') }}</label>
            <textarea
              v-model="form.billing_address"
              class="form-input"
              rows="2"
            ></textarea>
          </div>
  
          <div class="md:col-span-2">
            <label class="form-label">{{ t('crm.shippingAddress') }}</label>
            <textarea
              v-model="form.shipping_address"
              class="form-input"
              rows="2"
            ></textarea>
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
          <span v-else>{{ account ? t('common.update') : t('common.create') }}</span>
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
    account: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['save', 'cancel'])
  
  const loading = ref(false)
  const industries = INDUSTRIES
  const territories = SAUDI_CITIES
  
  const form = reactive({
    account_name: '',
    account_name_ar: '',
    account_type: '',
    industry: '',
    vat_number: '',
    cr_number: '',
    email: '',
    phone: '',
    website: '',
    territory: '',
    annual_revenue: 0,
    number_of_employees: 0,
    billing_address: '',
    shipping_address: '',
    city: '',
    country: 'Saudi Arabia'
  })
  
  watch(() => props.account, (newAccount) => {
    if (newAccount) {
      Object.assign(form, newAccount)
    }
  }, { immediate: true })
  
  const handleSubmit = async () => {
    loading.value = true
  
    try {
      emit('save', { ...form })
    } catch (error) {
      console.error('Error saving account:', error)
    } finally {
      loading.value = false
    }
  }
  </script>